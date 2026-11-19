# Walkthrough clips

Remotion project that turns a project's live site into two videos:

| Output | Size | Where it goes |
|---|---|---|
| `../public/video/<slug>.mp4` | 1280×800, silent loop, ~1.7 MB | Played over the screenshot on the case-study page |
| `out/<slug>-reel.mp4` | 1080×1920 with the end card and sonic logo | Instagram / Facebook Reels, Google Business Profile |

```bash
cd video
npm install
npm run clip -- ristorante-lola            # capture the live site, then render both
npm run clip -- --no-capture ristorante-lola
npm run dev                                 # Remotion Studio, to tweak the look
```

`capture.mjs` takes full-length desktop and phone screenshots with Playwright
(it pins top bars, hides floating buttons and cookie banners). `render.mjs`
reads the title and sector from `src/data/projects.json` and `overrides.json`.
The Reel shows the sector, never a place name.

The case-study page picks up `public/video/<slug>.mp4` automatically at build
time. It only plays while on screen, never under reduced motion, data saving
or 2G, and has a pause button; otherwise the screenshot stays.

This folder is separate from the site build: Vercel never installs it.
