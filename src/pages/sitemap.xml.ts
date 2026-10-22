// Every indexable page, each with its alternate-language version and the date
// its content last changed: home pages follow the most recently updated
// project, legal pages follow src/data/legal.ts.
import type { APIRoute } from "astro";
import { homePath, legalPath, langs, type Lang } from "../i18n";
import projects from "../data/projects.json";
import { updated as legalUpdated } from "../data/legal";

export const GET: APIRoute = ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const day = (d: string) => d.slice(0, 10);
  const latest = projects.map((p) => p.updated ?? "").sort().at(-1) || legalUpdated;
  const pages: { paths: Record<Lang, string>; lastmod: string; xDefault: Lang }[] = [
    { paths: homePath, lastmod: day(latest), xDefault: "fr" },
    { paths: legalPath, lastmod: legalUpdated, xDefault: "fr" },
  ];
  const urls = pages.flatMap(({ paths, lastmod, xDefault }) => {
    const alternates =
      langs.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${abs(paths[l])}"/>`).join("") +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${abs(paths[xDefault])}"/>`;
    return langs.map((l) => `<url><loc>${abs(paths[l])}</loc><lastmod>${lastmod}</lastmod>${alternates}</url>`);
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
