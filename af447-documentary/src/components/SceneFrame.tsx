import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SOURCE, type SceneId } from "../data/af447";
import { COLOR, FONT, tween } from "../data/theme";
import { activeCue, sceneById } from "../data/timing";
import { SAFE } from "../data/video";
import { Grain, Vignette } from "./Atmosphere";
import { SceneFade } from "./CinematicTransition";

// Shell for every scene: picture, film texture, the scene heading, the BEA
// source label while a BEA finding is narrated, and fades from/to black.
export const SceneFrame: React.FC<{
  sceneId: SceneId;
  children: React.ReactNode;
  heading?: boolean;
  quiet?: [number, number][];
  fadeIn?: number;
  fadeOut?: number;
}> = ({ sceneId, children, heading = true, quiet = [], fadeIn = 18, fadeOut = 18 }) => {
  const frame = useCurrentFrame();
  const scene = sceneById(sceneId);
  const cue = activeCue(sceneId, frame);
  const hide = quiet.some(([a, b]) => frame >= a && frame < b);
  const headingOpacity = Math.min(tween(frame, [10, 36], [0, 1]), tween(frame, [140, 175], [1, 0]));
  const sourceOpacity = cue?.bea && !hide ? tween(frame, [cue.from, cue.from + 12], [0, 0.9]) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.black }}>
      {children}
      <Vignette strength={0.8} />
      <Grain opacity={0.06} />
      {heading && headingOpacity > 0 ? (
        <div style={{ position: "absolute", left: SAFE.x, top: SAFE.top, opacity: headingOpacity, textShadow: "0 2px 12px #000" }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 18, letterSpacing: "0.3em", color: COLOR.amber }}>{String(scene.number).padStart(2, "0")} / 12</div>
          <div style={{ fontFamily: FONT.serif, fontSize: 44, fontWeight: 600, color: COLOR.text, marginTop: 2 }}>{scene.title}</div>
        </div>
      ) : null}
      {sourceOpacity > 0 ? (
        <div
          style={{
            position: "absolute",
            left: SAFE.x,
            bottom: SAFE.subtitleBottom + 112,
            fontFamily: FONT.mono,
            fontSize: 16,
            letterSpacing: "0.1em",
            color: COLOR.textDim,
            opacity: sourceOpacity,
            textShadow: "0 1px 10px rgba(0,0,0,0.95)",
          }}
        >
          <span style={{ color: COLOR.amber, letterSpacing: "0.2em", marginRight: 12 }}>SOURCE</span>
          {SOURCE.short}
        </div>
      ) : null}
      <SceneFade duration={scene.durationInFrames} fadeIn={fadeIn} fadeOut={fadeOut} />
    </AbsoluteFill>
  );
};
