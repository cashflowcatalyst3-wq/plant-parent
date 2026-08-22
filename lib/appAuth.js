// Shared check used by every user-facing API route. If APP_PASSWORD isn't
// configured, the gate is off and this always passes — the feature is
// entirely opt-in.
export function checkAppPassword(req) {
  const required = !!process.env.APP_PASSWORD;
  if (!required) return true;
  const provided = req.headers['x-app-password'];
  return provided === process.env.APP_PASSWORD;
}
