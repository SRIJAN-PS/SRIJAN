import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE, tween } from "../data/theme";

// Transitions used between shots and scenes.
//   fadeBlack  – dip to black and back
//   cut        – hard cut to black for `len` frames (the cold open's "music cuts")
//   flash      – brief warm light-leak flash
//   iris       – vignette closes to black (suspense)
export const CinematicTransition: React.FC<{ type: "fadeBlack" | "cut" | "flash" | "iris"; at: number; len?: number }> = ({ type, at, len = 30 }) => {
  const frame = useCurrentFrame();
  if (frame < at - len || frame > at + len) {
    return null;
  }
  if (type === "cut") {
    return frame >= at && frame < at + len ? <AbsoluteFill style={{ backgroundColor: "#000" }} /> : null;
  }
  if (type === "flash") {
    const o = tween(frame, [at - 4, at, at + len], [0, 0.85, 0], EASE.out);
    return <AbsoluteFill style={{ background: "radial-gradient(circle at 60% 45%, rgba(255,214,150,1), rgba(255,170,90,0.4) 45%, transparent 75%)", opacity: o, mixBlendMode: "screen" }} />;
  }
  if (type === "iris") {
    const p = tween(frame, [at - len, at], [0, 1], EASE.inOut);
    const r = 110 - p * 110;
    return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, transparent ${Math.max(0, r - 25)}%, #000 ${r}%)` }} />;
  }
  const o = tween(frame, [at - len, at, at + len], [0, 1, 0], EASE.inOut);
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity: o }} />;
};

// Fades a whole scene in from black and out to black.
export const SceneFade: React.FC<{ duration: number; fadeIn?: number; fadeOut?: number }> = ({ duration, fadeIn = 18, fadeOut = 18 }) => {
  const frame = useCurrentFrame();
  const o = Math.max(tween(frame, [0, fadeIn], [1, 0]), tween(frame, [duration - fadeOut, duration], [0, 1]));
  return o > 0 ? <AbsoluteFill style={{ backgroundColor: "#000", opacity: o, pointerEvents: "none" }} /> : null;
};
