import { CircleHelp, Milk, Trash2, Truck } from "lucide-react";
import { AbsoluteFill, Interactive, useCurrentFrame } from "remotion";
import { StatCard } from "../components/Cards";
import { Arrow, FlowNode, link, type Point } from "../components/Flow";
import { Backdrop, SceneShell } from "../components/SceneShell";
import { ASSETS } from "../config/assets";
import type { SceneId } from "../config/narration";
import { COLOR, EASE, FONT, tween } from "../config/theme";
import { cuesOf } from "../config/timing";
import { VIDEO } from "../config/video";
import { MediaSlot } from "../components/Cards";
import { IndiaCityMap } from "../illustrations/IndiaCityMap";
import { CityStreet, GarbageTruck, GROUND_Y, handPosition, Person, PlasticBottle, StreetBins } from "../illustrations/Street";

const ID: SceneId = "hook";
const PERSON_X = 600;
const BINS_X = 820;
const DRY_BIN_X = BINS_X + 110;

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf(ID);

  // Throw: wind up, swing, release, bottle arcs into the dry bin.
  const throwAt = c.at("throw") + 14;
  const arm = tween(frame, [throwAt - 16, throwAt, throwAt + 10, throwAt + 40], [0, -35, 115, 0], EASE.inOut);
  const release = handPosition(PERSON_X, 115);
  const flight = tween(frame, [throwAt + 8, throwAt + 34], [0, 1], EASE.soft);
  const bottleX = release.x + (DRY_BIN_X - release.x) * flight;
  const bottleY = release.y + (GROUND_Y - 150 - release.y) * flight - Math.sin(flight * Math.PI) * 150;
  const inHand = frame < throwAt + 8;
  const hand = handPosition(PERSON_X, arm);
  const lid = tween(frame, [throwAt + 26, throwAt + 32, throwAt + 44], [0, 1, 0]);

  // Truck: arrives, collects, leaves.
  const truckIn = c.at("truck");
  const truckOut = c.end("truck") + 6;
  const truckX = tween(frame, [truckIn, truckIn + 50, truckOut, truckOut + 70], [1980, 1010, 1010, -560], EASE.inOut);
  const wheel = -truckX * 1.2;
  const bag = tween(frame, [truckIn + 55, truckIn + 75], [0, 1], EASE.inOut);

  // Person walks away.
  const walk = tween(frame, [c.at("forget"), c.end("forget") + 20], [0, 1], EASE.inOut);

  // Street recedes when the question is asked; map and stat take over.
  const streetOpacity = tween(frame, [c.at("where") - 6, c.at("where") + 24, c.at("scale") - 6, c.at("scale") + 18], [1, 0.16, 0.16, 0]);
  const chainOpacity = tween(frame, [c.at("scale") - 6, c.at("scale") + 12], [1, 0]);
  const titleAt = c.end("bigger") + 12;
  const mapOpacity = tween(frame, [titleAt, titleAt + 24], [1, 0.3]);
  const statOpacity = tween(frame, [titleAt - 6, titleAt + 12], [1, 0]);

  const chain: { icon: typeof Milk; label: string; color: string }[] = [
    { icon: Milk, label: "Bottle", color: COLOR.dry },
    { icon: Trash2, label: "Dustbin", color: COLOR.dry },
    { icon: Truck, label: "Garbage truck", color: COLOR.muted },
    { icon: CircleHelp, label: "???", color: COLOR.accent },
  ];
  const chainX = 860;
  const chainY = (i: number) => 320 + i * 130;

  return (
    <SceneShell
      sceneId={ID}
      header={false}
      badge={frame < titleAt}
      backdrop={<Backdrop grid={false} />}
      camera={[
        { frame: 0, scale: 1.08, x: -60, y: 40 },
        { frame: c.at("truck"), scale: 1.02, x: 0, y: 20 },
        { frame: c.at("where"), scale: 1, x: 0, y: 0 },
        { frame: c.duration, scale: 1.04, x: 0, y: 0 },
      ]}
      overlay={<TitleCard appear={titleAt} />}
    >
      <AbsoluteFill style={{ opacity: streetOpacity }}>
        <MediaSlot src={ASSETS.images.hookBackground}>
          <CityStreet />
        </MediaSlot>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <StreetBins x={BINS_X} lid={lid} />
          <Person x={PERSON_X - walk * 320} arm={arm} step={walk * 18} opacity={1 - walk * 0.9} flip={walk > 0.02} />
          {inHand ? (
            <PlasticBottle x={hand.x} y={hand.y + 10} rotate={-arm * 0.6} scale={0.9} />
          ) : flight < 1 ? (
            <PlasticBottle x={bottleX} y={bottleY} rotate={flight * 320} scale={0.9} />
          ) : null}
          {bag > 0 && bag < 1 ? (
            <rect
              x={DRY_BIN_X - 22 + (truckX + 300 - DRY_BIN_X) * bag}
              y={GROUND_Y - 170 - Math.sin(bag * Math.PI) * 80 + bag * 60}
              width={44}
              height={40}
              rx={10}
              fill="#2B3947"
            />
          ) : null}
          <GarbageTruck x={truckX} wheel={wheel} />
        </svg>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: chainOpacity }}>
        {chain.map((n, i) => (
          <FlowNode
            key={n.label}
            x={chainX}
            y={chainY(i)}
            size={88}
            icon={n.icon}
            label={n.label}
            color={n.color}
            labelPosition="right"
            labelSize={40}
            appear={c.beat("where", i, 4)}
            highlight={i === 3 ? 0.5 + Math.sin(frame * 0.2) * 0.5 : 0}
          />
        ))}
        {chain.slice(1).map((_, i) => (
          <Arrow
            key={i}
            points={link([chainX, chainY(i)] as Point, [chainX, chainY(i + 1)] as Point, 52)}
            start={c.beat("where", i + 1, 4) - 8}
            duration={10}
          />
        ))}
      </AbsoluteFill>

      <IndiaCityMap cx={620} cy={520} height={520} appear={c.at("scale")} opacity={mapOpacity} />
      <StatCard statId="generatedPerDay" x={1060} y={340} width={660} appear={c.at("scale") + 12} opacity={statOpacity} />
    </SceneShell>
  );
};

const TitleCard: React.FC<{ appear: number }> = ({ appear }) => {
  const frame = useCurrentFrame();
  const t = tween(frame, [appear, appear + 30], [0, 1]);
  const lines = ["WHERE DOES", "INDIA'S GARBAGE", "ACTUALLY GO?"];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", opacity: t }}>
      <Interactive.Div
        name="Series"
        style={{ fontFamily: FONT.mono, fontSize: 28, letterSpacing: 8, color: COLOR.accent, marginBottom: 28 }}
      >
        {VIDEO.series}
      </Interactive.Div>
      {lines.map((line, i) => (
        <div
          key={line}
          style={{
            fontSize: 112,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.02,
            color: i === 2 ? COLOR.accent : COLOR.text,
            opacity: tween(frame, [appear + i * 8, appear + i * 8 + 20], [0, 1]),
            translate: `0px ${tween(frame, [appear + i * 8, appear + i * 8 + 24], [30, 0])}px`,
          }}
        >
          {line}
        </div>
      ))}
    </AbsoluteFill>
  );
};
