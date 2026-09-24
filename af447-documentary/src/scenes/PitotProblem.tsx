import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CockpitView, ECAM, PFD, flightState, utc } from "../components/Cockpit";
import { Clock, Exterior } from "../components/Exterior";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { Timeline } from "../components/Timeline";
import { tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { PitotDiagram } from "../illustrations/Diagrams";
import { NightSky } from "../illustrations/Scenery";

// Scene 3 — The first warning: ice crystals at FL350, the Pitot probes,
// unreliable airspeed, autopilot off, alternate law.
export const PitotProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("pitotProblem");
  // Clock runs from 02:08:00 to 02:10:05 across the opening lines.
  const clockT = tween(frame, [0, c.at("crystals")], [-120, 5], (t) => t);
  const pfdFrom = c.at("inconsistent") - 6;
  const modelT = tween(frame, [pfdFrom, c.duration], [4, 16], (t) => t);
  const s = flightState(modelT);
  return (
    <SceneFrame sceneId="pitotProblem">
      <Shot from={0} to={c.at("probes") + 40} fadeIn={0} tag="reconstruction">
        <Exterior x={620} y={500} scale={1.25} cloudY={760} crystals={tween(frame, [c.at("crystals"), c.at("crystals") + 40], [0, 1])} inCloud={0.45} lightning={0.4} />
      </Shot>
      {frame < c.at("probes") + 40 ? <Clock text={utc(clockT)} /> : null}
      <Shot from={c.at("probes") + 40} to={pfdFrom} tag="illustration">
        <PitotDiagram
          frame={frame}
          crystals={tween(frame, [c.at("probes") + 40, c.at("probes") + 70], [0, 1])}
          ice={tween(frame, [c.at("unreliable"), c.end("unreliable")], [0, 1])}
          showGauge={frame > c.at("what") + 20}
          gaugeWrong={tween(frame, [c.at("info"), c.at("info") + 30], [0, 1])}
        />
      </Shot>
      <Shot from={pfdFrom} to={c.at("manual") - 4} tag="data">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, #0b1626, #020408 75%)" }} />
        <div style={{ position: "absolute", left: 180, top: 170 }}>
          <PFD s={s} size={640} blink={frame % 16 < 8} />
        </div>
        <div style={{ position: "absolute", left: 900, top: 170, opacity: tween(frame, [c.at("autopilot"), c.at("autopilot") + 12], [0, 1]) }}>
          <ECAM
            width={620}
            lines={[
              { text: "AUTO FLT AP OFF", color: "red" },
              ...(frame >= c.at("law") ? [{ text: "AUTO FLT A/THR OFF", color: "amber" as const }, { text: "F/CTL ALTN LAW", color: "amber" as const }] : []),
            ]}
          />
        </div>
        <Clock text={utc(modelT)} top={84} size={40} />
      </Shot>
      <Shot from={c.at("manual") - 4} to={c.duration} tag="reconstruction">
        <CockpitView frame={frame} crew={2} outside={<NightSky frame={frame} horizon={380} stars={40} />}>
          <div style={{ position: "absolute", left: 300, top: 560 }}>
            <PFD s={s} size={260} blink={frame % 16 < 8} />
          </div>
          <div style={{ position: "absolute", left: 1490, top: 560 }}>
            <PFD s={s} size={260} blink={frame % 16 < 8} />
          </div>
        </CockpitView>
      </Shot>
      {frame >= c.at("inconsistent") && frame < c.at("manual") + 60 ? (
        <AbsoluteFill style={{ opacity: tween(frame, [c.at("manual"), c.at("manual") + 40], [1, 0]) }}>
          <Timeline
            x={1330}
            top={560}
            gap={104}
            width={760}
            steps={[
              { label: "PITOT PROBES", at: c.at("inconsistent"), tone: "warn" },
              { label: "INCORRECT AIRSPEED INFORMATION", at: c.at("inconsistent") + 30, tone: "warn" },
              { label: "AUTOMATIC SYSTEMS DISCONNECT", at: c.at("autopilot"), tone: "danger" },
            ]}
          />
        </AbsoluteFill>
      ) : null}
    </SceneFrame>
  );
};
