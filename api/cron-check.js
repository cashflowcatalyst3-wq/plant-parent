import { Redis } from '@upstash/redis';
import webpush from 'web-push';

function daysSince(dateStr) {
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

export default async function handler(req, res) {
  // Vercel Cron sends a special header; also allow manual testing via a secret query param
  const isCron = req.headers['x-vercel-cron'] || req.query.secret === process.env.CRON_SECRET;
  if (!isCron) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const missing = [];
  if (!process.env.VAPID_PUBLIC_KEY) missing.push('VAPID_PUBLIC_KEY');
  if (!process.env.VAPID_PRIVATE_KEY) missing.push('VAPID_PRIVATE_KEY');
  if (!process.env.UPSTASH_REDIS_REST_URL && !process.env.KV_REST_API_URL) missing.push('UPSTASH_REDIS_REST_URL (or KV_REST_API_URL)');
  if (!process.env.UPSTASH_REDIS_REST_TOKEN && !process.env.KV_REST_API_TOKEN) missing.push('UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_TOKEN)');
  if (missing.length) {
    return res.status(500).json({ error: `Missing environment variable(s): ${missing.join(', ')}. Add them in Vercel → Settings → Environment Variables, then redeploy.` });
  }

  let redis, deviceIds;
  try {
    redis = Redis.fromEnv();
    webpush.setVapidDetails(
      'mailto:plant-parent-app@example.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
    deviceIds = await redis.smembers('devices');
  } catch (err) {
    console.error('Setup failed:', err);
    return res.status(500).json({ error: `Setup failed: ${err.message}` });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    let sent = 0;

    for (const deviceId of deviceIds || []) {
      const [plants, subscription] = await Promise.all([
        redis.get(`plants:${deviceId}`),
        redis.get(`sub:${deviceId}`)
      ]);
      if (!plants || !subscription) continue;

      for (const plant of plants) {
        const elapsed = daysSince(plant.lastWatered);
        const overdue = elapsed >= plant.frequency;
        const alreadyNotifiedToday = plant.lastNotified === today;
        if (overdue && !alreadyNotifiedToday) {
          const payload = JSON.stringify({
            title: `${plant.name} is thirsty`,
            body: `It's been ${elapsed} day${elapsed === 1 ? '' : 's'} since the last watering.`
          });
          try {
            await webpush.sendNotification(subscription, payload);
            sent++;
          } catch (err) {
            // subscription may be expired/invalid — remove it so we stop retrying
            if (err.statusCode === 410 || err.statusCode === 404) {
              await redis.del(`sub:${deviceId}`);
            }
          }
          plant.lastNotified = today;
        }
      }
      await redis.set(`plants:${deviceId}`, plants);
    }

    return res.status(200).json({ ok: true, checked: (deviceIds || []).length, sent });
  } catch (err) {
    console.error('Cron check failed:', err);
    return res.status(500).json({ error: `Cron check failed: ${err.message}` });
  }
}
