import crypto from 'crypto';

// Hash the token before storing it, so a leaked Redis dump doesn't give
// an attacker the raw tokens needed to impersonate devices.
export function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

export function generateDeviceToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Get the token from the request header. Frontend sends it as
// "x-device-token" on every write request.
export function getTokenFromRequest(req) {
  const t = req.headers['x-device-token'];
  return typeof t === 'string' ? t.trim() : null;
}

// Verify that the given token belongs to the given device. Returns true if
// the device has no token registered yet (first-time write) — that device
// will be issued a token by the caller.
export async function verifyDeviceToken(redis, deviceId, token) {
  const stored = await redis.get(`devtoken:${deviceId}`);
  if (!stored) return { ok: true, isFirstUse: true };
  if (!token) return { ok: false, error: 'Missing device token' };
  if (stored !== hashToken(token)) return { ok: false, error: 'Invalid device token' };
  return { ok: true, isFirstUse: false };
}

// Register a token for a device if it doesn't already have one.
export async function registerDeviceToken(redis, deviceId, token) {
  const key = `devtoken:${deviceId}`;
  const existing = await redis.get(key);
  if (existing) return; // don't overwrite an existing token
  // Expire tokens after ~2 years to keep Redis from growing forever.
  await redis.set(key, hashToken(token), { ex: 60 * 60 * 24 * 730 });
}
