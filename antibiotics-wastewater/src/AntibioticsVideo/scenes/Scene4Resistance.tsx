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
import { Bacterium } from "../components/Bacterium";
import { COLORS, fontFamily, tween } from "../theme";

const RESISTANT = [4, 13];
const DEATH_START = 105;
const SPREAD_START = 185;

const CELLS = Array.from({ length: 18 }, (_, i) => ({
  x: 380 + (i % 6) * 232 + (random(`s4-jx-${i}`) - 0.5) * 70,
  y: 410 + Math.floor(i / 6) * 165 + (random(`s4-jy-${i}`) - 0.5) * 50,
  rot: (random(`s4-rot-${i}`) - 0.5) * 70,
  resistant: RESISTANT.includes(i),
}));

const susceptible = CELLS.map((c, i) => ({ ...c, i })).filter((c) => !c.resistant);

const DEATH_ORDER = [...susceptible]
  .sort((a, b) => random(`s4-d-${a.i}`) - random(`s4-d-${b.i}`))
  .map((c) => c.i);

// Each dead cell's spot is refilled by a daughter of the nearest resistant cell.
const DAUGHTERS = susceptible
  .map((c) => {
    const parent = RESISTANT.map((r) => CELLS[r]).reduce((best, r) =>
      Math.hypot(r.x - c.x, r.y - c.y) < Math.hypot(best.x - c.x, best.y - c.y) ? r : best,
    );
    return { target: c, parent, dist: Math.hypot(parent.x - c.x, parent.y - c.y) };
  })
  .sort((a, b) => a.dist - b.dist);

const DRUGS = Array.from({ length: 14 }, (_, i) => {
  const angle = random(`s4-a-${i}`) * Math.PI * 2;
  return {
    fromX: 960 + Math.cos(angle) * 1100,
    fromY: 580 + Math.sin(angle) * 600,
    toX: 360 + random(`s4-tx-${i}`) * 1200,
    toY: 360 + random(`s4-ty-${i}`) * 420,
    delay: 85 + i * 2,
    rot: random(`s4-r-${i}`) * 360,
  };
});

export const Scene4Resistance: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Scene 4 - Resistance" style={{ fontFamily }}>
      <Backdrop />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", top: 0, left: 0 }}>
        {CELLS.map((c, i) => {
          if (c.resistant) {
            const pulse = tween(frame, [30, 50, 70], [0, 1, 0]);
            const grow = 1 + Math.max(0, Math.sin((frame - SPREAD_START) * 0.25)) * 0.08 * (frame > SPREAD_START ? 1 : 0);
            return (
              <g key={i}>
                <circle cx={c.x} cy={c.y} r={60 + pulse * 30} fill="none" stroke={COLORS.resistant} strokeWidth={4} opacity={pulse} />
                <Bacterium x={c.x} y={c.y} rotate={c.rot} frame={frame} seed={i} color={COLORS.resistant} resistant scale={1.25 * grow} />
              </g>
            );
          }
          const deathAt = DEATH_START + DEATH_ORDER.indexOf(i) * 3;
          const dt = frame - deathAt;
          return (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r={tween(dt, [0, 20], [20, 80])} fill="none" stroke={COLORS.antibiotic} strokeWidth={3} opacity={tween(dt, [0, 5, 20], [0, 0.8, 0])} />
              <Bacterium
                x={c.x}
                y={c.y}
                rotate={c.rot}
                frame={dt > 0 ? deathAt : frame}
                seed={i}
                color={interpolateColors(dt, [0, 10], [COLORS.susceptible, COLORS.dead])}
                scale={1.25 * tween(dt, [0, 30], [1, 0.6])}
                opacity={tween(dt, [12, 35], [1, 0])}
              />
            </g>
          );
        })}
        {DRUGS.map((d, i) => {
          const t = frame - d.delay;
          const x = tween(t, [0, 30], [d.fromX, d.toX]);
          const y = tween(t, [0, 30], [d.fromY, d.toY]) + Math.sin(frame * 0.1 + i) * 6;
          return <Antibiotic key={i} x={x} y={y} size={38} rotate={d.rot + frame * 2} opacity={tween(frame, [175, 200], [1, 0])} />;
        })}
        {DAUGHTERS.map((d, k) => {
          const t = frame - (SPREAD_START + k * 5);
          if (t < 0) {
            return null;
          }
          const spring = Easing.spring({ damping: 14 });
          return (
            <Bacterium
              key={k}
              x={tween(t, [0, 30], [d.parent.x, d.target.x], spring)}
              y={tween(t, [0, 30], [d.parent.y, d.target.y], spring)}
              rotate={d.target.rot}
              frame={frame}
              seed={k + 30}
              color={COLORS.resistant}
              resistant
              scale={1.25 * tween(t, [0, 25], [0.4, 1])}
              opacity={tween(t, [0, 6], [0, 1])}
            />
          );
        })}
        <g opacity={tween(frame, [20, 40], [0, 1])}>
          <rect x={1370} y={110} width={40} height={20} rx={10} fill={COLORS.susceptible} />
          <text x={1424} y={130} fill={COLORS.text} fontSize={30}>Susceptible</text>
          <rect x={1370} y={165} width={40} height={20} rx={10} fill={COLORS.resistant} />
          <text x={1424} y={185} fill={COLORS.text} fontSize={30}>Resistant</text>
        </g>
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
        03 · THE RISK
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
        How resistance spreads
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
          opacity: interpolate(frame, [20, 40, 88, 98], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Wastewater teems with bacteria. A few carry{" "}
        <span style={{ color: COLORS.resistant, fontWeight: 700 }}>resistance genes</span>.
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
          opacity: interpolate(frame, [100, 110, 168, 178], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Low levels of <span style={{ color: COLORS.antibiotic, fontWeight: 700 }}>antibiotics</span> kill
        the susceptible cells…
      </Interactive.Div>
      <Interactive.Div
        name="Caption 3"
        style={{
          position: "absolute",
          left: 140,
          right: 140,
          bottom: 90,
          fontSize: 50,
          lineHeight: 1.35,
          color: COLORS.text,
          opacity: interpolate(frame, [180, 190], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        …so <span style={{ color: COLORS.resistant, fontWeight: 700 }}>resistant bacteria</span> survive,
        multiply and share their genes.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
