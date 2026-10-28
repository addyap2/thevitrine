// RSS feed of the published articles in one language: /blog/rss.xml and /en/blog/rss.xml.
import { strings, blogPath, postPath, type BlogLang } from "./i18n";
import { postsFor, isPublished, shareImage } from "./blog";

export const feedPath: Record<BlogLang, string> = { fr: "/blog/rss.xml", en: "/en/blog/rss.xml" };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function feed(lang: BlogLang, site: URL): Promise<Response> {
  const t = strings[lang];
  const abs = (path: string) => new URL(path, site).href;
  const posts = (await postsFor(lang)).filter(isPublished);
  const latest = posts.reduce((d, p) => Math.max(d, (p.data.updated ?? p.data.date).getTime()), 0);
  const items = posts.map((p) => {
    const url = abs(postPath(lang, p.data.slug));
    const authors = p.data.authors.map((a) => (a === "Julien" ? "Julien Bourgois" : "Antony Addy")).join(", ");
    return `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(p.data.description)}</description>
      <pubDate>${p.data.date.toUTCString()}</pubDate>
      <dc:creator>${esc(authors)}</dc:creator>
      <media:content url="${abs(shareImage(p))}" medium="image" type="image/jpeg" width="1200" height="630" />
    </item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${esc(`${t.blogHeading} · The Vitrine`)}</title>
    <link>${abs(blogPath[lang])}</link>
    <atom:link href="${abs(feedPath[lang])}" rel="self" type="application/rss+xml" />
    <description>${esc(t.blogDescription)}</description>
    <language>${lang === "fr" ? "fr-FR" : "en-GB"}</language>
    <image><url>${abs("/icon-512.png")}</url><title>${esc(`${t.blogHeading} · The Vitrine`)}</title><link>${abs(blogPath[lang])}</link></image>
    ${latest ? `<lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>` : ""}
${items.join("\n")}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
