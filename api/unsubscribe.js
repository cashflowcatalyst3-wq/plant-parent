import { Redis } from '@upstash/redis';
import { getTokenFromRequest, verifyDeviceToken } from '../lib/deviceAuth.js';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { deviceId } = req.body || {};
  if (!deviceId) {
    return res.status(400).json({ error: 'Missing deviceId' });
  }

  const token = getTokenFromRequest(req);
  const check = await verifyDeviceToken(redis, deviceId, token);
  if (!check.ok) {
    return res.status(403).json({ error: check.error });
  }

  try {
    await redis.del(`sub:${deviceId}`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not remove subscription' });
  }
}
