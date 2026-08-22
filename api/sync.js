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
  const { deviceId, plants, syncCode } = req.body || {};
  if (!deviceId || !Array.isArray(plants)) {
    return res.status(400).json({ error: 'Missing deviceId or plants' });
  }

  try {
    await redis.set(`plants:${deviceId}`, plants);
    await redis.sadd('devices', deviceId);
    if (syncCode) {
      await redis.set(`synced:${syncCode}`, { plants, updatedAt: new Date().toISOString() });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not sync' });
  }
}
