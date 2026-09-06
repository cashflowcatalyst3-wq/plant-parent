import { Redis } from '@upstash/redis';
import { sanitizeNickname, containsBlockedWord } from '../lib/nickname.js';

// MOCKUP NOTE: this is a lightweight, demo-scale community wall built for
// a competition presentation — not hardened for public production use.
// It reuses the leaderboard's existing nickname sanitizing/blocklist for
// basic decency, but has no per-device rate limiting, no edit/delete UI,
// and no real moderation queue. Good enough to demo live; would need
// hardening (rate limits, reporting, admin moderation) before real users.

const redis = Redis.fromEnv();
const POSTS_KEY = 'community-posts'; // sorted set of post ids, scored by time
const MAX_POSTS_RETURNED = 30;
const MAX_STORED_POSTS = 200; // keep the feed bounded so this stays a mockup, not an unbounded store
const MAX_TIP_LENGTH = 280;

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const ids = await redis.zrange(POSTS_KEY, 0, MAX_POSTS_RETURNED - 1, { rev: true });
      if (!ids || ids.length === 0) {
        return res.status(200).json({ ok: true, posts: [] });
      }
      const posts = await Promise.all(ids.map((id) => redis.get(`community-post:${id}`)));
      return res.status(200).json({ ok: true, posts: posts.filter(Boolean) });
    }

    if (req.method === 'POST') {
      const { deviceId, nickname, tip } = req.body || {};
      if (!deviceId || !nickname || !tip) {
        return res.status(400).json({ error: 'Missing deviceId, nickname, or tip' });
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

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const post = {
        id,
        nickname: cleanNickname,
        tip: cleanTip,
        plantEmoji: '🌱',
        createdAt: new Date().toISOString(),
      };

      await redis.set(`community-post:${id}`, post);
      await redis.zadd(POSTS_KEY, { score: Date.now(), member: id });

      // Trim old posts once the feed grows past the demo-scale cap.
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
