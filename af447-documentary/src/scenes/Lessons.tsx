import { AbsoluteFill, useCurrentFrame } from "remotion";
import { A330Side } from "../components/Aircraft";
import { CockpitView, PFD, flightState } from "../components/Cockpit";
import { EvidenceCard } from "../components/EvidenceCard";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { COLOR, FONT, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { Clouds } from "../illustrations/Scenery";

// A full-flight simulator on its motion platform (illustrative).
const Simulator: React.FC<{ frame: number }> = ({ frame }) => {
  const tilt = Math.sin(frame / 40) * 3;
  const lift = Math.sin(frame / 55) * 10;
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <rect width="1920" height="1080" fill="#0b1018" />
      <rect x={0} y={860} width={1920} height={220} fill="#141b26" />
      {[[760, 880, 820, 640], [1160, 880, 1100, 640], [900, 900, 960, 660], [1020, 900, 960, 660], [700, 870, 880, 650], [1220, 870, 1040, 650]].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2 + lift} stroke="#6c7c8e" strokeWidth={14} strokeLinecap="round" />
      ))}
      <g transform={`translate(960 ${440 + lift}) rotate(${tilt})`}>
        <path d="M-300,-220 L260,-220 Q320,-220 330,-160 L340,160 L-300,200 Z" fill="#dfe6ee" />
        <rect x={-300} y={180} width={640} height={40} fill="#9aa8b8" />
        <rect x={-220} y={-160} width={120} height={90} rx={10} fill="#1a2433" />
        <text x={0} y={60} textAnchor="middle" fill="#3a4a5c" fontFamily={FONT.mono} fontSize={30}>
          FULL FLIGHT SIMULATOR
        </text>
      </g>
    </svg>
  );
};

// Scene 11 — What changed after AF447: training, simulators, Pitot probes.
export const Lessons: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("lessons");
  const trainFrom = c.at("training") - 6;
  const probeFrom = c.at("probes") - 6;
  const skyFrom = c.at("case") - 6;
  return (
    <SceneFrame sceneId="lessons">
      <Shot from={0} to={trainFrom} fadeIn={0} tag="illustration">
        <Simulator frame={frame} />
      </Shot>
      <Shot from={trainFrom} to={probeFrom} tag="illustration">
        <CockpitView frame={frame} crew={2} outside={<AbsoluteFill style={{ background: "linear-gradient(#1b2d4a, #6a86a8)" }} />}>
          <div style={{ position: "absolute", left: 300, top: 560 }}>
            <PFD s={flightState(20)} size={260} blink={frame % 16 < 8} />
          </div>
          <div style={{ position: "absolute", left: 1490, top: 560 }}>
            <PFD s={flightState(20)} size={260} blink={frame % 16 < 8} />
          </div>
        </CockpitView>
        <div style={{ position: "absolute", left: 120, top: 170, padding: "10px 20px", border: `2px solid ${COLOR.cyan}`, fontFamily: FONT.mono, fontSize: 26, letterSpacing: "0.16em", color: COLOR.cyan, backgroundColor: "rgba(2,6,12,0.7)" }}>
          SIMULATOR TRAINING · UNRELIABLE AIRSPEED · STALL RECOVERY
        </div>
        <EvidenceCard
          title="BEA"
          note="Post-accident training में unreliable airspeed, high-altitude flight in alternate law और stall scenarios को शामिल करने का उल्लेख है।"
          x={1340}
          y={430}
          at={c.at("simulator")}
          width={760}
          accent={COLOR.cyan}
        />
      </Shot>
      <Shot from={probeFrom} to={skyFrom} tag="illustration">
        <AbsoluteFill style={{ backgroundColor: "#040912" }} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {[
            { x: 560, label: "THALES AA", sub: "replaced", color: COLOR.red, o: tween(frame, [probeFrom, probeFrom + 60], [1, 0.35]) },
            { x: 1360, label: "GOODRICH", sub: "A330/A340 fleet", color: COLOR.green, o: tween(frame, [probeFrom + 40, probeFrom + 70], [0, 1]) },
          ].map((p) => (
            <g key={p.label} opacity={p.o}>
              <path d={`M${p.x + 200},510 L${p.x - 160},510 Q${p.x - 190},510 ${p.x - 200},522 L${p.x - 216},540 L${p.x - 200},558 Q${p.x - 190},570 ${p.x - 160},570 L${p.x + 200},570 Z`} fill="#8795a8" stroke="#c7d2e0" strokeWidth={2} />
              <rect x={p.x + 200} y={460} width={40} height={160} fill="#2a3444" />
              <text x={p.x} y={660} textAnchor="middle" fill={p.color} fontFamily={FONT.mono} fontSize={34}>
                {p.label}
              </text>
              <text x={p.x} y={700} textAnchor="middle" fill={COLOR.textDim} fontFamily={FONT.mono} fontSize={22}>
                {p.sub}
              </text>
            </g>
          ))}
          <text x={960} y={546} textAnchor="middle" fill={COLOR.textDim} fontSize={60}>
            →
          </text>
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center", fontFamily: FONT.mono, fontSize: 28, letterSpacing: "0.2em", color: COLOR.textDim }}>
          PITOT PROBE REPLACEMENT
        </div>
      </Shot>
      <Shot from={skyFrom} to={c.duration} tag="illustration">
        <AbsoluteFill style={{ background: "linear-gradient(#0f1f3a 0%, #3a5a86 45%, #e3a064 78%, #f3c98a 100%)" }} />
        <Clouds frame={frame} y={860} seed="dawn-deck" color="#c9b7a8" speed={0.8} scale={1.8} opacity={0.85} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <A330Side x={tween(frame, [skyFrom, c.duration], [420, 820], (t) => t)} y={500} scale={1.0} frame={frame} night={false} />
        </svg>
        <Clouds frame={frame} y={1000} seed="dawn-near" color="#e8d6c6" speed={1.6} scale={2} opacity={0.9} />
      </Shot>
    </SceneFrame>
  );
};
