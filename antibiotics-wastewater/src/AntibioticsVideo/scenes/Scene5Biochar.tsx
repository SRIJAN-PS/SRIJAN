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

const CX = 900;
const CY = 600;
const R = 200;

const radiusAt = (theta: number) =>
  R * (1 + 0.08 * Math.sin(3 * theta) + 0.05 * Math.sin(7 * theta + 1));

const OUTLINE = Array.from({ length: 64 }, (_, i) => {
  const t = (i / 64) * Math.PI * 2;
  const r = radiusAt(t);
  return `${(CX + Math.cos(t) * r).toFixed(1)},${(CY + Math.sin(t) * r).toFixed(1)}`;
}).join(" ");

// Scatter pores inside the particle, skipping candidates that would overlap.
const PORES = Array.from({ length: 60 }, (_, i) => {
  const t = random(`s5-pt-${i}`) * Math.PI * 2;
  const d = Math.sqrt(random(`s5-pd-${i}`)) * 0.72 * R;
  return { x: CX + Math.cos(t) * d, y: CY + Math.sin(t) * d, r: 8 + random(`s5-pr-${i}`) * 16 };
})
  .reduce<{ x: number; y: number; r: number }[]>(
    (kept, p) =>
      kept.every((q) => Math.hypot(p.x - q.x, p.y - q.y) > p.r + q.r + 10) ? [...kept, p] : kept,
    [],
  )
  .slice(0, 18);

const SITES = Array.from({ length: 11 }, (_, i) => {
  const t = (i / 11) * Math.PI * 2 + 0.3;
  const r = radiusAt(t);
  return {
    toX: CX + Math.cos(t) * r * 0.9,
    toY: CY + Math.sin(t) * r * 0.9,
    fromX: CX + Math.cos(t) * (r + (Math.cos(t) > 0 ? 130 : 60) + random(`s5-f-${i}`) * 50),
    fromY: CY + Math.sin(t) * (r * 0.9 + 30 + random(`s5-f2-${i}`) * 20),
    start: 105 + i * 9,
    rot: random(`s5-r-${i}`) * 360,
  };
});

const STEPS = [
  { y: 390, title: "Biomass", sub: "crop waste, wood", at: 15 },
  { y: 560, title: "Pyrolysis", sub: "300–700 °C, little O₂", at: 35 },
  { y: 730, title: "Biochar", sub: "porous carbon", at: 55 },
];

const StepIcon: React.FC<{ index: number; x: number; y: number }> = ({ index, x, y }) => {
  if (index === 0) {
    return (
      <g transform={`translate(${x} ${y})`}>
        <path d="M-30 25 C-30 -20 0 -35 32 -32 C32 5 10 30 -30 25 Z" fill={COLORS.good} />
        <path d="M-30 25 L18 -18" stroke="#0B2233" strokeWidth={4} strokeLinecap="round" />
      </g>
    );
  }
  if (index === 1) {
    return (
      <g transform={`translate(${x} ${y})`}>
        <path d="M0 -36 C18 -14 30 0 24 18 C18 34 -18 34 -24 18 C-30 0 -12 -8 0 -36 Z" fill="#FF8A3D" />
        <path d="M0 -6 C8 6 12 12 8 20 C4 28 -8 28 -10 20 C-12 12 -4 8 0 -6 Z" fill={COLORS.light} />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon points="-30,-8 -12,-30 18,-26 32,0 20,26 -14,30 -32,12" fill="#1A1A1D" stroke="#6A6A72" strokeWidth={3} />
      <circle cx={-6} cy={-4} r={6} fill="#000" />
      <circle cx={12} cy={10} r={5} fill="#000" />
    </g>
  );
};

export const Scene5Biochar: React.FC = () => {
  const frame = useCurrentFrame();
  const particleScale = tween(frame, [70, 100], [0.6, 1], Easing.spring({ damping: 14 }));
  const particleOpacity = tween(frame, [70, 85], [0, 1]);

  return (
    <AbsoluteFill name="Scene 5 - Biochar" style={{ fontFamily }}>
      <Backdrop />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <radialGradient id="s5-char" cx="0.4" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#4A4A52" />
            <stop offset="1" stopColor="#18181B" />
          </radialGradient>
        </defs>
        {STEPS.map((s, i) => (
          <g key={i} opacity={tween(frame, [s.at, s.at + 20], [0, 1])}>
            <StepIcon index={i} x={190} y={s.y} />
            <text x={250} y={s.y - 4} fill={COLORS.text} fontSize={36} fontWeight={600}>
              {s.title}
            </text>
            <text x={250} y={s.y + 36} fill={COLORS.muted} fontSize={28}>
              {s.sub}
            </text>
            {i < STEPS.length - 1 ? (
              <path
                d={`M190 ${s.y + 50} L190 ${s.y + 115} M180 ${s.y + 103} L190 ${s.y + 115} L200 ${s.y + 103}`}
                stroke={COLORS.muted}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                opacity={tween(frame, [s.at + 15, s.at + 30], [0, 1])}
              />
            ) : null}
          </g>
        ))}
        <path
          d="M560 740 C610 740 640 720 675 700"
          stroke={COLORS.muted}
          strokeWidth={3}
          strokeDasharray="8 8"
          fill="none"
          opacity={tween(frame, [65, 85], [0, 0.8])}
        />
        <g
          opacity={particleOpacity}
          transform={`translate(${CX} ${CY}) scale(${particleScale}) translate(${-CX} ${-CY})`}
        >
          <polygon points={OUTLINE} fill="url(#s5-char)" stroke="#6A6A72" strokeWidth={4} />
          {PORES.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#070708" stroke="#55555C" strokeWidth={2} />
          ))}
        </g>
        {SITES.map((s, i) => {
          const t = frame - s.start;
          const x = tween(t, [0, 40], [s.fromX, s.toX], Easing.bezier(0.45, 0, 0.2, 1));
          const y = tween(t, [0, 40], [s.fromY, s.toY], Easing.bezier(0.45, 0, 0.2, 1)) + (t < 40 ? Math.sin(frame * 0.12 + i) * 8 : 0);
          const glow = tween(t, [38, 45, 70], [0, 1, 0]);
          return (
            <g key={i} opacity={tween(frame, [85, 105], [0, 1])}>
              <circle cx={s.toX} cy={s.toY} r={34} fill={COLORS.antibiotic} opacity={glow * 0.35} />
              <Antibiotic x={x} y={y} size={36} rotate={s.rot + (t < 40 ? frame * 2 : 0)} />
            </g>
          );
        })}
      </svg>
      {[
        { label: "Huge surface area", at: 150 },
        { label: "Pore filling", at: 175 },
        { label: "π–π stacking, H-bonds", at: 200 },
      ].map((chip) => (
        <div
          key={chip.label}
          style={{
            position: "absolute",
            left: 1340,
            top: 420 + (chip.at - 150) * 4,
            padding: "14px 28px",
            borderRadius: 40,
            border: `3px solid ${COLORS.antibiotic}`,
            backgroundColor: "rgba(11, 34, 51, 0.85)",
            fontSize: 30,
            fontWeight: 600,
            color: COLORS.text,
            opacity: interpolate(frame, [chip.at, chip.at + 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [chip.at, chip.at + 15], ["30px 0px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {chip.label}
        </div>
      ))}
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
        04 · SOLUTION: ADSORPTION
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
        Biochar: a porous carbon sponge
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
          opacity: interpolate(frame, [120, 145], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Its pores and surface groups{" "}
        <span style={{ color: COLORS.antibiotic, fontWeight: 700 }}>trap antibiotic molecules</span>{" "}
        on its surface: adsorption.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
