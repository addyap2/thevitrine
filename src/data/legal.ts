// Publisher details for the mentions légales (French law: LCEN, art. 6 III).
// Every field marked "required" must be filled in. Until then the page shows a
// placeholder for it and the build log lists what is missing.

export interface Publisher {
  name: string;
  /** Legal status, e.g. "Entrepreneur individuel (micro-entreprise)". Required. */
  status: { fr: string; en: string } | null;
  /** SIREN or SIRET number. Required; use false if the person isn't a registered business. */
  siret: string | false | null;
  /** Postal address (business address or domiciliation). Required. */
  address: string | null;
  /** Required. */
  email: string | null;
  /** Required by law for professionals. */
  phone: string | null;
  /** Optional, e.g. VAT number or RCS/RNE registration. */
  extra?: { fr: string; en: string } | null;
}

export const publishers: Publisher[] = [
  {
    name: "Antony Addy",
    // Same details as the legal notice on antonyaddy.com (version of 18 August 2026).
    status: { fr: "Entrepreneur individuel (auto-entrepreneur)", en: "Sole trader (French auto-entrepreneur)" },
    siret: "483 178 893 00028",
    address: "135 rue Henri Vadon, Résidence des Arènes, 83600 Fréjus, France",
    email: "formations@antonyaddy.com",
    phone: "+33 6 49 82 98 26",
    extra: { fr: "TVA non applicable, art. 293 B du CGI", en: "VAT not applicable (art. 293 B of the French tax code)" },
  },
  {
    name: "Julien Bourgois",
    status: null,
    siret: null,
    address: null,
    email: null,
    phone: null,
  },
];

/** Person legally responsible for what is published. Required. */
export const director: string | null = "Antony Addy";

/** Contact address for privacy requests and takedown requests. Required. */
export const contactEmail: string | null = "antony@antonyaddy.com";

/** Date the legal notice was last reviewed (YYYY-MM-DD). */
export const updated = "2026-10-22";

export const host = {
  name: "Vercel Inc.",
  address: "440 N Barranca Ave #4133, Covina, CA 91723, United States",
  url: "https://vercel.com",
};

// Build guard: list every missing required field.
export function missingFields(): string[] {
  const missing: string[] = [];
  for (const p of publishers) {
    for (const k of ["status", "siret", "address", "email", "phone"] as const) {
      if (p[k] === null || p[k] === "") missing.push(`${p.name}: ${k}`);
    }
  }
  if (!director) missing.push("director");
  if (!contactEmail) missing.push("contactEmail");
  return missing;
}
