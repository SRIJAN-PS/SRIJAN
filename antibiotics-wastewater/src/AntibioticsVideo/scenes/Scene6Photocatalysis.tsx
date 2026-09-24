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

// g-C3N4 sheet drawn as a parallelogram in perspective.
const A = { x: 230, y: 690 };
const B = { x: 830, y: 690 };
const C = { x: 930, y: 610 };
const D = { x: 330, y: 610 };
const SUN = { x: 240, y: 360 };

const HEXES = Array.from({ length: 27 }, (_, i) => {
  const u = 0.07 + (i % 9) * 0.108;
  const v = 0.2 + Math.floor(i / 9) * 0.3;
  return {
    x: A.x + u * (B.x - A.x) + v * (D.x - A.x),
    y: A.y + u * (B.y - A.y) + v * (D.y - A.y),
  };
});
const HEX_POINTS = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 3) * i;
  return `${(Math.cos(a) * 18).toFixed(1)},${(Math.sin(a) * 8).toFixed(1)}`;
}).join(" ");

const MOLECULES = Array.from({ length: 5 }, (_, k) => ({
  x: 560 + k * 85,
  y: 490 + (k % 2) * 50,
  rot: random(`s6-r-${k}`) * 360,
  breakAt: 190 + k * 9,
  radical: k % 2 === 0 ? "•OH" : "•O₂⁻",
}));

const FRAGMENTS = Array.from({ length: 5 }, (_, i) => {
  const a = (i / 5) * Math.PI * 2 + 0.4;
  return { dx: Math.cos(a) * 60, dy: Math.sin(a) * 60 - 20 };
});

const wavePath = (x1: number, y1: number, x2: number, y2: number, from: number, to: number) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const pts: string[] = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const s = from + ((to - from) * i) / steps;
    const off = Math.sin(s * 0.12) * 10;
    const px = x1 + ux * s - uy * off;
    const py = y1 + uy * s + ux * off;
    pts.push(`${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  return { d: pts.join(" "), len };
};

const Photon: React.FC<{ frame: number; target: { x: number; y: number }; delay: number }> = ({
  frame,
  target,
  delay,
}) => {
  const t = frame - delay;
  if (t < 0) {
    return null;
  }
  const { len } = wavePath(SUN.x, SUN.y, target.x, target.y, 0, 1);
  const head = ((t % 45) / 45) * (len + 120);
  const from = Math.max(0, head - 120);
  const to = Math.min(len, head);
  if (to <= from) {
    return null;
  }
  const { d } = wavePath(SUN.x, SUN.y, target.x, target.y, from, to);
  return <path d={d} stroke={COLORS.light} strokeWidth={4} fill="none" strokeLinecap="round" />;
};

const Charge: React.FC<{ x: number; y: number; label: string; filled: boolean; opacity: number }> = ({
  x,
  y,
  label,
  filled,
  opacity,
}) => (
  <g opacity={opacity}>
    <circle cx={x} cy={y} r={20} fill={filled ? "#7CC8FF" : "#0B2233"} stroke={filled ? "#7CC8FF" : "#ffffff"} strokeWidth={3} />
    <text x={x} y={y + 8} textAnchor="middle" fontSize={22} fontWeight={700} fill={filled ? "#0B2233" : "#ffffff"}>
      {label}
    </text>
  </g>
);

export const Scene6Photocatalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const sheetIn = tween(frame, [15, 40], [0, 1]);
  const lit = tween(frame, [60, 90], [0, 1]);
  const sheetFace = `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`;

  return (
    <AbsoluteFill name="Scene 6 - Photocatalysis" style={{ fontFamily }}>
      <Backdrop />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", top: 0, left: 0 }}>
        <g opacity={tween(frame, [20, 40], [0, 1])}>
          <circle cx={SUN.x} cy={SUN.y} r={70} fill={COLORS.light} opacity={0.15 + Math.sin(frame * 0.15) * 0.05} />
          <circle cx={SUN.x} cy={SUN.y} r={45} fill={COLORS.light} />
          <text x={SUN.x + 70} y={SUN.y - 30} fill={COLORS.light} fontSize={30} fontWeight={600}>
            Visible light
          </text>
        </g>
        {[0, 1, 2, 3].map((p) => (
          <Photon key={p} frame={frame} delay={40 + p * 11} target={{ x: 360 + p * 70, y: 660 - p * 8 }} />
        ))}
        <g opacity={sheetIn} transform={`translate(0 ${(1 - sheetIn) * 40})`}>
          {[48, 24].map((off) => (
            <g key={off} transform={`translate(0 ${off})`}>
              <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${B.x},${B.y + 16} ${A.x},${A.y + 16}`} fill="#B8912E" />
              <polygon points={`${B.x},${B.y} ${C.x},${C.y} ${C.x},${C.y + 16} ${B.x},${B.y + 16}`} fill="#8F6F20" />
            </g>
          ))}
          <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${B.x},${B.y + 16} ${A.x},${A.y + 16}`} fill="#D4A93A" />
          <polygon points={`${B.x},${B.y} ${C.x},${C.y} ${C.x},${C.y + 16} ${B.x},${B.y + 16}`} fill="#A9852A" />
          <polygon points={sheetFace} fill={COLORS.gcn} />
          <polygon points={sheetFace} fill="#FFF6C8" opacity={lit * (0.25 + Math.sin(frame * 0.2) * 0.1)} />
          {HEXES.map((h, i) => (
            <polygon key={i} points={HEX_POINTS} transform={`translate(${h.x} ${h.y})`} fill="none" stroke="#9C7A1E" strokeWidth={2.5} />
          ))}
        </g>
        <text x={580} y={810} textAnchor="middle" fill={COLORS.gcn} fontSize={32} fontWeight={600} opacity={sheetIn}>
          g-C<tspan fontSize={22} dy={8}>3</tspan>
          <tspan dy={-8}>N</tspan>
          <tspan fontSize={22} dy={8}>4</tspan>
          <tspan dy={-8}> nanosheets</tspan>
        </text>
        {MOLECULES.map((m, k) => {
          const radicalT = frame - (m.breakAt - 22);
          const breakT = frame - m.breakAt;
          const bob = Math.sin(frame * 0.1 + k) * 8;
          const surfaceY = 650 - k * 4;
          return (
            <g key={k} opacity={tween(frame, [30, 50], [0, 1])}>
              {radicalT >= 0 && breakT < 12 ? (
                <g opacity={tween(breakT, [0, 12], [1, 0])}>
                  <circle cx={m.x} cy={tween(radicalT, [0, 22], [surfaceY, m.y + bob + 26], Easing.linear)} r={9} fill={COLORS.radical} />
                  <text x={m.x + 16} y={tween(radicalT, [0, 22], [surfaceY, m.y + bob + 26], Easing.linear) + 8} fill={COLORS.radical} fontSize={24} fontWeight={700}>
                    {m.radical}
                  </text>
                </g>
              ) : null}
              <Antibiotic x={m.x} y={m.y + bob} size={42} rotate={m.rot + frame} opacity={tween(breakT, [0, 8], [1, 0])} />
              {breakT >= 0
                ? FRAGMENTS.map((f, i) => (
                    <circle
                      key={i}
                      cx={m.x + f.dx * tween(breakT, [0, 30], [0, 1])}
                      cy={m.y + bob + f.dy * tween(breakT, [0, 30], [0, 1])}
                      r={5}
                      fill={COLORS.antibiotic}
                      opacity={tween(breakT, [0, 30], [1, 0])}
                    />
                  ))
                : null}
            </g>
          );
        })}
        <text
          x={720}
          y={tween(frame, [215, 255], [470, 420])}
          textAnchor="middle"
          fill={COLORS.text}
          fontSize={34}
          fontWeight={600}
          opacity={tween(frame, [215, 230], [0, 1])}
        >
          → CO₂ + H₂O
        </text>
        <g opacity={tween(frame, [40, 65], [0, 1])}>
          <rect x={1080} y={320} width={700} height={480} rx={24} fill="#0B2233" stroke="#28465C" strokeWidth={3} />
          <text x={1110} y={366} fill={COLORS.muted} fontSize={28} fontWeight={500}>
            Inside the catalyst
          </text>
          <rect x={1220} y={440} width={340} height={36} rx={8} fill={COLORS.water} opacity={0.85} />
          <rect x={1220} y={670} width={340} height={36} rx={8} fill={COLORS.gcn} opacity={0.9} />
          <text x={1165} y={469} fill={COLORS.text} fontSize={30} fontWeight={700}>CB</text>
          <text x={1165} y={699} fill={COLORS.text} fontSize={30} fontWeight={700}>VB</text>
          <path d="M1610 484 L1610 662 M1600 496 L1610 484 L1620 496 M1600 650 L1610 662 L1620 650" stroke={COLORS.muted} strokeWidth={3} fill="none" strokeLinecap="round" />
          <text x={1635} y={570} fill={COLORS.text} fontSize={34} fontWeight={700}>2.7 eV</text>
          <text x={1635} y={606} fill={COLORS.muted} fontSize={26}>band gap</text>
        </g>
        <path
          d={wavePath(1110, 590, 1318, 676, 0, tween(frame, [70, 95], [1, 224], Easing.linear)).d}
          stroke={COLORS.light}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          opacity={tween(frame, [70, 72, 95, 105], [0, 1, 1, 0])}
        />
        <path
          d={wavePath(1250, 590, 1438, 676, 0, tween(frame, [85, 110], [1, 207], Easing.linear)).d}
          stroke={COLORS.light}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          opacity={tween(frame, [85, 87, 110, 120], [0, 1, 1, 0])}
        />
        {[
          { x: 1330, at: 95 },
          { x: 1450, at: 110 },
        ].map((c) => (
          <g key={c.x}>
            <Charge x={c.x} y={688} label="h⁺" filled={false} opacity={tween(frame, [c.at, c.at + 5], [0, 1])} />
            <Charge
              x={c.x}
              y={tween(frame, [c.at, c.at + 30], [688, 458], Easing.bezier(0.33, 1, 0.68, 1))}
              label="e⁻"
              filled
              opacity={tween(frame, [c.at - 30, c.at - 20], [0, 1])}
            />
          </g>
        ))}
        <text x={1220} y={420} fill={COLORS.radical} fontSize={30} fontWeight={600} opacity={tween(frame, [140, 155], [0, 1])}>
          e⁻ + O₂ → •O₂⁻
        </text>
        <text x={1220} y={760} fill={COLORS.radical} fontSize={30} fontWeight={600} opacity={tween(frame, [155, 170], [0, 1])}>
          h⁺ + H₂O → •OH
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
        05 · SOLUTION: PHOTOCATALYSIS
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
        g-C<sub>3</sub>N<sub>4</sub>: powered by visible light
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
          opacity: interpolate(frame, [130, 155], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Light-excited electrons and holes form{" "}
        <span style={{ color: COLORS.radical, fontWeight: 700 }}>reactive radicals</span> that break
        antibiotics down into CO<sub>2</sub> and water.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
