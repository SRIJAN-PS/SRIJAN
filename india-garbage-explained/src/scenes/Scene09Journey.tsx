import { Factory, Funnel, Mountain, PersonStanding, Recycle, Trash2, Truck, type LucideIcon } from "lucide-react";
import { AbsoluteFill, Interactive, useCurrentFrame } from "remotion";
import { Arrow, FlowNode, link, type Point } from "../components/Flow";
import { SceneShell } from "../components/SceneShell";
import { fadeWindow } from "../components/Transitions";
import type { SceneId } from "../config/narration";
import { COLOR, EASE, FONT, tween } from "../config/theme";
import { cuesOf } from "../config/timing";
import { VIDEO } from "../config/video";
import { PlasticBottle } from "../illustrations/Street";

const ID: SceneId = "journey";
const Y = 470;
const XS = Array.from({ length: 7 }, (_, i) => 200 + i * 253);

type Step = { icon: LucideIcon; label: string; color: string; at: (c: ReturnType<typeof cuesOf>) => number };

const STEPS: Step[] = [
  { icon: PersonStanding, label: "Person", color: COLOR.muted, at: (c) => c.beat("works", 0, 5) },
  { icon: Trash2, label: "Segregation", color: COLOR.dry, at: (c) => c.beat("works", 1, 5) },
  { icon: Truck, label: "Collection", color: COLOR.dry, at: (c) => c.beat("works", 2, 5) },
  { icon: Funnel, label: "Sorting", color: COLOR.accent, at: (c) => c.beat("works", 3, 5) },
  { icon: Recycle, label: "Recovery", color: COLOR.recovery, at: (c) => c.beat("works", 4, 5) },
  { icon: Factory, label: "Recycling / processing", color: COLOR.recovery, at: (c) => c.at("processed") },
  { icon: Mountain, label: "Residual disposal", color: COLOR.hazardous, at: (c) => c.beat("processed", 1, 2) },
];

export const Scene09Journey: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf(ID);

  // Opening: the bottle from scene 1 returns, then shrinks onto the chain.
  const bottleIn = tween(frame, [c.at("back"), c.at("back") + 24], [0, 1]);
  const toChain = tween(frame, [c.end("back"), c.at("works") + 10], [0, 1], EASE.inOut);
  // Bottle hops from step to step until recycling.
  const hop = (i: number) => STEPS[Math.min(i, 5)].at(c);
  let bx = XS[0];
  for (let i = 1; i <= 5; i++) {
    bx += (XS[i] - XS[i - 1]) * tween(frame, [hop(i) - 12, hop(i) + 4], [0, 1], EASE.inOut);
  }
  const bottleX = 960 + (bx - 960) * toChain;
  const bottleY = 470 + (Y - 120 - 470) * toChain;
  const bottleScale = 3.2 + (1.1 - 3.2) * toChain;
  // Only the residue continues to disposal.
  const residue = tween(frame, [hop(6) - 4, hop(6) + 16], [0, 1], EASE.inOut);

  const chain = tween(frame, [c.at("disappear") - 10, c.at("disappear") + 16], [1, 0]);
  const closing = c.end("letGo") + 20;
  const line1 = fadeWindow(frame, c.at("disappear"), c.at("measure") + 4);
  const line2 = fadeWindow(frame, c.at("measure"), closing);
  const endLine = fadeWindow(frame, closing, closing + 125, 20);
  const endCard = tween(frame, [closing + 130, closing + 155], [0, 1]);

  return (
    <SceneShell sceneId={ID} badge={frame < closing} header={frame < closing}>
      <AbsoluteFill style={{ opacity: chain * (1 - endCard) }}>
        {STEPS.map((s, i) => (
          <FlowNode key={s.label} x={XS[i]} y={Y} size={92} icon={s.icon} label={s.label} color={s.color} appear={s.at(c)} labelWidth={220} labelSize={26} />
        ))}
        {XS.slice(1).map((x, i) => (
          <Arrow key={x} points={link([XS[i], Y] as Point, [x, Y] as Point, 58)} start={STEPS[i + 1].at(c) - 10} duration={10} />
        ))}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g opacity={bottleIn}>
            <PlasticBottle x={bottleX} y={bottleY} scale={bottleScale} />
          </g>
          {residue > 0 ? (
            <rect x={XS[5] + (XS[6] - XS[5]) * residue - 12} y={Y - 132} width={24} height={20} rx={5} fill={COLOR.faint} opacity={1 - residue * 0.3} />
          ) : null}
        </svg>
        <div
          style={{
            position: "absolute",
            left: 660,
            top: 680,
            width: 600,
            textAlign: "center",
            fontFamily: FONT.mono,
            fontSize: 24,
            letterSpacing: 3,
            color: COLOR.accent,
            opacity: bottleIn * (1 - toChain),
          }}
        >
          THE SAME BOTTLE
        </div>
      </AbsoluteFill>

      {/* Closing lines, shown as on-screen typography instead of subtitles */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", opacity: line1 }}>
        <Interactive.Div name="Line: disappear" style={{ fontSize: 68, fontWeight: 700, letterSpacing: -1, maxWidth: 1500, textWrap: "balance" }}>
          Waste doesn't disappear when we throw it away.
        </Interactive.Div>
        <Interactive.Div
          name="Line: sight"
          style={{
            marginTop: 24,
            fontSize: 68,
            fontWeight: 700,
            color: COLOR.accent,
            opacity: tween(frame, [c.at("sight"), c.at("sight") + 14], [0, 1]),
          }}
        >
          It only leaves our sight.
        </Interactive.Div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", opacity: line2 }}>
        <Interactive.Div name="Line: measure" style={{ fontSize: 46, fontWeight: 500, lineHeight: 1.3, color: COLOR.muted, maxWidth: 1400, textWrap: "balance" }}>
          The real measure of a waste-management system isn't how quickly garbage disappears from our streets.
        </Interactive.Div>
        <Interactive.Div
          name="Line: let go"
          style={{
            marginTop: 36,
            fontSize: 66,
            fontWeight: 700,
            lineHeight: 1.2,
            maxWidth: 1500,
            textWrap: "balance",
            opacity: tween(frame, [c.at("letGo"), c.at("letGo") + 14], [0, 1]),
          }}
        >
          It's what happens to that waste after we let go of it.
        </Interactive.Div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", opacity: endLine }}>
        <Interactive.Div name="Final line" style={{ fontSize: 84, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1, maxWidth: 1500, textWrap: "balance" }}>
          THE STORY OF WASTE DOESN'T END <span style={{ color: COLOR.accent }}>AT THE BIN.</span>
        </Interactive.Div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: endCard }}>
        <div style={{ width: tween(frame, [closing + 135, closing + 170], [0, 520]), height: 2, backgroundColor: COLOR.accent }} />
        <Interactive.Div name="Series title" style={{ margin: "36px 0", fontSize: 96, fontWeight: 800, letterSpacing: 6 }}>
          {VIDEO.series}
        </Interactive.Div>
        <div style={{ width: tween(frame, [closing + 135, closing + 170], [0, 520]), height: 2, backgroundColor: COLOR.accent }} />
      </AbsoluteFill>
    </SceneShell>
  );
};
