import { Redis } from '@upstash/redis';
import { checkAppPassword } from '../lib/appAuth.js';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkAppPassword(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { deviceId, subscription } = req.body || {};
  if (!deviceId || !subscription) {
    return res.status(400).json({ error: 'Missing deviceId or subscription' });
  }

  try {
    await redis.set(`sub:${deviceId}`, subscription);
    await redis.sadd('devices', deviceId);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not save subscription' });
  }
}
