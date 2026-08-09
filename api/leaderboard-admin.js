import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const MEMBERS_KEY = 'leaderboard-members';
const NICKNAME_INDEX_KEY = 'leaderboard-nickname-index';

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
      return res.status(200).json({ ok: true, entries });
    }

    if (req.method === 'POST') {
      const { deviceId, action, field, mode, value } = req.body || {};
      if (!deviceId) {
        return res.status(400).json({ error: 'Missing deviceId' });
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

      if (action === 'clearOverride') {
        entry.adminOverride = false;
        await redis.set(`leaderboard-entry:${deviceId}`, entry);
        return res.status(200).json({ ok: true, entry });
      }

      // Adjust a stat: field is 'bestStreak' or 'plantCount', mode is 'set' or 'add'
      if (field !== 'bestStreak' && field !== 'plantCount') {
        return res.status(400).json({ error: "field must be 'bestStreak' or 'plantCount'" });
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
