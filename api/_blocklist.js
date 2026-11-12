// Senders we never want to hear from again. A match is accepted silently (200, nothing
// sent), so the sender sees "success" and has no reason to try a workaround.
// Add entries in lower case. Phones are compared as digits only, ignoring a leading 0 / 33.

const EMAILS = [
  "alexis.felten3342@probox.my.id",
];
// Whole email domains (matches the domain and any subdomain).
const EMAIL_DOMAINS = [
  "probox.my.id",
];
const PHONES = [
  "723926732", // 07 23 92 67 32 (Alexis Felten, Nov 2026)
];
// Domains that, if linked or mentioned anywhere in the message, mark it as spam.
const LINK_DOMAINS = [
  "unpartage.online",
];

const national = (s) => String(s || "").replace(/\D/g, "").replace(/^(00)?33/, "").replace(/^0+/, "");
const domainHit = (host, list) => list.some((d) => host === d || host.endsWith("." + d));

export function isBlocked({ email = "", phone = "", text = "" } = {}) {
  const mail = String(email).trim().toLowerCase();
  if (EMAILS.includes(mail)) return true;
  const at = mail.lastIndexOf("@");
  if (at > -1 && domainHit(mail.slice(at + 1), EMAIL_DOMAINS)) return true;
  const digits = national(phone);
  if (digits && PHONES.includes(digits)) return true;
  const body = String(text).toLowerCase();
  if (LINK_DOMAINS.some((d) => body.includes(d))) return true;
  return false;
}
