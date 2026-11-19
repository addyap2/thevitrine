import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

// The Vitrine palette, as in src/styles/tokens.css on the site.
export const C = {
  night: "#081227",
  night2: "#10234d",
  lamp: "#ffc27d",
  lampHot: "#ffe2b8",
  textHi: "#f6f2ea",
  textLo: "#b4c0dc",
  blue: "#79adff",
};

export const FRAUNCES = "Fraunces";
export const INTER = "Inter";

loadFont({ family: FRAUNCES, url: staticFile("fonts/fraunces-latin-500-normal.woff2"), weight: "500" });
loadFont({ family: FRAUNCES, url: staticFile("fonts/fraunces-latin-500-italic.woff2"), weight: "500", style: "italic" });
loadFont({ family: INTER, url: staticFile("fonts/inter-latin-600-normal.woff2"), weight: "600" });

export type Shot = { file: string; width: number; height: number };

export type ClipProps = {
  slug: string;
  title: string;
  /** Sector label, e.g. "Restaurants & bars". Never a place name. */
  category: string;
  host: string;
  /** The client's own domain, shown as the call to action in the Reel. */
  link?: string | null;
  desktop: Shot;
  mobile: Shot;
};

// A scroll that reads like a person browsing: a pause on the first screen,
// then a few eased moves down the page with a short look at each stop.
export type Walk = { frames: number[]; offsets: number[]; end: number };

export function walk(opts: {
  fps: number;
  /** Rendered height of the page image, in output px. */
  pageHeight: number;
  /** Height of the window it scrolls inside, in output px. */
  viewHeight: number;
  start?: number;
  stops?: number;
  holdFirst?: number;
  move?: number;
  dwell?: number;
}): Walk {
  const { fps, pageHeight, viewHeight } = opts;
  const start = opts.start ?? 0;
  const max = Math.max(0, pageHeight - viewHeight);
  const stops = Math.max(1, Math.min(opts.stops ?? 4, Math.ceil(max / (viewHeight * 0.9))));
  const holdFirst = Math.round((opts.holdFirst ?? 1.2) * fps);
  const move = Math.round((opts.move ?? 1.1) * fps);
  const dwell = Math.round((opts.dwell ?? 0.8) * fps);
  // Each stop travels about one screen, so the viewer can follow along.
  const step = Math.min(viewHeight * 0.95, max / stops);
  const frames = [start, start + holdFirst];
  const offsets = [0, 0];
  for (let i = 1; i <= stops; i++) {
    const t = frames[frames.length - 1];
    frames.push(t + move, t + move + dwell);
    offsets.push(-step * i, -step * i);
  }
  return { frames, offsets, end: frames[frames.length - 1] };
}

export const scrollAt = (frame: number, w: Walk) =>
  interpolate(frame, w.frames, w.offsets, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);
