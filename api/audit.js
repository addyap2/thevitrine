// Vercel function: the "Audit express" (/audit-express/, /en/website-check/,
// /it/check-up-sito/). Fetches the home page of a site a visitor names and
// returns a short list of checks. Nothing about the page is returned except
// those checks, and nothing is stored.
//
// Safety: http(s) on standard ports only, no IP literals, every resolved
// address must be public (checked at connection time, so DNS rebinding can't
// slip through), at most 4 redirects (each re-checked), 8 s, 1.5 MB, and a
// per-IP rate limit.

import http from "node:http";
import https from "node:https";
import dns from "node:dns";
import net from "node:net";
import { parse } from "parse5";
import { limited, clientIp, isJson } from "./_guard.js";
import { originOk, readJson } from "./_email.js";

const TIMEOUT_MS = 8000;
const MAX_BYTES = 1.5 * 1024 * 1024;
const MAX_REDIRECTS = 4;

// ---------- address checks ----------
function privateV4(ip) {
  const [a, b] = ip.split(".").map(Number);
  return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) || a >= 224;
}
function privateIp(ip) {
  if (net.isIPv4(ip)) return privateV4(ip);
  const v6 = ip.toLowerCase();
  const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return privateV4(mapped[1]);
  return v6 === "::" || v6 === "::1" || v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe8") ||
    v6.startsWith("fe9") || v6.startsWith("fea") || v6.startsWith("feb") || v6.startsWith("ff") || v6.startsWith("64:ff9b");
}
// A DNS lookup that refuses private addresses: used for every connection.
function safeLookup(hostname, options, callback) {
  dns.lookup(hostname, { all: true }, (err, addresses) => {
    if (err) return callback(err);
    if (!addresses.length || addresses.some((a) => privateIp(a.address))) {
      return callback(Object.assign(new Error("blocked address"), { code: "EBLOCKED" }));
    }
    const first = addresses[0];
    if (options && options.all) return callback(null, addresses);
    callback(null, first.address, first.family);
  });
}

export function normaliseUrl(input) {
  let raw = String(input || "").trim();
  if (!raw || raw.length > 300) return null;
  if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
  let url;
  try { url = new URL(raw); } catch { return null; }
  if (!["http:", "https:"].includes(url.protocol)) return null;
  if (url.username || url.password) return null;
  if (url.port && !["80", "443"].includes(url.port)) return null;
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (net.isIP(host) || !host.includes(".") || host.endsWith(".local") || host.endsWith(".internal") || host === "localhost") return null;
  url.hash = "";
  return url;
}

// ---------- fetching ----------
function get(url, remainingMs) {
  return new Promise((resolve, reject) => {
    const lib = url.protocol === "https:" ? https : http;
    const started = Date.now();
    const req = lib.get(url, {
      lookup: safeLookup,
      timeout: remainingMs,
      headers: { "User-Agent": "TheVitrine-AuditExpress/1.0 (+https://thevitrine.fr/audit-express/)", Accept: "text/html,application/xhtml+xml" },
    }, (res) => {
      const ttfb = Date.now() - started;
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        clearTimeout(deadline);
        resolve({ redirect: res.headers.location, status: res.statusCode, ttfb });
        res.destroy();
        return;
      }
      const chunks = []; let size = 0;
      res.on("data", (c) => {
        size += c.length;
        if (size > MAX_BYTES) { req.destroy(Object.assign(new Error("too large"), { code: "ETOOLARGE" })); return; }
        chunks.push(c);
      });
      res.on("end", () => { clearTimeout(deadline); resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString("utf8"), size, ttfb, total: Date.now() - started }); });
      res.on("error", reject);
    });
    // Socket inactivity alone does not bound DNS, slow streams or redirects.
    const deadline = setTimeout(() => req.destroy(Object.assign(new Error("timeout"), { code: "ETIMEOUT" })), remainingMs);
    req.on("timeout", () => req.destroy(Object.assign(new Error("timeout"), { code: "ETIMEOUT" })));
    req.on("error", (e) => { clearTimeout(deadline); reject(e); });
    req.on("close", () => clearTimeout(deadline));
  });
}

export async function fetchPage(start) {
  let url = start, hops = 0;
  const started = Date.now();
  const deadline = started + TIMEOUT_MS;
  for (;;) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw Object.assign(new Error("timeout"), { code: "ETIMEOUT" });
    const r = await get(url, remaining);
    if (!r.redirect) return { ...r, total: Date.now() - started, finalUrl: url, hops };
    if (++hops > MAX_REDIRECTS) throw Object.assign(new Error("redirects"), { code: "EREDIRECTS" });
    const next = normaliseUrl(new URL(r.redirect, url).href);
    if (!next) throw Object.assign(new Error("blocked redirect"), { code: "EBLOCKED" });
    url = next;
  }
}

// ---------- checks ----------
export function analyse(html, meta) {
  // Parse inert HTML, never execute it. Script strings, comments, templates and
  // data-* attributes must not count as actual headings, images or metadata.
  const elements = [];
  const pending = [parse(html)];
  while (pending.length) {
    const node = pending.pop();
    if (node.tagName) elements.push(node);
    if (node.tagName !== "template") {
      const children = node.childNodes || [];
      for (let i = children.length - 1; i >= 0; i--) pending.push(children[i]);
    }
  }
  const tags = (name) => elements.filter((node) => node.tagName === name);
  const attr = (node, name) => node?.attrs?.find((a) => a.name === name)?.value;
  const text = (node) => (node?.childNodes || []).map((n) => n.value || "").join("").replace(/\s+/g, " ").trim();
  const metas = tags("meta");
  const metaContent = (key) => {
    const tag = metas.find((t) => (attr(t, "name") || attr(t, "property") || "").toLowerCase() === key);
    return tag ? (attr(tag, "content") || "").trim() : null;
  };
  const title = text(tags("title")[0]);
  const description = metaContent("description");
  const viewport = metaContent("viewport") || "";
  const lang = (attr(tags("html")[0], "lang") || "").trim();
  const h1 = tags("h1").length;
  const tel = tags("a").some((node) => /^tel:.+/i.test((attr(node, "href") || "").trim()));
  const jsonLd = tags("script").some((node) => (attr(node, "type") || "").trim().toLowerCase() === "application/ld+json");
  const ogImage = metaContent("og:image");
  const imgs = tags("img");
  const noAlt = imgs.filter((t) => attr(t, "alt") === undefined).length;

  const checks = [];
  const add = (id, status, value) => checks.push({ id, status, ...(value !== undefined ? { value } : {}) });
  add("https", meta.https ? "good" : "bad");
  add("mobile", /width\s*=\s*device-width/i.test(viewport) ? "good" : "bad");
  add("speed", meta.total < 1500 ? "good" : meta.total < 3500 ? "warn" : "bad", meta.total);
  add("weight", meta.size < 300 * 1024 ? "good" : meta.size < 800 * 1024 ? "warn" : "bad", Math.max(0.1, Math.round(meta.size / 102.4) / 10));
  add("title", !title ? "bad" : title.length >= 10 && title.length <= 65 ? "good" : "warn", title.length);
  // Description length alone does not establish quality or search appearance.
  add("description", description ? "good" : "bad", description ? description.length : 0);
  add("h1", h1 === 1 ? "good" : h1 === 0 ? "bad" : "warn", h1);
  add("phone", tel ? "good" : "warn");
  add("structured", jsonLd ? "good" : "warn");
  add("share", ogImage ? "good" : "warn");
  add("lang", lang ? "good" : "warn");
  if (imgs.length) add("alt", noAlt === 0 ? "good" : noAlt / imgs.length < 0.3 ? "warn" : "bad", noAlt);
  return { checks };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false }); }
  if (!originOk(req)) return res.status(403).json({ ok: false });
  if (!isJson(req)) return res.status(415).json({ ok: false });
  let body;
  try { body = await readJson(req, 1024); } catch { return res.status(400).json({ ok: false }); }
  const url = normaliseUrl(body && body.url);
  if (!url) return res.status(422).json({ ok: false, error: "url" });

  const ip = clientIp(req);
  try {
    if (await limited("audit-ip", ip, 8, 10 * 60 * 1000) || await limited("audit-ip-day", ip, 30, 24 * 60 * 60 * 1000)) {
      return res.status(429).json({ ok: false, error: "rate" });
    }
  } catch { return res.status(503).json({ ok: false, error: "unavailable" }); }

  let page;
  try {
    page = await fetchPage(url);
  } catch (e) {
    const error = e.code === "EBLOCKED" ? "url" : e.code === "ETIMEOUT" ? "timeout" : e.code === "ETOOLARGE" ? "large" : "unreachable";
    console.info(JSON.stringify({ event: "audit_failed", error }));
    return res.status(200).json({ ok: false, error });
  }
  if (page.status >= 400) return res.status(200).json({ ok: false, error: "status", status: page.status });
  const type = String(page.headers["content-type"] || "");
  if (type && !/html/i.test(type)) return res.status(200).json({ ok: false, error: "nothtml" });

  const result = analyse(page.body, { https: page.finalUrl.protocol === "https:", total: page.total, size: page.size });
  console.info(JSON.stringify({ event: "audit_run", checks: result.checks.length }));
  return res.status(200).json({ ok: true, host: page.finalUrl.hostname, url: page.finalUrl.href, ...result });
}
