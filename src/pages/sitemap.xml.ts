// Every indexable page, each with its alternate-language version and the date
// its content last changed: home pages follow the most recently updated
// project, legal pages follow src/data/legal.ts, case studies their project.
import type { APIRoute } from "astro";
import { homePath, legalPath, casePath, blogPath, postPath, questionnairePath, contactPath, aboutPath, langs, type Lang } from "../i18n";
import { postsFor, isPublished } from "../blog";
import { cases, caseSlug } from "../data/cases";
import projects from "../data/projects.json";
import { updated as legalUpdated } from "../data/legal";

export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const day = (d: string) => d.slice(0, 10);
  const latest = projects.map((p) => p.updated ?? "").sort().at(-1) || legalUpdated;
  const pages: { paths: Record<Lang, string>; lastmod: string; xDefault: Lang }[] = [
    { paths: homePath, lastmod: day(latest), xDefault: "fr" },
    { paths: legalPath, lastmod: legalUpdated, xDefault: "fr" },
    { paths: questionnairePath, lastmod: legalUpdated, xDefault: "fr" },
    { paths: contactPath, lastmod: legalUpdated, xDefault: "fr" },
    { paths: aboutPath, lastmod: legalUpdated, xDefault: "fr" },
    // Case studies count only once published (drafts are noindex).
    ...projects
      .filter((p) => cases[p.slug]?.status === "published")
      .map((p) => ({
        paths: { fr: casePath("fr", caseSlug(p.title)), en: casePath("en", caseSlug(p.title)) },
        lastmod: day(p.updated ?? legalUpdated),
        xDefault: "fr" as Lang,
      })),
  ];
  // Blog: the index and each article, once published (a post is listed when
  // it and its translation are both published).
  const fr = (await postsFor("fr")).filter(isPublished);
  const en = (await postsFor("en")).filter(isPublished);
  const pairs = fr.flatMap((f) => {
    const e = en.find((x) => x.data.key === f.data.key);
    return e ? [{ f, e }] : [];
  });
  if (pairs.length) {
    const newest = pairs.map(({ f }) => f.data.date.toISOString().slice(0, 10)).sort().at(-1)!;
    pages.push({ paths: blogPath, lastmod: newest, xDefault: "fr" });
    for (const { f, e } of pairs) {
      pages.push({ paths: { fr: postPath("fr", f.data.slug), en: postPath("en", e.data.slug) }, lastmod: f.data.date.toISOString().slice(0, 10), xDefault: "fr" });
    }
  }
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
