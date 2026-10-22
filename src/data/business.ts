// Business facts used in the "What we do" section and in structured data.
// Empty slots are placeholders: the matching line is left off the page (and
// out of the structured data), and the build log lists what's still missing.

/** Starting price for a site vitrine, in euros (e.g. 900). */
export const priceFrom: number | null = null;

/** Typical time from first call to launch, in each language (e.g. "2 à 3 semaines"). */
export const timescale: { fr: string; en: string } | null = null;

/** WhatsApp numbers, encoded (see src/protect.ts): decoded only when a visitor taps the button. */
export const whatsapp = {
  antony: "NjI4OTI4OTQ2MzM=",
  julien: "NTg1Nzg4NDc2MzM=",
};

/** The Vitrine's own public profiles once they exist: Google Business Profile,
 *  Malt, LinkedIn page, Sortlist… Used as `sameAs` in structured data. */
export const profiles: string[] = [];

export function missingBusinessFields(): string[] {
  const missing: string[] = [];
  if (priceFrom === null) missing.push("priceFrom");
  if (timescale === null) missing.push("timescale");
  if (profiles.length === 0) missing.push("profiles");
  return missing;
}
