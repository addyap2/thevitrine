// Vercel function: receives the contact form (/contact/, /en/contact/) and emails it.
// Same system as api/devis.js: no database, the message lives only in the two emails.
// Environment variables: RESEND_API_KEY (required), DEVIS_FROM and DEVIS_TO (optional).

import { checkToken, countConversion, limited, clientIp, isJson, greetingName, countLinks } from "./_guard.js";
import {
  C, SERIF, SANS, SITE, esc, clip, oneLine, isEmail, originOk, readJson, recipients, sender, send, submissionKey, phoneDigits,
  documentHtml, header, button, buttons, eyebrow, footer, signature,
} from "./_email.js";

const MAX_BODY = 16 * 1024;      // bytes
const MAX_MESSAGE = 5000;        // characters
const MIN_FILL_MS = 3000;        // faster than this is a bot
const MAX_LINKS = 5;             // more links than this in a message is spam

function clean(body) {
  return {
    lang: body.lang === "en" ? "en" : "fr",
    name: oneLine(body.name, 120),
    email: oneLine(body.email, 254),
    phone: oneLine(body.phone, 60),
    message: clip(body.message, MAX_MESSAGE).replace(/\r\n?/g, "\n"),
    consent: body.consent === true,
  };
}

const quote = (text) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.line};border-left:3px solid ${C.lamp};border-radius:12px"><tr>` +
    `<td style="padding:18px 20px;font-family:${SANS};font-size:15px;line-height:1.65;color:${C.ink};white-space:pre-wrap">${esc(text)}</td>` +
  `</tr></table>`;

function ownerEmail(d) {
  const digits = phoneDigits(d.phone);
  const first = greetingName(d.name) || d.name;
  const replySubject = encodeURIComponent(d.lang === "en" ? "Your message — The Vitrine" : "Votre message — The Vitrine");
  const body =
    header("Nouveau message") +
    `<tr><td class="px" style="padding:30px 36px 6px 36px">` +
      eyebrow("Formulaire de contact · en " + (d.lang === "en" ? "anglais" : "français")) +
      `<h1 class="h1" style="font-family:${SERIF};font-weight:400;font-size:30px;line-height:1.15;color:${C.night};margin:0 0 10px">${esc(d.name)}</h1>` +
      `<p style="font-family:${SANS};font-size:14px;line-height:1.6;color:${C.soft};margin:0 0 18px">` +
        `<a href="mailto:${esc(d.email)}" style="color:${C.night};font-weight:600;text-decoration:none">${esc(d.email)}</a>` +
        (d.phone ? ` &nbsp;·&nbsp; ${digits ? `<a href="tel:+${digits}" style="color:${C.night};text-decoration:none">${esc(d.phone)}</a>` : esc(d.phone)}` : "") +
      `</p>` +
      buttons(
        button(`mailto:${d.email}?subject=${replySubject}`, `Répondre à ${esc(first)}`),
        digits && button(`tel:+${digits}`, "Appeler", "ghost"),
        digits && button(`https://wa.me/${digits}`, "WhatsApp", "ghost"),
      ) +
    `</td></tr>` +
    `<tr><td class="px" style="padding:24px 36px 0 36px">` + eyebrow("Message", C.night) + quote(d.message) + `</td></tr>` +
    `<tr><td class="px" style="padding:24px 36px 30px 36px">` +
      `<p style="font-family:${SANS};font-size:13px;line-height:1.6;color:${C.soft};margin:0">Envoyé à Antony et Julien. « Répondre » écrit directement à ${esc(first)} : pensez à mettre l'autre en copie.</p>` +
    `</td></tr>` +
    footer("fr", "Message reçu depuis le formulaire de contact de thevitrine.fr");
  const text = [`Nouveau message (The Vitrine) — ${d.name}`, `${d.email}${d.phone ? " · " + d.phone : ""}`, "", d.message].join("\n");
  const preview = d.message.replace(/\s+/g, " ").slice(0, 110);
  return {
    subject: `Nouveau message de ${d.name}`.slice(0, 180),
    html: documentHtml({ lang: "fr", title: `Nouveau message de ${d.name}`, preview, body }),
    text,
  };
}

function clientEmail(d) {
  const fr = d.lang !== "en";
  const first = esc(greetingName(d.name));
  const T = fr ? {
    subject: "Nous avons bien reçu votre message — The Vitrine",
    preview: "Merci ! Nous vous répondons très vite.",
    label: "Message reçu",
    h1: first ? `Merci, ${first}.` : "Merci.",
    intro: "Nous avons bien reçu votre message. Nous vous répondons très vite.",
    copy: "Votre message",
    project: "Un projet de site ? Notre questionnaire nous aide à vous préparer un devis clair.",
    quote: "Décrire votre projet", work: "Voir nos réalisations",
    foot: "Vous recevez cet e-mail parce que vous nous avez écrit depuis thevitrine.fr.",
  } : {
    subject: "We've received your message — The Vitrine",
    preview: "Thank you! We'll reply very soon.",
    label: "Message received",
    h1: first ? `Thank you, ${first}.` : "Thank you.",
    intro: "We've received your message. We'll reply very soon.",
    copy: "Your message",
    project: "Planning a website? Our questionnaire helps us prepare a clear quote for you.",
    quote: "Describe your project", work: "See our work",
    foot: "You're receiving this email because you wrote to us from thevitrine.fr.",
  };
  const body =
    header(T.label) +
    `<tr><td class="px" style="padding:34px 36px 4px 36px">` +
      `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td align="center" valign="middle" width="48" height="48" bgcolor="${C.lamp}" style="width:48px;height:48px;background:${C.lamp};background-image:linear-gradient(180deg,${C.lampHot},${C.lamp});border-radius:24px;font-family:${SANS};font-size:24px;font-weight:700;line-height:48px;color:#1a0f04">&#10003;</td></tr></table>` +
      `<h1 class="h1" style="font-family:${SERIF};font-style:italic;font-weight:400;font-size:30px;line-height:1.15;color:${C.night};margin:18px 0 14px">${T.h1}</h1>` +
      `<p style="font-family:${SANS};font-size:16px;line-height:1.65;color:${C.soft};margin:0 0 24px">${T.intro}</p>` +
    `</td></tr>` +
    `<tr><td class="px" style="padding:0 36px">` + eyebrow(T.copy, C.night) + quote(d.message) + `</td></tr>` +
    `<tr><td class="px" style="padding:24px 36px 0 36px">` +
      `<p style="font-family:${SANS};font-size:14px;line-height:1.6;color:${C.soft};margin:0 0 18px">${T.project}</p>` +
      buttons(button(`${SITE}${fr ? "/devis/" : "/en/quote/"}`, T.quote), button(`${SITE}${fr ? "/" : "/en/"}#work`, T.work, "ghost")) +
    `</td></tr>` +
    `<tr><td class="px" style="padding:30px 36px 32px 36px">${signature(d.lang)}</td></tr>` +
    footer(d.lang, T.foot);
  const text = [T.h1.replace(/&#39;/g, "'"), "", T.intro, "", `${T.copy} :`, d.message, "", fr ? "À très vite," : "Speak soon,", "Antony Addy & Julien Bourgois", "The Vitrine", SITE].join("\n");
  return { subject: T.subject, html: documentHtml({ lang: d.lang, title: T.subject, preview: T.preview, body }), text };
}

export { ownerEmail, clientEmail, clean };

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false }); }
  if (!originOk(req)) return res.status(403).json({ ok: false });
  if (!isJson(req)) return res.status(415).json({ ok: false });

  let body;
  try { body = await readJson(req, MAX_BODY); } catch (e) { return res.status(400).json({ ok: false }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return res.status(400).json({ ok: false });

  // Bots: honeypot filled or impossibly fast. Pretend it worked.
  if (body.website) return res.status(200).json({ ok: true });
  let token;
  try { token = await checkToken(body.token, MIN_FILL_MS); }
  catch { return res.status(503).json({ ok: false, error: "unavailable" }); }
  if (token === "invalid") return res.status(403).json({ ok: false, error: "token" });
  if (token === "young") return res.status(200).json({ ok: true });

  const d = clean(body);
  if (!d.name || !isEmail(d.email) || !d.message || !d.consent) return res.status(422).json({ ok: false, error: "invalid" });
  // Link-stuffed messages are spam: accept silently, send nothing.
  if (countLinks(d.message) > MAX_LINKS) return res.status(200).json({ ok: true });

  const ip = clientIp(req);
  try {
    if (await limited("contact-ip", ip, 5, 10 * 60 * 1000) || await limited("contact-ip-day", ip, 20, 24 * 60 * 60 * 1000) ||
        await limited("contact-to", d.email.toLowerCase(), 3, 60 * 60 * 1000)) {
      return res.status(429).json({ ok: false, error: "rate" });
    }
  } catch { return res.status(503).json({ ok: false, error: "unavailable" }); }

  const key = process.env.RESEND_API_KEY;
  if (!key) { console.error("contact: RESEND_API_KEY is not set"); return res.status(500).json({ ok: false }); }
  const from = sender(), to = recipients();
  const requestKey = submissionKey("contact", body.submissionId, d);
  let confirmationSent = true;

  try {
    const mine = ownerEmail(d);
    await send(key, { from, to, reply_to: d.email, subject: mine.subject, html: mine.html, text: mine.text }, `${requestKey}-team`);
  } catch (e) {
    console.error("contact: team email failed", e.message);
    return res.status(502).json({ ok: false });
  }
  try {
    const theirs = clientEmail(d);
    await send(key, { from, to: [d.email], reply_to: to, subject: theirs.subject, html: theirs.html, text: theirs.text }, `${requestKey}-confirmation`);
  } catch (e) {
    confirmationSent = false;
    console.error(JSON.stringify({ event: "confirmation_failed", form: "contact", requestKey, reason: e.name }));
  }
  await countConversion("contact", d.lang, requestKey);
  console.info(JSON.stringify({ event: "form_received", form: "contact", confirmationSent, requestKey }));
  return res.status(200).json({ ok: true, confirmationSent });
}
