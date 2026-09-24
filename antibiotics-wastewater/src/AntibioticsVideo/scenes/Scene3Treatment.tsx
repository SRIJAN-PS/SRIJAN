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

const CHANNEL = { x: 140, y: 500, w: 1640, h: 200 };
const RIVER_X = 1540;
const SPEED = 6;
const GRATE_X = 420;

type Kind = "drug" | "debris" | "organic";

const PARTICLES = Array.from({ length: 46 }, (_, i) => {
  const r = random(`s3-kind-${i}`);
  const kind: Kind = r < 0.4 ? "drug" : r < 0.7 ? "debris" : "organic";
  return {
    kind,
    t0: 10 + i * 6,
    y0: CHANNEL.y + 25 + random(`s3-y-${i}`) * (CHANNEL.h - 50),
    rot: random(`s3-rot-${i}`) * 360,
    stopJitter: random(`s3-stop-${i}`) * 40,
  };
});

const BUBBLES = Array.from({ length: 16 }, (_, i) => ({
  x: 690 + random(`s3-bx-${i}`) * 360,
  offset: random(`s3-bo-${i}`) * 200,
  r: 4 + random(`s3-br-${i}`) * 5,
}));

const STAGES = [
  { x: 300, w: 240, label: "Screening", result: "Solids removed", ok: true, at: 60 },
  { x: 660, w: 420, label: "Biological treatment", result: "Organics digested", ok: true, at: 110 },
  { x: 1200, w: 260, label: "Clarifier", result: "Sludge settles", ok: true, at: 150 },
  { x: RIVER_X, w: 240, label: "River", result: "Drugs remain", ok: false, at: 200 },
];

const ResultBadge: React.FC<{ cx: number; ok: boolean; label: string; opacity: number }> = ({
  cx,
  ok,
  label,
  opacity,
}) => {
  const color = ok ? COLORS.good : COLORS.antibiotic;
  const width = label.length * 17 + 56;
  const left = cx - width / 2;
  return (
    <g opacity={opacity}>
      <circle cx={left + 16} cy={770} r={16} fill={color} />
      {ok ? (
        <path d={`M${left + 8} 770 l6 6 l11 -12`} stroke="#0B2233" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d={`M${left + 10} 764 l12 12 M${left + 22} 764 l-12 12`} stroke="#0B2233" strokeWidth={4} strokeLinecap="round" />
      )}
      <text x={left + 44} y={781} fill={color} fontSize={30} fontWeight={600}>
        {label}
      </text>
    </g>
  );
};

export const Scene3Treatment: React.FC = () => {
  const frame = useCurrentFrame();
  const sludge = tween(frame, [60, 290], [0, 40], Easing.linear);

  return (
    <AbsoluteFill name="Scene 3 - Conventional treatment" style={{ fontFamily }}>
      <Backdrop />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <linearGradient id="s3-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={COLORS.water} stopOpacity={0.45} />
            <stop offset="1" stopColor="#1C5D80" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <rect x={CHANNEL.x} y={CHANNEL.y} width={CHANNEL.w} height={CHANNEL.h} rx={16} fill="url(#s3-water)" />
        {[0.3, 0.6, 0.85].map((f, i) => (
          <line
            key={i}
            x1={CHANNEL.x + 10}
            x2={CHANNEL.x + CHANNEL.w - 10}
            y1={CHANNEL.y + CHANNEL.h * f}
            y2={CHANNEL.y + CHANNEL.h * f}
            stroke="#ffffff"
            strokeOpacity={0.12}
            strokeWidth={3}
            strokeDasharray="30 50"
            strokeDashoffset={-frame * 6 - i * 25}
          />
        ))}
        {STAGES.map((s, i) => (
          <g key={i} opacity={tween(frame, [10 + i * 8, 35 + i * 8], [0, 1])}>
            <rect
              x={s.x}
              y={CHANNEL.y - 30}
              width={s.w}
              height={CHANNEL.h + 60}
              rx={14}
              fill="none"
              stroke={s.ok ? "#9DB4C7" : COLORS.water}
              strokeWidth={3}
              strokeDasharray={s.ok ? undefined : "10 8"}
            />
            <text x={s.x + s.w / 2} y={CHANNEL.y - 48} textAnchor="middle" fill={COLORS.text} fontSize={34} fontWeight={600}>
              {s.label}
            </text>
          </g>
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={GRATE_X + i * 16} y={CHANNEL.y - 20} width={6} height={CHANNEL.h + 40} rx={3} fill="#B8C7D3" />
        ))}
        {BUBBLES.map((b, i) => {
          const y = CHANNEL.y + CHANNEL.h - ((frame * 2.5 + b.offset) % CHANNEL.h);
          return <circle key={i} cx={b.x} cy={y} r={b.r} fill="none" stroke="#ffffff" strokeOpacity={0.5} strokeWidth={2} />;
        })}
        <rect x={1215} y={CHANNEL.y + CHANNEL.h - sludge} width={230} height={sludge} rx={6} fill="#7A5C3A" opacity={0.85} />
        {PARTICLES.map((p, i) => {
          if (frame < p.t0) {
            return null;
          }
          const x = CHANNEL.x + (frame - p.t0) * SPEED;
          if (p.kind === "debris") {
            const stopX = GRATE_X - 20 - p.stopJitter;
            const tStop = p.t0 + (stopX - CHANNEL.x) / SPEED;
            const dt = frame - tStop;
            const cx = Math.min(x, stopX);
            const cy = dt > 0 ? tween(dt, [0, 25], [p.y0, CHANNEL.y + CHANNEL.h - 14]) : p.y0;
            const op = dt > 0 ? tween(dt, [40, 70], [1, 0]) : 1;
            return (
              <polygon
                key={i}
                points="-12,-6 -2,-13 11,-8 13,6 1,12 -11,8"
                transform={`translate(${cx} ${cy}) rotate(${p.rot})`}
                fill="#A07A4E"
                opacity={op}
              />
            );
          }
          if (p.kind === "organic") {
            const s = tween(x, [720, 1020], [1, 0], Easing.linear);
            if (s <= 0) {
              return null;
            }
            return <circle key={i} cx={x} cy={p.y0} r={12 * s} fill="#8FBF5A" opacity={0.9} />;
          }
          const riverX = x > RIVER_X ? RIVER_X + (x - RIVER_X) * 0.35 : x;
          const wobble = x > RIVER_X ? Math.sin(frame * 0.08 + i) * 10 : 0;
          return <Antibiotic key={i} x={riverX} y={p.y0 + wobble} size={34} rotate={p.rot + frame * 2} />;
        })}
        {STAGES.map((s, i) => (
          <ResultBadge
            key={i}
            cx={s.x + s.w / 2}
            ok={s.ok}
            label={s.result}
            opacity={tween(frame, [s.at, s.at + 20], [0, 1])}
          />
        ))}
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
        02 · CONVENTIONAL TREATMENT
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
        Designed for waste, not drugs
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
          opacity: interpolate(frame, [160, 185], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Plants remove solids and organic matter, but many{" "}
        <span style={{ color: COLORS.antibiotic, fontWeight: 700 }}>antibiotics pass straight through</span>{" "}
        into rivers.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
