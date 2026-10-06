import { Redis } from '@upstash/redis';
import { getTokenFromRequest, verifyDeviceToken, registerDeviceToken } from '../lib/deviceAuth.js';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { deviceId, plants, syncCode } = req.body || {};
  if (!deviceId || typeof deviceId !== 'string') {
    return res.status(400).json({ error: 'Missing deviceId' });
  }
  if (!/^[a-zA-Z0-9_-]{8,64}$/.test(deviceId)) {
    return res.status(400).json({ error: 'Invalid deviceId format' });
  }
  if (!Array.isArray(plants)) {
    return res.status(400).json({ error: 'plants must be an array' });
  }
  if (plants.length > 500) {
    return res.status(400).json({ error: 'Too many plants' });
  }
  for (const p of plants) {
    if (!p || typeof p !== 'object' || typeof p.name !== 'string' || !p.name.trim()) {
      return res.status(400).json({ error: 'Each plant must be an object with a name' });
    }
  }
