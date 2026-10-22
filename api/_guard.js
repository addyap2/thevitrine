// Signed form tokens and abuse limits. Shared Redis is used when configured;
// the bounded in-memory fallback remains best effort until Redis is connected.
import crypto from "node:crypto";

const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function secret() {
  const base = process.env.FORM_SECRET || process.env.RESEND_API_KEY || "";
  return base ? crypto.createHmac("sha256", base).update("form-token-v1").digest() : null;
}

function sign(payload, key) {
  return crypto.createHmac("sha256", key).update(payload).digest("base64url");
}

function issueToken() {
  const key = secret();
  if (!key) return null;
  const payload = `${Date.now()}.${crypto.randomBytes(9).toString("base64url")}`;
  return `${payload}.${sign(payload, key)}`;
}

// Nonces already spent on this instance, so one token can't be replayed in a loop.
const spent = new Map();

// → "ok" | "invalid" | "young". "young" means filled faster than a person could.
async function checkToken(token, minAgeMs) {
  const key = secret();
  if (!key || typeof token !== "string" || token.length > 200) return "invalid";
  const parts = token.split(".");
  if (parts.length !== 3) return "invalid";
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = Buffer.from(sign(payload, key));
  const given = Buffer.from(parts[2]);
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return "invalid";
  const age = Date.now() - Number(parts[0]);
  if (!(age >= 0) || age > TOKEN_MAX_AGE_MS) return "invalid";
  if (age < minAgeMs) return "young";
  if (redisConfigured()) {
    const claimed = await redis(["SET", `vitrine:nonce:${parts[1]}`, "1", "NX", "PX", TOKEN_MAX_AGE_MS]);
    return claimed === "OK" ? "ok" : "invalid";
  }
  if (spent.has(parts[1])) return "invalid";
  sweep(spent, TOKEN_MAX_AGE_MS);
  if (spent.size >= 10000) return "invalid";
  spent.set(parts[1], Date.now());
  return "ok";
}

// key → list of hit times, per limiter.
const buckets = new Map();

function sweep(map, windowMs) {
  if (map.size < 5000) return;
  const now = Date.now();
  for (const [k, v] of map) {
    const last = Array.isArray(v) ? v[v.length - 1] : v;
    if (now - last > windowMs) map.delete(k);
  }
}

// true when the key has already hit `max` times within `windowMs`; otherwise records a hit.
async function limited(name, key, max, windowMs) {
  if (!key) return false;
  // Store only keyed hashes, never raw visitor IPs or email addresses.
  const id = crypto.createHmac("sha256", secret() || "local-test").update(`${name}:${key}`).digest("hex");
  if (redisConfigured()) {
    const lua = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]) end; return n";
    return (await redis(["EVAL", lua, "1", `vitrine:limit:${id}`, String(windowMs)])) > max;
  }
  const now = Date.now();
  const hits = (buckets.get(id) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) { buckets.set(id, hits); return true; }
  if (buckets.size >= 10000 && !buckets.has(id)) return true;
  hits.push(now);
  buckets.set(id, hits);
  sweep(buckets, 24 * 60 * 60 * 1000);
  return false;
}

function clientIp(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return fwd || String(req.headers["x-real-ip"] || "") || (req.socket && req.socket.remoteAddress) || "";
}

// JSON only: a plain cross-site <form> post can't send this content type without a CORS preflight.
function isJson(req) {
  return /^application\/json\b/i.test(String(req.headers["content-type"] || ""));
}

// First name for a greeting, or "" when it looks like a link or an address, so the
// confirmation email can't be used to deliver someone else's URL to a victim.
function greetingName(name) {
  const first = String(name || "").trim().split(/\s+/)[0] || "";
  if (!first || first.length > 40 || /(https?:|www\.|:\/\/|@|\.[a-z]{2,}\b)/i.test(first)) return "";
  return first;
}

function countLinks(s) {
  return (String(s || "").match(/https?:\/\/|www\./gi) || []).length;
}

export { issueToken, checkToken, limited, clientIp, isJson, greetingName, countLinks };

export function redisConfigured() {
  return !!((process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) && (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN));
}
export async function redis(command) {
  const response = await fetch(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL, {
    method: "POST", headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command), signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error("Shared protection unavailable");
  const body = await response.json();
  if (body.error) throw new Error("Shared protection failed");
  return body.result;
}

export async function countConversion(form, lang, requestKey) {
  if (!redisConfigured()) return;
  const key = `vitrine:events:${new Date().toISOString().slice(0, 10)}`;
  try {
    const first = await redis(["SET", `vitrine:conversion:${requestKey}`, "1", "NX", "EX", 86400]);
    if (first !== "OK") return;
    await redis(["HINCRBY", key, `${form}_received:${lang}`, "1"]);
    await redis(["EXPIRE", key, 90 * 86400]);
  } catch { console.error(JSON.stringify({ event: "conversion_count_failed", form })); }
}
