// A lightweight shared-passcode gate for the whole app. Fully opt-in: if
// APP_PASSWORD isn't set, the gate is disabled entirely and everything
// behaves exactly as before.
export default async function handler(req, res) {
  const required = !!process.env.APP_PASSWORD;

  if (req.method === 'GET') {
    return res.status(200).json({ required });
  }

  if (req.method === 'POST') {
    if (!required) {
      return res.status(200).json({ ok: true });
    }
    const { password } = req.body || {};
    if (password && password === process.env.APP_PASSWORD) {
      return res.status(200).json({ ok: true });
    }
    return res.status(401).json({ error: 'Incorrect passcode.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
