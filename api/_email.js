// Shared email kit for the questionnaire (api/devis.js) and the contact form
// (api/contact.js): The Vitrine's colours, the logo header, buttons that render
// in Outlook and Gmail, and the request helpers both endpoints need.
// (The leading underscore keeps Vercel from exposing this file as a route.)

import crypto from "node:crypto";

export const SITE = "https://thevitrine.fr";
export const LOGO = `${SITE}/brand/logo-email.png`; // 500×128, shown at 190×49

export const C = {
  night: "#081227", night2: "#10234d", lamp: "#ffc27d", lampHot: "#ffe2b8", blue: "#79adff",
  ink: "#1d1b18", soft: "#5d574f", muted: "#8a8379", accent: "#a8431f",
  paper: "#f6f3ee", card: "#fbf9f5", line: "#e4ded4", row: "#efe9df", red: "#b3261e", white: "#ffffff",
};
export const SERIF = "Georgia,'Times New Roman',serif";
export const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

export function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
export const clip = (s, n) => String(s == null ? "" : s).slice(0, n).trim();
export const oneLine = (s, n) => clip(s, n).replace(/[\r\n]+/g, " ");
export const isEmail = (s) => /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/.test(s) && s.length <= 254;

const ALLOWED_HOSTS = [/^thevitrine\.fr$/, /^www\.thevitrine\.fr$/, /^thevitrine(?:-[a-z0-9-]+)?\.vercel\.app$/, /^localhost(:\d+)?$/, /^127\.0\.0\.1(:\d+)?$/];
export function originOk(req) {
  const o = req.headers.origin || req.headers.referer || "";
  if (!o) return true; // some privacy tools strip both; the other checks still apply
  try { const h = new URL(o).host; return ALLOWED_HOSTS.some((re) => re.test(h)); }
  catch (e) { return false; }
}

export async function readJson(req, maxBytes) {
  if (req.body !== undefined) {
    const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(raw, "utf8") > maxBytes) throw new Error("too large");
    return JSON.parse(raw);
  }
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > maxBytes) throw new Error("too large"); chunks.push(c); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

/** Who receives form emails: DEVIS_TO (comma-separated) or Antony and Julien. */
export const recipients = () =>
  (process.env.DEVIS_TO || "antony@antonyaddy.com,bourgois.ju@gmail.com").split(",").map((s) => s.trim()).filter(Boolean);
// thevitrine.fr is verified in Resend (DKIM-signed), which lets it pass the domain's
// strict DMARC policy even though the domain itself receives no mail.
export const sender = () => process.env.DEVIS_FROM || "The Vitrine <devis@thevitrine.fr>";

export function submissionKey(kind, id, data) {
  return crypto.createHmac("sha256", process.env.FORM_SECRET || process.env.RESEND_API_KEY || "local-test").update(JSON.stringify([kind, typeof id === "string" ? id.slice(0, 80) : "", data])).digest("hex");
}

export async function send(key, msg, idempotencyKey) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}) },
    body: JSON.stringify(msg),
    signal: AbortSignal.timeout(10000),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json();
}

/** Phone digits for tel: and WhatsApp links; French numbers starting with 0 get +33. */
export function phoneDigits(phone) {
  let d = String(phone || "").replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  else if (d.startsWith("00")) d = d.slice(2);
  else if (/^0\d{9}$/.test(d)) d = "33" + d.slice(1);
  return /^\d{8,15}$/.test(d) ? d : "";
}

// ---------- building blocks ----------

/** A whole email: light colours only (so dark-mode clients don't half-invert it), phone layout, hidden preview text. */
export function documentHtml({ lang, title, preview, body }) {
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"><title>${esc(title)}</title>` +
    `<style>` +
      `body{margin:0;padding:0;background:${C.paper}}a{color:${C.night}}` +
      `@media (max-width:620px){.card{width:100%!important;border-radius:0!important;border-left:0!important;border-right:0!important}` +
      `.outer{padding:0!important}.px{padding-left:22px!important;padding-right:22px!important}` +
      `.stack,.stack>tbody,.stack>tbody>tr,.stack>tbody>tr>td{display:block!important;width:100%!important}` +
      `.stack>tbody>tr>td{padding-right:0!important}.btns td{display:inline-block!important;margin-bottom:8px}` +
      `.h1{font-size:26px!important}}` +
    `</style></head>` +
    `<body style="margin:0;padding:0;background:${C.paper}">` +
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all">${esc(preview)}&#8199;&#65279;&#847;</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.paper}" style="background:${C.paper}">` +
    `<tr><td class="outer" align="center" style="padding:28px 12px">` +
      `<table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" bgcolor="${C.white}" style="width:600px;max-width:600px;background:${C.white};border:1px solid ${C.line};border-radius:18px;overflow:hidden">` +
        body +
      `</table>` +
    `</td></tr></table></body></html>`;
}

/** The night band with the logo, an optional label on the right, and the lamp sill line. */
export function header(label) {
  return (
    `<tr><td bgcolor="${C.night}" class="px" style="background:${C.night};background-image:linear-gradient(180deg,${C.night2},${C.night});padding:24px 36px">` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>` +
        `<td valign="middle"><a href="${SITE}/" style="text-decoration:none"><img src="${LOGO}" width="190" height="49" alt="The Vitrine" style="display:block;border:0;outline:none;width:190px;height:49px"></a></td>` +
        (label ? `<td valign="middle" align="right" style="font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${C.lamp}">${esc(label)}</td>` : "") +
      `</tr></table>` +
    `</td></tr>` +
    `<tr><td bgcolor="${C.lamp}" style="height:3px;background:${C.lamp};background-image:linear-gradient(90deg,${C.night},${C.lamp} 30%,${C.blue} 80%,${C.night});font-size:0;line-height:0">&nbsp;</td></tr>`
  );
}

/** A pill button; "primary" is lit in lamp colour, "ghost" is outlined. */
export function button(href, label, kind = "primary") {
  const primary = kind === "primary";
  return `<td style="padding:0 8px 0 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr>` +
    `<td bgcolor="${primary ? C.lamp : C.white}" style="border-radius:999px;background:${primary ? C.lamp : C.white};${primary ? "" : `border:1px solid ${C.line};`}">` +
      `<a href="${esc(href)}" style="display:inline-block;padding:12px 20px;font-family:${SANS};font-size:14px;font-weight:600;line-height:1;color:${primary ? "#1a0f04" : C.night};text-decoration:none;border-radius:999px">${label}</a>` +
    `</td></tr></table></td>`;
}
export const buttons = (...cells) =>
  `<table role="presentation" class="btns" cellpadding="0" cellspacing="0"><tr>${cells.filter(Boolean).join("")}</tr></table>`;

export const eyebrow = (text, color = C.accent) =>
  `<div style="font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${color};margin:0 0 10px">${text}</div>`;

/** The site's languages: French (default), English and Italian. */
export const pickLang = (l) => (l === "en" || l === "it" ? l : "fr");
export const HOME = { fr: "/", en: "/en/", it: "/it/" };
export const QUOTE = { fr: "/devis/", en: "/en/quote/", it: "/it/preventivo/" };
const LEGAL = { fr: "/mentions-legales/", en: "/en/legal-notice/", it: "/it/note-legali/" };
const LEGAL_LABEL = { fr: "Mentions légales", en: "Legal notice", it: "Note legali" };
export const SIGN_OFF = { fr: "À très vite,", en: "Speak soon,", it: "A presto," };
/** The visitor's language, named in French for the team's emails. */
export const LANG_FR = { fr: "français", en: "anglais", it: "italien" };

/** Footer row: a short line and links back to the site. */
export function footer(lang, line) {
  const l = pickLang(lang);
  return `<tr><td class="px" bgcolor="${C.paper}" style="padding:20px 36px;background:${C.paper};border-top:1px solid ${C.line};font-family:${SANS};font-size:12px;line-height:1.7;color:${C.muted}">` +
    (line ? `${line}<br>` : "") +
    `<a href="${SITE}${HOME[l]}" style="color:${C.night};font-weight:600;text-decoration:none">thevitrine.fr</a>` +
    ` &nbsp;·&nbsp; <a href="${SITE}${LEGAL[l]}" style="color:${C.muted};text-decoration:underline">${LEGAL_LABEL[l]}</a>` +
  `</td></tr>`;
}

/** The sign-off both client emails share. */
export function signature(lang) {
  const l = pickLang(lang);
  const tagline = { fr: " · sites web sur mesure", en: " · made-to-measure websites", it: " · siti web su misura" }[l];
  return `<p style="font-family:${SANS};font-size:15px;color:${C.soft};margin:0 0 6px">${SIGN_OFF[l]}</p>` +
    `<div style="font-family:${SERIF};font-size:19px;color:${C.night}">Antony Addy &amp; Julien Bourgois</div>` +
    `<div style="font-family:${SANS};font-size:13px;color:${C.muted};margin-top:3px">The Vitrine${tagline}</div>`;
}
