// Blog helpers: posts per language, their translation, and reading time.
import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "./i18n";

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
