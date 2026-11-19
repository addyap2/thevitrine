// Renders the walkthrough clips for one or more projects.
//
//   npm run clip -- ristorante-lola [more slugs…]      capture, then render both
//   npm run clip -- --no-capture ristorante-lola       reuse existing captures
//   npm run clip -- --reels-only --all                 only the Reels
//
// Outputs:
//   ../public/video/<slug>.mp4   1280×800 loop for the case-study page (committed)
//   out/<slug>-reel.mp4          1080×1920 Reel with the end card and the site's
//                                address, only for sites on their own domain
import { execFileSync } from "node:child_process";
import { readFile, mkdir } from "node:fs/promises";
import projects from "../src/data/projects.json" with { type: "json" };
import overrides from "../src/data/overrides.json" with { type: "json" };

const args = process.argv.slice(2);
const reelsOnly = args.includes("--reels-only");
const capture = !args.includes("--no-capture") && !reelsOnly;
let slugs = args.filter((a) => !a.startsWith("--"));
// --all: every project that has a case study and a live site.
if (args.includes("--all")) {
  // The case keys are the top-level entries of the `cases` object in cases.ts.
  const src = await readFile(new URL("../src/data/cases.ts", import.meta.url), "utf8");
  const block = src.slice(src.indexOf("export const cases"));
  const keys = new Set([...block.matchAll(/^ {2}"?([\w-]+)"?: \{/gm)].map((m) => m[1]));
  slugs = projects.filter((p) => p.url && keys.has(p.slug)).map((p) => p.slug);
}
if (!slugs.length) {
  console.error("Usage: npm run clip -- [--no-capture] <slug> [slug…]");
  process.exit(1);
}

// Reel titles without place names (marketing never names a town or region).
const REEL_TITLES = { "wall-street": "Wall Street" };

// A Reel points viewers to the client's own site, so it's only made for sites
// on their own domain: not a hosting subdomain (x.vercel.app), and not a page
// or subdomain of antonyaddy.com.
const SHARED_HOSTS = ["antonyaddy.com", "vercel.app", "netlify.app", "github.io", "pages.dev", "web.app"];
export function ownDomain(url) {
  const u = new URL(url);
  const host = u.host.replace(/^www\./, "");
  if (u.pathname.replace(/\/$/, "") !== "") return null;
  if (SHARED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return null;
  return host;
}

const here = new URL("./", import.meta.url).pathname;
const run = (cmd, a) => execFileSync(cmd, a, { cwd: here, stdio: "inherit" });

if (capture) run("node", ["capture.mjs", ...slugs]);
await mkdir(new URL("../public/video/", import.meta.url), { recursive: true });

for (const slug of slugs) {
  const p = projects.find((x) => x.slug === slug);
  const shots = await readFile(new URL(`./public/captures/${slug}.json`, import.meta.url), "utf8").then(JSON.parse).catch(() => null);
  if (!p?.url || !shots) {
    console.warn(`No capture for ${slug}, skipped.`);
    continue;
  }
  // A page about one screen tall (a sign-in page, say) has nothing to walk through.
  if (shots.desktop.height < 1200) {
    console.warn(`${slug} is only ${shots.desktop.height}px tall, skipped.`);
    continue;
  }
  const category = overrides.categories.find((c) => c.id === p.category)?.label?.fr ?? "";
  const props = {
    slug,
    title: REEL_TITLES[slug] ?? p.title,
    category, // a sector, never a place
    host: new URL(p.url).host.replace(/^www\./, ""),
    link: ownDomain(p.url),
    ...shots,
  };
  const json = JSON.stringify(props);
  // Small file for the web: no audio, H.264 for every browser.
  if (!reelsOnly) run("npx", ["remotion", "render", "src/index.ts", "PaneClip", `../public/video/${slug}.mp4`, `--props=${json}`, "--codec=h264", "--crf=30", "--muted", "--x264-preset=slow", "--pixel-format=yuv420p"]);
  if (!ownDomain(p.url)) {
    console.warn(`${slug}: no domain of its own (${p.url}), no Reel.`);
    continue;
  }
  run("npx", ["remotion", "render", "src/index.ts", "ReelClip", `out/${slug}-reel.mp4`, `--props=${json}`, "--codec=h264", "--crf=18"]);
}
