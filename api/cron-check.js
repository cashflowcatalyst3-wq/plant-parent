import { Redis } from '@upstash/redis';
import webpush from 'web-push';
import { logNotification } from '../lib/notificationLog.js';

function daysSince(dateStr) {
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function daysBetween(aIso, bIso) {
  return Math.floor((new Date(bIso) - new Date(aIso)) / (1000 * 60 * 60 * 24));
}


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
      title: 'Your week in review',
      body: `No waterings logged this week across your ${plants.length} plant${plants.length === 1 ? '' : 's'}. Might be worth a check-in.`,
    };
  }

  let body = `${wateringsThisWeek} watering${wateringsThisWeek === 1 ? '' : 's'} logged this week across ${plants.length} plant${plants.length === 1 ? '' : 's'}.`;
  if (bestStreakPlant && bestStreak > 1) {
    body += ` ${bestStreakPlant} is on a ${bestStreak}-watering streak.`;
  }
  if (overdueCount > 0) {
    body += ` ${overdueCount} plant${overdueCount === 1 ? ' is' : 's are'} overdue right now.`;
  }

  return { title: 'Your week in review', body };
}

export default async function handler(req, res) {

const secret = process.env.CRON_SECRET;
if (!secret) {
  return res.status(500).json({ error: 'CRON_SECRET is not configured' });
}
const authHeader = req.headers['authorization'] || '';
const bearerOk = authHeader === `Bearer ${secret}`;
const queryOk = req.query.secret === secret;
if (!bearerOk && !queryOk) {
  return res.status(401).json({ error: 'Unauthorized' });
}

  const missing = [];
  if (!process.env.VAPID_PUBLIC_KEY) missing.push('VAPID_PUBLIC_KEY');
  if (!process.env.VAPID_PRIVATE_KEY) missing.push('VAPID_PRIVATE_KEY');
  if (!process.env.UPSTASH_REDIS_REST_URL && !process.env.KV_REST_API_URL) missing.push('UPSTASH_REDIS_REST_URL (or KV_REST_API_URL)');
  if (!process.env.UPSTASH_REDIS_REST_TOKEN && !process.env.KV_REST_API_TOKEN) missing.push('UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_TOKEN)');
  if (missing.length) {
    return res.status(500).json({ error: `Missing environment variable(s): ${missing.join(', ')}. Add them in Vercel -> Settings -> Environment Variables, then redeploy.` });
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
    let totalFailed = 0;
    let digestsSent = 0;

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
      if (!Array.isArray(plants) || !subscription) continue;
      const validPlants = plants.filter(p => p && typeof p === 'object' && typeof p.name === 'string');


      const lbEntry = await redis.get(`leaderboard-entry:${deviceId}`);
      const deviceLabel = lbEntry?.nickname
        ? `${lbEntry.nickname} (${deviceId})`
        : deviceId;


      const overduePlants = plants.filter(p => {
        const elapsed = daysSince(p.lastWatered);
        return elapsed >= p.frequency && p.lastNotified !== today;
      });

      if (overduePlants.length >= 2) {
        const summaryPayload = JSON.stringify({
          title: `You have ${overduePlants.length} plants overdue`,
          body: `Water them today so their streaks don't reset.`
        });
        try {
          await webpush.sendNotification(subscription, summaryPayload);
          sent++;
          await logNotification(redis, {
            type: 'daily-check-summary',
            deviceId: deviceLabel,
            title: `You have ${overduePlants.length} plants overdue`,
            status: 'sent',
          });
        } catch (err) {
          totalFailed++;
          await logNotification(redis, {
            type: 'daily-check-summary',
            deviceId: deviceLabel,
            title: `You have ${overduePlants.length} plants overdue`,
            status: 'failed',
            error: err.statusCode ? `${err.statusCode}` : (err.message || 'unknown'),
          });
          if (err.statusCode === 410 || err.statusCode === 404) {
            await redis.del(`sub:${deviceId}`);
          }
        }
      }

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
            await logNotification(redis, {
              type: 'daily-check-plant',
              deviceId: deviceLabel,
              title: `${plant.name} is thirsty`,
              status: 'sent',
            });
          } catch (err) {
            totalFailed++;
            await logNotification(redis, {
              type: 'daily-check-plant',
              deviceId: deviceLabel,
              title: `${plant.name} is thirsty`,
              status: 'failed',
              error: err.statusCode ? `${err.statusCode}` : (err.message || 'unknown'),
            });
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
          await logNotification(redis, {
            type: 'weekly-digest',
            deviceId: deviceLabel,
            title: digest.title,
            status: 'sent',
          });
        } catch (err) {
          totalFailed++;
          await logNotification(redis, {
            type: 'weekly-digest',
            deviceId: deviceLabel,
            title: 'Weekly digest',
            status: 'failed',
            error: err.statusCode ? `${err.statusCode}` : (err.message || 'unknown'),
          });
          if (err.statusCode === 410 || err.statusCode === 404) {
            await redis.del(`sub:${deviceId}`);
          }
        }
      }
    }

    if (shouldSendDigests) {
      await redis.set('last-digest-date', today);
    }

    await redis.set('last-cron-run', new Date().toISOString());
    await logNotification(redis, {
      type: 'cron-run',
      deviceId: 'all',
      title: `Run summary: ${(deviceIds || []).length} devices checked, ${sent} sent, ${totalFailed} failed`,
      status: totalFailed > 0 ? 'failed' : 'sent',
    });

    return res.status(200).json({
      ok: true,
      checked: (deviceIds || []).length,
      sent,
      failed: totalFailed,
      digestsSent
    });
  } catch (err) {
    console.error('Cron check failed:', err);
    try {
      await logNotification(redis, {
        type: 'cron-error',
        deviceId: 'all',
        title: 'Cron check failed',
        status: 'failed',
        error: err.message || 'unknown',
      });
    } catch (logErr) {
      console.error('Could not log cron failure:', logErr);
    }
    return res.status(500).json({ error: `Cron check failed: ${err.message}` });
  }
}
