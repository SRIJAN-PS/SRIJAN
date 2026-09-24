import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EvidenceCard } from "../components/EvidenceCard";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { TitleText } from "../components/TitleText";
import { COLOR, EASE, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { CalendarPage, Recorder } from "../illustrations/Diagrams";
import { ROV, Seabed, Ship, SonarImage, Underwater } from "../illustrations/Ocean";

// Scene 8 — Two years of questions: 2009, 2010, 2011; the sonar find on
// 3 April 2011; the wreckage; the recorders recovered.
export const BlackBox: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("twoYears");
  const aprilFrom = c.at("april") - 6;
  const wreckFrom = c.at("wreckage") - 10;
  const recFrom = c.at("recovered") - 6;
  const years = ["2009", "2010", "2011"];
  const yearIdx = Math.min(2, Math.floor(tween(frame, [10, aprilFrom - 20], [0, 2.99], (t) => t)));
  return (
    <SceneFrame sceneId="twoYears">
      <Shot from={0} to={aprilFrom} fadeIn={0} tag="illustration">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #0e2236, #020408 80%)" }} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <Ship x={1550} y={880} scale={0.6} frame={frame} />
        </svg>
        <div style={{ position: "absolute", right: 120, top: 180, transform: "scale(0.4)", transformOrigin: "right top", opacity: 0.7 }}>
          <SonarImage progress={tween(frame, [0, aprilFrom], [0.1, 1])} target={false} />
        </div>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1600 }}>
          {years.map((y, i) => (
            <div
              key={y}
              style={{
                position: "absolute",
                transformOrigin: "50% 0%",
                transform: `translateX(-240px) rotateX(${i < yearIdx ? 90 : 0}deg)`,
                opacity: i < yearIdx ? 0 : 1,
                zIndex: 10 - i,
              }}
            >
              <CalendarPage year={y} />
            </div>
          ))}
        </AbsoluteFill>
      </Shot>
      <Shot from={aprilFrom} to={wreckFrom} tag="illustration">
        <AbsoluteFill style={{ backgroundColor: "#050403" }} />
        <div style={{ position: "absolute", left: 120, top: 250 }}>
          <CalendarPage year="2011" month="APRIL" day="3" />
        </div>
        <div style={{ position: "absolute", left: 640, top: 190, transform: "scale(0.82)", transformOrigin: "left top" }}>
          <SonarImage progress={tween(frame, [aprilFrom, aprilFrom + 70], [0.1, 1])} />
        </div>
      </Shot>
      <Shot from={wreckFrom} to={recFrom} tag="reconstruction">
        <Seabed frame={frame} reveal={tween(frame, [wreckFrom + 20, recFrom - 20], [0, 1], EASE.out)} recorder={0} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <ROV x={960} y={tween(frame, [wreckFrom, recFrom], [140, 420])} scale={0.7} frame={frame} />
        </svg>
      </Shot>
      <Shot from={recFrom} to={c.duration} tag="illustration">
        <Underwater frame={frame} depth={0.9} light={0.3} />
        <div style={{ position: "absolute", left: 300, top: 300, opacity: tween(frame, [recFrom, recFrom + 20], [0, 1]) }}>
          <Recorder label="FLIGHT DATA RECORDER" />
        </div>
        <div style={{ position: "absolute", left: 1100, top: 300, opacity: tween(frame, [recFrom + 50, recFrom + 70], [0, 1]) }}>
          <Recorder label="COCKPIT VOICE RECORDER" />
        </div>
        <EvidenceCard title="FDR RECOVERED" value="1 MAY 2011" x={560} y={760} at={recFrom + 20} width={420} />
        <EvidenceCard title="CVR RECOVERED" value="2 MAY 2011" x={1360} y={760} at={recFrom + 70} width={420} />
      </Shot>
      <TitleText text="THE BLACK BOXES WERE FOUND" at={c.end("recovered") + 6} size={56} spacing={0.14} top="18%" color={COLOR.amber} />
    </SceneFrame>
  );
};
