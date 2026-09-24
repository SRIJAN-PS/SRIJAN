import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { SceneId } from "../data/story";
import { COLOR, FONT, tween } from "../data/theme";
import { activeCue, sceneById } from "../data/timing";
import { SAFE } from "../data/video";
import { Grain, Vignette } from "./Atmosphere";
import { SceneFade } from "./CinematicTransition";
import { ActiveClaim } from "./SourceLabel";

// Shell for every scene: picture, then film texture, the scene heading,
// the claim badge and source label for the active narration line, and a
// fade from and to black.
export const SceneFrame: React.FC<{
  sceneId: SceneId;
  children: React.ReactNode;
  // Frame ranges (scene-relative) where the badge and source label are hidden.
  quiet?: [number, number][];
  heading?: boolean;
  fadeIn?: number;
  fadeOut?: number;
}> = ({ sceneId, children, quiet = [], heading = true, fadeIn = 18, fadeOut = 18 }) => {
  const frame = useCurrentFrame();
  const scene = sceneById(sceneId);
  const hide = quiet.some(([a, b]) => frame >= a && frame < b);
  const headingOpacity = Math.min(tween(frame, [12, 40], [0, 1]), tween(frame, [150, 190], [1, 0]));
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.black }}>
      {children}
      <Vignette strength={0.85} />
      <Grain opacity={0.08} />
      {heading && headingOpacity > 0 ? (
        <div style={{ position: "absolute", left: SAFE.x, top: SAFE.top + 4, opacity: headingOpacity, textShadow: "0 2px 12px #000" }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 19, letterSpacing: "0.3em", color: COLOR.brass }}>
            {String(scene.number).padStart(2, "0")} / 11
          </div>
          <div style={{ fontFamily: FONT.serif, fontSize: 44, fontWeight: 600, color: COLOR.text, marginTop: 4, letterSpacing: "0.02em" }}>{scene.title}</div>
        </div>
      ) : null}
      <ActiveClaim cue={activeCue(sceneId, frame)} hide={hide} />
      <SceneFade duration={scene.durationInFrames} fadeIn={fadeIn} fadeOut={fadeOut} />
    </AbsoluteFill>
  );
};
