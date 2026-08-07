import { Redis } from '@upstash/redis';
import webpush from 'web-push';

function daysSince(dateStr) {
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function daysBetween(aIso, bIso) {
  return Math.floor((new Date(bIso) - new Date(aIso)) / (1000 * 60 * 60 * 24));
}

// Mirrors the streak calculation in app.js so the weekly digest reports the
// same numbers the person sees in the app.
function calcStreak(plant) {
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

function weeklyDigestPayload(plants) {
  const weekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let wateringsThisWeek = 0;
  let bestStreak = 0;
  let bestStreakPlant = null;
  let overdueCount = 0;

  for (const plant of plants) {
    const log = plant.waterLog || [];
    wateringsThisWeek += log.filter((iso) => new Date(iso).getTime() >= weekAgoMs).length;

    const streak = calcStreak(plant);
    if (streak > bestStreak) {
      bestStreak = streak;
      bestStreakPlant = plant.name;
    }

    if (daysSince(plant.lastWatered) >= plant.frequency) overdueCount++;
  }

  if (wateringsThisWeek === 0 && plants.length > 0) {
    return {
      title: '🌱 Your week in review',
      body: `No waterings logged this week across your ${plants.length} plant${plants.length === 1 ? '' : 's'} — might be worth a check-in.`,
    };
  }

  let body = `${wateringsThisWeek} watering${wateringsThisWeek === 1 ? '' : 's'} logged this week across ${plants.length} plant${plants.length === 1 ? '' : 's'}.`;
  if (bestStreakPlant && bestStreak > 1) {
    body += ` ${bestStreakPlant} is on a ${bestStreak}-watering streak 🔥`;
  }
  if (overdueCount > 0) {
    body += ` ${overdueCount} plant${overdueCount === 1 ? ' is' : 's are'} overdue right now.`;
  }

  return { title: '🌱 Your week in review', body };
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
    let digestsSent = 0;

    // Weekly digest piggybacks on this same daily cron — no extra scheduler
    // needed. It only fires on Sundays, and only once per day even if this
    // endpoint gets triggered more than once (e.g. manual testing).
    const isDigestDay = new Date().getUTCDay() === 0; // Sunday
    let shouldSendDigests = false;
    if (isDigestDay) {
      const lastDigestDate = await redis.get('last-digest-date');
      if (lastDigestDate !== today) {
        shouldSendDigests = true;
      }
    }

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

      if (shouldSendDigests && plants.length > 0) {
        try {
          const digest = weeklyDigestPayload(plants);
          await webpush.sendNotification(subscription, JSON.stringify(digest));
          digestsSent++;
        } catch (err) {
          if (err.statusCode === 410 || err.statusCode === 404) {
            await redis.del(`sub:${deviceId}`);
          }
        }
      }
    }

    if (shouldSendDigests) {
      await redis.set('last-digest-date', today);
    }

    return res.status(200).json({ ok: true, checked: (deviceIds || []).length, sent, digestsSent });
  } catch (err) {
    console.error('Cron check failed:', err);
    return res.status(500).json({ error: `Cron check failed: ${err.message}` });
  }
}
