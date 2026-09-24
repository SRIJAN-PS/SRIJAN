import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  interpolateColors,
  random,
  useCurrentFrame,
} from "remotion";
import { Antibiotic } from "../components/Antibiotic";
import { Backdrop } from "../components/Backdrop";
import { COLORS, fontFamily, tween } from "../theme";

const GEL = { x: 620, y: 390, w: 640, h: 400 };
const SUN = { x: 1340, y: 420 };
const CAPTURE_START = 45;
const DEGRADE_START = 150;
const REUSE_START = 230;

const inGel = (key: string, inset: number) => ({
  x: GEL.x + inset + random(`${key}-x`) * (GEL.w - inset * 2),
  y: GEL.y + inset + random(`${key}-y`) * (GEL.h - inset * 2),
});

const MESH_NODES = Array.from({ length: 30 }, (_, i) => inGel(`s7-mesh-${i}`, 30));
const MESH_EDGES = MESH_NODES.flatMap((n, i) =>
  MESH_NODES.map((m, j) => ({ j, d: Math.hypot(n.x - m.x, n.y - m.y) }))
    .filter((e) => e.j !== i)
    .sort((a, b) => a.d - b.d)
    .slice(0, 2)
    .map((e) => [i, e.j] as const),
);

const CHAR_SITES = Array.from({ length: 8 }, (_, i) => ({
  x: GEL.x + 110 + (i % 4) * 140 + (random(`s7-cx-${i}`) - 0.5) * 30,
  y: GEL.y + 115 + Math.floor(i / 4) * 170 + (random(`s7-cy-${i}`) - 0.5) * 30,
  rot: random(`s7-cr-${i}`) * 360,
}));

const FLAKES = Array.from({ length: 10 }, (_, i) => ({
  ...inGel(`s7-flake-${i}`, 50),
  rot: random(`s7-fr-${i}`) * 60,
}));

const MOLECULES = Array.from({ length: 16 }, (_, k) => {
  const site = CHAR_SITES[k % 8];
  const a = (k < 8 ? -0.8 : 2.3) + random(`s7-ma-${k}`) * 0.6;
  return {
    fromX: 170 + random(`s7-mx-${k}`) * 340,
    fromY: 460 + random(`s7-my-${k}`) * 300,
    toX: site.x + Math.cos(a) * 42,
    toY: site.y + Math.sin(a) * 42,
    capture: CAPTURE_START + k * 5,
    degrade: DEGRADE_START + k * 5,
    rot: random(`s7-mr-${k}`) * 360,
  };
});

const DROPS = Array.from({ length: 24 }, (_, i) => ({
  y: 480 + random(`s7-dy-${i}`) * 260,
  delay: 120 + i * 7,
}));

export const Scene7Hydrogel: React.FC = () => {
  const frame = useCurrentFrame();
  const lit = tween(frame, [DEGRADE_START - 25, DEGRADE_START], [0, 1]);
  const captured =
    MOLECULES.reduce((sum, m) => sum + tween(frame - m.capture, [0, 35], [0, 1]), 0) / MOLECULES.length;
  const meterHeight = 340 * (1 - captured);
  const reusePulse = frame > REUSE_START ? (Math.sin((frame - REUSE_START) * 0.2) + 1) / 2 : 0;

  return (
    <AbsoluteFill name="Scene 7 - Hydrogel" style={{ fontFamily }}>
      <Backdrop />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", top: 0, left: 0 }}>
        <text x={345} y={430} textAnchor="middle" fill={COLORS.muted} fontSize={30} fontWeight={600} opacity={tween(frame, [15, 35], [0, 1])}>
          Contaminated water
        </text>
        <g opacity={tween(frame, [10, 35], [0, 1])} transform={`translate(0 ${tween(frame, [10, 35], [30, 0])})`}>
          <rect
            x={GEL.x}
            y={GEL.y}
            width={GEL.w}
            height={GEL.h}
            rx={70}
            fill={COLORS.gel}
            fillOpacity={0.14}
            stroke={COLORS.gel}
            strokeOpacity={0.6 + reusePulse * 0.4}
            strokeWidth={4 + reusePulse * 4}
          />
          {MESH_EDGES.map(([i, j], k) => (
            <line
              key={k}
              x1={MESH_NODES[i].x}
              y1={MESH_NODES[i].y}
              x2={MESH_NODES[j].x}
              y2={MESH_NODES[j].y}
              stroke={COLORS.gel}
              strokeOpacity={0.3}
              strokeWidth={2}
            />
          ))}
          {FLAKES.map((f, i) => (
            <g key={i} opacity={tween(frame, [25 + i * 2, 40 + i * 2], [0, 1])}>
              <circle cx={f.x} cy={f.y} r={30} fill={COLORS.light} opacity={lit * (0.3 + Math.sin(frame * 0.25 + i) * 0.15)} />
              <polygon
                points="-16,0 -8,-13 8,-13 16,0 8,13 -8,13"
                transform={`translate(${f.x} ${f.y}) rotate(${f.rot})`}
                fill={COLORS.gcn}
                stroke="#9C7A1E"
                strokeWidth={2}
              />
            </g>
          ))}
          {CHAR_SITES.map((c, i) => (
            <polygon
              key={i}
              points="-26,-8 -12,-26 14,-24 28,-2 18,22 -10,26 -28,10"
              transform={`translate(${c.x} ${c.y}) rotate(${c.rot})`}
              fill="#1E1E22"
              stroke="#6A6A72"
              strokeWidth={3}
              opacity={tween(frame, [20 + i * 2, 35 + i * 2], [0, 1])}
            />
          ))}
        </g>
        <g opacity={lit}>
          <circle cx={SUN.x} cy={SUN.y} r={52} fill={COLORS.light} opacity={0.2} />
          <circle cx={SUN.x} cy={SUN.y} r={32} fill={COLORS.light} />
          {[0, 1, 2, 3, 4].map((i) => {
            const a = Math.PI * (0.66 + i * 0.08);
            const phase = ((frame + i * 7) % 36) / 36;
            const r1 = 50 + phase * 260;
            return (
              <line
                key={i}
                x1={SUN.x + Math.cos(a) * r1}
                y1={SUN.y + Math.sin(a) * r1}
                x2={SUN.x + Math.cos(a) * (r1 + 60)}
                y2={SUN.y + Math.sin(a) * (r1 + 60)}
                stroke={COLORS.light}
                strokeWidth={6}
                strokeLinecap="round"
                opacity={1 - phase}
              />
            );
          })}
        </g>
        {MOLECULES.map((m, k) => {
          const t = frame - m.capture;
          const d = frame - m.degrade;
          const drift = Math.min(frame, m.capture) * 0.8;
          const x = tween(t, [0, 35], [m.fromX + drift, m.toX], Easing.bezier(0.45, 0, 0.2, 1));
          const y = tween(t, [0, 35], [m.fromY, m.toY], Easing.bezier(0.45, 0, 0.2, 1)) + (t < 35 ? Math.sin(frame * 0.12 + k) * 6 : 0);
          return (
            <g key={k}>
              <circle cx={m.toX} cy={m.toY} r={30} fill={COLORS.radical} opacity={tween(d, [0, 6, 22], [0, 0.6, 0])} />
              <Antibiotic
                x={x}
                y={y}
                size={32}
                rotate={m.rot + (t < 35 ? frame * 2 : 0)}
                opacity={tween(frame, [5, 20], [0, 1]) * tween(d, [0, 10], [1, 0])}
              />
            </g>
          );
        })}
        {DROPS.map((dr, i) => {
          const t = frame - dr.delay;
          if (t < 0) {
            return null;
          }
          const x = GEL.x + GEL.w + 10 + t * 4;
          if (x > 1580) {
            return null;
          }
          return <circle key={i} cx={x} cy={dr.y} r={7} fill={COLORS.water} opacity={tween(x, [1530, 1580], [1, 0], Easing.linear)} />;
        })}
        <text x={1420} y={800} textAnchor="middle" fill={COLORS.water} fontSize={30} fontWeight={600} opacity={tween(frame, [140, 160], [0, 1])}>
          Clean water
        </text>
        <g opacity={tween(frame, [30, 50], [0, 1])}>
          <text x={1690} y={404} textAnchor="middle" fill={COLORS.muted} fontSize={24} fontWeight={600}>
            Antibiotics
          </text>
          <text x={1690} y={432} textAnchor="middle" fill={COLORS.muted} fontSize={24} fontWeight={600}>
            in water
          </text>
          <rect x={1655} y={450} width={70} height={340} rx={14} fill="#0B2233" stroke="#28465C" strokeWidth={3} />
          <rect
            x={1661}
            y={790 - 6 - Math.max(0, meterHeight - 12)}
            width={58}
            height={Math.max(0, meterHeight - 12)}
            rx={10}
            fill={interpolateColors(captured, [0, 1], [COLORS.antibiotic, COLORS.good])}
          />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 285,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 28,
        }}
      >
        {[
          { n: "1", word: "Adsorb", sub: "biochar captures", at: CAPTURE_START, color: COLORS.antibiotic },
          { n: "2", word: "Degrade", sub: "light destroys", at: DEGRADE_START - 10, color: COLORS.gcn },
          { n: "3", word: "Reuse", sub: "beads recovered", at: REUSE_START, color: COLORS.gel },
        ].map((chip) => (
          <div
            key={chip.n}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "10px 26px 10px 12px",
              borderRadius: 40,
              border: `3px solid ${frame >= chip.at ? chip.color : "#28465C"}`,
              backgroundColor: "rgba(11, 34, 51, 0.85)",
              fontSize: 30,
              color: COLORS.text,
              opacity: interpolate(frame, [15, 30, chip.at, chip.at + 10], [0, 0.4, 0.4, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: chip.color,
                color: "#0B2233",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {chip.n}
            </span>
            <span style={{ fontWeight: 700 }}>{chip.word}</span>
            <span style={{ color: COLORS.muted }}>{chip.sub}</span>
          </div>
        ))}
      </div>
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
        06 · THE COMBINED MATERIAL
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
        Biochar/g-C<sub>3</sub>N<sub>4</sub> hydrogel
      </Interactive.Div>
      <Interactive.Div
        name="Caption 1"
        style={{
          position: "absolute",
          left: 140,
          right: 140,
          bottom: 90,
          fontSize: 50,
          lineHeight: 1.35,
          color: COLORS.text,
          opacity: interpolate(frame, [55, 75, 220, 232], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Biochar <span style={{ color: COLORS.antibiotic, fontWeight: 700 }}>captures</span> antibiotics;
        light-activated g-C<sub>3</sub>N<sub>4</sub>{" "}
        <span style={{ color: COLORS.gcn, fontWeight: 700 }}>destroys</span> them in place.
      </Interactive.Div>
      <Interactive.Div
        name="Caption 2"
        style={{
          position: "absolute",
          left: 140,
          right: 140,
          bottom: 90,
          fontSize: 50,
          lineHeight: 1.35,
          color: COLORS.text,
          opacity: interpolate(frame, [234, 250], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Capture and destroy in one{" "}
        <span style={{ color: COLORS.gel, fontWeight: 700 }}>easy-to-recover, reusable</span> material.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
