// Plant species identification via Pl@ntNet's free API (my.plantnet.org).
// Free tier: 500 identifications/day, no cost. Needs a free API key.
import { Redis } from '@upstash/redis';
import { checkRateLimit, todayKey } from '../lib/rateLimit.js';

const redis = Redis.fromEnv();

// Pl@ntNet's whole free tier is 500/day, shared across everyone using this
// app. These caps just stop any single visitor from using up a big chunk of
// that on their own — not a login, just fair-use protection.
const PER_DEVICE_DAILY_LIMIT = 20;
const PER_IP_DAILY_LIMIT = 40;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64, organ, deviceId } = req.body || {};

  try {
    const today = todayKey();
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';

    if (deviceId) {
      const deviceCheck = await checkRateLimit(redis, `ratelimit:identify:device:${deviceId}:${today}`, PER_DEVICE_DAILY_LIMIT, 172800);
      if (!deviceCheck.allowed) {
        return res.status(429).json({ error: "You've hit today's identification limit on this device. Try again tomorrow." });
      }
    }

    const ipCheck = await checkRateLimit(redis, `ratelimit:identify:ip:${ip}:${today}`, PER_IP_DAILY_LIMIT, 172800);
    if (!ipCheck.allowed) {
      return res.status(429).json({ error: "This connection has hit today's identification limit. Try again tomorrow." });
    }
  } catch (err) {
    // if the rate-limit check itself fails, don't block identification over it
    console.error('Rate limit check failed:', err);
  }

  if (!process.env.PLANTNET_API_KEY) {
    return res.status(500).json({ error: 'PLANTNET_API_KEY is not set. Add it in Vercel → Settings → Environment Variables, then redeploy.' });
  }

  try {
    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing photo' });
    }

    const match = imageBase64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: 'Invalid photo data' });
    }
    const mimeType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const form = new FormData();
    const blob = new Blob([buffer], { type: mimeType });
    form.append('images', blob, 'photo.jpg');
    form.append('organs', organ === 'flower' || organ === 'fruit' || organ === 'bark' ? organ : 'leaf');

    const url = `https://my-api.plantnet.org/v2/identify/all?api-key=${encodeURIComponent(process.env.PLANTNET_API_KEY)}&nb-results=5`;
    const plantnetRes = await fetch(url, { method: 'POST', body: form });
    const data = await plantnetRes.json();

    if (!plantnetRes.ok) {
      const message = data?.message || (plantnetRes.status === 404
        ? "Couldn't find a confident match — try a clearer photo of a leaf."
        : 'Identification failed. Try again in a moment.');
      return res.status(plantnetRes.status === 404 ? 200 : 500).json(
        plantnetRes.status === 404 ? { ok: true, results: [] } : { error: message }
      );
    }

    const results = (data.results || []).slice(0, 5).map((r) => ({
      score: r.score,
      scientificName: r.species?.scientificNameWithoutAuthor || r.species?.scientificName || 'Unknown',
      commonNames: r.species?.commonNames || [],
    }));

    return res.status(200).json({ ok: true, results });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Identification request failed' });
  }
}
