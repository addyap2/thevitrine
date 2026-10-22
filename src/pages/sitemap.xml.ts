// Both language versions, each listing the other as its alternate.
import type { APIRoute } from "astro";
import { homePath, langs } from "../i18n";

export const GET: APIRoute = ({ site }) => {
  const url = (l: (typeof langs)[number]) => new URL(homePath[l], site).href;
  const alternates = langs.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${url(l)}"/>`).join("") +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${url("fr")}"/>`;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${langs.map((l) => `<url><loc>${url(l)}</loc>${alternates}</url>`).join("\n")}
</urlset>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
