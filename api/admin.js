import { Redis } from '@upstash/redis';
import webpush from 'web-push';
import { NICKNAME_INDEX_KEY, MEMBERS_KEY as LEADERBOARD_MEMBERS_KEY } from '../lib/nickname.js';

const redis = Redis.fromEnv();
const DEVICES_KEY = 'devices';

function isAuthorized(req) {
  const secret = req.headers['x-admin-secret'];
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

function daysSince(dateStr) {
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
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
      const deviceIds = await redis.smembers(DEVICES_KEY);
      const devices = await Promise.all((deviceIds || []).map(async (id) => {
        const [plants, sub, leaderboardEntry] = await Promise.all([
          redis.get(`plants:${id}`),
          redis.get(`sub:${id}`),
          redis.get(`leaderboard-entry:${id}`),
        ]);
        const plantList = Array.isArray(plants) ? plants : [];
        const overdueCount = plantList.filter((p) => daysSince(p.lastWatered) >= p.frequency).length;
        return {
          deviceId: id,
          plantCount: plantList.length,
          overdueCount,
          pushEnabled: !!sub,
          nickname: leaderboardEntry ? leaderboardEntry.nickname : null,
        };
      }));
      devices.sort((a, b) => b.plantCount - a.plantCount);
      return res.status(200).json({ ok: true, devices });
    }

    if (req.method === 'POST') {
      const { action, deviceId, title, body } = req.body || {};

      if (action === 'wipeDevice') {
        if (!deviceId) return res.status(400).json({ error: 'Missing deviceId' });
        await redis.del(`plants:${deviceId}`);
        await redis.del(`sub:${deviceId}`);
        await redis.srem(DEVICES_KEY, deviceId);
        const lbEntry = await redis.get(`leaderboard-entry:${deviceId}`);
        if (lbEntry) {
          if (lbEntry.normalized) await redis.hdel(NICKNAME_INDEX_KEY, lbEntry.normalized);
          await redis.del(`leaderboard-entry:${deviceId}`);
          await redis.srem(LEADERBOARD_MEMBERS_KEY, deviceId);
        }
        return res.status(200).json({ ok: true });
      }

      if (action === 'sendPush') {
        if (!title || !body) return res.status(400).json({ error: 'Missing title or body' });
        if (!deviceId) return res.status(400).json({ error: 'Missing deviceId (use "all" to broadcast)' });

        const missing = [];
        if (!process.env.VAPID_PUBLIC_KEY) missing.push('VAPID_PUBLIC_KEY');
        if (!process.env.VAPID_PRIVATE_KEY) missing.push('VAPID_PRIVATE_KEY');
        if (missing.length) return res.status(500).json({ error: `Missing environment variable(s): ${missing.join(', ')}` });

        webpush.setVapidDetails(
          'mailto:plant-parent-app@example.com',
          process.env.VAPID_PUBLIC_KEY,
          process.env.VAPID_PRIVATE_KEY
        );

        let targets;
        if (deviceId === 'all') {
          targets = (await redis.smembers(DEVICES_KEY)) || [];
        } else {
          targets = [deviceId];
        }

        let sent = 0;
        let failed = 0;
        for (const id of targets) {
          const sub = await redis.get(`sub:${id}`);
          if (!sub) continue;
          try {
            await webpush.sendNotification(sub, JSON.stringify({ title, body }));
            sent++;
          } catch (err) {
            failed++;
            if (err.statusCode === 410 || err.statusCode === 404) {
              await redis.del(`sub:${id}`);
            }
          }
        }
        return res.status(200).json({ ok: true, sent, failed, checked: targets.length });
      }

      return res.status(400).json({ error: 'Unrecognized action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Admin request failed' });
  }
}
