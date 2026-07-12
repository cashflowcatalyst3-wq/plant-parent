import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { deviceId, plants } = req.body || {};
  if (!deviceId || !Array.isArray(plants)) {
    return res.status(400).json({ error: 'Missing deviceId or plants' });
  }

  try {
    await kv.set(`plants:${deviceId}`, plants);
    await kv.sadd('devices', deviceId);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not sync' });
  }
}
