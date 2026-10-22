// Vercel function: receives the project questionnaire (/devis/, /en/quote/) and emails it.
// Ported from antonyaddy.com. No database: the answers live only in the emails it sends.
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY  required  API key from resend.com
//   DEVIS_FROM      optional  verified sender, default "The Vitrine <devis@antonyaddy.com>"
//   DEVIS_TO        optional  comma-separated recipients, default Antony and Julien

import { checkToken, limited, clientIp, isJson, greetingName } from "./_guard.js";

const MAX_BODY = 40 * 1024;      // bytes
const MAX_SECTIONS = 10;
const MAX_ITEMS = 40;
const MAX_FIELD = 2000;          // characters per value
const MIN_FILL_MS = 4000;        // faster than this is a bot

const DEFAULT_TO = "antony@antonyaddy.com,bourgois.ju@gmail.com";
const ALLOWED_HOSTS = [/^thevitrine\.fr$/, /^www\.thevitrine\.fr$/, /\.vercel\.app$/, /^localhost(:\d+)?$/, /^127\.0\.0\.1(:\d+)?$/];

// The Vitrine's colours, as plain values for email clients.
const NIGHT = "#081227", NIGHT2 = "#10234d", LAMP = "#ffc27d", LAMP_HOT = "#ffe2b8", BLUE = "#79adff";
const INK = "#1d1b18", SOFT = "#5d574f", MUTED = "#8a8379", ACCENT = "#a8431f", PAPER = "#f6f3ee", LINE = "#e4ded4", ROW = "#efe9df", RED = "#b3261e";
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "Arial,Helvetica,sans-serif";

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function clip(s, n) { return String(s == null ? "" : s).slice(0, n || MAX_FIELD).trim(); }
function oneLine(s, n) { return clip(s, n).replace(/[\r\n]+/g, " "); }
function isEmail(s) { return /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/.test(s) && s.length <= 254; }

function originOk(req) {
  const o = req.headers.origin || req.headers.referer || "";
  if (!o) return true; // some privacy tools strip both; the other checks still apply
  try { const h = new URL(o).host; return ALLOWED_HOSTS.some((re) => re.test(h)); }
  catch (e) { return false; }
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > MAX_BODY) throw new Error("too large"); chunks.push(c); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function clean(body) {
  const sections = (Array.isArray(body.sections) ? body.sections : []).slice(0, MAX_SECTIONS).map((s) => ({
    title: oneLine(s && s.title, 120),
    items: (Array.isArray(s && s.items) ? s.items : []).slice(0, MAX_ITEMS).map((it) => {
      const value = clip(it && it.value);
      let status = it && it.status;
      if (status !== "na" && status !== "empty") status = value ? "answered" : "empty";
      return { label: oneLine(it && it.label, 200), value: status === "answered" ? value : "", status };
    }).filter((it) => it.label)
  })).filter((s) => s.title && s.items.length);
  return {
    lang: body.lang === "en" ? "en" : "fr",
    name: oneLine(body.name, 120),
    email: oneLine(body.email, 254),
    phone: oneLine(body.phone, 60),
    company: oneLine(body.company, 160),
    consent: body.consent === true,
    sections
  };
}

// The header band: the wordmark on night blue, with the lamp-to-blue sill line under it.
function header(tagline) {
  return (
    `<tr><td bgcolor="${NIGHT}" style="background:${NIGHT};background-image:linear-gradient(180deg,${NIGHT2},${NIGHT});padding:26px 36px 24px 36px">` +
      `<div style="font-family:${SERIF};font-size:13px;color:${BLUE};letter-spacing:.02em">The</div>` +
      `<div style="font-family:${SERIF};font-size:28px;line-height:1;color:#f6f2ea">Vitrine</div>` +
      (tagline ? `<div style="font-family:${SANS};font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#b4c0dc;margin-top:12px">${tagline}</div>` : "") +
    `</td></tr>` +
    `<tr><td bgcolor="${LAMP}" style="height:3px;background:${LAMP};background-image:linear-gradient(90deg,${LAMP_HOT},${LAMP} 45%,${BLUE});font-size:0;line-height:0">&nbsp;</td></tr>`
  );
}

function ownerEmail(d) {
  const who = d.company ? `${d.name} — ${d.company}` : d.name;
  const all = d.sections.flatMap((s) => s.items);
  const asked = all.filter((it) => it.status !== "na").length;
  const answered = all.filter((it) => it.status === "answered").length;
  const B = `border-bottom:1px solid ${ROW};`;

  const cell = (it) => {
    const base = `padding:9px 0;vertical-align:top;font-family:${SANS};${B}`;
    if (it.status === "empty") return `<td style="${base}font-size:14px;font-style:italic;color:${RED}">— Non renseigné</td>`;
    if (it.status === "na") return `<td style="${base}font-size:14px;font-style:italic;color:${MUTED}">Non applicable</td>`;
    return `<td style="${base}font-size:15px;color:${INK};white-space:pre-wrap">${esc(it.value)}</td>`;
  };
  const rows = (items) => items.map((it) =>
    `<tr><td style="padding:9px 14px 9px 0;vertical-align:top;${B}font-family:${SANS};color:${it.status === "answered" ? SOFT : MUTED};font-size:14px;width:42%">${esc(it.label)}</td>` +
    cell(it) + `</tr>`).join("");
  const textValue = (it) => it.status === "empty" ? "— NON RENSEIGNÉ" : it.status === "na" ? "(non applicable)" : it.value;

  const sectionsHtml = d.sections.map((s) =>
    `<tr><td style="padding:24px 36px 0 36px">` +
      `<h2 style="font-family:${SERIF};font-weight:400;font-size:18px;color:${NIGHT};border-bottom:1px solid ${LINE};padding-bottom:8px;margin:0 0 2px">${esc(s.title)}</h2>` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rows(s.items)}</table>` +
    `</td></tr>`).join("");

  const count = `${answered} réponse${answered > 1 ? "s" : ""} sur ${asked} question${asked > 1 ? "s" : ""}`;

  const html =
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:0;background:${PAPER}">` +
    `<tr><td align="center" style="padding:28px 16px">` +
      `<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border:1px solid ${LINE};border-radius:18px;overflow:hidden">` +
        header("") +
        `<tr><td style="padding:22px 36px 0 36px">` +
          `<div style="font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:${ACCENT};margin-bottom:10px">Nouvelle demande de devis</div>` +
          `<h1 style="font-family:${SERIF};font-style:italic;font-weight:400;font-size:25px;line-height:1.2;color:${NIGHT};margin:0 0 10px">${esc(who)}</h1>` +
          `<p style="font-family:${SANS};font-size:14px;line-height:1.5;color:${SOFT};margin:0 0 16px">` +
            `<a href="mailto:${esc(d.email)}" style="color:${NIGHT};text-decoration:none;font-weight:600">${esc(d.email)}</a>` +
            (d.phone ? ` &nbsp;·&nbsp; ${esc(d.phone)}` : "") +
            ` &nbsp;·&nbsp; questionnaire rempli en ${d.lang === "en" ? "anglais" : "français"}` +
          `</p>` +
          `<span style="display:inline-block;font-family:${SANS};padding:6px 14px;border-radius:999px;background:#fff1e0;color:${NIGHT};font-size:13px;font-weight:700">${count}</span>` +
        `</td></tr>` +
        sectionsHtml +
        `<tr><td style="padding:24px 36px 0 36px">` +
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:${PAPER};border:1px solid ${LINE};border-radius:10px;padding:14px 16px;font-family:${SANS};font-size:14px;line-height:1.5;color:${SOFT}">Envoyé à Antony et Julien. Répondez directement à cet e-mail pour écrire à <strong style="color:${NIGHT}">${esc(d.name)}</strong>, en mettant l'autre en copie.</td></tr></table>` +
        `</td></tr>` +
        `<tr><td style="padding:22px 36px 30px 36px">` +
          `<div style="font-family:${SERIF};font-size:16px;color:${NIGHT}">The Vitrine</div>` +
          `<div style="font-family:${SANS};font-size:12px;letter-spacing:.04em;color:${MUTED};margin-top:2px">thevitrine.fr</div>` +
        `</td></tr>` +
      `</table>` +
    `</td></tr>` +
    `</table>`;

  const text = [`Nouvelle demande de devis (The Vitrine) — ${who}`, `${d.email}${d.phone ? " · " + d.phone : ""}`, count, ""]
    .concat(...d.sections.map((s) => ["", s.title.toUpperCase()].concat(s.items.map((it) => `- ${it.label} : ${textValue(it)}`))))
    .join("\n");
  return { subject: `Demande de devis The Vitrine — ${who}`.slice(0, 180), html, text };
}

function clientEmail(d) {
  const fr = d.lang !== "en";
  // Plain greeting when the name looks like a link (the address isn't verified).
  const first = esc(greetingName(d.name));
  const subject = fr ? "Nous avons bien reçu votre projet — The Vitrine" : "We've received your project — The Vitrine";

  const T = fr ? {
    pre: "Nous avons bien reçu votre projet : nous revenons vers vous très vite.",
    eyebrow: "Demande bien reçue",
    h1: first ? `Merci, ${first}.` : "Merci.",
    intro: "Nous avons bien reçu votre questionnaire et nous l'étudions avec attention. Antony ou Julien revient vers vous très rapidement, d'abord pour en parler, puis avec un devis clair.",
    stepsTitle: "Et maintenant ?",
    steps: ["Nous étudions votre projet en détail.", "Nous échangeons pour préciser vos besoins.", "Vous recevez un devis clair."],
    note: "Une précision à ajouter ? Répondez simplement à cet e-mail.",
    signoff: "À très vite,",
    tagline: "Sites web sur mesure"
  } : {
    pre: "We've received your project: we'll be back in touch very soon.",
    eyebrow: "Request received",
    h1: first ? `Thank you, ${first}.` : "Thank you.",
    intro: "We've received your questionnaire and we're looking it over carefully. Antony or Julien will be back in touch very soon, first to talk it through, then with a clear quote.",
    stepsTitle: "What happens next",
    steps: ["We study your project in detail.", "We talk to pin down your needs.", "You get a clear quote."],
    note: "Want to add anything? Just reply to this email.",
    signoff: "Speak soon,",
    tagline: "Made-to-measure websites"
  };

  const stepRows = T.steps.map((s, i) =>
    `<tr>` +
      `<td width="38" valign="top" style="padding:0 0 12px 0">` +
        `<table role="presentation" cellpadding="0" cellspacing="0"><tr>` +
          `<td align="center" valign="middle" width="28" height="28" style="width:28px;height:28px;background:${LAMP};border-radius:14px;color:#1a0f04;font-family:${SANS};font-size:13px;font-weight:700;line-height:28px">${i + 1}</td>` +
        `</tr></table>` +
      `</td>` +
      `<td valign="middle" style="padding:0 0 12px 12px;font-family:${SANS};font-size:15px;line-height:1.45;color:${INK}">${s}</td>` +
    `</tr>`).join("");

  const html =
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${T.pre}</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:0;background:${PAPER}">` +
    `<tr><td align="center" style="padding:28px 16px">` +
      `<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:560px;background:#ffffff;border:1px solid ${LINE};border-radius:18px;overflow:hidden">` +
        header(T.tagline) +
        `<tr><td style="padding:26px 36px 4px 36px">` +
          `<div style="font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:${ACCENT};margin-bottom:10px">${T.eyebrow}</div>` +
          `<h1 style="font-family:${SERIF};font-style:italic;font-weight:400;font-size:27px;line-height:1.2;color:${NIGHT};margin:0 0 16px">${T.h1}</h1>` +
          `<p style="font-family:${SANS};font-size:16px;line-height:1.6;color:${SOFT};margin:0 0 26px">${T.intro}</p>` +
        `</td></tr>` +
        `<tr><td style="padding:0 36px 4px 36px">` +
          `<div style="font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${NIGHT};margin-bottom:14px">${T.stepsTitle}</div>` +
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stepRows}</table>` +
        `</td></tr>` +
        `<tr><td style="padding:14px 36px 0 36px">` +
          `<p style="font-family:${SANS};font-size:14px;line-height:1.55;color:${MUTED};margin:0 0 26px">${T.note}</p>` +
        `</td></tr>` +
        `<tr><td style="padding:0 36px 32px 36px">` +
          `<p style="font-family:${SANS};font-size:15px;color:${SOFT};margin:0 0 4px">${T.signoff}</p>` +
          `<div style="font-family:${SERIF};font-size:18px;color:${NIGHT}">Antony Addy &amp; Julien Bourgois</div>` +
          `<div style="font-family:${SANS};font-size:13px;color:${MUTED};margin-top:3px">The Vitrine</div>` +
        `</td></tr>` +
        `<tr><td style="padding:20px 36px;background:${PAPER};border-top:1px solid ${LINE};font-family:${SANS};font-size:13px;color:${SOFT};line-height:1.7">` +
          `<a href="https://thevitrine.fr${fr ? "/" : "/en/"}" style="color:${NIGHT};text-decoration:none;font-weight:600">thevitrine.fr</a>` +
        `</td></tr>` +
      `</table>` +
    `</td></tr>` +
    `</table>`;

  const text = [
    T.h1, "", T.intro, "", T.stepsTitle,
    ...T.steps.map((s, i) => `${i + 1}. ${s}`),
    "", T.note, "", T.signoff, "Antony Addy & Julien Bourgois", "The Vitrine",
    "", "thevitrine.fr"
  ].join("\n").replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');

  return { subject, html, text };
}

async function send(key, msg) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(msg)
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json();
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false }); }
  if (!originOk(req)) return res.status(403).json({ ok: false });
  if (!isJson(req)) return res.status(415).json({ ok: false });

  let body;
  try { body = await readJson(req); } catch (e) { return res.status(400).json({ ok: false }); }
  if (!body || typeof body !== "object") return res.status(400).json({ ok: false });

  // Bots: honeypot filled or impossibly fast. Pretend it worked.
  if (body.website) return res.status(200).json({ ok: true });
  const token = checkToken(body.token, MIN_FILL_MS);
  if (token === "invalid") return res.status(403).json({ ok: false, error: "token" });
  if (token === "young") return res.status(200).json({ ok: true });

  const d = clean(body);
  if (!d.name || !isEmail(d.email) || !d.consent) return res.status(422).json({ ok: false, error: "invalid" });

  // Per sender IP, and per address the confirmation goes to (stops mail-bombing one inbox).
  const ip = clientIp(req);
  if (limited("devis-ip", ip, 3, 10 * 60 * 1000) || limited("devis-ip-day", ip, 10, 24 * 60 * 60 * 1000) ||
      limited("devis-to", d.email.toLowerCase(), 3, 60 * 60 * 1000)) {
    return res.status(429).json({ ok: false, error: "rate" });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) { console.error("devis: RESEND_API_KEY is not set"); return res.status(500).json({ ok: false }); }
  const from = process.env.DEVIS_FROM || "The Vitrine <devis@antonyaddy.com>";
  const to = (process.env.DEVIS_TO || DEFAULT_TO).split(",").map((s) => s.trim()).filter(Boolean);

  try {
    const mine = ownerEmail(d);
    await send(key, { from, to, reply_to: d.email, subject: mine.subject, html: mine.html, text: mine.text });
  } catch (e) {
    console.error("devis: owner email failed", e.message);
    return res.status(502).json({ ok: false });
  }
  try {
    const theirs = clientEmail(d);
    await send(key, { from, to: [d.email], reply_to: to, subject: theirs.subject, html: theirs.html, text: theirs.text });
  } catch (e) {
    // The request reached Antony and Julien; a failed confirmation shouldn't show the client an error.
    console.error("devis: confirmation email failed", e.message);
  }
  return res.status(200).json({ ok: true });
}
