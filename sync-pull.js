import { Redis } from '@upstash/redis';
import { checkRateLimit, todayKey } from '../lib/rateLimit.js';

const redis = Redis.fromEnv();

// Sync codes are only 6 characters, so without a limit here this endpoint
// could be hammered to brute-force a guess at someone else's synced data.
// Generous enough for normal use (typos, retries) but caps sustained guessing.
const PER_IP_DAILY_LIMIT = 30;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { syncCode } = req.body || {};
  if (!syncCode) {
    return res.status(400).json({ error: 'Missing syncCode' });
  }

  try {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
    const ipCheck = await checkRateLimit(redis, `ratelimit:sync-pull:ip:${ip}:${todayKey()}`, PER_IP_DAILY_LIMIT, 172800);
    if (!ipCheck.allowed) {
      return res.status(429).json({ error: "Too many sync attempts from this connection today. Try again tomorrow." });
    }
  } catch (err) {
    // if the rate-limit check itself fails, don't block syncing over it
    console.error('Rate limit check failed:', err);
  }

  try {
    const data = await redis.get(`synced:${syncCode}`);
    if (!data) {
      return res.status(404).json({ error: 'No synced data found for that code yet.' });
    }
    return res.status(200).json({ ok: true, plants: data.plants || [], updatedAt: data.updatedAt || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not fetch synced data' });
  }
}
