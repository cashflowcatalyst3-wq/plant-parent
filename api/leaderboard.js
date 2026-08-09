import { Redis } from '@upstash/redis';
import {
  sanitizeNickname,
  normalizeNickname,
  containsBlockedWord,
  MEMBERS_KEY,
  NICKNAME_INDEX_KEY,
  BANNED_KEY,
} from '../lib/nickname.js';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const memberIds = await redis.smembers(MEMBERS_KEY);
      if (!memberIds || memberIds.length === 0) {
        return res.status(200).json({ ok: true, streaks: [], plants: [] });
      }

      const entries = await Promise.all(
        memberIds.map((id) => redis.get(`leaderboard-entry:${id}`))
      );
      const valid = entries.filter(Boolean);

      const streaks = [...valid]
        .sort((a, b) => (b.bestStreak || 0) - (a.bestStreak || 0))
        .slice(0, 50)
        .map((e) => ({ nickname: e.nickname, deviceId: e.deviceId, value: e.bestStreak || 0 }));

      const plants = [...valid]
        .sort((a, b) => (b.plantCount || 0) - (a.plantCount || 0))
        .slice(0, 50)
        .map((e) => ({ nickname: e.nickname, deviceId: e.deviceId, value: e.plantCount || 0 }));

      return res.status(200).json({ ok: true, streaks, plants });
    }

    if (req.method === 'POST') {
      const { deviceId, nickname, bestStreak, plantCount } = req.body || {};
      if (!deviceId || !nickname) {
        return res.status(400).json({ error: 'Missing deviceId or nickname' });
      }

      const isBanned = await redis.hexists(BANNED_KEY, deviceId);
      if (isBanned) {
        return res.status(403).json({ error: 'This device has been removed from the leaderboard and cannot rejoin.' });
      }

      const priorEntry = await redis.get(`leaderboard-entry:${deviceId}`);

      let cleanNickname, normalized;
      if (priorEntry?.adminOverride) {
        // An admin has locked this entry — keep the nickname (and stats)
        // exactly as they set it, rather than letting this device's own
        // periodic self-refresh silently revert the change.
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

        // free up this device's previous nickname reservation, if it's changing
        if (priorEntry?.normalized && priorEntry.normalized !== normalized) {
          await redis.hdel(NICKNAME_INDEX_KEY, priorEntry.normalized);
        }
      }

      const entry = {
        deviceId,
        nickname: cleanNickname,
        normalized,
        bestStreak: priorEntry?.adminOverride ? (priorEntry.bestStreak || 0) : Math.max(0, parseInt(bestStreak, 10) || 0),
        plantCount: priorEntry?.adminOverride ? (priorEntry.plantCount || 0) : Math.max(0, parseInt(plantCount, 10) || 0),
        adminOverride: !!priorEntry?.adminOverride,
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
