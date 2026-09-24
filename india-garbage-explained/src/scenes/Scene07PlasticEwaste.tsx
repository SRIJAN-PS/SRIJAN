import {
  BrickWall,
  Battery,
  Cpu,
  Funnel,
  Milk,
  Recycle,
  ShieldCheck,
  Smartphone,
  Syringe,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Arrow, FlowNode, link, type Point } from "../components/Flow";
import { SceneShell } from "../components/SceneShell";
import type { SceneId } from "../config/narration";
import { SOURCES, type Source, type SourceId } from "../config/sources";
import { COLOR, FONT, tween } from "../config/theme";
import { cuesOf } from "../config/timing";

const ID: SceneId = "plasticEwaste";
const YS = [350, 470, 590, 710];

type Node = { icon: LucideIcon; label: string; color: string };

const PLASTIC: Node[] = [
  { icon: Milk, label: "Plastic bottle", color: COLOR.dry },
  { icon: Truck, label: "Separate collection", color: COLOR.dry },
  { icon: Funnel, label: "Sorting by type", color: COLOR.accent },
  { icon: Recycle, label: "Recycling / recovery", color: COLOR.recovery },
];

const EWASTE: Node[] = [
  { icon: Smartphone, label: "Mobile phone", color: COLOR.ewaste },
  { icon: Cpu, label: "E-waste", color: COLOR.ewaste },
  { icon: ShieldCheck, label: "Authorised collection", color: COLOR.accent },
  { icon: Recycle, label: "Material recovery / recycling", color: COLOR.recovery },
];

const FRAMEWORKS: { icon: LucideIcon; sourceId: SourceId; name: string }[] = [
  { icon: Milk, sourceId: "plastic2016", name: "Plastic waste" },
  { icon: Smartphone, sourceId: "ewaste2022", name: "E-waste" },
  { icon: Battery, sourceId: "battery2022", name: "Batteries" },
  { icon: Syringe, sourceId: "biomedical2016", name: "Biomedical waste" },
  { icon: BrickWall, sourceId: "cnd2025", name: "Construction & demolition" },
];

const ruleName = (s: Source) => `${s.title}${s.detail ? `, ${s.detail}` : ""}`;

const Chain: React.FC<{ nodes: Node[]; x: number; cue: string; c: ReturnType<typeof cuesOf> }> = ({ nodes, x, cue, c }) => (
  <>
    {nodes.map((n, i) => (
      <FlowNode
        key={n.label}
        x={x}
        y={YS[i]}
        size={80}
        icon={n.icon}
        label={n.label}
        color={n.color}
        labelPosition="right"
        labelWidth={420}
        labelSize={32}
        appear={c.beat(cue, i, 4)}
      />
    ))}
    {nodes.slice(1).map((_, i) => (
      <Arrow key={i} points={link([x, YS[i]] as Point, [x, YS[i + 1]] as Point, 48)} start={c.beat(cue, i + 1, 4) - 8} duration={10} />
    ))}
  </>
);

export const Scene07PlasticEwaste: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf(ID);
  const split = tween(frame, [8, 30], [0, 1]);
  const panel = tween(frame, [c.at("frameworks") - 4, c.at("frameworks") + 16], [0, 1]);
  const own = tween(frame, [c.at("own"), c.at("own") + 16], [0, 1]);

  return (
    <SceneShell sceneId={ID}>
      <AbsoluteFill style={{ opacity: split * (1 - panel * 0.88) }}>
        <div style={{ position: "absolute", left: 960, top: 262, width: 2, height: 520, backgroundColor: COLOR.line }} />
        <div style={{ position: "absolute", left: 180, top: 262, fontFamily: FONT.mono, fontSize: 24, letterSpacing: 4, color: COLOR.dry }}>
          PLASTIC
        </div>
        <div style={{ position: "absolute", left: 1020, top: 262, fontFamily: FONT.mono, fontSize: 24, letterSpacing: 4, color: COLOR.ewaste }}>
          E-WASTE
        </div>
        <Chain nodes={PLASTIC} x={260} cue="bottle" c={c} />
        <Chain nodes={EWASTE} x={1100} cue="phone" c={c} />
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          left: 240,
          top: 262,
          width: 1440,
          padding: "30px 40px 18px",
          borderRadius: 20,
          backgroundColor: "rgba(17, 26, 35, 0.94)",
          border: `1px solid ${COLOR.line}`,
          opacity: panel,
          translate: `0px ${(1 - panel) * 20}px`,
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: 3, color: COLOR.fact }}>
          SEPARATE RULES FOR SPECIFIC WASTE STREAMS
        </div>
        {FRAMEWORKS.map((f, i) => {
          const Icon = f.icon;
          const at = c.beat("frameworks", i, 6);
          return (
            <div
              key={f.sourceId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                marginTop: 18,
                opacity: tween(frame, [at, at + 12], [0, 1]),
                translate: `${tween(frame, [at, at + 16], [20, 0])}px 0px`,
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 29,
                  border: `2px solid ${COLOR.fact}`,
                  backgroundColor: `${COLOR.fact}${own > 0 ? "33" : "14"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={28} color={COLOR.fact} strokeWidth={1.8} />
              </div>
              <div style={{ width: 360, fontSize: 30, fontWeight: 700 }}>{f.name}</div>
              <div style={{ flex: 1, fontSize: 25, color: COLOR.muted, lineHeight: 1.3 }}>
                {ruleName(SOURCES[f.sourceId])}
              </div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};
