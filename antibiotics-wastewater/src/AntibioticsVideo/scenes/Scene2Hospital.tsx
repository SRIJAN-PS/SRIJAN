import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { Antibiotic } from "../components/Antibiotic";
import { Backdrop } from "../components/Backdrop";
import { COLORS, fontFamily, tween } from "../theme";

const PIPE_START = 570;
const PIPE_END = 1310;
const PIPE_Y = 700;
const FLOW_START = 70;
const FLOW_SPEED = 5;

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  isDrug: random(`s2-drug-${i}`) < 0.4,
  dy: (random(`s2-dy-${i}`) - 0.5) * 26,
  rot: random(`s2-rot-${i}`) * 360,
}));

const Hospital: React.FC<{ frame: number }> = ({ frame }) => {
  const rise = tween(frame, [0, 30], [80, 0]);
  const opacity = tween(frame, [0, 25], [0, 1]);
  return (
    <g transform={`translate(170 ${330 + rise})`} opacity={opacity}>
      <rect x={130} y={0} width={140} height={90} rx={6} fill="#EEF3F7" />
      <rect x={185} y={18} width={30} height={54} rx={3} fill={COLORS.antibiotic} />
      <rect x={173} y={30} width={54} height={30} rx={3} fill={COLORS.antibiotic} />
      <rect x={0} y={80} width={400} height={320} rx={8} fill="#DCE6EE" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect
          key={i}
          x={30 + (i % 4) * 95}
          y={115 + Math.floor(i / 4) * 72}
          width={60}
          height={42}
          rx={4}
          fill="#7FB8D8"
        />
      ))}
      <rect x={165} y={330} width={70} height={70} rx={4} fill="#5C92B3" />
    </g>
  );
};

const TreatmentPlant: React.FC<{ frame: number }> = ({ frame }) => {
  const rise = tween(frame, [15, 45], [80, 0]);
  const opacity = tween(frame, [15, 40], [0, 1]);
  const armAngle = frame * 1.5;
  const tank = (cx: number, rx: number) => (
    <g>
      <rect x={cx - rx} y={200} width={rx * 2} height={70} fill="#8FA3B3" />
      <ellipse cx={cx} cy={270} rx={rx} ry={22} fill="#8FA3B3" />
      <ellipse cx={cx} cy={200} rx={rx} ry={22} fill="#A9BBC8" />
      <ellipse cx={cx} cy={200} rx={rx - 10} ry={16} fill={COLORS.water} opacity={0.85} />
      <line
        x1={cx}
        y1={200}
        x2={cx + Math.cos((armAngle * Math.PI) / 180) * (rx - 12)}
        y2={200 + Math.sin((armAngle * Math.PI) / 180) * 14}
        stroke="#EEF3F7"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </g>
  );
  return (
    <g transform={`translate(1290 ${430 + rise})`} opacity={opacity}>
      <rect x={20} y={130} width={130} height={170} rx={6} fill="#C9D6E0" />
      <rect x={20} y={118} width={130} height={20} rx={4} fill="#9FB2C1" />
      <rect x={45} y={170} width={32} height={32} rx={3} fill="#7FB8D8" />
      <rect x={95} y={170} width={32} height={32} rx={3} fill="#7FB8D8" />
      {tank(255, 85)}
      {tank(400, 62)}
    </g>
  );
};

export const Scene2Hospital: React.FC = () => {
  const frame = useCurrentFrame();
  const pipeLength = tween(frame, [30, 70], [0, PIPE_END - PIPE_START]);
  const callout = tween(frame, [110, 135], [0, 1]);

  return (
    <AbsoluteFill name="Scene 2 - Hospital" style={{ fontFamily }}>
      <Backdrop />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", top: 0, left: 0 }}>
        <rect x={0} y={730} width={1920} height={6} fill="#28465C" />
        <rect
          x={PIPE_START}
          y={PIPE_Y - 30}
          width={pipeLength}
          height={60}
          rx={10}
          fill="#1B3A50"
          stroke="#6F8799"
          strokeWidth={4}
        />
        {frame > FLOW_START
          ? PARTICLES.map((p, i) => {
              const x = PIPE_START + (frame - FLOW_START) * FLOW_SPEED - i * 28;
              if (x < PIPE_START + 10 || x > PIPE_END - 10) {
                return null;
              }
              return p.isDrug ? (
                <Antibiotic key={i} x={x} y={PIPE_Y + p.dy * 0.5} size={30} rotate={p.rot + frame * 3} />
              ) : (
                <circle key={i} cx={x} cy={PIPE_Y + p.dy} r={6} fill={COLORS.water} opacity={0.9} />
              );
            })
          : null}
        <Hospital frame={frame} />
        <TreatmentPlant frame={frame} />
        <g opacity={callout} transform={`translate(0 ${(1 - callout) * 20})`}>
          <line x1={940} y1={622} x2={940} y2={666} stroke={COLORS.antibiotic} strokeWidth={3} strokeDasharray="6 6" />
          <rect x={745} y={556} width={390} height={66} rx={33} fill="#0B2233" stroke={COLORS.antibiotic} strokeWidth={3} />
          <Antibiotic x={800} y={592} size={34} />
          <text x={840} y={601} fill={COLORS.text} fontSize={30} fontWeight={600}>
            Antibiotic residues
          </text>
        </g>
        <text x={370} y={800} textAnchor="middle" fill={COLORS.text} fontSize={38} fontWeight={600} opacity={tween(frame, [20, 40], [0, 1])}>
          Hospital
        </text>
        <text x={1525} y={800} textAnchor="middle" fill={COLORS.text} fontSize={38} fontWeight={600} opacity={tween(frame, [35, 55], [0, 1])}>
          Treatment plant
        </text>
      </svg>
      <Interactive.Div
        name="Kicker"
        style={{
          position: "absolute",
          left: 140,
          top: 96,
          fontSize: 34,
          fontWeight: 600,
          letterSpacing: 6,
          color: COLORS.water,
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        01 · THE SOURCE
      </Interactive.Div>
      <Interactive.Div
        name="Heading"
        style={{
          position: "absolute",
          left: 140,
          top: 140,
          fontSize: 84,
          fontWeight: 700,
          color: COLORS.text,
          opacity: interpolate(frame, [5, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [5, 30], ["0px 30px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        From hospital to treatment plant
      </Interactive.Div>
      <Interactive.Div
        name="Caption"
        style={{
          position: "absolute",
          left: 140,
          right: 140,
          bottom: 90,
          fontSize: 50,
          lineHeight: 1.35,
          color: COLORS.text,
          opacity: interpolate(frame, [140, 165], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Patients can excrete up to{" "}
        <span style={{ color: COLORS.antibiotic, fontWeight: 700 }}>90%</span> of
        some antibiotic doses unchanged, straight into hospital drains.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
