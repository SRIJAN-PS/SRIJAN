import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLOR, EASE } from "../config/theme";

// Dark-to-light scene transition: each scene rises out of black and sinks
// back into it, so consecutive scenes meet on a black frame.
export const DarkToLight: React.FC<{
  durationInFrames: number;
  inFrames?: number;
  outFrames?: number;
}> = ({ durationInFrames, inFrames = 24, outFrames = 18 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, inFrames, durationInFrames - outFrames, durationInFrames - 1],
    [1, 0, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut },
  );
  return <AbsoluteFill style={{ backgroundColor: COLOR.bgDeep, opacity, pointerEvents: "none" }} />;
};

// Crossfade helper for elements that hand over to each other inside a scene.
export const fadeWindow = (frame: number, start: number, end: number, fade = 15) =>
  interpolate(frame, [start, start + fade, end - fade, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
