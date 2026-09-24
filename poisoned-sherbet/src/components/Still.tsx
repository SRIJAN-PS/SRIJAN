import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { EASE, tween } from "../data/theme";

// A photographic still with a slow Ken Burns move. `focus` is the point the
// camera drifts toward (in % of the image), `zoom` the start and end scale.
export const Still: React.FC<{
  src: string;
  from?: number;
  to: number;
  zoom?: [number, number];
  focus?: [number, number];
  pan?: [number, number, number, number];
  filter?: string;
}> = ({ src, from = 0, to, zoom = [1.05, 1.15], focus = [50, 50], pan = [0, 0, 0, 0], filter }) => {
  const frame = useCurrentFrame();
  const range = [from, Math.max(from + 1, to)];
  const s = tween(frame, range, zoom, EASE.slow);
  const x = tween(frame, range, [pan[0], pan[2]], EASE.slow);
  const y = tween(frame, range, [pan[1], pan[3]], EASE.slow);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: `${focus[0]}% ${focus[1]}%`,
          transform: `translate(${x}px, ${y}px) scale(${s})`,
          filter,
        }}
      />
    </AbsoluteFill>
  );
};
