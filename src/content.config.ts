// Blog posts: Markdown files in src/content/blog/fr/ and src/content/blog/en/.
// A post and its translation share the same `key`.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    updated: z.coerce.date().optional(),
    /** Shown in Google results and on the blog index (about 150 characters). */
    description: z.string(),
    lang: z.enum(["fr", "en"]),
    /** URL slug in this language. */
    slug: z.string(),
    /** Shared by a post and its translation. */
    key: z.string(),
    date: z.coerce.date(),
    /** "draft": readable for review, but noindex, out of the sitemap and the index. */
    status: z.enum(["draft", "published"]).default("draft"),
    authors: z.array(z.enum(["Antony", "Julien"])).default(["Antony", "Julien"]),
    /** Project slug (projects.json) whose screenshot illustrates the article and its share image. */
    cover: z.string().optional(),
    /** Project slugs whose case studies are linked at the end of the article. */
    cases: z.array(z.string()).default([]),
    /** Keys of the articles suggested next. Falls back to the latest ones. */
    next: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
