// Hands the questionnaire (/devis/, /en/quote/) a signed timestamp (see api/_guard.js).
import { issueToken, limited, clientIp } from "./_guard.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({ ok: false }); }
  try {
  if (await limited("token", clientIp(req), 60, 60 * 60 * 1000)) return res.status(429).json({ ok: false });
  } catch { return res.status(503).json({ ok: false }); }
  const token = issueToken();
  if (!token) { console.error("form-token: no secret (RESEND_API_KEY / FORM_SECRET) set"); return res.status(500).json({ ok: false }); }
  return res.status(200).json({ ok: true, token });
}
