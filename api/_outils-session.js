// Sessions for the private tools under /outils/ (see middleware.js).
// Uses Web Crypto only, so the same code runs in the Edge middleware and in
// the Node login function.
//
// Environment:
//   OUTILS_SECRET  random string that signs session cookies. Changing it signs
//                  everyone out (use it after changing a password).
//   OUTILS_USERS   "name:salt:hash;name:salt:hash" (scrypt), generated with
//                  `node scripts/outils-users.mjs`.

export const COOKIE = "vitrine_outils";
export const SESSION_DAYS = 30;
const enc = new TextEncoder();

const b64url = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(`outils-v1:${data}`)));
}

/** Constant-time comparison of two strings. */
function same(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSession(user, secret, now = Date.now()) {
  const exp = Math.floor(now / 1000) + SESSION_DAYS * 86400;
  const payload = `${user}.${exp}`;
  return `${payload}.${await hmac(secret, payload)}`;
}

/** → the signed-in user's name, or null. Fails closed when no secret is set. */
export async function verifySession(token, secret, now = Date.now()) {
  if (!secret || typeof token !== "string" || token.length > 300) return null;
  const parts = token.split(".");
  if (parts.length !== 3 || !/^[a-z0-9-]{1,32}$/.test(parts[0]) || !/^\d{1,12}$/.test(parts[1])) return null;
  if (Number(parts[1]) * 1000 < now) return null;
  return same(parts[2], await hmac(secret, `${parts[0]}.${parts[1]}`)) ? parts[0] : null;
}

export function readCookie(header, name = COOKIE) {
  for (const part of (header || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

export const sessionCookie = token =>
  `${COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${SESSION_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`;
export const clearedCookie = `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;

/** Only same-site paths inside /outils/ are allowed as a post-login destination. */
export function safeNext(next) {
  return typeof next === "string" && /^\/outils\/[\w\-/.]*$/.test(next) && !next.includes("..") && !next.startsWith("/outils/connexion")
    ? next : "/outils/devis-maintenance/";
}
