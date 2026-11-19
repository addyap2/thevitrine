// Takes full-length screenshots of a project's live site, desktop and mobile,
// for the walkthrough clips. Scrolls the whole page first so lazy images and
// scroll-reveal animations have loaded before the shot.
//
//   node capture.mjs ristorante-lola [more slugs…]
//
// Writes public/captures/<slug>-desktop.jpg, <slug>-mobile.jpg and <slug>.json
// (the image sizes, read by render.mjs).
import { writeFile, mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import sharp from "sharp";
import projects from "../src/data/projects.json" with { type: "json" };

const MAX_DESKTOP = 6400; // CSS px; longer pages are cut off, the clip only shows the first part
const MAX_MOBILE = 7200;
const out = new URL("./public/captures/", import.meta.url).pathname;

async function settle(page) {
  // Instant scrolling, so the page is really back at the top when shot.
  await page.addStyleTag({ content: `html,body{scroll-behavior:auto!important}` });
  // Walk down the page in viewport steps, then come back to the top.
  await page.evaluate(async () => {
    const step = innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 160));
    }
    scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(800);
  // The page is shot one screen at a time, so fixed and sticky bars would
  // repeat on every screen. Pin top bars to the top of the document and drop
  // floating buttons and banners.
  await page.evaluate(() => {
    scrollTo(0, 0);
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.position === "sticky") el.style.setProperty("position", "relative", "important");
      else if (cs.position === "fixed") {
        const r = el.getBoundingClientRect();
        if (r.top <= 4 && r.width > innerWidth * 0.6 && r.height < innerHeight * 0.3) el.style.setProperty("position", "absolute", "important");
        else el.style.setProperty("display", "none", "important");
      }
    }
  });
  await page.waitForTimeout(300);
}

async function shoot(browser, p, kind) {
  const mobile = kind === "mobile";
  const context = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 },
    deviceScaleFactor: 2,
    isMobile: mobile,
    hasTouch: mobile,
    reducedMotion: "no-preference",
    bypassCSP: true, // so the clean-up styles can be added to sites with a strict CSP
  });
  const page = await context.newPage();
  await page.goto(p.url, { waitUntil: "load", timeout: 60_000 });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await settle(page);
  const width = mobile ? 390 : 1280;
  const full = await page.evaluate(() => document.documentElement.scrollHeight);
  const height = Math.min(full, mobile ? MAX_MOBILE : MAX_DESKTOP);
  // Stitch viewport-sized shots: a single full-page shot would stretch the
  // viewport and every section sized in vh with it.
  const dpr = 2;
  const view = mobile ? 844 : 800;
  const H = height * dpr;
  let png;
  try {
    const parts = [];
    for (let y = 0; y < height; y += view) {
      const top = (await page.evaluate((y) => (scrollTo(0, y), scrollY), y)) * dpr;
      if (top >= H) break;
      await page.waitForTimeout(300);
      // Let scroll-in animations on this screen finish (endless ones excluded).
      await page.evaluate(() =>
        Promise.race([
          Promise.all(
            document
              .getAnimations()
              .filter((a) => Number.isFinite(a.effect?.getComputedTiming().endTime))
              .map((a) => a.finished.catch(() => {})),
          ),
          new Promise((r) => setTimeout(r, 2000)),
        ]),
      );
      await page.waitForTimeout(150);
      const shot = await page.screenshot({ type: "png", timeout: 15_000 });
      const keep = Math.min(view * dpr, H - top);
      parts.push({ input: await sharp(shot).extract({ left: 0, top: 0, width: width * dpr, height: keep }).toBuffer(), top, left: 0 });
    }
    png = await sharp({ create: { width: width * dpr, height: H, channels: 3, background: "#fff" } }).composite(parts).png().toBuffer();
  } catch (err) {
    // Some sites refuse repeated viewport shots: fall back to one full-page shot.
    console.warn(`  ${p.slug} ${kind}: stitching failed (${err.message.split("\n")[0]}), using a full-page shot`);
    await page.evaluate(() => scrollTo(0, 0));
    png = await page.screenshot({ fullPage: true, clip: { x: 0, y: 0, width, height }, type: "png", timeout: 60_000 });
  }
  await context.close();
  // Desktop at 1.5× is enough for a 1280-wide clip; mobile keeps 2× for the phone frame.
  const scale = mobile ? 2 : 1.5;
  const file = `${p.slug}-${kind}.jpg`;
  await sharp(png).resize({ width: Math.round(width * scale) }).jpeg({ quality: 86, mozjpeg: true }).toFile(out + file);
  return { file, width, height };
}

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("Usage: node capture.mjs <slug> [slug…]");
  process.exit(1);
}
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
for (const slug of slugs) {
  const p = projects.find((x) => x.slug === slug);
  if (!p?.url) {
    console.warn(`No live URL for ${slug}, skipped.`);
    continue;
  }
  try {
    const desktop = await shoot(browser, p, "desktop");
    const mobile = await shoot(browser, p, "mobile");
    await writeFile(out + `${slug}.json`, JSON.stringify({ desktop, mobile }, null, 2));
    console.log(`${slug}: desktop ${desktop.height}px, mobile ${mobile.height}px`);
  } catch (err) {
    console.warn(`Could not capture ${slug} (${p.url}): ${err.message}`);
  }
}
await browser.close();
