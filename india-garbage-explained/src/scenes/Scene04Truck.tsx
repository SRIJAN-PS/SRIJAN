import { Factory, House, Layers, MapPin, Mountain, Recycle, Truck, Users, type LucideIcon } from "lucide-react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { StatBar } from "../components/Cards";
import { Arrow, FlowNode, link, type Point } from "../components/Flow";
import { SceneShell } from "../components/SceneShell";
import type { SceneId } from "../config/narration";
import { COLOR, EASE, FONT, tween } from "../config/theme";
import { cuesOf } from "../config/timing";
import { IndiaCityMap } from "../illustrations/IndiaCityMap";
import { GarbageTruck } from "../illustrations/Street";

const ID: SceneId = "truck";

type Step = { icon: LucideIcon; label: string; sublabel?: string; color: string; at: (c: ReturnType<typeof cuesOf>) => number };

// Serpentine layout: row 1 left→right, elbow down on the right, row 2 right→left.
const ROW1 = 380;
const ROW2 = 650;
const POS: Point[] = [
  [240, ROW1],
  [620, ROW1],
  [1000, ROW1],
  [1380, ROW1],
  [1380, ROW2],
  [1000, ROW2],
  [620, ROW2],
];

const STEPS: Step[] = [
  { icon: House, label: "House", color: COLOR.muted, at: (c) => c.beat("route", 0, 4) },
  { icon: Users, label: "Collection", color: COLOR.dry, at: (c) => c.beat("route", 1, 4) },
  { icon: Truck, label: "Transport", color: COLOR.dry, at: (c) => c.beat("route", 2, 4) },
  { icon: Factory, label: "Sorting / processing", color: COLOR.accent, at: (c) => c.beat("route", 3, 4) },
  { icon: Recycle, label: "Recycling / composting / recovery", color: COLOR.recovery, at: (c) => c.at("recover") },
  { icon: Layers, label: "Residual waste", sublabel: "what can't be processed", color: COLOR.muted, at: (c) => c.at("residual") },
  { icon: Mountain, label: "Disposal", color: COLOR.hazardous, at: (c) => c.beat("residual", 1, 2) },
];

export const Scene04Truck: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf(ID);

  // Phase 1: a truck moves waste from A to B.
  const intro = tween(frame, [10, 30, c.at("route") - 14, c.at("route") + 4], [0, 1, 1, 0]);
  const drive = tween(frame, [c.at("moves"), c.end("moves") + 10], [0, 1], EASE.inOut);
  const truckX = 520 + drive * 1000;
  const question = tween(frame, [c.at("question"), c.at("question") + 16], [0, 1]);

  // Phase 2: the full chain; dims when the statistics come in.
  const chain = tween(frame, [c.at("route") - 6, c.at("route") + 12], [0, 1]);
  const statsIn = tween(frame, [c.at("gap"), c.at("gap") + 18], [0, 1]);
  const chainDim = 1 - statsIn;

  const elbow: Point[] = [
    [1380 + 58, ROW1],
    [1580, ROW1],
    [1580, ROW2],
    [1380 + 58, ROW2],
  ];

  return (
    <SceneShell sceneId={ID}>
      <AbsoluteFill style={{ opacity: intro }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <line x1={320} y1={640} x2={1600} y2={640} stroke={COLOR.line} strokeWidth={6} strokeLinecap="round" />
          <line x1={320} y1={640} x2={1600} y2={640} stroke={COLOR.faint} strokeWidth={2} strokeDasharray="18 18" strokeDashoffset={-frame * 3} />
          <circle cx={1600} cy={520} r={70 + question * 20} fill="none" stroke={COLOR.accent} strokeWidth={4} opacity={question * (0.6 + Math.sin(frame * 0.2) * 0.4)} />
          <GarbageTruck x={truckX} y={640} wheel={frame * 6 * (drive > 0 && drive < 1 ? 1 : 0)} scale={0.7} flip />
        </svg>
        <Pin x={320} label="Your street" color={COLOR.muted} />
        <Pin x={1600} label="Somewhere else" color={COLOR.accent} />
        <div
          style={{
            position: "absolute",
            left: 1520,
            top: 470,
            width: 160,
            textAlign: "center",
            fontSize: 80,
            fontWeight: 800,
            color: COLOR.accent,
            opacity: question,
          }}
        >
          ?
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: chain * chainDim }}>
        {STEPS.map((s, i) => (
          <FlowNode
            key={s.label}
            x={POS[i][0]}
            y={POS[i][1]}
            icon={s.icon}
            label={s.label}
            sublabel={s.sublabel}
            color={s.color}
            appear={s.at(c)}
            labelWidth={280}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <Arrow key={i} points={link(POS[i], POS[i + 1], 62)} start={STEPS[i + 1].at(c) - 10} duration={12} />
        ))}
        <Arrow points={elbow} start={STEPS[4].at(c) - 14} duration={16} />
        {[4, 5].map((i) => (
          <Arrow key={i} points={link(POS[i], POS[i + 1], 62)} start={STEPS[i + 1].at(c) - 10} duration={12} />
        ))}
        {/* Truck token travelling along the first row */}
        <div
          style={{
            position: "absolute",
            left: tween(frame, [c.beat("route", 1, 4), c.beat("route", 3, 4) + 10], [240, 1380], EASE.inOut) - 22,
            top: ROW1 - 110,
            opacity: tween(frame, [c.beat("route", 1, 4), c.beat("route", 1, 4) + 8, c.end("route"), c.end("route") + 10], [0, 1, 1, 0]),
          }}
        >
          <Truck size={44} color={COLOR.dry} strokeWidth={1.8} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: statsIn }}>
        <IndiaCityMap cx={1520} cy={540} height={440} appear={c.at("gap")} opacity={0.35} caption={false} />
        <div
          style={{
            position: "absolute",
            left: 160,
            top: 300,
            width: 1100,
            padding: "36px 40px",
            borderRadius: 20,
            backgroundColor: "rgba(17, 26, 35, 0.9)",
            border: `1px solid ${COLOR.line}`,
          }}
        >
          <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: 3, color: COLOR.muted }}>
            INDIA · SHARE OF MUNICIPAL SOLID WASTE GENERATED
          </div>
          <div style={{ position: "relative", height: 330 }}>
            <StatBar statId="collectedShare" title="Collected" x={0} y={40} width={1020} appear={c.at("shares")} color={COLOR.dry} />
            <StatBar statId="treatedShare" title="Treated or processed" x={0} y={190} width={1020} appear={c.beat("shares", 1, 2)} color={COLOR.recovery} />
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Pin: React.FC<{ x: number; label: string; color: string }> = ({ x, label, color }) => (
  <div style={{ position: "absolute", left: x - 150, top: 560, width: 300, textAlign: "center" }}>
    <MapPin size={56} color={color} strokeWidth={1.8} />
    <div style={{ marginTop: 70, fontSize: 32, fontWeight: 600, color: COLOR.text }}>{label}</div>
  </div>
);
