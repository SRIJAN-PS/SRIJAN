import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CockpitView, PFD, flightState, utc } from "../components/Cockpit";
import { BigCounter, Clock, Exterior } from "../components/Exterior";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { TitleText } from "../components/TitleText";
import { COLOR, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { Trends } from "../illustrations/Diagrams";
import { NightSky } from "../illustrations/Scenery";

// Scene 4 — The aircraft starts climbing: nose up, altitude up, airspeed down.
export const Climb: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("climb");
  // Model time runs 02:10:10 → 02:10:55 across the scene.
  const t = tween(frame, [0, c.duration], [10, 55], (x) => x);
  const s = flightState(t);
  const trendsFrom = c.at("important") - 6;
  const counterFrom = c.at("envelope") - 6;
  return (
    <SceneFrame sceneId="climb">
      <Shot from={0} to={trendsFrom} fadeIn={0} tag="data">
        <AbsoluteFill style={{ clipPath: "inset(0 50% 0 0)" }}>
          <Exterior x={330} y={560 - (s.alt - 35000) / 12} scale={0.75} pitch={s.pitch} cloudY={800 + (s.alt - 35000) / 8} />
        </AbsoluteFill>
        <AbsoluteFill style={{ left: 960, backgroundColor: "#03060b" }}>
          <div style={{ position: "absolute", left: 150, top: 180 }}>
            <PFD s={s} size={660} blink={frame % 16 < 8} />
          </div>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 958, top: 0, bottom: 0, width: 4, backgroundColor: "#1c2836" }} />
        <Clock text={utc(t)} top={100} size={40} />
      </Shot>
      <Shot from={trendsFrom} to={c.at("up") - 4} tag="data">
        <CockpitView frame={frame} crew={2} outside={<NightSky frame={frame} horizon={420} stars={50} />} />
        <AbsoluteFill style={{ backgroundColor: "rgba(2,4,8,0.55)" }} />
        <AbsoluteFill style={{ justifyContent: "center" }}>
          <Trends alt={s.alt} ias={s.ias} aoa={s.aoa} frame={frame} />
        </AbsoluteFill>
      </Shot>
      <Shot from={c.at("up") - 4} to={counterFrom} tag="reconstruction">
        <Exterior x={700} y={560} scale={1.1} pitch={s.pitch} cloudY={880} speed={tween(frame, [c.at("up"), counterFrom], [3, 1.2])} />
      </Shot>
      <Shot from={counterFrom} to={c.duration} tag="data">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #0c1a2c, #020408 75%)" }} />
        <BigCounter
          value={`${(Math.round(tween(frame, [counterFrom, c.at("then")], [35000, 38000]) / 100) * 100).toLocaleString("en-US")} ft`}
          label="ALTITUDE"
          color={frame > c.at("then") ? COLOR.amber : COLOR.text}
        />
        {frame >= c.at("warning") ? <AbsoluteFill style={{ backgroundColor: COLOR.red, opacity: 0.08 + 0.08 * Math.sin(frame / 3) }} /> : null}
      </Shot>
      <TitleText text="35,000 ft  →  37,000 ft  →  38,000 ft" at={counterFrom + 10} hold={c.duration - counterFrom - 30} size={40} top="68%" font="mono" color={COLOR.textDim} />
    </SceneFrame>
  );
};
