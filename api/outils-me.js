// Tells the private tools who is signed in, so the quote tool can pre-fill the
// issuer. Same session cookie as middleware.js; answers 401 without it.
import { readCookie, verifySession } from "./_outils-session.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const user = await verifySession(readCookie(req.headers.cookie), process.env.OUTILS_SECRET);
  if (!user) return res.status(401).json({ ok: false });
  return res.status(200).json({ ok: true, user });
}
