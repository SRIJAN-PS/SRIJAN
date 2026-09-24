import { AbsoluteFill } from "remotion";
import { Palace } from "../illustrations/Palace";
import { Sky, type SkyMood } from "../illustrations/Sky";
import { Skyline } from "../illustrations/Skyline";
import { Dust, Haze } from "./Atmosphere";
import { Camera, Layer, type CameraMove } from "./Camera";

// Exterior of the Gaekwad palace against the sky, with the old city behind
// and haze in front. Children render in the foreground layer (figures,
// carriages) so they share the camera move.
export const PalaceScene: React.FC<{
  mood: SkyMood;
  camera: CameraMove;
  gate?: number;
  lit?: number;
  sun?: { x: number; y: number; r: number };
  children?: React.ReactNode;
}> = ({ mood, camera, gate = 0, lit = 0.45, sun, children }) => {
  const rim = mood === "dusk" || mood === "dawn" ? "#e3a15c" : "#b8894a";
  return (
    <AbsoluteFill>
      <Camera {...camera}>
        <Layer depth={0.15}>
          <Sky mood={mood} sun={sun} />
        </Layer>
        <Layer depth={0.35}>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <Skyline seed="palace-far" baseY={880} height={0.8} color="#120e0c" windows={mood === "night" || mood === "dusk" ? "#e8a95a" : undefined} />
          </svg>
        </Layer>
        <Layer depth={0.6}>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <Palace x={310} y={960} scale={1} gate={gate} lit={lit} rim={rim} />
            <rect x={0} y={958} width={1920} height={140} fill="#0b0807" />
          </svg>
        </Layer>
        <Haze opacity={0.18} seed={5} />
        <Layer depth={1}>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            {children}
          </svg>
        </Layer>
        <Dust count={40} seed="palace" opacity={0.3} />
      </Camera>
    </AbsoluteFill>
  );
};
