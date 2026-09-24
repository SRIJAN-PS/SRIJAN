import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { SceneId } from "../config/narration";
import { COLOR, FONT, tween } from "../config/theme";
import { sceneById } from "../config/timing";
import { SAFE } from "../config/video";
import { Camera, driftKeys, type CameraKey } from "./Camera";
import { ActiveSourceLabel, ClaimBadge } from "./Labels";
import { DarkToLight } from "./Transitions";

// Documentary backdrop: near-black base, a soft pool of light that "switches
// on" as the scene opens, a faint measurement grid and film grain.
export const Backdrop: React.FC<{ lightX?: number; lightY?: number; grid?: boolean }> = ({
  lightX = 50,
  lightY = 42,
  grid = true,
}) => {
  const frame = useCurrentFrame();
  const light = tween(frame, [0, 45], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.bg }}>
      <AbsoluteFill
        style={{
          opacity: light,
          background: `radial-gradient(ellipse 70% 65% at ${lightX}% ${lightY}%, ${COLOR.bgLift} 0%, ${COLOR.bg} 60%, ${COLOR.bgDeep} 100%)`,
        }}
      />
      {grid ? (
        <AbsoluteFill
          style={{
            opacity: 0.35 * light,
            backgroundImage: `linear-gradient(${COLOR.line}40 1px, transparent 1px), linear-gradient(90deg, ${COLOR.line}40 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse 60% 55% at 50% 50%, black 0%, transparent 100%)",
          }}
        />
      ) : null}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.07 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const SceneHeader: React.FC<{ sceneId: SceneId }> = ({ sceneId }) => {
  const frame = useCurrentFrame();
  const scene = sceneById(sceneId);
  const show = tween(frame, [12, 36], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.x,
        top: SAFE.top,
        opacity: show,
        translate: `0px ${(1 - show) * 16}px`,
      }}
    >
      <div style={{ fontFamily: FONT.mono, fontSize: 24, letterSpacing: 4, color: COLOR.accent }}>
        {String(scene.number).padStart(2, "0")}
        <span style={{ color: COLOR.faint }}> / 09</span>
      </div>
      <div
        style={{
          marginTop: 6,
          fontFamily: FONT.sans,
          fontSize: 56,
          fontWeight: 700,
          letterSpacing: -1,
          color: COLOR.text,
        }}
      >
        {scene.title}
      </div>
    </div>
  );
};

// Standard wrapper for every scene: backdrop, virtual camera over the scene
// artwork, header, claim-type badge, automatic source label and the
// dark-to-light transition.
export const SceneShell: React.FC<{
  sceneId: SceneId;
  children: React.ReactNode;
  camera?: CameraKey[];
  header?: boolean;
  badge?: boolean;
  backdrop?: React.ReactNode;
  // Overlays rendered above the camera layer (not affected by camera moves).
  overlay?: React.ReactNode;
}> = ({ sceneId, children, camera, header = true, badge = true, backdrop, overlay }) => {
  const scene = sceneById(sceneId);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: COLOR.text, overflow: "hidden" }}>
      {backdrop ?? <Backdrop />}
      <Camera keys={camera ?? driftKeys(scene.durationInFrames)}>{children}</Camera>
      {overlay}
      {header ? <SceneHeader sceneId={sceneId} /> : null}
      <ClaimBadge sceneId={sceneId} hidden={!badge} />
      <ActiveSourceLabel sceneId={sceneId} />
      <DarkToLight durationInFrames={scene.durationInFrames} />
    </AbsoluteFill>
  );
};
