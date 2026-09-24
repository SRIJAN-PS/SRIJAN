import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../config/theme";

export type CameraKey = { frame: number; scale: number; x?: number; y?: number };

// Smooth virtual camera over a full-frame layer. Keys are interpolated with
// an ease-in-out curve; x/y are pixel offsets of the view.
export const Camera: React.FC<{ keys: CameraKey[]; children: React.ReactNode }> = ({ keys, children }) => {
  const frame = useCurrentFrame();
  const frames = keys.map((k) => k.frame);
  const opts = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut } as const;
  const scale = keys.length > 1 ? interpolate(frame, frames, keys.map((k) => k.scale), opts) : keys[0].scale;
  const x = keys.length > 1 ? interpolate(frame, frames, keys.map((k) => k.x ?? 0), opts) : (keys[0].x ?? 0);
  const y = keys.length > 1 ? interpolate(frame, frames, keys.map((k) => k.y ?? 0), opts) : (keys[0].y ?? 0);
  return (
    <AbsoluteFill style={{ scale: String(scale), translate: `${-x}px ${-y}px`, transformOrigin: "50% 50%" }}>
      {children}
    </AbsoluteFill>
  );
};

// Default slow push-in used by most scenes.
export const driftKeys = (durationInFrames: number, amount = 0.035): CameraKey[] => [
  { frame: 0, scale: 1 },
  { frame: durationInFrames, scale: 1 + amount },
];
