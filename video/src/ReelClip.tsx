// The 9:16 Reel: the project in the lit window, desktop and phone scrolling
// together, then the official end card with the sonic logo.
import { Video } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ARRIVE, C, ClipProps, FRAUNCES, INTER, scrollAt, walk } from "./shared";

// Layout, in output px (1080×1920).
const PANE = { x: 60, y: 500, w: 900, chrome: 40 };
const paneView = Math.round((PANE.w * 10) / 16); // 16:10 page window
const PHONE = { x: 700, y: 920, w: 320, r: 46, bezel: 12 };
const phoneView = Math.round(((PHONE.w - PHONE.bezel * 2) * 844) / 390);

export const END_CARD = 105; // 3.5 s at 30 fps
const INTRO = 24;

export const reelWalks = (p: ClipProps, fps: number) => ({
  desktop: walk({ fps, start: INTRO, pageHeight: (p.desktop.height / p.desktop.width) * PANE.w, viewHeight: paneView, stops: 4, holdFirst: 1.0 }),
  mobile: walk({ fps, start: INTRO + 10, pageHeight: (p.mobile.height / p.mobile.width) * (PHONE.w - PHONE.bezel * 2), viewHeight: phoneView, stops: 4, holdFirst: 1.0 }),
});

export const reelBody = (p: ClipProps, fps: number) => {
  const w = reelWalks(p, fps);
  return Math.max(w.desktop.end, w.mobile.end) + Math.round(1.2 * fps);
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ReelClip: React.FC<ClipProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = reelWalks(p, fps);
  const body = reelBody(p, fps);

  return (
    <AbsoluteFill style={{ backgroundColor: C.night }}>
      <Sequence durationInFrames={body} name="Window">
        <AbsoluteFill
          style={{
            background: `radial-gradient(70% 40% at 70% 48%, rgb(255 178 102 / 0.26), transparent 70%), radial-gradient(80% 40% at 0% 0%, rgb(84 128 230 / 0.32), transparent 70%), linear-gradient(180deg, ${C.night2} 0%, ${C.night} 75%)`,
          }}
        >
          {/* Title block */}
          <div
            style={{
              position: "absolute",
              left: 72,
              right: 72,
              top: 200,
              opacity: interpolate(frame, [0, 18], [0, 1], { ...clamp, easing: ARRIVE }),
              translate: interpolate(frame, [0, 22], ["0px 24px", "0px 0px"], { ...clamp, easing: ARRIVE }),
            }}
          >
            <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 30, letterSpacing: "0.16em", textTransform: "uppercase", color: C.lamp }}>
              {p.category}
            </div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 500, fontSize: 104, lineHeight: 1.02, letterSpacing: "-0.03em", color: C.textHi, marginTop: 22, textWrap: "balance" }}>
              {p.title}
            </div>
          </div>

          {/* Desktop window */}
          <div
            style={{
              position: "absolute",
              left: PANE.x,
              top: PANE.y,
              width: PANE.w,
              borderRadius: 18,
              overflow: "hidden",
              background: "#0d1a36",
              boxShadow: "0 0 0 1px rgb(255 255 255 / 0.12), 0 50px 90px -30px rgb(0 0 0 / 0.85), 0 0 110px -10px rgb(255 178 102 / 0.4)",
              opacity: interpolate(frame, [4, 26], [0, 1], clamp),
              translate: interpolate(frame, [4, 34], ["0px 60px", "0px 0px"], { ...clamp, easing: ARRIVE }),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, height: PANE.chrome, padding: "0 18px", background: "linear-gradient(180deg, #1b2a4f, #142243)" }}>
              {["#ff7b6b", "rgb(255 255 255 / 0.2)", "rgb(255 255 255 / 0.2)"].map((bg, i) => (
                <i key={i} style={{ width: 12, height: 12, borderRadius: 6, background: bg }} />
              ))}
              <span style={{ marginLeft: 14, fontFamily: INTER, fontWeight: 600, fontSize: 18, color: C.textLo }}>{p.host}</span>
            </div>
            <div style={{ height: paneView, overflow: "hidden", background: "#fff" }}>
              <Img src={staticFile(`captures/${p.desktop.file}`)} style={{ width: PANE.w, translate: `0px ${scrollAt(frame, w.desktop)}px` }} />
            </div>
          </div>

          {/* Phone */}
          <div
            style={{
              position: "absolute",
              left: PHONE.x,
              top: PHONE.y,
              width: PHONE.w,
              padding: PHONE.bezel,
              borderRadius: PHONE.r,
              background: "linear-gradient(160deg, #2a3557, #0b1430)",
              boxShadow: "0 0 0 2px rgb(255 255 255 / 0.14), 0 50px 80px -20px rgb(0 0 0 / 0.9), 0 0 80px -10px rgb(121 173 255 / 0.35)",
              opacity: interpolate(frame, [14, 36], [0, 1], clamp),
              translate: interpolate(frame, [14, 46], ["40px 80px", "0px 0px"], { ...clamp, easing: ARRIVE }),
            }}
          >
            <div style={{ height: phoneView, borderRadius: PHONE.r - PHONE.bezel, overflow: "hidden", background: "#fff" }}>
              <Img src={staticFile(`captures/${p.mobile.file}`)} style={{ width: PHONE.w - PHONE.bezel * 2, translate: `0px ${scrollAt(frame, w.mobile)}px` }} />
            </div>
          </div>

          {/* Sign-off line */}
          <div
            style={{
              position: "absolute",
              left: 72,
              bottom: 150,
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: INTER,
              fontWeight: 600,
              fontSize: 32,
              color: C.textLo,
              opacity: interpolate(frame, [40, 60], [0, 1], clamp),
            }}
          >
            <i style={{ width: 12, height: 12, borderRadius: 6, background: C.lamp }} />
            <span>
              Réalisé par <span style={{ color: C.textHi }}>The Vitrine</span>
            </span>
          </div>

          {/* The window sill: the brand's amber-to-blue line. */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 96, height: 3, background: `linear-gradient(90deg, transparent, ${C.lamp} 35%, ${C.blue} 75%, transparent)`, opacity: 0.85 }} />

          {/* Fade into the end card */}
          <AbsoluteFill style={{ backgroundColor: C.night, opacity: interpolate(frame, [body - 12, body], [0, 1], clamp) }} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={body} durationInFrames={END_CARD} name="End card">
        <Video src={staticFile("brand/the-vitrine-endcard-reel-9x16.mp4")} />
      </Sequence>
    </AbsoluteFill>
  );
};
