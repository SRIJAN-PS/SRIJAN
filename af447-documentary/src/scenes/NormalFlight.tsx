import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CockpitView, PFD, WeatherRadar, flightState } from "../components/Cockpit";
import { Exterior } from "../components/Exterior";
import { FlightMap, PLACES } from "../components/FlightMap";
import { LowerThird } from "../components/LowerThird";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { Clouds, NightSky } from "../illustrations/Scenery";

// Scene 2 — A normal flight: the route, cruise at FL350, the weather ahead,
// a small deviation.
export const NormalFlight: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("normalFlight");
  const cruise = flightState(0);
  const wxFrom = c.at("weather") - 6;
  return (
    <SceneFrame sceneId="normalFlight">
      <Shot from={0} to={c.at("a330") - 4} fadeIn={0} tag="illustration">
        <FlightMap
          keys={[
            { at: 0, center: [-22, 12], zoom: 1 },
            { at: c.at("route") + 60, center: [-28, 0], zoom: 1.6 },
          ]}
          route={{ from: 10, to: c.at("a330"), progress: [0, 0.36] }}
          markers={[
            { place: PLACES.rio, label: "RIO DE JANEIRO", at: 5, side: "left" },
            { place: PLACES.paris, label: "PARIS", at: 20 },
          ]}
        />
      </Shot>
      <Shot from={c.at("a330") - 4} to={c.at("sea") - 4} tag="reconstruction">
        <Exterior x={560} y={500} scale={1.2} cloudY={820} />
      </Shot>
      <LowerThird label="AIRBUS A330-203 · F-GZCP" detail="long-haul · twin-engine" at={c.at("a330") + 10} hold={c.len("a330") + 10} />
      <LowerThird label="FL350" detail="लगभग 35,000 feet" at={c.at("altitude")} hold={c.len("altitude") + 40} />
      <Shot from={c.at("sea") - 4} to={wxFrom} tag="reconstruction">
        <CockpitView
          frame={frame}
          crew={3}
          outside={
            <AbsoluteFill>
              <NightSky frame={frame} horizon={380} />
            </AbsoluteFill>
          }
        >
          <div style={{ position: "absolute", left: 300, top: 560 }}>
            <PFD s={cruise} size={260} blink />
          </div>
          <div style={{ position: "absolute", left: 1490, top: 560 }}>
            <PFD s={cruise} size={260} blink />
          </div>
        </CockpitView>
      </Shot>
      <Shot from={wxFrom} to={c.at("until") - 4} tag="reconstruction">
        <AbsoluteFill style={{ backgroundColor: "#020408" }}>
          <NightSky frame={frame} horizon={500} />
          <Clouds frame={frame} y={560} seed="wx" color="#16233a" speed={1} scale={2.2} lightning={1} />
        </AbsoluteFill>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: "scale(1.15)" }}>
            <WeatherRadar frame={frame} turn={tween(frame, [c.at("deviate") + 20, c.end("deviate")], [0, 12])} intensity={tween(frame, [wxFrom, wxFrom + 40], [0.2, 1])} />
          </div>
        </AbsoluteFill>
      </Shot>
      <LowerThird label="WEATHER RADAR" detail="convective weather ahead" at={c.at("weather") + 10} hold={c.end("deviate") - c.at("weather")} />
      <Shot from={c.at("until") - 4} to={c.duration} tag="reconstruction">
        <Exterior x={760} y={470} scale={0.9} cloudY={640} lightning={0.8} inCloud={tween(frame, [c.at("until"), c.duration], [0, 0.7])} />
      </Shot>
    </SceneFrame>
  );
};
