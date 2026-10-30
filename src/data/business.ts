// Business facts used in the "What we do" section and in structured data.
// Empty slots are placeholders: the matching line is left off the page (and
// out of the structured data), and the build log lists what's still missing.

/** Starting price for a site vitrine, in euros (e.g. 900). Left empty on
 *  purpose: price is quoted per project (decided 23 October 2026). */
export const priceFrom: number | null = null;

/** Typical time from first call to launch (e.g. "2 à 3 semaines"). Left empty on
 *  purpose: the timescale is set per project, in the quote. */
export const timescale: { fr: string; en: string; it: string } | null = null;

/** WhatsApp numbers, encoded (see src/protect.ts): decoded only when a visitor taps the button. */
export const whatsapp = {
  antony: "NjI4OTI4OTQ2MzM=",
  julien: "NTg1Nzg4NDc2MzM=",
};

/** The Vitrine on Instagram. */
export const instagram = { handle: "@thevitrine.fr", url: "https://www.instagram.com/thevitrine.fr/" };

/** The Vitrine on Facebook. */
export const facebook = { url: "https://www.facebook.com/thevitrine.fr/" };

/** The Vitrine's own public profiles: Instagram, Facebook, and later Google
 *  Business Profile, LinkedIn, Malt… Used as `sameAs` in structured data. */
export const profiles: string[] = [instagram.url, facebook.url];

export function missingBusinessFields(): string[] {
  const missing: string[] = [];
  if (profiles.length === 0) missing.push("profiles");
  return missing;
}
