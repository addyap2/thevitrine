// Shared spam / abuse protection for the questionnaire endpoint (ported from antonyaddy.com). No third-party service,
// no database. (The leading underscore keeps Vercel from exposing this file as a route.)
//
//  - Signed form tokens: /api/form-token hands the page a timestamp signed with a
//    server secret. The form sends it back, so the fill time is measured by the
//    server instead of trusted from the browser, and a script that never loads
//    the page has no token.
//  - Rate limits per IP and per recipient address. They live in the function's
//    memory, so they are best effort (each warm instance counts separately), but
//    they stop the burst-style abuse that matters here.
//
// Secret: FORM_SECRET if set, otherwise derived from RESEND_API_KEY, so nothing
// new has to be configured.

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
function checkToken(token, minAgeMs) {
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
  if (spent.has(parts[1])) return "invalid";
  sweep(spent, TOKEN_MAX_AGE_MS);
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
function limited(name, key, max, windowMs) {
  if (!key) return false;
  const id = `${name}:${key}`;
  const now = Date.now();
  const hits = (buckets.get(id) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) { buckets.set(id, hits); return true; }
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
