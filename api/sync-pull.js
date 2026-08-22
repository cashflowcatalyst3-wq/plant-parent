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
  const { syncCode } = req.body || {};
  if (!syncCode) {
    return res.status(400).json({ error: 'Missing syncCode' });
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
