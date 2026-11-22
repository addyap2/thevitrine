// Login for the private tools under /outils/ (page: /outils/connexion/).
// Checks a name and password against OUTILS_USERS and sets the session cookie
// that middleware.js requires. See api/_outils-session.js.
import crypto from "node:crypto";
import { promisify } from "node:util";
import { limited, clientIp, isJson } from "./_guard.js";
import { originOk, readJson } from "./_email.js";
import { createSession, safeNext, sessionCookie } from "./_outils-session.js";

const scrypt = promisify(crypto.scrypt);
const KEY_LEN = 32;
// Compared against when the name is unknown, so both cases take the same time.
const DUMMY = { salt: "AAAAAAAAAAAAAAAAAAAAAA", hash: "A".repeat(43) };

/** "antony:salt:hash;julien:salt:hash" → Map(name → { salt, hash }) */
export function parseUsers(value) {
  const users = new Map();
  for (const entry of String(value || "").split(";")) {
    const [name, salt, hash] = entry.trim().split(":");
    if (name && salt && hash) users.set(name.toLowerCase(), { salt, hash });
  }
  return users;
}

export async function hashPassword(password, salt) {
  return (await scrypt(password.normalize("NFC"), Buffer.from(salt, "base64url"), KEY_LEN)).toString("base64url");
}

export async function checkPassword(users, name, password) {
  const user = users.get(name) || DUMMY;
  const given = Buffer.from(await hashPassword(password, user.salt));
  const expected = Buffer.from(user.hash);
  return users.has(name) && given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false }); }
  if (!isJson(req) || !originOk(req)) return res.status(400).json({ ok: false });

  const secret = process.env.OUTILS_SECRET;
  const users = parseUsers(process.env.OUTILS_USERS);
  if (!secret || !users.size) { console.error("outils-login: OUTILS_SECRET or OUTILS_USERS not set"); return res.status(503).json({ ok: false, error: "config" }); }

  let body;
  try { body = await readJson(req, 4096); } catch { return res.status(400).json({ ok: false }); }
  const name = String(body.name || "").trim().toLowerCase().slice(0, 32);
  const password = String(body.password || "").slice(0, 200);
  if (!name || !password) return res.status(400).json({ ok: false, error: "missing" });

  // Slow down guessing: per visitor and per account.
  try {
    if (await limited("outils-login-ip", clientIp(req), 10, 15 * 60 * 1000)
      || await limited("outils-login-user", name, 20, 60 * 60 * 1000)) {
      return res.status(429).json({ ok: false, error: "limit" });
    }
  } catch { return res.status(503).json({ ok: false }); }

  if (!(await checkPassword(users, name, password))) return res.status(401).json({ ok: false, error: "wrong" });

  res.setHeader("Set-Cookie", sessionCookie(await createSession(name, secret)));
  return res.status(200).json({ ok: true, next: safeNext(body.next) });
}
