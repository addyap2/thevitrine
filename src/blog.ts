// Blog helpers: posts per language, their translation, and reading time.
import { getCollection, type CollectionEntry } from "astro:content";
import type { BlogLang as Lang } from "./i18n";
import projects from "./data/projects.json";

export type Post = CollectionEntry<"blog">;

export async function postsFor(lang: Lang): Promise<Post[]> {
  const all = await getCollection("blog", (p) => p.data.lang === lang);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const isPublished = (p: Post) => p.data.status === "published";

/** The same article in the other language, if it exists. */
export async function translationOf(post: Post): Promise<Post | undefined> {
  const other = post.data.lang === "fr" ? "en" : "fr";
  return (await postsFor(other)).find((p) => p.data.key === post.data.key);
}

/** About 220 words a minute, never less than one. */
export const minutes = (post: Post) => Math.max(1, Math.round((post.body ?? "").split(/\s+/).filter(Boolean).length / 220));

export const formatDate = (d: Date, lang: Lang) =>
  d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

/** The project behind an article's cover or case links (from projects.json). */
export function projectFor(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Blog: unknown project "${slug}"`);
  return project;
}

/** Share image made by scripts/og-blog.mjs, one per article and language. */
export const shareImage = (post: Post) => `/og/blog/${post.data.lang}/${post.data.slug}.jpg`;

/** The articles suggested after this one: its `next` keys, then the latest others. */
export async function nextFor(post: Post, count = 2): Promise<Post[]> {
  const siblings = (await postsFor(post.data.lang)).filter((p) => p.id !== post.id);
  const pool = siblings.some(isPublished) ? siblings.filter(isPublished) : siblings;
  const chosen = post.data.next.map((k) => pool.find((p) => p.data.key === k)).filter((p): p is Post => !!p);
  for (const p of pool) if (chosen.length < count && !chosen.includes(p)) chosen.push(p);
  return chosen.slice(0, count);
}
