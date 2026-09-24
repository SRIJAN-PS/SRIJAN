import { AbsoluteFill, useCurrentFrame } from "remotion";
import { A330Side } from "../components/Aircraft";
import { Camera } from "../components/Camera";
import { CockpitView, PFD, type FlightState } from "../components/Cockpit";
import { LowerThird } from "../components/LowerThird";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { TitleText } from "../components/TitleText";
import { COLOR, EASE, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { OceanSurface } from "../illustrations/Ocean";
import { NightSky, RioSkyline, Runway } from "../illustrations/Scenery";

const GROUND: FlightState = { alt: 30, ias: 0, shownIas: 0, speedFlag: false, pitch: 0, roll: 0, vs: 0, aoa: 0, ap: false, altn: false, stall: false };

// Scene 1 — The last flight: instruments come alive, take-off from Rio at
// night, the city falls away, the Atlantic ahead.
export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("opening");
  const roll = c.at("takeoff") - 10;
  const climbOut = c.at("people") - 10;
  const ocean = c.at("hours") - 10;
  const lift = tween(frame, [roll + 90, roll + 190], [0, 1], EASE.inOut);
  const wakeUp = tween(frame, [40, 110], [0, 1]);
  return (
    <SceneFrame sceneId="opening" heading={false} quiet={[[c.end("mystery"), c.duration]]}>
      {/* instruments come alive */}
      <Shot from={0} to={roll} fadeIn={40} tag="reconstruction">
        <Camera from={0} to={roll + 20} zoom={[1.0, 1.12]} origin={[50, 62]}>
          <CockpitView
            frame={frame}
            crew={3}
            outside={
              <AbsoluteFill>
                <NightSky frame={frame} horizon={330} glow="#1d2b44" />
                <div style={{ position: "absolute", inset: 0, transform: "translateY(-120px) scale(0.6)" }}>
                  <Runway frame={frame} />
                </div>
              </AbsoluteFill>
            }
          >
            <div style={{ position: "absolute", left: 300, top: 560, opacity: wakeUp }}>
              <PFD s={GROUND} size={260} blink={frame % 20 < 10} />
            </div>
            <div style={{ position: "absolute", left: 1490, top: 560, opacity: wakeUp }}>
              <PFD s={GROUND} size={260} blink={frame % 20 < 10} />
            </div>
          </CockpitView>
        </Camera>
      </Shot>
      {/* take-off */}
      <Shot from={roll} to={climbOut} tag="reconstruction">
        <NightSky frame={frame} horizon={600} glow="#1d2b44" />
        <Runway frame={frame} speed={tween(frame, [roll, roll + 90], [0.2, 3])} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <A330Side x={tween(frame, [roll, climbOut], [520, 820])} y={700 - lift * 330} scale={1.05} frame={frame} pitch={lift > 0 && lift < 1 ? 9 : lift >= 1 ? 7 : 0} gear={lift < 0.6} engineGlow={0.9} />
        </svg>
      </Shot>
      {/* Rio falls away */}
      <Shot from={climbOut} to={ocean} tag="reconstruction">
        <Camera from={climbOut} to={ocean + 20} zoom={[1.15, 1.0]} y={[0, 40]}>
          <NightSky frame={frame} horizon={700} glow="#162a44" />
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
            <RioSkyline frame={frame} y={tween(frame, [climbOut, ocean], [760, 880])} />
            <A330Side x={tween(frame, [climbOut, ocean], [700, 1340])} y={tween(frame, [climbOut, ocean], [420, 250])} scale={tween(frame, [climbOut, ocean], [0.55, 0.3])} frame={frame} pitch={6} engineGlow={0.4} />
          </svg>
        </Camera>
      </Shot>
      {/* out over the Atlantic */}
      <Shot from={ocean} to={c.duration} fadeOut={30} tag="reconstruction">
        <OceanSurface frame={frame} mood="night" horizon={640} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <A330Side x={tween(frame, [ocean, c.end("mystery")], [300, 1500], (t) => t)} y={330} scale={0.22} frame={frame} />
        </svg>
        <AbsoluteFill style={{ backgroundColor: "#000", opacity: tween(frame, [c.end("mystery") - 20, c.end("mystery") + 10], [0, 1]) }} />
      </Shot>
      <LowerThird label="31 MAY 2009" detail="रात · Rio de Janeiro" at={c.at("night")} hold={c.len("night") + 40} position="upper" />
      <LowerThird label="RIO DE JANEIRO → PARIS" detail="Airbus A330" at={c.at("takeoff") + 10} hold={c.end("flightNo") - c.at("takeoff")} />
      <TitleText text="FLIGHT AF447" at={c.at("flightNo") + 20} hold={c.len("flightNo") + 10} size={96} top="58%" spacing={0.2} />
      <LowerThird label="216 PASSENGERS · 12 CREW" detail="कुल 228 लोग" at={c.at("people") + 10} hold={c.end("total") - c.at("people") + 20} accent={COLOR.cyan} />
      <TitleText text="WHAT HAPPENED TO AF447?" at={c.end("mystery") + 20} size={84} spacing={0.14} />
    </SceneFrame>
  );
};
