import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CockpitView, PFD, flightState, utc } from "../components/Cockpit";
import { Clock, Exterior } from "../components/Exterior";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { TitleText } from "../components/TitleText";
import { COLOR, FONT, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { WingDiagram } from "../illustrations/Diagrams";
import { OceanSurface } from "../illustrations/Ocean";
import { NightSky } from "../illustrations/Scenery";

// Scene 5 — The stall: the warning, what a stall is, the descent, the end.
export const Stall: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("stall");
  const wingFrom = c.at("notEngines") - 6;
  const pfdFrom = c.at("notRecognised") - 6;
  const fallFrom = c.at("minutes") - 6;
  const endFrom = c.at("andThen") - 6;
  // Model time 02:10:55 → 02:14:28 across the scene, until impact.
  const t = tween(frame, [0, c.at("impact")], [55, 268], (x) => x);
  const s = flightState(t);
  const warning = frame < endFrom;
  return (
    <SceneFrame sceneId="stall" quiet={[[c.end("impact"), c.duration]]} fadeOut={1}>
      <Shot from={0} to={wingFrom} fadeIn={0} tag="reconstruction">
        <CockpitView frame={frame} crew={2} alarm={1} outside={<NightSky frame={frame} horizon={500} stars={30} />}>
          <div style={{ position: "absolute", left: 300, top: 560 }}>
            <PFD s={s} size={260} blink={frame % 16 < 8} />
          </div>
          <div style={{ position: "absolute", left: 1490, top: 560 }}>
            <PFD s={s} size={260} blink={frame % 16 < 8} />
          </div>
        </CockpitView>
      </Shot>
      <Shot from={wingFrom} to={pfdFrom} tag="illustration">
        <WingDiagram frame={frame} aoa={tween(frame, [c.at("meaning"), c.end("aoa")], [4, 35])} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", fontFamily: FONT.mono, fontSize: 26, letterSpacing: "0.2em", color: COLOR.textDim }}>
          NORMAL AIRFLOW → HIGH ANGLE OF ATTACK → AIRFLOW SEPARATES → LIFT DECREASES → STALL
        </div>
      </Shot>
      <Shot from={pfdFrom} to={fallFrom} tag="data">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 50%, #0b1626, #020408 75%)" }} />
        <div style={{ position: "absolute", left: 640, top: 180 }}>
          <PFD s={s} size={640} blink={frame % 16 < 8} />
        </div>
        <Clock text={utc(t)} top={640} size={40} />
      </Shot>
      <Shot from={fallFrom} to={endFrom} tag="reconstruction">
        <Exterior x={720} y={420 + tween(frame, [fallFrom, endFrom], [0, 120])} scale={0.9} pitch={15} cloudY={tween(frame, [fallFrom, endFrom], [900, 180])} speed={0.6} sink={0} />
        <AbsoluteFill style={{ right: 120, left: "auto", width: 520 }}>
          <div style={{ position: "absolute", right: 0, top: 170, textAlign: "right", fontFamily: FONT.mono, textShadow: "0 2px 14px #000" }}>
            <div style={{ fontSize: 24, letterSpacing: "0.2em", color: COLOR.textDim }}>ALTITUDE</div>
            <div style={{ fontSize: 64, color: COLOR.amber }}>{`${(Math.round(s.alt / 100) * 100).toLocaleString("en-US")} ft`}</div>
            <div style={{ fontSize: 24, letterSpacing: "0.2em", color: COLOR.textDim, marginTop: 14 }}>VERTICAL SPEED</div>
            <div style={{ fontSize: 48, color: COLOR.red }}>{`${Math.round(s.vs / 100) * 100} ft/min`}</div>
          </div>
        </AbsoluteFill>
      </Shot>
      <Shot from={endFrom} to={c.end("impact")} fadeOut={0} tag="reconstruction">
        <OceanSurface frame={frame} mood="night" horizon={260} />
        <Clock text={utc(t)} top={140} size={48} />
      </Shot>
      {warning && frame > 20 ? (
        <div
          style={{
            position: "absolute",
            right: 140,
            top: 84,
            padding: "10px 22px",
            border: `3px solid ${COLOR.red}`,
            fontFamily: FONT.mono,
            fontSize: 34,
            letterSpacing: "0.2em",
            color: COLOR.red,
            backgroundColor: "rgba(20,2,4,0.7)",
            opacity: (0.55 + 0.45 * Math.sin(frame / 3)) * tween(frame, [endFrom - 30, endFrom], [1, 0]),
          }}
        >
          STALL WARNING
        </div>
      ) : null}
      {frame >= c.end("impact") ? <AbsoluteFill style={{ backgroundColor: "#000" }} /> : null}
      <TitleText text="228 PEOPLE LOST THEIR LIVES" at={c.end("impact") + 20} size={62} spacing={0.14} color={COLOR.text} />
    </SceneFrame>
  );
};
