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
        entry.adminOverride = false;
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
        entry.nickname = cleanNickname;
        entry.normalized = normalized;
        entry.adminOverride = true; // lock it so their device doesn't quietly revert it
        entry.updatedAt = new Date().toISOString();
        await redis.set(`leaderboard-entry:${deviceId}`, entry);
        await redis.hset(NICKNAME_INDEX_KEY, { [normalized]: deviceId });
        return res.status(200).json({ ok: true, entry });
      }

      // Adjust a stat: field is 'bestStreak' or 'plantCount', mode is 'set' or 'add'
      if (field !== 'bestStreak' && field !== 'plantCount') {
        return res.status(400).json({ error: "Unrecognized action or field." });
      }
      const amount = parseInt(value, 10);
      if (Number.isNaN(amount)) {
        return res.status(400).json({ error: 'value must be a number' });
      }

      const current = entry[field] || 0;
      const next = mode === 'add' ? current + amount : amount;
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
