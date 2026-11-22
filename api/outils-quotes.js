// Shared "Mes devis" for the quote tool (/outils/devis-maintenance/), so Antony
// and Julien see the same saved quotes on every device. Same session cookie as
// middleware.js. Stored in the site's Redis as one hash per environment, so a
// preview deployment never touches production quotes.
//
//   GET                 → { ok, quotes: [{ quote, savedAt, savedBy }] }
//   POST { quote }      → saves or replaces that quote (by quote.id)
//   DELETE ?id=<uuid>   → removes it
import { isJson, redis, redisConfigured } from "./_guard.js";
import { originOk, readJson } from "./_email.js";
import { readCookie, verifySession } from "./_outils-session.js";

const MAX_QUOTE_BYTES = 64 * 1024;
const MAX_QUOTES = 1000;
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const quotesKey = () => `vitrine:outils:quotes:${process.env.VERCEL_ENV || "development"}`;

/** Minimal shape check; the tool validates every field again when it loads the list. */
export function validQuote(quote) {
  return !!quote && typeof quote === "object" && !Array.isArray(quote) && typeof quote.id === "string" && ID.test(quote.id)
    && typeof quote.reference === "string" && Array.isArray(quote.selected) && quote.client && quote.provider;
}

/** HGETALL reply ([field, value, …]) → saved quotes, newest first. Unreadable entries are skipped. */
export function parseAll(reply) {
  const out = [];
  for (let i = 1; i < (reply || []).length; i += 2) {
    try { const item = JSON.parse(reply[i]); if (validQuote(item.quote)) out.push(item); } catch { /* skip */ }
  }
  return out.sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)));
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const user = await verifySession(readCookie(req.headers.cookie), process.env.OUTILS_SECRET);
  if (!user) return res.status(401).json({ ok: false });
  if (!redisConfigured()) return res.status(503).json({ ok: false, error: "storage" });

  try {
    if (req.method === "GET") {
      return res.status(200).json({ ok: true, quotes: parseAll(await redis(["HGETALL", quotesKey()])) });
    }

    if (!originOk(req)) return res.status(403).json({ ok: false });

    if (req.method === "POST") {
      if (!isJson(req)) return res.status(400).json({ ok: false });
      let body;
      try { body = await readJson(req, MAX_QUOTE_BYTES + 1024); } catch { return res.status(413).json({ ok: false, error: "size" }); }
      if (!validQuote(body.quote)) return res.status(400).json({ ok: false, error: "invalid" });
      const item = { quote: body.quote, savedAt: new Date().toISOString(), savedBy: user };
      const json = JSON.stringify(item);
      if (Buffer.byteLength(json) > MAX_QUOTE_BYTES) return res.status(413).json({ ok: false, error: "size" });
      const exists = await redis(["HEXISTS", quotesKey(), body.quote.id]);
      if (!exists && (await redis(["HLEN", quotesKey()])) >= MAX_QUOTES) return res.status(507).json({ ok: false, error: "full" });
      await redis(["HSET", quotesKey(), body.quote.id, json]);
      return res.status(200).json({ ok: true, item });
    }

    if (req.method === "DELETE") {
      const id = new URL(req.url, "https://thevitrine.fr").searchParams.get("id") || "";
      if (!ID.test(id)) return res.status(400).json({ ok: false });
      await redis(["HDEL", quotesKey(), id]);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ ok: false });
  } catch (error) {
    console.error("outils-quotes:", error.message);
    return res.status(503).json({ ok: false, error: "storage" });
  }
}
