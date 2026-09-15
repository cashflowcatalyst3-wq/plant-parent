import { Redis } from '@upstash/redis';
import {
  sanitizeNickname,
  normalizeNickname,
  containsBlockedWord,
  MEMBERS_KEY,
  NICKNAME_INDEX_KEY,
  BANNED_KEY,
} from '../lib/nickname.js';
import { getTokenFromRequest, verifyDeviceToken, registerDeviceToken } from '../lib/deviceAuth.js';

function daysBetween(aIso, bIso) {
  return Math.floor((new Date(bIso) - new Date(aIso)) / (1000 * 60 * 60 * 24));
}

// Mirrors the streak calculation in app.js so the server reports the same
// number the person sees in the app.
function serverCalcStreak(plant) {
  const log = plant.waterLog || [];
  if (log.length === 0) return 0;
  let streak = 1;
  for (let i = log.length - 1; i > 0; i--) {
    const gap = daysBetween(log[i - 1], log[i]);
    if (gap <= (plant.frequency || 7) + 2) streak++;
    else break;
  }
  return streak;
}

function bestStreakFromPlants(plants) {
  return plants.reduce((best, p) => Math.max(best, serverCalcStreak(p)), 0);
}

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const memberIds = await redis.smembers(MEMBERS_KEY);
      if (!memberIds || memberIds.length === 0) {
        return res.status(200).json({ ok: true, streaks: [], plants: [], raindrop: [], memory: [] });
      }

      const entries = await Promise.all(
        memberIds.map((id) => redis.get(`leaderboard-entry:${id}`))
      );
      const valid = entries.filter(Boolean);

      const rank = (field) => [...valid]
        .sort((a, b) => (b[field] || 0) - (a[field] || 0))
        .slice(0, 50)
        .map((e) => ({ nickname: e.nickname, deviceId: e.deviceId, value: e[field] || 0 }));

      return res.status(200).json({
        ok: true,
        streaks: rank('bestStreak'),
        plants: rank('plantCount'),
        raindrop: rank('gameHighScore'),
        memory: rank('memoryHighScore'),
      });
    }

    if (req.method === 'POST') {
      const { deviceId, nickname, bestStreak, plantCount, gameHighScore, memoryHighScore } = req.body || {};
      if (!deviceId || !nickname) {
        return res.status(400).json({ error: 'Missing deviceId or nickname' });
      }

      const token = getTokenFromRequest(req);
      const check = await verifyDeviceToken(redis, deviceId, token);
      if (!check.ok) {
        return res.status(403).json({ error: check.error });
      }

      const isBanned = await redis.hexists(BANNED_KEY, deviceId);
      if (isBanned) {
        return res.status(403).json({ error: 'This device has been removed from the leaderboard and cannot rejoin.' });
      }

      const priorEntry = await redis.get(`leaderboard-entry:${deviceId}`);

      let cleanNickname, normalized;
      if (priorEntry?.adminOverride) {
        cleanNickname = priorEntry.nickname;
        normalized = priorEntry.normalized;
      } else {
        cleanNickname = sanitizeNickname(nickname);
        if (!cleanNickname) {
          return res.status(400).json({ error: 'Nickname must contain at least one letter or number.' });
        }
        if (containsBlockedWord(cleanNickname)) {
          return res.status(400).json({ error: "That nickname isn't allowed — please choose something else." });
        }

        normalized = normalizeNickname(cleanNickname);

        const existingOwner = await redis.hget(NICKNAME_INDEX_KEY, normalized);
        if (existingOwner && existingOwner !== deviceId) {
          return res.status(409).json({ error: 'That nickname is already taken — try another one.' });
        }

        if (priorEntry?.normalized && priorEntry.normalized !== normalized) {
          await redis.hdel(NICKNAME_INDEX_KEY, priorEntry.normalized);
        }
      }

      if (check.isFirstUse && token) {
        await registerDeviceToken(redis, deviceId, token);
      }

      // Fetch the actual plants this device has stored. The server computes
      // streak and plant count from real data instead of trusting the client.
      const storedPlants = (await redis.get(`plants:${deviceId}`)) || [];
      const serverBestStreak = bestStreakFromPlants(storedPlants);
      const serverPlantCount = storedPlants.length;

      const locked = !!priorEntry?.adminOverride;
      const entry = {
        deviceId,
        nickname: cleanNickname,
        normalized,
        // If an admin has locked this entry, keep their numbers.
        // Otherwise use the server-computed values for streak and count.
        bestStreak: locked ? (priorEntry.bestStreak || 0) : serverBestStreak,
        plantCount: locked ? (priorEntry.plantCount || 0) : serverPlantCount,
        // Game scores still come from the client — the server doesn't store
        // enough data to recompute them without replaying the whole game.
        gameHighScore: locked ? (priorEntry.gameHighScore || 0) : Math.max(0, parseInt(gameHighScore, 10) || 0),
        memoryHighScore: locked ? (priorEntry.memoryHighScore || 0) : Math.max(0, parseInt(memoryHighScore, 10) || 0),
        adminOverride: locked,
        updatedAt: new Date().toISOString(),
      };
      await redis.set(`leaderboard-entry:${deviceId}`, entry);
      await redis.sadd(MEMBERS_KEY, deviceId);
      if (!priorEntry?.adminOverride) {
        await redis.hset(NICKNAME_INDEX_KEY, { [normalized]: deviceId });
      }
      return res.status(200).json({ ok: true, nickname: cleanNickname });
    }

    if (req.method === 'DELETE') {
      const { deviceId } = req.body || {};
      if (!deviceId) {
        return res.status(400).json({ error: 'Missing deviceId' });
      }

      const token = getTokenFromRequest(req);
      const check = await verifyDeviceToken(redis, deviceId, token);
      if (!check.ok) {
        return res.status(403).json({ error: check.error });
      }

      const entry = await redis.get(`leaderboard-entry:${deviceId}`);
      if (entry && entry.normalized) {
        await redis.hdel(NICKNAME_INDEX_KEY, entry.normalized);
      }
      await redis.del(`leaderboard-entry:${deviceId}`);
      await redis.srem(MEMBERS_KEY, deviceId);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Leaderboard request failed' });
  }
}
