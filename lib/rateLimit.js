// Simple fixed-window rate limiter backed by Redis (already available via
// Upstash on every endpoint). Not per-user auth — just a cap on how much any
// single device or IP can hit an expensive endpoint (like the free Pl@ntNet
// quota) in a given day, so one visitor can't exhaust it for everyone else.
export async function checkRateLimit(redis, key, limit, windowSeconds) {
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }
  return { allowed: count <= limit, count, limit };
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD, UTC
}
