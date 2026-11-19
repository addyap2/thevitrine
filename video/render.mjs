// Renders the walkthrough clips for one or more projects.
//
//   npm run clip -- ristorante-lola [more slugs…]      capture, then render both
//   npm run clip -- --no-capture ristorante-lola       reuse existing captures
//
// Outputs:
//   ../public/video/<slug>.mp4   1280×800 loop for the case-study page (committed)
//   out/<slug>-reel.mp4          1080×1920 Reel with the end card (for social)
import { execFileSync } from "node:child_process";
import { readFile, mkdir } from "node:fs/promises";
import projects from "../src/data/projects.json" with { type: "json" };
import overrides from "../src/data/overrides.json" with { type: "json" };

const args = process.argv.slice(2);
const capture = !args.includes("--no-capture");
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
  const category =overrides.categories.find((c) => c.id === p.category)?.label?.fr ?? "";
  const props = {
    slug,
    title: REEL_TITLES[slug] ?? p.title,
    category, // a sector, never a place
    host: new URL(p.url).host.replace(/^www\./, ""),
    ...shots,
  };
  const json = JSON.stringify(props);
  // Small file for the web: no audio, H.264 for every browser, keyframes every 2 s.
  run("npx", ["remotion", "render", "src/index.ts", "PaneClip", `../public/video/${slug}.mp4`, `--props=${json}`, "--codec=h264", "--crf=30", "--muted", "--x264-preset=slow", "--pixel-format=yuv420p"]);
  run("npx", ["remotion", "render", "src/index.ts", "ReelClip", `out/${slug}-reel.mp4`, `--props=${json}`, "--codec=h264", "--crf=18"]);
}
