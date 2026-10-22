// Makes small WebP copies of every screenshot in public/shots, so phones and
// card-sized slots never download the full 1280px JPEG. Runs before each build;
// files that are already up to date are skipped. Output goes to public/shots/w/
// (git-ignored) and is read by src/img.ts.

import { readdir, stat, mkdir } from "node:fs/promises";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const src = new URL("public/shots/", root);
const out = new URL("public/shots/w/", root);
export const WIDTHS = [480, 800, 1280];

await mkdir(out, { recursive: true });
const files = (await readdir(src)).filter((f) => f.endsWith(".jpg"));
let made = 0;
for (const f of files) {
  const input = new URL(f, src);
  const { mtimeMs } = await stat(input);
  for (const w of WIDTHS) {
    const target = new URL(f.replace(/\.jpg$/, `-${w}.webp`), out);
    const done = await stat(target).then((s) => s.mtimeMs >= mtimeMs, () => false);
    if (done) continue;
    await sharp(input.pathname).resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(target.pathname);
    made++;
  }
}
console.log(`images: ${made} WebP file(s) written, ${files.length * WIDTHS.length - made} up to date.`);
