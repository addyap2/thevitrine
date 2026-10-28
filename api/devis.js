// Vercel function: receives the project questionnaire (/devis/, /en/quote/) and emails it.
// Ported from antonyaddy.com. No database: the answers live only in the emails it sends.
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY  required  API key from resend.com
//   DEVIS_FROM      optional  verified sender, default "The Vitrine <devis@thevitrine.fr>"
//   DEVIS_TO        optional  comma-separated recipients, default Antony and Julien

import { checkToken, countConversion, limited, clientIp, isJson, greetingName } from "./_guard.js";
import {
  C, SERIF, SANS, SITE, esc, clip, oneLine, isEmail, originOk, readJson, recipients, sender, send, submissionKey, phoneDigits,
  documentHtml, header, button, buttons, eyebrow, footer, signature, pickLang, HOME, SIGN_OFF, LANG_FR,
} from "./_email.js";

const MAX_BODY = 48 * 1024;      // bytes
const MAX_SECTIONS = 10;
const MAX_ITEMS = 40;
const MAX_FIELD = 2000;          // characters per value
const MIN_FILL_MS = 4000;        // faster than this is a bot

// Answers lifted into the "at a glance" summaries, in this order.
const TEAM_SUMMARY = ["kind", "budget", "launch", "deadline", "goal", "features", "langs", "pages"];
const CLIENT_SUMMARY = ["kind", "goal", "budget", "launch"];
const SUMMARY_LABELS = {
  kind: { fr: "Projet", en: "Project", it: "Progetto" }, budget: { fr: "Budget", en: "Budget", it: "Budget" },
  launch: { fr: "Mise en ligne souhaitée", en: "Hoped-for launch", it: "Messa online desiderata" }, deadline: { fr: "Échéance", en: "Deadline", it: "Scadenza" },
  goal: { fr: "Objectifs", en: "Goals", it: "Obiettivi" }, features: { fr: "Fonctionnalités", en: "Features", it: "Funzionalità" },
  langs: { fr: "Langues", en: "Languages", it: "Lingue" }, pages: { fr: "Pages", en: "Pages", it: "Pagine" },
};

function clean(body) {
  const sections = (Array.isArray(body.sections) ? body.sections : []).slice(0, MAX_SECTIONS).map((s) => ({
    title: oneLine(s && s.title, 120),
    items: (Array.isArray(s && s.items) ? s.items : []).slice(0, MAX_ITEMS).map((it) => {
      const value = clip(it && it.value, MAX_FIELD);
      let status = it && it.status;
      if (status !== "na" && status !== "empty") status = value ? "answered" : "empty";
      const id = typeof (it && it.id) === "string" && /^[a-zA-Z]{1,30}$/.test(it.id) ? it.id : "";
      // The same answer in the visitor's language, for their confirmation.
      const local = status === "answered" ? clip((it && it.local) || value, MAX_FIELD) : "";
      return { id, label: oneLine(it && it.label, 200), value: status === "answered" ? value : "", local, status };
    }).filter((it) => it.label),
  })).filter((s) => s.title && s.items.length);
  return {
    lang: pickLang(body.lang),
    name: oneLine(body.name, 120),
    email: oneLine(body.email, 254),
    phone: oneLine(body.phone, 60),
    company: oneLine(body.company, 160),
    consent: body.consent === true,
    sections,
  };
}

const byId = (d) => Object.fromEntries(d.sections.flatMap((s) => s.items).filter((it) => it.id && it.status === "answered").map((it) => [it.id, it]));

/** A two-column "label / value" grid that stacks on phones. */
function factGrid(facts) {
  const cells = facts.map(([label, value]) =>
    `<td valign="top" width="50%" style="padding:0 16px 14px 0">` +
      `<div style="font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${C.muted};margin-bottom:3px">${esc(label)}</div>` +
      `<div style="font-family:${SANS};font-size:15px;line-height:1.45;color:${C.ink}">${esc(value)}</div>` +
    `</td>`);
  const rows = [];
  for (let i = 0; i < cells.length; i += 2) rows.push(`<tr>${cells[i]}${cells[i + 1] || `<td width="50%"></td>`}</tr>`);
  return `<table role="presentation" class="stack" width="100%" cellpadding="0" cellspacing="0">${rows.join("")}</table>`;
}

function ownerEmail(d) {
  const who = d.company ? `${d.name} — ${d.company}` : d.name;
  const all = d.sections.flatMap((s) => s.items);
  const asked = all.filter((it) => it.status !== "na").length;
  const answered = all.filter((it) => it.status === "answered").length;
  const pct = asked ? Math.round((answered / asked) * 100) : 0;
  const a = byId(d);
  const digits = phoneDigits(d.phone);
  const replySubject = encodeURIComponent({ fr: "Votre projet de site — The Vitrine", en: "Your website project — The Vitrine", it: "Il tuo progetto di sito — The Vitrine" }[d.lang]);
  const first = greetingName(d.name) || d.name;

  const summary = TEAM_SUMMARY.filter((id) => a[id]).map((id) => [SUMMARY_LABELS[id].fr, a[id].value]);

  const sectionsHtml = d.sections.map((s) => {
    const answeredItems = s.items.filter((it) => it.status === "answered");
    const skipped = s.items.filter((it) => it.status === "empty").map((it) => it.label);
    const items = answeredItems.map((it) =>
      `<tr><td style="padding:10px 0;border-bottom:1px solid ${C.row}">` +
        `<div style="font-family:${SANS};font-size:12px;color:${C.muted};margin-bottom:3px">${esc(it.label)}</div>` +
        `<div style="font-family:${SANS};font-size:15px;line-height:1.5;color:${C.ink};white-space:pre-wrap">${esc(it.value)}</div>` +
      `</td></tr>`).join("");
    return `<tr><td class="px" style="padding:26px 36px 0 36px">` +
      `<h2 style="font-family:${SERIF};font-weight:400;font-size:19px;color:${C.night};margin:0 0 4px;padding-bottom:8px;border-bottom:1px solid ${C.line}">${esc(s.title)}</h2>` +
      (items ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>` : "") +
      (skipped.length ? `<p style="font-family:${SANS};font-size:12px;line-height:1.5;color:${C.muted};font-style:italic;margin:10px 0 0">Sans réponse : ${esc(skipped.join(" · "))}</p>` : "") +
    `</td></tr>`;
  }).join("");

  const body =
    header("Demande de devis") +
    `<tr><td class="px" style="padding:30px 36px 6px 36px">` +
      eyebrow("Nouvelle demande · questionnaire en " + LANG_FR[d.lang]) +
      `<h1 class="h1" style="font-family:${SERIF};font-weight:400;font-size:30px;line-height:1.15;color:${C.night};margin:0 0 6px">${esc(d.name)}</h1>` +
      (d.company ? `<div style="font-family:${SERIF};font-style:italic;font-size:18px;color:${C.soft};margin:0 0 14px">${esc(d.company)}</div>` : "") +
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
    (summary.length ? `<tr><td class="px" style="padding:22px 36px 0 36px">` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.line};border-radius:14px"><tr><td style="padding:18px 20px 6px 20px">` +
        eyebrow("En bref", C.night) + factGrid(summary) +
      `</td></tr></table>` +
    `</td></tr>` : "") +
    `<tr><td class="px" style="padding:18px 36px 0 36px">` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>` +
        `<td style="font-family:${SANS};font-size:13px;color:${C.soft};padding-bottom:6px"><strong style="color:${C.night}">${answered}</strong> réponses sur ${asked} questions</td>` +
      `</tr><tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:99px;overflow:hidden"><tr>` +
        `<td width="${pct}%" bgcolor="${C.lamp}" style="height:6px;background:${C.lamp};font-size:0;line-height:0">&nbsp;</td>` +
        (pct < 100 ? `<td bgcolor="${C.row}" style="height:6px;background:${C.row};font-size:0;line-height:0">&nbsp;</td>` : "") +
      `</tr></table></td></tr></table>` +
    `</td></tr>` +
    sectionsHtml +
    `<tr><td class="px" style="padding:28px 36px 30px 36px">` +
      `<p style="font-family:${SANS};font-size:13px;line-height:1.6;color:${C.soft};margin:0">Envoyé à Antony et Julien. « Répondre » écrit directement à ${esc(first)} : pensez à mettre l'autre en copie.</p>` +
    `</td></tr>` +
    footer("fr", "Questionnaire projet reçu sur thevitrine.fr");

  const textValue = (it) => it.status === "empty" ? "— sans réponse" : it.status === "na" ? "(non applicable)" : it.value;
  const text = [`Nouvelle demande de devis (The Vitrine) — ${who}`, `${d.email}${d.phone ? " · " + d.phone : ""}`, `${answered} réponses sur ${asked} questions`, ""]
    .concat(...d.sections.map((s) => ["", s.title.toUpperCase()].concat(s.items.filter((it) => it.status !== "na").map((it) => `- ${it.label} : ${textValue(it)}`))))
    .join("\n");
  return {
    subject: `Demande de devis — ${who}`.slice(0, 180),
    html: documentHtml({ lang: "fr", title: `Demande de devis — ${who}`, preview: `${who}${a.budget ? " · " + a.budget.value : ""}${a.kind ? " · " + a.kind.value : ""}`, body }),
    text,
  };
}

function clientEmail(d) {
  const first = esc(greetingName(d.name));
  const a = byId(d);
  const recap = CLIENT_SUMMARY.filter((id) => a[id]).map((id) => [SUMMARY_LABELS[id][d.lang], a[id].local || a[id].value]);
  const T = {
    fr: {
    subject: "Nous avons bien reçu votre projet — The Vitrine",
    preview: "Merci ! Nous revenons vers vous très vite pour en parler.",
    label: "Demande reçue",
    h1: first ? `Merci, ${first}.` : "Merci.",
    intro: "Nous avons bien reçu votre questionnaire et nous l'étudions avec attention. Nous revenons vers vous très vite, d'abord pour en parler, puis avec un devis clair.",
    stepsTitle: "Et maintenant ?",
    steps: ["Nous étudions votre projet en détail.", "Nous échangeons avec vous pour préciser vos besoins.", "Vous recevez un devis clair, sans surprise."],
    recapTitle: "Votre demande en bref",
    note: "Une précision à ajouter ? Répondez simplement à cet e-mail : il arrive à Antony et Julien.",
    work: "Voir nos réalisations", blog: "Lire nos conseils",
    foot: "Vous recevez cet e-mail parce que vous avez rempli le questionnaire projet sur thevitrine.fr.",
    second: ["/blog/", "Lire nos conseils"],
    },
    en: {
    subject: "We've received your project — The Vitrine",
    preview: "Thank you! We'll be in touch very soon to talk it through.",
    label: "Request received",
    h1: first ? `Thank you, ${first}.` : "Thank you.",
    intro: "We've received your questionnaire and we're looking it over carefully. We'll be in touch very soon, first to talk it through, then with a clear quote.",
    stepsTitle: "What happens next",
    steps: ["We study your project in detail.", "We talk with you to pin down your needs.", "You get a clear quote, with no surprises."],
    recapTitle: "Your request at a glance",
    note: "Want to add anything? Just reply to this email: it reaches both Antony and Julien.",
    work: "See our work", blog: "Read our articles",
    foot: "You're receiving this email because you filled in the project questionnaire on thevitrine.fr.",
    second: ["/en/blog/", "Read our articles"],
    },
    it: {
      subject: "Abbiamo ricevuto il tuo progetto — The Vitrine",
      preview: "Grazie! Ti ricontattiamo al più presto per parlarne.",
      label: "Richiesta ricevuta",
      h1: first ? `Grazie, ${first}.` : "Grazie.",
      intro: "Abbiamo ricevuto il tuo questionario e lo stiamo esaminando con attenzione. Ti ricontattiamo al più presto, prima per parlarne, poi con un preventivo chiaro.",
      stepsTitle: "E adesso?",
      steps: ["Esaminiamo il tuo progetto nel dettaglio.", "Ci confrontiamo con te per definire le tue esigenze.", "Ricevi un preventivo chiaro, senza sorprese."],
      recapTitle: "La tua richiesta in breve",
      note: "Vuoi aggiungere qualcosa? Rispondi semplicemente a questa e-mail: arriva ad Antony e Julien.",
      work: "Guarda i nostri progetti", blog: "Domande frequenti",
      foot: "Ricevi questa e-mail perché hai compilato il questionario di progetto su thevitrine.fr.",
      second: ["/it/#faq", "Domande frequenti"],
    },
  }[d.lang];

  const stepRows = T.steps.map((s, i) =>
    `<tr><td width="40" valign="top" style="padding:0 0 12px 0">` +
      `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td align="center" valign="middle" width="28" height="28" bgcolor="${C.lamp}" style="width:28px;height:28px;background:${C.lamp};border-radius:14px;color:#1a0f04;font-family:${SANS};font-size:13px;font-weight:700;line-height:28px">${i + 1}</td></tr></table>` +
    `</td><td valign="middle" style="padding:0 0 12px 10px;font-family:${SANS};font-size:15px;line-height:1.45;color:${C.ink}">${s}</td></tr>`).join("");

  const body =
    header(T.label) +
    `<tr><td class="px" style="padding:34px 36px 4px 36px">` +
      `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td align="center" valign="middle" width="48" height="48" bgcolor="${C.lamp}" style="width:48px;height:48px;background:${C.lamp};background-image:linear-gradient(180deg,${C.lampHot},${C.lamp});border-radius:24px;font-family:${SANS};font-size:24px;font-weight:700;line-height:48px;color:#1a0f04">&#10003;</td></tr></table>` +
      `<h1 class="h1" style="font-family:${SERIF};font-style:italic;font-weight:400;font-size:30px;line-height:1.15;color:${C.night};margin:18px 0 14px">${T.h1}</h1>` +
      `<p style="font-family:${SANS};font-size:16px;line-height:1.65;color:${C.soft};margin:0 0 26px">${T.intro}</p>` +
    `</td></tr>` +
    `<tr><td class="px" style="padding:0 36px">` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.line};border-radius:14px"><tr><td style="padding:20px 20px 8px 20px">` +
        eyebrow(T.stepsTitle, C.night) +
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stepRows}</table>` +
      `</td></tr></table>` +
    `</td></tr>` +
    (recap.length ? `<tr><td class="px" style="padding:24px 36px 0 36px">` + eyebrow(T.recapTitle, C.accent) + factGrid(recap) + `</td></tr>` : "") +
    `<tr><td class="px" style="padding:12px 36px 0 36px">` +
      `<p style="font-family:${SANS};font-size:14px;line-height:1.6;color:${C.soft};margin:0 0 22px">${T.note}</p>` +
      buttons(button(`${SITE}${HOME[d.lang]}#work`, T.work), button(`${SITE}${T.second[0]}`, T.second[1], "ghost")) +
    `</td></tr>` +
    `<tr><td class="px" style="padding:30px 36px 32px 36px">${signature(d.lang)}</td></tr>` +
    footer(d.lang, T.foot);

  const text = [
    T.h1.replace(/&#39;/g, "'"), "", T.intro, "", T.stepsTitle, ...T.steps.map((s, i) => `${i + 1}. ${s}`),
    ...(recap.length ? ["", T.recapTitle, ...recap.map(([l, v]) => `- ${l} : ${v}`)] : []),
    "", T.note, "", SIGN_OFF[d.lang], "Antony Addy & Julien Bourgois", "The Vitrine", "", SITE + HOME[d.lang],
  ].join("\n");

  return { subject: T.subject, html: documentHtml({ lang: d.lang, title: T.subject, preview: T.preview, body }), text };
}

// Exported for previews; Vercel only uses the default export.
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
  if (!d.name || !isEmail(d.email) || !d.consent) return res.status(422).json({ ok: false, error: "invalid" });

  // Per sender IP, and per address the confirmation goes to (stops mail-bombing one inbox).
  const ip = clientIp(req);
  try {
    if (await limited("devis-ip", ip, 3, 10 * 60 * 1000) || await limited("devis-ip-day", ip, 10, 24 * 60 * 60 * 1000) ||
        await limited("devis-to", d.email.toLowerCase(), 3, 60 * 60 * 1000)) {
      return res.status(429).json({ ok: false, error: "rate" });
    }
  } catch { return res.status(503).json({ ok: false, error: "unavailable" }); }

  const key = process.env.RESEND_API_KEY;
  if (!key) { console.error("devis: RESEND_API_KEY is not set"); return res.status(500).json({ ok: false }); }
  const from = sender(), to = recipients();
  const requestKey = submissionKey("devis", body.submissionId, d);
  let confirmationSent = true;

  try {
    const mine = ownerEmail(d);
    await send(key, { from, to, reply_to: d.email, subject: mine.subject, html: mine.html, text: mine.text }, `${requestKey}-team`);
  } catch (e) {
    console.error("devis: team email failed", e.message);
    return res.status(502).json({ ok: false });
  }
  try {
    const theirs = clientEmail(d);
    await send(key, { from, to: [d.email], reply_to: to, subject: theirs.subject, html: theirs.html, text: theirs.text }, `${requestKey}-confirmation`);
  } catch (e) {
    // The request reached Antony and Julien; a failed confirmation shouldn't show the client an error.
    confirmationSent = false;
    console.error(JSON.stringify({ event: "confirmation_failed", form: "devis", requestKey, reason: e.name }));
  }
  await countConversion("devis", d.lang, requestKey);
  console.info(JSON.stringify({ event: "form_received", form: "devis", confirmationSent, requestKey }));
  return res.status(200).json({ ok: true, confirmationSent });
}
