// Renders one share image per blog article and language:
// public/og/blog/<lang>/<slug>.jpg (1200×630). Reads the Markdown files
// directly, so no server is needed: `npm run og:blog`. Re-run after adding an
// article or changing a title or cover. Needs a network connection for the fonts.
import { chromium } from "playwright";
import { readdir, readFile, mkdir } from "node:fs/promises";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const projects = JSON.parse(await readFile(new URL("src/data/projects.json", root), "utf8"));
const logo = await readFile(new URL("public/brand/logo-light.svg", root), "utf8");

// Just the frontmatter fields this script needs.
function frontmatter(text) {
  const block = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const field = (k) => block.match(new RegExp(`^${k}: (.*)$`, "m"))?.[1]?.trim().replace(/^"(.*)"$/, "$1");
  return { title: field("title"), lang: field("lang"), slug: field("slug"), cover: field("cover"), status: field("status") };
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function shot(slug) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Unknown cover project: ${slug}`);
  const buf = await sharp(new URL(`public${project.image}`, root).pathname).resize({ width: 900 }).jpeg({ quality: 82 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

function html({ title, lang, image }) {
  const size = title.length > 70 ? 50 : title.length > 50 ? 56 : 64;
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Inter:wght@500;600&display=block" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; position: relative; color: #f6f2ea; font-family: Inter, sans-serif;
    background: radial-gradient(60% 70% at 18% 0%, rgb(255 178 102 / 0.22), transparent 70%), linear-gradient(160deg, #081227 0%, #10234d 100%); }
  .sill { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: linear-gradient(90deg, transparent, #ffc27d 35%, #79adff 75%, transparent); }
  .text { position: absolute; left: 72px; top: 64px; bottom: 64px; width: 560px; display: flex; flex-direction: column; }
  .logo svg { height: 44px; width: auto; display: block; }
  .eyebrow { margin-top: auto; font-size: 18px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #ffc27d; }
  h1 { margin-top: 18px; font-family: Fraunces, serif; font-weight: 500; font-size: ${size}px; line-height: 1.08; letter-spacing: -0.02em; text-wrap: balance; }
  .by { margin-top: 28px; font-size: 19px; font-weight: 500; color: rgb(246 242 234 / 0.7); }
  .frame { position: absolute; left: 690px; top: 118px; width: 640px; border-radius: 16px; overflow: hidden; background: #f6f2ea;
    box-shadow: 0 40px 80px -20px rgb(0 0 0 / 0.6), 0 0 0 1px rgb(255 255 255 / 0.12); transform: rotate(-3deg); }
  .dots { display: flex; gap: 8px; padding: 12px 16px; background: #e9e3d8; }
  .dots i { width: 11px; height: 11px; border-radius: 50%; background: #c9c1b3; }
  .frame img { display: block; width: 100%; height: 400px; object-fit: cover; object-position: top; }
</style></head><body>
  <div class="text">
    <div class="logo">${logo}</div>
    <p class="eyebrow">Blog</p>
    <h1>${esc(title)}</h1>
    <p class="by">Antony Addy &amp; Julien Bourgois · thevitrine.fr</p>
  </div>
  <div class="frame"><div class="dots"><i></i><i></i><i></i></div><img src="${image}" alt=""></div>
  <div class="sill"></div>
</body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const lang of ["fr", "en"]) {
  const dir = new URL(`src/content/blog/${lang}/`, root);
  const out = new URL(`public/og/blog/${lang}/`, root);
  await mkdir(out, { recursive: true });
  for (const file of (await readdir(dir)).filter((f) => f.endsWith(".md"))) {
    const post = frontmatter(await readFile(new URL(file, dir), "utf8"));
    if (!post.cover) { console.warn(`skipped ${lang}/${file}: no cover`); continue; }
    await page.setContent(html({ ...post, image: await shot(post.cover) }), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: new URL(`${post.slug}.jpg`, out).pathname, type: "jpeg", quality: 84 });
    console.log(`og/blog/${lang}/${post.slug}.jpg`);
  }
}
await browser.close();
