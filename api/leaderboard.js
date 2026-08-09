import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const MEMBERS_KEY = 'leaderboard-members';
const NICKNAME_INDEX_KEY = 'leaderboard-nickname-index'; // normalized nickname -> deviceId
const MAX_NICKNAME_LENGTH = 20;

// Not exhaustive — just enough to block the obvious cases. Checked against
// the nickname with spaces/punctuation stripped, so simple spacing tricks
// ("f u c k") don't slip through.
const BLOCKED_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'pussy', 'cunt', 'cock',
  'nigger', 'nigga', 'fag', 'faggot', 'retard', 'whore', 'slut', 'rape',
  'nazi', 'hitler', 'kike', 'chink', 'spic', 'tranny',
];

function sanitizeNickname(raw) {
  const trimmed = String(raw || '').trim().slice(0, MAX_NICKNAME_LENGTH);
  // strip anything that isn't a letter, number, space, or a few safe punctuation marks
  return trimmed.replace(/[^\p{L}\p{N} _\-'!?]/gu, '').trim();
}

function normalizeNickname(nickname) {
  return nickname.toLowerCase().replace(/\s+/g, ' ').trim();
}

function containsBlockedWord(nickname) {
  const stripped = nickname.toLowerCase().replace(/[^a-z0-9]/g, '');
  return BLOCKED_WORDS.some((word) => stripped.includes(word));
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const memberIds = await redis.smembers(MEMBERS_KEY);
      if (!memberIds || memberIds.length === 0) {
        return res.status(200).json({ ok: true, streaks: [], plants: [] });
      }

      const entries = await Promise.all(
        memberIds.map((id) => redis.get(`leaderboard-entry:${id}`))
      );
      const valid = entries.filter(Boolean);

      const streaks = [...valid]
        .sort((a, b) => (b.bestStreak || 0) - (a.bestStreak || 0))
        .slice(0, 50)
        .map((e) => ({ nickname: e.nickname, deviceId: e.deviceId, value: e.bestStreak || 0 }));

      const plants = [...valid]
        .sort((a, b) => (b.plantCount || 0) - (a.plantCount || 0))
        .slice(0, 50)
        .map((e) => ({ nickname: e.nickname, deviceId: e.deviceId, value: e.plantCount || 0 }));

      return res.status(200).json({ ok: true, streaks, plants });
    }

    if (req.method === 'POST') {
      const { deviceId, nickname, bestStreak, plantCount } = req.body || {};
      if (!deviceId || !nickname) {
        return res.status(400).json({ error: 'Missing deviceId or nickname' });
      }

      const cleanNickname = sanitizeNickname(nickname);
      if (!cleanNickname) {
        return res.status(400).json({ error: 'Nickname must contain at least one letter or number.' });
      }
      if (containsBlockedWord(cleanNickname)) {
        return res.status(400).json({ error: "That nickname isn't allowed — please choose something else." });
      }

      const normalized = normalizeNickname(cleanNickname);

      const existingOwner = await redis.hget(NICKNAME_INDEX_KEY, normalized);
      if (existingOwner && existingOwner !== deviceId) {
        return res.status(409).json({ error: 'That nickname is already taken — try another one.' });
      }

      // free up this device's previous nickname reservation, if it's changing
      const priorEntry = await redis.get(`leaderboard-entry:${deviceId}`);
      if (priorEntry && priorEntry.normalized && priorEntry.normalized !== normalized) {
        await redis.hdel(NICKNAME_INDEX_KEY, priorEntry.normalized);
      }

      const entry = {
        deviceId,
        nickname: cleanNickname,
        normalized,
        bestStreak: priorEntry?.adminOverride ? (priorEntry.bestStreak || 0) : Math.max(0, parseInt(bestStreak, 10) || 0),
        plantCount: priorEntry?.adminOverride ? (priorEntry.plantCount || 0) : Math.max(0, parseInt(plantCount, 10) || 0),
        adminOverride: !!priorEntry?.adminOverride,
        updatedAt: new Date().toISOString(),
      };
      await redis.set(`leaderboard-entry:${deviceId}`, entry);
      await redis.sadd(MEMBERS_KEY, deviceId);
      await redis.hset(NICKNAME_INDEX_KEY, { [normalized]: deviceId });
      return res.status(200).json({ ok: true, nickname: cleanNickname });
    }

    if (req.method === 'DELETE') {
      const { deviceId } = req.body || {};
      if (!deviceId) {
        return res.status(400).json({ error: 'Missing deviceId' });
      }
      const entry = await redis.get(`leaderboard-entry:${deviceId}`);
      if (entry && entry.normalized) {
        await redis.hdel(NICKNAME_INDEX_KEY, entry.normalized);
      }
      await redis.del(`leaderboard-entry:${deviceId}`);
      await redis.srem(MEMBERS_KEY, deviceId);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Leaderboard request failed' });
  }
}
