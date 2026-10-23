// Makes the icon files from public/favicon.svg: favicon.ico (16, 32, 48 px),
// icon-192.png and icon-512.png for the web manifest, and a full-bleed
// icon-maskable-512.png for Android home screens. Run `npm run icons` after
// changing the favicon, and commit the results.
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const pub = new URL("../public/", import.meta.url);
const svg = await readFile(new URL("favicon.svg", pub), "utf8");
const png = (source, size) => sharp(Buffer.from(source), { density: 600 }).resize(size, size).png().toBuffer();

// favicon.ico: an ICO header followed by PNG images (supported by every current browser).
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(svg, s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e); header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8); header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
await writeFile(new URL("favicon.ico", pub), Buffer.concat([header, ...images]));

await writeFile(new URL("icon-192.png", pub), await png(svg, 192));
await writeFile(new URL("icon-512.png", pub), await png(svg, 512));

// Maskable: square corners and the mark shrunk into the central safe zone,
// so Android can crop it to a circle or squircle without cutting the logo.
const maskable = svg
  .replace(/<rect([^>]*?) rx="16"/, "<rect$1")
  .replace('<g transform="translate(8 8)">', '<g transform="translate(17.6 17.6) scale(0.7)">');
await writeFile(new URL("icon-maskable-512.png", pub), await png(maskable, 512));
console.log("icons: favicon.ico, icon-192.png, icon-512.png, icon-maskable-512.png");
