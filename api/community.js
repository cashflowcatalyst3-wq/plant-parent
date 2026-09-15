import { Redis } from '@upstash/redis';
import { sanitizeNickname, containsBlockedWord } from '../lib/nickname.js';
import { getTokenFromRequest, verifyDeviceToken, registerDeviceToken } from '../lib/deviceAuth.js';

const redis = Redis.fromEnv();
const POSTS_KEY = 'community-posts';
const MAX_POSTS_RETURNED = 30;
const MAX_STORED_POSTS = 200;
const MAX_TIP_LENGTH = 700;

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const ids = await redis.zrange(POSTS_KEY, 0, MAX_POSTS_RETURNED - 1, { rev: true });
      if (!ids || ids.length === 0) {
        return res.status(200).json({ ok: true, posts: [] });
      }
      const posts = await Promise.all(ids.map((id) => redis.get(`community-post:${id}`)));
      const publicPosts = posts.filter(Boolean).map(({ deviceId, ...rest }) => rest);
      return res.status(200).json({ ok: true, posts: publicPosts });
    }

    if (req.method === 'POST') {
      const { deviceId, nickname, tip } = req.body || {};
      if (!deviceId || !nickname || !tip) {
        return res.status(400).json({ error: 'Missing deviceId, nickname, or tip' });
      }

      const token = getTokenFromRequest(req);
      const check = await verifyDeviceToken(redis, deviceId, token);
      if (!check.ok) {
        return res.status(403).json({ error: check.error });
      }

      const cleanNickname = sanitizeNickname(nickname);
      if (!cleanNickname) {
        return res.status(400).json({ error: 'Name must contain at least one letter or number.' });
      }
      if (containsBlockedWord(cleanNickname)) {
        return res.status(400).json({ error: "That name isn't allowed — please choose something else." });
      }

      const cleanTip = String(tip).trim().slice(0, MAX_TIP_LENGTH);
      if (!cleanTip) {
        return res.status(400).json({ error: 'Tip cannot be empty.' });
      }
      if (containsBlockedWord(cleanTip)) {
        return res.status(400).json({ error: "That message isn't allowed — please rephrase." });
      }

      if (check.isFirstUse && token) {
        await registerDeviceToken(redis, deviceId, token);
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const post = {
        id,
        deviceId,
        nickname: cleanNickname,
        tip: cleanTip,
        plantEmoji: '🌱',
        createdAt: new Date().toISOString(),
      };

      await redis.set(`community-post:${id}`, post);
      await redis.zadd(POSTS_KEY, { score: Date.now(), member: id });

      const count = await redis.zcard(POSTS_KEY);
      if (count > MAX_STORED_POSTS) {
        const excess = await redis.zrange(POSTS_KEY, 0, count - MAX_STORED_POSTS - 1);
        if (excess.length) {
          await redis.zrem(POSTS_KEY, ...excess);
          await Promise.all(excess.map((oldId) => redis.del(`community-post:${oldId}`)));
        }
      }

      return res.status(200).json({ ok: true, post });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Community request failed' });
  }
}
