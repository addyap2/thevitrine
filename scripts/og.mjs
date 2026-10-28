// Renders the share images (public/og/en.jpg, fr.jpg, it.jpg) from the hero of
// a running preview: `npm run build && npx astro preview`, then `npm run og`.
// Re-run whenever the hero changes.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:4321";
const out = new URL("../public/og/", import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
for (const [lang, path] of [["en", "/en/"], ["fr", "/"], ["it", "/it/"]]) {
  // bypassCSP: the site's content security policy would block the style tweaks below.
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: "reduce", bypassCSP: true });
  await page.context().addCookies([{ name: "lang", value: lang, url: base }]);
  await page.goto(base + path, { waitUntil: "networkidle" });
  // A share card has no buttons to press: hide the controls and centre the scene.
  await page.addStyleTag({ content: "[data-site-header], .skip, .actions, .view-controls, .exhibit-bottom, .signature, .coordinate, .exhibit-top, astro-dev-toolbar { display: none !important } :root { --site-header-height: 0px !important } body { padding-top: 0 !important } .showcase { padding-top: 64px !important }" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: new URL(`${lang}.jpg`, out).pathname, type: "jpeg", quality: 82 });
  console.log(`og/${lang}.jpg`);
}
await browser.close();
