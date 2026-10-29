// Only fixed event names and language are collected. No URLs, text, identifiers or form answers.
import { limited, clientIp, redisConfigured, redis } from "./_guard.js";
import { originOk, readJson } from "./_email.js";
import { isJson } from "./_guard.js";
const events = new Set(["whatsapp_click", "quote_click", "contact_click", "contact_started", "quote_started", "audit_run"]);
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false }); }
  if (!originOk(req) || !isJson(req)) return res.status(403).json({ ok: false });
  try {
    const data = await readJson(req, 512);
    if (!events.has(data?.event) || !["fr", "en", "it"].includes(data?.lang)) return res.status(400).json({ ok: false });
    if (await limited("events", clientIp(req), 60, 60000)) return res.status(429).json({ ok: false });
    if (redisConfigured()) {
      const key = `vitrine:events:${new Date().toISOString().slice(0, 10)}`;
      await redis(["HINCRBY", key, `${data.event}:${data.lang}`, "1"]);
      await redis(["EXPIRE", key, 90 * 86400]);
    }
    console.info(JSON.stringify({ event: data.event, lang: data.lang }));
    return res.status(200).json({ ok: true });
  } catch { return res.status(503).json({ ok: false }); }
}
