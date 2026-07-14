import { Redis } from '@upstash/redis';
import webpush from 'web-push';

const MESSAGES = [
  { title: "🌿 Plant tip", body: "Talking to your plants can actually help them grow — the CO2 you exhale is basically plant food." },
  { title: "💧 Watering tip", body: "Water in the morning when you can, so leaves have time to dry before nightfall." },
  { title: "🪴 Fun fact", body: "The world's oldest known potted plant has been growing for over 200 years." },
  { title: "🌱 Just checking in", body: "How are your plants doing today? Might be worth a quick look." },
  { title: "🍃 Plant tip", body: "Yellowing leaves usually mean overwatering, not underwatering." },
  { title: "🌻 Fun fact", body: "Some plants respond to vibrations — gentle sound may help young stems grow sturdier." },
  { title: "🪴 Plant tip", body: "Give your plants a quarter turn now and then so they grow evenly toward the light." },
  { title: "💧 Watering tip", body: "Tap water is fine for most houseplants — let it sit out a few hours first if you're worried about chlorine." },
  { title: "🌿 Plant tip", body: "Ferns and calatheas usually appreciate a light misting between waterings." },
  { title: "🍂 Plant tip", body: "Dust on leaves blocks light. A gentle wipe now and then helps your plant photosynthesize better." },
  { title: "🌱 Good sign", body: "New leaf growth is one of the clearest signs a plant is happy where it is." },
  { title: "🪴 Fun fact", body: "Most houseplants actually prefer being slightly root-bound over being repotted too often." },
  { title: "💧 Quick check", body: "Stick a finger an inch into the soil — dry means water, still damp means wait a bit longer." },
  { title: "🌻 Reminder", body: "Your garden's been growing steadily. Worth a peek at how it's doing today." },
];

export default async function handler(req, res) {
  const isAuthorized = req.headers['x-vercel-cron'] || req.query.secret === process.env.CRON_SECRET;
  if (!isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check every required env var explicitly so a misconfiguration gives a real
  // answer instead of a blank 500.
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
    const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    let sent = 0;

    for (const deviceId of deviceIds || []) {
      const subscription = await redis.get(`sub:${deviceId}`);
      if (!subscription) continue;
      try {
        await webpush.sendNotification(subscription, JSON.stringify(message));
        sent++;
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await redis.del(`sub:${deviceId}`);
        }
      }
    }

    return res.status(200).json({ ok: true, sent, checked: (deviceIds || []).length, message: message.title });
  } catch (err) {
    console.error('Send failed:', err);
    return res.status(500).json({ error: `Failed to send notifications: ${err.message}` });
  }
}
