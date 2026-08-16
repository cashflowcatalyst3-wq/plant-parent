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

function isAuthorized(req) {
  const secret = req.headers['x-admin-secret'];
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

// Snapshot the entry's real values the first time an admin overrides it, so
// "Clear override" has something to actually restore. If it's already
// overridden, don't touch the snapshot — that would lose the true original.
function captureOriginalIfNeeded(entry) {
  if (!entry.adminOverride) {
    entry.preOverride = {
      nickname: entry.nickname,
      normalized: entry.normalized,
      bestStreak: entry.bestStreak || 0,
      plantCount: entry.plantCount || 0,
      gameHighScore: entry.gameHighScore || 0,
      memoryHighScore: entry.memoryHighScore || 0,
    };
  }
}

export default async function handler(req, res) {
  if (!process.env.ADMIN_SECRET) {
    return res.status(500).json({ error: 'ADMIN_SECRET is not set. Add it in Vercel → Settings → Environment Variables, then redeploy.' });
  }
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const memberIds = await redis.smembers(MEMBERS_KEY);
      const entries = memberIds.length
        ? (await Promise.all(memberIds.map((id) => redis.get(`leaderboard-entry:${id}`)))).filter(Boolean)
        : [];
      entries.sort((a, b) => a.nickname.localeCompare(b.nickname));

      const bannedMap = (await redis.hgetall(BANNED_KEY)) || {};
      const banned = Object.entries(bannedMap).map(([deviceId, nickname]) => ({ deviceId, nickname }));

      return res.status(200).json({ ok: true, entries, banned });
    }

    if (req.method === 'POST') {
      const { deviceId, action, field, mode, value, nickname } = req.body || {};
      if (!deviceId) {
        return res.status(400).json({ error: 'Missing deviceId' });
      }

      if (action === 'unban') {
        await redis.hdel(BANNED_KEY, deviceId);
        return res.status(200).json({ ok: true });
      }

      const entry = await redis.get(`leaderboard-entry:${deviceId}`);
      if (!entry) {
        return res.status(404).json({ error: 'No leaderboard entry for that device' });
      }

      if (action === 'delete') {
        if (entry.normalized) await redis.hdel(NICKNAME_INDEX_KEY, entry.normalized);
        await redis.del(`leaderboard-entry:${deviceId}`);
        await redis.srem(MEMBERS_KEY, deviceId);
        return res.status(200).json({ ok: true });
      }

      if (action === 'ban') {
        if (entry.normalized) await redis.hdel(NICKNAME_INDEX_KEY, entry.normalized);
        await redis.del(`leaderboard-entry:${deviceId}`);
        await redis.srem(MEMBERS_KEY, deviceId);
        await redis.hset(BANNED_KEY, { [deviceId]: entry.nickname });
        return res.status(200).json({ ok: true });
      }

      if (action === 'clearOverride') {
        if (entry.preOverride) {
          const restore = entry.preOverride;
          // Restore nickname too, but only if nobody else has since claimed
          // it — if they have, keep the current nickname and just restore stats.
          if (restore.normalized && restore.normalized !== entry.normalized) {
            const owner = await redis.hget(NICKNAME_INDEX_KEY, restore.normalized);
            if (!owner || owner === deviceId) {
              await redis.hdel(NICKNAME_INDEX_KEY, entry.normalized);
              await redis.hset(NICKNAME_INDEX_KEY, { [restore.normalized]: deviceId });
              entry.nickname = restore.nickname;
              entry.normalized = restore.normalized;
            }
          }
          entry.bestStreak = restore.bestStreak || 0;
          entry.plantCount = restore.plantCount || 0;
          entry.gameHighScore = restore.gameHighScore || 0;
          entry.memoryHighScore = restore.memoryHighScore || 0;
          delete entry.preOverride;
        }
        entry.adminOverride = false;
        entry.updatedAt = new Date().toISOString();
        await redis.set(`leaderboard-entry:${deviceId}`, entry);
        return res.status(200).json({ ok: true, entry });
      }

      if (action === 'rename') {
        const cleanNickname = sanitizeNickname(nickname);
        if (!cleanNickname) {
          return res.status(400).json({ error: 'Nickname must contain at least one letter or number.' });
        }
        if (containsBlockedWord(cleanNickname)) {
          return res.status(400).json({ error: "That nickname isn't allowed — please choose something else." });
        }
        const normalized = normalizeNickname(cleanNickname);
        const existingOwner = await redis.hget(NICKNAME_INDEX_KEY, normalized);
        if (existingOwner && existingOwner !== deviceId) {
          return res.status(409).json({ error: 'That nickname is already taken — try another one.' });
        }
        if (entry.normalized && entry.normalized !== normalized) {
          await redis.hdel(NICKNAME_INDEX_KEY, entry.normalized);
        }
        captureOriginalIfNeeded(entry);
        entry.nickname = cleanNickname;
        entry.normalized = normalized;
        entry.adminOverride = true; // lock it so their device doesn't quietly revert it
        entry.updatedAt = new Date().toISOString();
        await redis.set(`leaderboard-entry:${deviceId}`, entry);
        await redis.hset(NICKNAME_INDEX_KEY, { [normalized]: deviceId });
        return res.status(200).json({ ok: true, entry });
      }

      // Adjust a stat: field is 'bestStreak', 'plantCount', 'gameHighScore', or 'memoryHighScore'; mode is 'set' or 'add'
      const ADJUSTABLE_FIELDS = ['bestStreak', 'plantCount', 'gameHighScore', 'memoryHighScore'];
      if (!ADJUSTABLE_FIELDS.includes(field)) {
        return res.status(400).json({ error: "Unrecognized action or field." });
      }
      const amount = parseInt(value, 10);
      if (Number.isNaN(amount)) {
        return res.status(400).json({ error: 'value must be a number' });
      }

      const current = entry[field] || 0;
      const next = mode === 'add' ? current + amount : amount;
      captureOriginalIfNeeded(entry);
      entry[field] = Math.max(0, next);
      entry.adminOverride = true;
      entry.updatedAt = new Date().toISOString();

      await redis.set(`leaderboard-entry:${deviceId}`, entry);
      return res.status(200).json({ ok: true, entry });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Admin request failed' });
  }
}
