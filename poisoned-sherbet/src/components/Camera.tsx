import { createContext, useContext } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE, tween } from "../data/theme";

// Slow camera moves over illustrations. <Camera> interpolates zoom and pan
// across a frame range; <Layer depth> inside it moves more or less than the
// camera, which gives the parallax between foreground and background.

type CameraState = { zoom: number; x: number; y: number };
const CameraContext = createContext<CameraState>({ zoom: 1, x: 0, y: 0 });

export type CameraMove = {
  from?: number;
  to: number;
  zoom?: [number, number];
  x?: [number, number];
  y?: [number, number];
  // Origin of the zoom, in % of the frame.
  origin?: [number, number];
};

export const Camera: React.FC<CameraMove & { children: React.ReactNode }> = ({
  from = 0,
  to,
  zoom = [1, 1.08],
  x = [0, 0],
  y = [0, 0],
  origin = [50, 50],
  children,
}) => {
  const frame = useCurrentFrame();
  const range = [from, Math.max(from + 1, to)];
  const state = {
    zoom: tween(frame, range, zoom, EASE.slow),
    x: tween(frame, range, x, EASE.slow),
    y: tween(frame, range, y, EASE.slow),
  };
  return (
    <CameraContext.Provider value={state}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <AbsoluteFill style={{ transformOrigin: `${origin[0]}% ${origin[1]}%`, transform: `scale(${state.zoom})` }}>{children}</AbsoluteFill>
      </AbsoluteFill>
    </CameraContext.Provider>
  );
};

// depth 1 moves with the camera pan, 0 stays still, >1 is foreground.
export const Layer: React.FC<{ depth?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ depth = 1, children, style }) => {
  const cam = useContext(CameraContext);
  const extraZoom = 1 + (cam.zoom - 1) * (depth - 1) * 0.6;
  return (
    <AbsoluteFill style={{ transform: `translate(${cam.x * depth}px, ${cam.y * depth}px) scale(${extraZoom})`, ...style }}>{children}</AbsoluteFill>
  );
};
