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
  { title: "🪟 Light tip", body: "Most houseplants do best in bright, indirect light — direct sun through a window can scorch leaves." },
  { title: "🐛 Pest tip", body: "Sticky residue on leaves often means aphids or scale. A quick wipe with diluted soap water usually helps." },
  { title: "🌡️ Care tip", body: "Sudden leaf drop is often about temperature swings, not water — keep plants away from cold drafts and heating vents." },
  { title: "🌾 Fertilizing tip", body: "Most houseplants barely need feeding in fall and winter — save the fertilizer for active growing months." },
  { title: "🍁 Propagation tip", body: "A cutting roots faster in water when the container gets indirect light instead of a dark corner." },
  { title: "🌵 Fun fact", body: "Succulents store water in their leaves — that's exactly why overwatering is the #1 way to lose one." },
  { title: "🌸 Fun fact", body: "Some plants release chemical signals through the air to warn nearby plants when they're stressed." },
  { title: "🧴 Care tip", body: "Brown, crispy leaf tips are usually low humidity, not underwatering. A pebble tray or humidifier can help." },
  { title: "🌦️ Seasonal tip", body: "Plants drink less as days get shorter — if growth has slowed, it's normal to water a little less often." },
  { title: "🌺 Encouragement", body: "Even experienced plant parents lose a plant now and then — it's part of learning what each one needs." },
  { title: "🍃 Plant tip", body: "Cutting off dead or yellowing leaves lets your plant focus its energy on healthy new growth." },
  { title: "💧 Watering tip", body: "A pot without drainage holes is one of the most common reasons roots rot — always check before you water." },
  { title: "🪴 Fun fact", body: "Snake plants release oxygen at night too, unlike most plants — a nice one for the bedroom." },
  { title: "🌱 Good sign", body: "Roots peeking out of the drainage holes usually mean it's time to size up the pot." },
  { title: "🌻 Fun fact", body: "A plant leaning toward the window is chasing light — rotate it weekly for even, upright growth." },
  { title: "🐛 Pest tip", body: "Tiny flying bugs near the soil are usually fungus gnats — letting the topsoil dry out fully between waterings helps a lot." },
  { title: "🌿 Plant tip", body: "Grouping plants together raises the humidity around them, which many tropical varieties love." },
  { title: "💧 Quick check", body: "A pot that feels noticeably lighter than usual is a good sign it's ready for water." },
  { title: "🪟 Light tip", body: "An east-facing window gives gentle morning sun — one of the easiest spots for most houseplants to thrive." },
  { title: "🍂 Plant tip", body: "Wiping down leaves isn't just for looks — clean leaves photosynthesize more efficiently." },
  { title: "🌡️ Care tip", body: "Most houseplants are happiest between 65–75°F (18–24°C) — the same range most people keep their homes." },
  { title: "🌾 Fertilizing tip", body: "More fertilizer isn't better — over-feeding can burn roots faster than under-feeding ever will." },
  { title: "🌱 Just checking in", body: "Any new leaves unfurling lately? That's always worth celebrating." },
  { title: "🍁 Propagation tip", body: "Cuttings root fastest when taken just below a leaf node — that's where the new roots actually form." },
  { title: "🌵 Fun fact", body: "Some cacti can go months without water, but almost none of them enjoy sitting in a soggy pot." },
  { title: "🌺 Encouragement", body: "A slow-growing plant isn't necessarily an unhappy one — some species are just naturally patient growers." },
];

// How many of the most recent sends to avoid repeating. Keeps the same tip
// from showing up again for a while without needing to track every message ever sent.
const RECENT_HISTORY_LIMIT = 8;
const RECENT_HISTORY_KEY = 'notification-recent-indices';

async function pickMessage(redis) {
  let recent = [];
  try {
    const stored = await redis.get(RECENT_HISTORY_KEY);
    if (Array.isArray(stored)) recent = stored;
  } catch (err) {
    // if history lookup fails, fall back to picking from the full pool
  }

  const available = MESSAGES.map((_, i) => i).filter((i) => !recent.includes(i));
  const pool = available.length ? available : MESSAGES.map((_, i) => i);
  const index = pool[Math.floor(Math.random() * pool.length)];

  try {
    const updated = [...recent, index].slice(-RECENT_HISTORY_LIMIT);
    await redis.set(RECENT_HISTORY_KEY, updated);
  } catch (err) {
    // non-fatal — worst case a tip repeats sooner than usual
  }

  return MESSAGES[index];
}

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
    const message = await pickMessage(redis);
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
