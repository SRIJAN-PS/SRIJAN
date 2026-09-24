import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { EvidenceCard } from "../components/EvidenceCard";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { Timeline } from "../components/Timeline";
import { COLOR, FONT, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { DataPlot, Recorder } from "../illustrations/Diagrams";

// Scene 9 — The black boxes reveal the sequence: the recorders read out,
// the parameters plotted, the chain of events the BEA reconstructed.
export const Investigation: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("blackBox");
  const labFrom = c.at("fdr") - 6;
  const chainFrom = c.at("chain") - 6;
  const reportFrom = c.at("report") - 6;
  return (
    <SceneFrame sceneId="blackBox">
      <Shot from={0} to={labFrom} fadeIn={0} tag="illustration">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #1a2230, #03060a 75%)", alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: `scale(${tween(frame, [0, labFrom], [1.3, 1.5])}) translateY(${Math.sin(frame / 30) * 4}px)` }}>
            <Recorder label="FLIGHT DATA RECORDER" />
          </div>
        </AbsoluteFill>
      </Shot>
      <Shot from={labFrom} to={chainFrom} tag="illustration">
        <AbsoluteFill style={{ backgroundColor: "#03060b" }} />
        <div style={{ position: "absolute", left: 120, top: 190 }}>
          <DataPlot progress={tween(frame, [labFrom, c.at("cvr")], [0, 1], (t) => t)} width={1020} height={520} />
        </div>
        <div style={{ position: "absolute", left: 1200, top: 190, width: 600, height: 520, border: "3px solid #1f2b3a", backgroundColor: "#03070d" }}>
          <div style={{ position: "absolute", left: 24, top: 18, fontFamily: FONT.mono, fontSize: 20, color: COLOR.textDim, letterSpacing: "0.14em" }}>CVR · AUDIO TRACKS</div>
          <svg width="600" height="520" viewBox="0 0 600 520">
            {[0, 1, 2, 3].map((tr) => (
              <g key={tr}>
                {new Array(110).fill(0).map((_, i) => {
                  const h = frame > c.at("cvr") ? 6 + random(`cvr-${tr}-${i}-${Math.floor(frame / 3)}`) * 40 : 3;
                  return <rect key={i} x={24 + i * 5} y={120 + tr * 100 - h / 2} width={3} height={h} fill={COLOR.cyan} opacity={0.7} />;
                })}
              </g>
            ))}
          </svg>
        </div>
        <div style={{ position: "absolute", left: 120, top: 740, fontFamily: FONT.mono, fontSize: 18, color: COLOR.textFaint, letterSpacing: "0.1em" }}>
          RECORDED PARAMETERS · NO COCKPIT WORDS ARE SHOWN
        </div>
      </Shot>
      <Shot from={chainFrom} to={reportFrom} tag="data">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, #0b1626, #020408 75%)" }} />
        <Timeline
          x={960}
          top={160}
          gap={100}
          width={980}
          steps={[
            { time: "02:10:05 UTC", label: "Pitot probes affected · ice crystals", at: c.at("c1"), tone: "warn" },
            { label: "Airspeed indications become unreliable", at: c.at("c1") + 40, tone: "warn" },
            { label: "Autopilot disconnects", at: c.at("c2"), tone: "danger" },
            { label: "Aircraft climbs · speed decreases", at: c.at("c3"), tone: "warn" },
            { label: "STALL WARNING", at: c.at("c4"), tone: "danger" },
            { time: "02:14:28 UTC", label: "Aircraft descends in the stall · impact", at: c.at("c5"), tone: "danger" },
          ]}
        />
      </Shot>
      <Shot from={reportFrom} to={c.duration} tag="illustration">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #111c2b, #020408 75%)" }} />
        <EvidenceCard title="BEA · FINAL REPORT" value="JULY 2012" note="Bureau d'Enquêtes et d'Analyses pour la sécurité de l'aviation civile" x={960} y={500} at={reportFrom + 10} width={900} />
      </Shot>
    </SceneFrame>
  );
};
