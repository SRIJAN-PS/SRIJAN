import { Factory, Funnel, House, Package, PersonStanding, Truck, type LucideIcon } from "lucide-react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { InfoCard } from "../components/Cards";
import { Arrow, FlowNode, link, type Point } from "../components/Flow";
import { SceneShell } from "../components/SceneShell";
import type { SceneId } from "../config/narration";
import { COLOR, tween } from "../config/theme";
import { cuesOf } from "../config/timing";

const ID: SceneId = "people";
const Y = 400;
const XS = [235, 525, 815, 1105, 1395, 1685];

type Step = { icon: LucideIcon; label: string; color: string; at: (c: ReturnType<typeof cuesOf>) => number };

const STEPS: Step[] = [
  { icon: House, label: "Household", color: COLOR.muted, at: (c) => c.at("hands") },
  { icon: Truck, label: "Collection", color: COLOR.dry, at: (c) => c.beat("hands", 1, 2) },
  { icon: PersonStanding, label: "Waste picker", color: COLOR.accent, at: (c) => c.at("pickers") },
  { icon: Funnel, label: "Sorting", color: COLOR.accent, at: (c) => c.beat("pickers", 1, 2) },
  { icon: Factory, label: "Recycler", color: COLOR.recovery, at: (c) => c.at("sold") },
  { icon: Package, label: "New product", color: COLOR.recovery, at: (c) => c.at("products") },
];

// Recovered materials travelling along the chain; they separate into
// lanes by material after the sorting step.
const MATERIALS = [
  { color: COLOR.dry, lane: -24 },
  { color: "#D9C9A3", lane: -8 },
  { color: "#A9B4BF", lane: 8 },
  { color: COLOR.recovery, lane: 24 },
];

export const Scene06People: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf(ID);
  const flowStart = c.at("sold");
  const flowOn = tween(frame, [flowStart, flowStart + 20], [0, 1]);
  const chainDim = 1 - tween(frame, [c.at("recognised") - 6, c.at("recognised") + 16], [0, 0.35]);

  return (
    <SceneShell sceneId={ID}>
      <AbsoluteFill style={{ opacity: chainDim }}>
        {STEPS.map((s, i) => (
          <FlowNode
            key={s.label}
            x={XS[i]}
            y={Y}
            size={100}
            icon={s.icon}
            label={s.label}
            color={s.color}
            appear={s.at(c)}
            labelWidth={250}
            highlight={i === 2 ? tween(frame, [c.at("pickers"), c.at("pickers") + 20, c.end("sold"), c.end("sold") + 20], [0, 1, 1, 0]) : 0}
          />
        ))}
        {XS.slice(1).map((x, i) => (
          <Arrow key={x} points={link([XS[i], Y] as Point, [x, Y] as Point, 64)} start={STEPS[i + 1].at(c) - 10} duration={12} />
        ))}
        {flowOn > 0
          ? Array.from({ length: 16 }, (_, i) => {
              const m = MATERIALS[i % MATERIALS.length];
              const travel = ((frame - flowStart) * 4 + i * 90) % (XS[5] - XS[2]);
              const x = XS[2] + travel;
              const split = tween(x, [XS[3] - 40, XS[3] + 80], [0, 1]);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: x - 9,
                    top: Y - 92 + m.lane * split - 9,
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    backgroundColor: m.color,
                    opacity: flowOn * tween(x, [XS[5] - 80, XS[5] - 20], [1, 0]),
                  }}
                />
              );
            })
          : null}
      </AbsoluteFill>

      <InfoCard x={120} y={560} width={820} appear={c.at("recognised")} accent={COLOR.fact} eyebrow="SWM RULES, 2016 · WHO IS A WASTE PICKER">
        People informally engaged in collecting and recovering reusable and recyclable waste, for their livelihood.
      </InfoCard>
      <InfoCard x={980} y={560} width={820} appear={c.at("integrate")} accent={COLOR.fact} eyebrow="SWM RULES, 2026">
        Integration of waste pickers and kabadiwalas into the formal waste-management system.
      </InfoCard>
    </SceneShell>
  );
};
