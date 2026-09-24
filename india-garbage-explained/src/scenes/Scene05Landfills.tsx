import { Apple, CloudRain, Droplets, Layers, Microscope, Wind } from "lucide-react";
import { AbsoluteFill, interpolateColors, random, useCurrentFrame } from "remotion";
import { InfoCard } from "../components/Cards";
import { Arrow, FlowNode, link } from "../components/Flow";
import { SceneShell } from "../components/SceneShell";
import { fadeWindow } from "../components/Transitions";
import type { SceneId } from "../config/narration";
import { COLOR, FONT, tween } from "../config/theme";
import { cuesOf } from "../config/timing";

const ID: SceneId = "landfills";

const SURFACE = 420;
const BOTTOM = 740;
const PILE = "220,420 360,352 600,318 840,352 980,420 900,740 300,740";
const WATER = "#6FB6E8";
const LEACHATE = "#B08850";

// Height of the waste surface at x (piecewise-linear over the mound).
const topAt = (x: number) => {
  const pts: [number, number][] = [[220, 420], [360, 352], [600, 318], [840, 352], [980, 420]];
  for (let i = 1; i < pts.length; i++) {
    if (x <= pts[i][0]) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  return 420;
};

const CHUNKS = Array.from({ length: 70 }, (_, i) => ({
  x: 250 + random(`lf-x-${i}`) * 700,
  y: 330 + random(`lf-y-${i}`) * 400,
  w: 18 + random(`lf-w-${i}`) * 40,
  h: 10 + random(`lf-h-${i}`) * 22,
  r: random(`lf-r-${i}`) * 180,
  c: ["#4A5159", "#5B524A", "#3F4A56", "#6B6255", "#56606A"][Math.floor(random(`lf-c-${i}`) * 5)],
}));

const ORGANIC: [number, number][] = [[420, 470], [610, 420], [780, 520], [500, 610], [700, 650], [360, 560]];

const DROPS = Array.from({ length: 16 }, (_, i) => ({
  x: 330 + random(`drop-x-${i}`) * 540,
  phase: random(`drop-p-${i}`) * 90,
}));

export const Scene05Landfills: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf(ID);

  const pileIn = tween(frame, [10, 40], [0, 1]);
  const raining = frame >= c.at("rain") && frame < c.at("organic") + 10;
  const rainIn = fadeWindow(frame, c.at("rain"), c.at("organic") + 10, 20);
  const pool = tween(frame, [c.at("leachate"), c.at("leachate") + 40], [0, 24]);
  const liner = tween(frame, [c.at("liner"), c.at("liner") + 40], [0, 1]);
  const organicGlow = tween(frame, [c.at("organic"), c.at("organic") + 20], [0, 1]);
  const gasOn = frame >= c.at("gas");

  const intro = fadeWindow(frame, c.at("intro"), c.at("rain") + 6);
  const leachFlow = fadeWindow(frame, c.at("rain"), c.at("organic") + 6);
  const gasFlow = fadeWindow(frame, c.at("organic"), c.at("rule") + 6);
  const rule = tween(frame, [c.at("rule"), c.at("rule") + 16], [0, 1]);

  return (
    <SceneShell sceneId={ID}>
      <AbsoluteFill style={{ opacity: pileIn }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <clipPath id="pile">
              <polygon points={PILE} />
            </clipPath>
          </defs>
          {/* Soil around the pit */}
          <rect x={120} y={SURFACE} width={960} height={790 - SURFACE} fill="#211A14" />
          {[470, 540, 620, 700].map((y) => (
            <line key={y} x1={120} x2={1080} y1={y} y2={y + 6} stroke="#2C231B" strokeWidth={3} />
          ))}
          <line x1={120} x2={1080} y1={SURFACE} y2={SURFACE} stroke="#4A3D2E" strokeWidth={4} />
          {/* Waste body */}
          <polygon points={PILE} fill="#343A41" />
          <g clipPath="url(#pile)">
            {Array.from({ length: 9 }, (_, i) => (
              <rect key={i} x={200} y={318 + i * 48} width={800} height={3} fill="#262B31" />
            ))}
            {CHUNKS.map((k, i) => (
              <rect key={i} x={k.x} y={k.y} width={k.w} height={k.h} rx={3} fill={k.c} transform={`rotate(${k.r} ${k.x} ${k.y})`} />
            ))}
            {ORGANIC.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r={34} fill={COLOR.wet} opacity={0.25 * organicGlow} />
                <circle cx={x} cy={y} r={15} fill={interpolateColors(organicGlow, [0, 1], ["#5E6B4A", COLOR.wet])} />
              </g>
            ))}
            {/* Leachate collecting at the base */}
            <rect x={280} y={BOTTOM - pool} width={640} height={pool} fill={LEACHATE} opacity={0.85} />
            {raining
              ? DROPS.map((d, i) => {
                  const t = ((frame - c.at("rain") + d.phase) % 90) / 90;
                  const top = topAt(d.x);
                  const y = top + t * (BOTTOM - top - 10);
                  return (
                    <ellipse
                      key={i}
                      cx={d.x + Math.sin(t * 9 + i) * 8}
                      cy={y}
                      rx={5}
                      ry={8}
                      fill={interpolateColors(t, [0, 0.7], [WATER, LEACHATE])}
                      opacity={rainIn * (t < 0.95 ? 1 : 0)}
                    />
                  );
                })
              : null}
          </g>
          {/* Liner and drain of an engineered landfill */}
          <polyline
            points="216,420 296,744 904,744 984,420"
            fill="none"
            stroke="#D2AE4C"
            strokeWidth={7}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={`${liner} 1`}
          />
          <g opacity={liner}>
            <rect x={320} y={722} width={660} height={12} rx={6} fill="#8F9AA5" />
            {Array.from({ length: 14 }, (_, i) => (
              <circle key={i} cx={340 + i * 40} cy={728} r={3} fill="#2A3139" />
            ))}
          </g>
          {/* Rain */}
          <g opacity={rainIn}>
            {[400, 450, 500, 550, 600].map((x, i) => (
              <circle key={x} cx={x} cy={262 + (i % 2) * 8} r={i % 2 ? 26 : 32} fill="#44525F" />
            ))}
            <rect x={392} y={262} width={216} height={30} rx={15} fill="#44525F" />
            {raining
              ? Array.from({ length: 22 }, (_, i) => {
                  const x = 380 + random(`rain-${i}`) * 240;
                  const t = ((frame + i * 7) % 24) / 24;
                  const y = 296 + t * (topAt(x) - 296);
                  return <line key={i} x1={x} y1={y} x2={x - 4} y2={y + 18} stroke={WATER} strokeWidth={2.5} opacity={0.8} />;
                })
              : null}
          </g>
          {/* Landfill gas */}
          {gasOn
            ? ORGANIC.flatMap(([x, y], i) =>
                [0, 1].map((j) => {
                  const t = ((frame - c.at("gas") + i * 13 + j * 40) % 80) / 80;
                  const bx = x + Math.sin(t * 8 + i + j) * 10;
                  const by = y - t * (y - 250);
                  return <circle key={`${i}-${j}`} cx={bx} cy={by} r={6 + t * 6} fill="none" stroke={COLOR.gas} strokeWidth={2} opacity={(1 - t) * 0.8} />;
                }),
              )
            : null}
          <g opacity={tween(frame, [c.at("gas") + 20, c.at("gas") + 40], [0, 1])} fontFamily={FONT.sans} fontWeight={700} fontSize={34} fill={COLOR.gas}>
            <text x={470} y={278}>
              CH<tspan fontSize={22} dy={8}>4</tspan>
            </text>
            <text x={700} y={270}>
              CO<tspan fontSize={22} dy={8}>2</tspan>
            </text>
          </g>
        </svg>
        <div
          style={{
            position: "absolute",
            left: 300,
            top: 752,
            fontFamily: FONT.mono,
            fontSize: 22,
            letterSpacing: 3,
            color: LEACHATE,
            opacity: tween(frame, [c.at("leachate") + 10, c.at("leachate") + 26], [0, 1]),
          }}
        >
          LEACHATE COLLECTS AT THE BASE
        </div>
      </AbsoluteFill>

      {/* Right-hand explanation panel */}
      <div style={{ opacity: intro }}>
        <InfoCard x={1160} y={290} width={640} appear={c.at("intro") + 6} accent={COLOR.recovery} eyebrow="SANITARY LANDFILL">
          An engineered site designed to contain waste, leachate and gas.
        </InfoCard>
        <InfoCard x={1160} y={530} width={640} appear={c.beat("intro", 1, 2)} accent={COLOR.hazardous} eyebrow="OPEN DUMPSITE">
          Waste piled on land without these protective measures.
        </InfoCard>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: leachFlow }}>
        <FlowNode x={1240} y={330} size={84} icon={CloudRain} label="Rain" color={WATER} labelPosition="right" labelSize={32} appear={c.at("rain")} />
        <Arrow points={link([1240, 330], [1240, 470], 50)} start={c.beat("rain", 1, 2) - 8} duration={10} />
        <FlowNode x={1240} y={470} size={84} icon={Layers} label="Waste" color={COLOR.muted} labelPosition="right" labelSize={32} appear={c.beat("rain", 1, 2)} />
        <Arrow points={link([1240, 470], [1240, 610], 50)} start={c.at("leachate") - 8} duration={10} />
        <FlowNode x={1240} y={610} size={84} icon={Droplets} label="Leachate" color={LEACHATE} labelPosition="right" labelSize={32} appear={c.at("leachate")} />
        <div
          style={{
            position: "absolute",
            left: 1190,
            top: 690,
            width: 600,
            fontSize: 26,
            lineHeight: 1.35,
            color: COLOR.muted,
            opacity: tween(frame, [c.at("liner"), c.at("liner") + 16], [0, 1]),
          }}
        >
          <span style={{ color: "#D2AE4C", fontWeight: 600 }}>Engineered landfill:</span> liner and drains collect it for treatment.
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: gasFlow }}>
        <FlowNode x={1240} y={330} size={84} icon={Apple} label="Organic waste" color={COLOR.wet} labelPosition="right" labelSize={32} appear={c.at("organic")} />
        <Arrow points={link([1240, 330], [1240, 470], 50)} start={c.beat("organic", 1, 2) - 8} duration={10} />
        <FlowNode
          x={1240}
          y={470}
          size={84}
          icon={Microscope}
          label="Anaerobic decomposition"
          sublabel="oxygen-limited conditions"
          color={COLOR.accent}
          labelPosition="right"
          labelSize={32}
          labelWidth={440}
          appear={c.beat("organic", 1, 2)}
        />
        <Arrow points={link([1240, 470], [1240, 610], 50)} start={c.at("gas") - 8} duration={10} />
        <FlowNode
          x={1240}
          y={610}
          size={84}
          icon={Wind}
          label="Methane + carbon dioxide"
          sublabel="landfill gas"
          color={COLOR.gas}
          labelPosition="right"
          labelSize={32}
          labelWidth={440}
          appear={c.at("gas")}
        />
      </div>
      <InfoCard x={1160} y={380} width={640} appear={c.at("rule")} accent={COLOR.fact} eyebrow="SWM RULES, 2026 · LANDFILLS" opacity={rule}>
        Restricted to waste that can't be recycled or used for energy recovery, and to inert material.
      </InfoCard>
    </SceneShell>
  );
};
