import { kv } from '@vercel/kv';
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:plant-parent-app@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

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

  try {
    const deviceIds = await kv.smembers('devices');
    const today = new Date().toISOString().slice(0, 10);
    let sent = 0;

    for (const deviceId of deviceIds || []) {
      const [plants, subscription] = await Promise.all([
        kv.get(`plants:${deviceId}`),
        kv.get(`sub:${deviceId}`)
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
              await kv.del(`sub:${deviceId}`);
            }
          }
          plant.lastNotified = today;
        }
      }
      await kv.set(`plants:${deviceId}`, plants);
    }

    return res.status(200).json({ ok: true, checked: (deviceIds || []).length, sent });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Cron check failed' });
  }
}
