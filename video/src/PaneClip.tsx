// The clip for the website: just the page, scrolling, at 1280×800. The case
// study page draws its own browser frame around it. Ends on the first screen
// again so it can loop without a jump.
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ClipProps, scrollAt, walk } from "./shared";

export const PANE_FADE = 18;

export const paneWalk = (p: ClipProps, fps: number, width: number, height: number) =>
  walk({ fps, pageHeight: (p.desktop.height / p.desktop.width) * width, viewHeight: height, holdFirst: 1.4, stops: 4 });

export const PaneClip: React.FC<ClipProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const w = paneWalk(p, fps, width, height);
  const src = staticFile(`captures/${p.desktop.file}`);

  return (
    <AbsoluteFill style={{ backgroundColor: "#fff", overflow: "hidden" }}>
      <Img src={src} style={{ width, translate: `0px ${scrollAt(frame, w)}px` }} />
      {/* Back to the top for a seamless loop. */}
      <Img
        src={src}
        style={{
          position: "absolute",
          inset: 0,
          width,
          opacity: interpolate(frame, [durationInFrames - PANE_FADE, durationInFrames - 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
