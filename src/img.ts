// Responsive sources for a screenshot made by scripts/images.mjs.
// "/shots/lola.jpg" → "/shots/w/lola-480.webp 480w, …".
const WIDTHS = [480, 800, 1280];

export const srcset = (image: string) =>
  WIDTHS.map((w) => `${image.replace(/^\/shots\/(.+)\.jpg$/, `/shots/w/$1-${w}.webp`)} ${w}w`).join(", ");

export const src800 = (image: string) => image.replace(/^\/shots\/(.+)\.jpg$/, "/shots/w/$1-800.webp");

// Rendered widths, matching the grid in Vitrine.astro and ProjectCard.astro.
export const sizes = {
  card: "(min-width: 1000px) 368px, (min-width: 640px) calc(50vw - 3rem), calc(100vw - 2rem)",
  wide: "(min-width: 1000px) 400px, (min-width: 640px) 46vw, calc(100vw - 2rem)",
  hero: "(min-width: 1200px) 520px, (min-width: 960px) 44vw, 80vw",
};
