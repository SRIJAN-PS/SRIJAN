import {
  Apple,
  Bandage,
  Battery,
  BatteryWarning,
  CircleX,
  Droplets,
  Milk,
  Newspaper,
  Package,
  Recycle,
  ShieldCheck,
  Sprout,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useCurrentFrame } from "remotion";
import { Arrow, FlowNode, link } from "../components/Flow";
import { SceneShell } from "../components/SceneShell";
import type { SceneId } from "../config/narration";
import { COLOR, EASE, FONT, tween } from "../config/theme";
import { cuesOf } from "../config/timing";

const ID: SceneId = "segregation";

const A_X = 440;
const A_Y = [470, 600, 730];

type Row = {
  icon: LucideIcon;
  label: string;
  color: string;
  outIcon: LucideIcon;
  outLabel: string;
  cue: string;
};

const ROWS: Row[] = [
  { icon: Trash2, label: "Wet waste", color: COLOR.wet, outIcon: Sprout, outLabel: "Composting / biological processing", cue: "wet" },
  { icon: Trash2, label: "Dry waste", color: COLOR.dry, outIcon: Recycle, outLabel: "Material recovery / recycling", cue: "dry" },
  { icon: BatteryWarning, label: "Domestic hazardous waste", color: COLOR.hazardous, outIcon: ShieldCheck, outLabel: "Specialised management", cue: "hazardous" },
];

const StreamChip: React.FC<{ text: string; color: string; opacity: number }> = ({ text, color, opacity }) => (
  <div
    style={{
      position: "absolute",
      right: 120,
      top: 244,
      padding: "6px 14px",
      borderRadius: 8,
      border: `2px solid ${color}`,
      fontFamily: FONT.mono,
      fontSize: 20,
      letterSpacing: 2,
      color,
      opacity,
    }}
  >
    {text}
  </div>
);

export const Scene03Segregation: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf(ID);

  const pathA = tween(frame, [c.at("separate") - 6, c.at("separate") + 16], [1, 0.4]);
  const pathB = tween(frame, [c.at("separate") - 6, c.at("separate") + 16], [0.3, 1]);
  const panels = tween(frame, [8, 30], [0, 1]);
  const dirt = tween(frame, [c.at("contaminate"), c.end("contaminate")], [0, 1]);

  // 2026 update: rows reflow from three streams to four.
  const upgrade = tween(frame, [c.at("rule2026"), c.at("rule2026") + 24], [0, 1], EASE.inOut);
  const rowY = (i: number) => {
    const three = [370, 510, 650][i] ?? 650;
    const four = [350, 465, 580, 695][i];
    return three + (four - three) * upgrade;
  };
  const rule2016 = tween(frame, [c.at("rule2016"), c.at("rule2016") + 12, c.at("rule2026") - 4, c.at("rule2026") + 8], [0, 1, 1, 0]);
  const rule2026 = tween(frame, [c.at("rule2026"), c.at("rule2026") + 14], [0, 1]);

  const items: LucideIcon[] = [Apple, Milk, Newspaper, Battery];
  const itemColors = [COLOR.wet, COLOR.dry, COLOR.dry, COLOR.hazardous];

  return (
    <SceneShell sceneId={ID}>
      {/* Panel frames */}
      <div style={{ position: "absolute", left: 120, top: 250, width: 800, height: 550, opacity: panels }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 24, letterSpacing: 3, color: COLOR.hazardous }}>PATH A · MIXED</div>
      </div>
      <div style={{ position: "absolute", left: 960, top: 250, width: 2, height: 540, backgroundColor: COLOR.line, opacity: panels }} />
      <div style={{ position: "absolute", left: 1010, top: 250, width: 790, opacity: panels }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 24, letterSpacing: 3, color: COLOR.recovery }}>PATH B · SEGREGATED</div>
      </div>
      <StreamChip text="SWM RULES 2016 · 3 STREAMS" color={COLOR.fact} opacity={rule2016} />
      <StreamChip text="SWM RULES 2026 · 4 STREAMS" color={COLOR.fact} opacity={rule2026} />

      {/* PATH A */}
      <div style={{ position: "absolute", inset: 0, opacity: pathA }}>
        {items.map((Icon, i) => {
          const at = c.beat("mixed", i, 4);
          const merge = tween(frame, [c.end("mixed") - 10, c.end("mixed") + 14], [0, 1], EASE.inOut);
          const x0 = 250 + i * 125;
          const x = x0 + (A_X - x0) * merge * 0.35;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 30,
                top: 292,
                opacity: tween(frame, [at, at + 12], [0, 1]),
                filter: `sepia(${dirt * 0.8}) saturate(${1 - dirt * 0.5})`,
              }}
            >
              <Icon size={60} color={itemColors[i]} strokeWidth={1.7} />
            </div>
          );
        })}
        <Arrow points={[[A_X, 364], [A_X, A_Y[0] - 50]]} start={c.end("mixed") - 4} duration={10} />
        <FlowNode x={A_X} y={A_Y[0]} size={84} icon={Trash2} label="Mixed waste" color={COLOR.contamination} labelPosition="right" labelSize={32} appear={c.end("mixed")} />
        <Arrow points={link([A_X, A_Y[0]], [A_X, A_Y[1]], 50)} start={c.at("contaminate") - 6} duration={10} />
        <FlowNode x={A_X} y={A_Y[1]} size={84} icon={Droplets} label="Contamination" color={COLOR.hazardous} labelPosition="right" labelSize={32} appear={c.at("contaminate")} />
        <Arrow points={link([A_X, A_Y[1]], [A_X, A_Y[2]], 50)} start={c.at("hardRecover") - 6} duration={10} />
        <FlowNode x={A_X} y={A_Y[2]} size={84} icon={CircleX} label="Difficult recovery" color={COLOR.muted} labelPosition="right" labelSize={32} appear={c.at("hardRecover")} />
      </div>

      {/* PATH B */}
      <div style={{ position: "absolute", inset: 0, opacity: pathB }}>
        {ROWS.map((row, i) => {
          const y = rowY(i);
          const at = c.at(row.cue);
          const isHazard = i === 2;
          return (
            <div key={row.cue}>
              <FlowNode x={1080} y={y} size={76} icon={row.icon} label={isHazard ? "" : row.label} color={row.color} labelPosition="right" labelWidth={190} labelSize={28} appear={at} />
              {isHazard ? (
                <>
                  <HazardLabel y={y} text="Domestic hazardous waste" opacity={tween(frame, [at, at + 14], [0, 1]) * (1 - upgrade)} />
                  <HazardLabel y={y} text="Special care waste" opacity={upgrade} />
                </>
              ) : null}
              <Arrow points={[[1345, y], [1432, y]]} start={at + 6} duration={10} color={row.color} />
              <FlowNode x={1490} y={y} size={76} icon={row.outIcon} label={row.outLabel} color={COLOR.recovery} labelPosition="right" labelWidth={250} labelSize={26} appear={at + 12} />
            </div>
          );
        })}
        {/* Fourth stream introduced by the 2026 Rules */}
        <div style={{ opacity: upgrade }}>
          <FlowNode x={1080} y={rowY(3)} size={76} icon={Bandage} label="Sanitary waste" color={COLOR.sanitary} labelPosition="right" labelWidth={190} labelSize={28} appear={c.at("fourStreams")} />
          <Arrow points={[[1345, rowY(3)], [1432, rowY(3)]]} start={c.at("fourStreams") + 6} duration={10} color={COLOR.sanitary} />
          <FlowNode x={1490} y={rowY(3)} size={76} icon={Package} label="Wrapped and kept separate" color={COLOR.recovery} labelPosition="right" labelWidth={250} labelSize={26} appear={c.at("fourStreams") + 12} />
        </div>
      </div>
    </SceneShell>
  );
};

const HazardLabel: React.FC<{ y: number; text: string; opacity: number }> = ({ y, text, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: 1140,
      top: y,
      width: 190,
      translate: "0px -50%",
      fontSize: 28,
      fontWeight: 600,
      lineHeight: 1.2,
      opacity,
    }}
  >
    {text}
  </div>
);
