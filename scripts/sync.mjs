// Collects every repo tagged with the Vitrine topic across our GitHub accounts,
// merges in src/data/overrides.json, takes screenshots of any site that has none
// yet, and writes src/data/projects.json for the site to render.
//
//   npm run sync                  normal run
//   npm run sync -- --refresh     retake every screenshot
//   npm run sync -- --all         preview mode: ignore the topic and include every
//                                 repo with a website link (don't commit this output)
//
// Set GITHUB_TOKEN to raise the rate limit and to include private repos the token can see.

import { readFile, writeFile, access } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const args = new Set(process.argv.slice(2));
const refresh = args.has("--refresh");
const all = args.has("--all");

const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), "utf8"));
const config = await readJson("vitrine.config.json");
const overrides = await readJson("src/data/overrides.json");

const makerByLogin = Object.fromEntries(
  config.accounts.map((a) => [a.login.toLowerCase(), a.maker]),
);

async function searchRepos() {
  const users = config.accounts.map((a) => `user:${a.login}`).join(" ");
  const q = all ? users : `topic:${config.topic} ${users}`;
  const url = `https://api.github.com/search/repositories?per_page=100&q=${encodeURIComponent(q)}`;
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub search failed: ${res.status} ${await res.text()}`);
  const { items, total_count } = await res.json();
  if (total_count > items.length) console.warn(`Only the first ${items.length} of ${total_count} repos were fetched.`);
  return all ? items.filter((r) => r.homepage) : items;
}

const titleCase = (name) =>
  name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function fromRepo(repo) {
  const o = overrides.projects[repo.name] ?? {};
  if (o.hidden) return null;
  return {
    slug: repo.name,
    title: o.title ?? titleCase(repo.name),
    description: o.description ?? repo.description ?? "",
    url: o.url ?? (repo.homepage || null),
    repo: repo.private ? null : repo.html_url,
    maker: o.maker ?? makerByLogin[repo.owner.login.toLowerCase()] ?? repo.owner.login,
    tags: o.tags ?? repo.topics.filter((t) => t !== config.topic),
    featured: o.featured ?? false,
    inProgress: o.inProgress ?? false,
    order: o.order ?? null,
    updated: repo.pushed_at,
  };
}

function fromExtra(e) {
  return {
    repo: null, tags: [], featured: false, inProgress: false, order: null, updated: null,
    description: "", ...e,
  };
}

const exists = (path) => access(new URL(path, root)).then(() => true, () => false);

async function screenshot(projects) {
  const todo = [];
  for (const p of projects) {
    if (p.url && (refresh || !(await exists(`public/shots/${p.slug}.jpg`)))) todo.push(p);
  }
  if (!todo.length) return;
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  for (const p of todo) {
    try {
      await page.goto(p.url, { waitUntil: "networkidle", timeout: 30_000 });
      await page.waitForTimeout(1500); // let entrance animations settle
      await page.screenshot({ path: new URL(`public/shots/${p.slug}.jpg`, root).pathname, type: "jpeg", quality: 78 });
      console.log(`📸 ${p.slug}`);
    } catch (err) {
      console.warn(`Could not screenshot ${p.slug} (${p.url}): ${err.message}`);
    }
  }
  await browser.close();
}

const repos = await searchRepos();
const projects = [
  ...repos.map(fromRepo).filter(Boolean),
  ...overrides.extra.map(fromExtra),
];

await screenshot(projects);
for (const p of projects) {
  p.image = (await exists(`public/shots/${p.slug}.jpg`)) ? `/shots/${p.slug}.jpg` : null;
}

// Featured first, then any explicit order, then most recently worked on.
projects.sort(
  (a, b) =>
    b.featured - a.featured ||
    (a.order ?? Infinity) - (b.order ?? Infinity) ||
    (b.updated ?? "").localeCompare(a.updated ?? ""),
);

await writeFile(new URL("src/data/projects.json", root), JSON.stringify(projects, null, 2) + "\n");
console.log(`Wrote ${projects.length} projects${all ? " (preview mode — don't commit this)" : ""}.`);
