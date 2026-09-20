// Keeps a rolling log of the last N notifications sent, so the admin
// panel can show what happened and when. Stored as a single Redis list,
// trimmed on every write so it never grows unbounded.
const LOG_KEY = 'notification-log';
const MAX_ENTRIES = 100;

export async function logNotification(redis, entry) {
  // entry: { type, deviceId, nickname, title, status, error? }
  const record = {
    ...entry,
    at: new Date().toISOString(),
  };
  try {
    // LPUSH puts the newest entry at the head of the list.
    await redis.lpush(LOG_KEY, JSON.stringify(record));
    // Keep the list from growing forever.
    await redis.ltrim(LOG_KEY, 0, MAX_ENTRIES - 1);
  } catch (err) {
    // Logging is best-effort. Never let it break a notification send.
    console.error('Could not write notification log:', err);
  }
}

export async function readNotificationLog(redis, limit = 50) {
  try {
    const raw = await redis.lrange(LOG_KEY, 0, limit - 1);
    return (raw || []).map(item => {
      if (typeof item === 'string') {
        try { return JSON.parse(item); } catch (e) { return null; }
      }
      return item;
    }).filter(Boolean);
  } catch (err) {
    console.error('Could not read notification log:', err);
    return [];
  }
}

export async function clearNotificationLog(redis) {
  try {
    await redis.del(LOG_KEY);
  } catch (err) {
    console.error('Could not clear notification log:', err);
  }
}
