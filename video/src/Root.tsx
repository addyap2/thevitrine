import { CalculateMetadataFunction, Composition } from "remotion";
import { PANE_FADE, PaneClip, paneWalk } from "./PaneClip";
import { END_CARD, ReelClip, reelBody } from "./ReelClip";
import { ClipProps } from "./shared";

// Studio preview uses the sample capture; render.mjs passes real props.
const sample: ClipProps = {
  slug: "ristorante-lola",
  title: "Ristorante da Lola",
  category: "Restaurants & bars",
  host: "ristorantedalola.it",
  desktop: { file: "ristorante-lola-desktop.jpg", width: 1280, height: 6400 },
  mobile: { file: "ristorante-lola-mobile.jpg", width: 390, height: 7200 },
};

const FPS = 30;

const paneMeta: CalculateMetadataFunction<ClipProps> = ({ props }) => ({
  durationInFrames: paneWalk(props, FPS, 1280, 800).end + Math.round(0.6 * FPS) + PANE_FADE,
});

const reelMeta: CalculateMetadataFunction<ClipProps> = ({ props }) => ({
  durationInFrames: reelBody(props, FPS) + END_CARD,
});

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="PaneClip" component={PaneClip} fps={FPS} width={1280} height={800} durationInFrames={300} defaultProps={sample} calculateMetadata={paneMeta} />
    <Composition id="ReelClip" component={ReelClip} fps={FPS} width={1080} height={1920} durationInFrames={450} defaultProps={sample} calculateMetadata={reelMeta} />
  </>
);
