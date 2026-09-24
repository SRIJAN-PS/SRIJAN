import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Arrow } from "../components/Arrow";
import { Dust, Flicker } from "../components/Atmosphere";
import { EvidenceCard } from "../components/EvidenceCard";
import { HistoricalText } from "../components/HistoricalText";
import { Envelope } from "../components/Letter";
import { Portrait } from "../components/Portrait";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { COLOR, EASE, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { Figure } from "../illustrations/Figures";
import { Glass } from "../illustrations/Glass";
import { Corridor } from "../illustrations/Palace";

// Scene 6 — The case against the Maharaja: what the prosecution tried to
// connect, the palace corridors, the evidence cards, and the challenge.
export const Accusation: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("accusation");
  const cardsAt = c.at("other") - 20;
  const cards = [
    { label: "TESTIMONY", x: 560, y: 380 },
    { label: "ACCESS", x: 1360, y: 380 },
    { label: "PALACE CONNECTION", x: 560, y: 690 },
    { label: "ALLEGED INSTRUCTIONS", x: 1360, y: 690 },
  ];
  return (
    <SceneFrame sceneId="accusation">
      {/* the Maharaja; the line the prosecution drew */}
      <Shot from={0} to={c.at("household") - 6} fadeIn={0} tag="silhouette">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 62% 45%, #2a1d12, #070504 72%)" }} />
        <Dust count={40} seed="mr" opacity={0.3} />
        <Portrait kind="ruler" name="Maharaja Malhar Rao Gaekwad" role="RULER OF BARODA, 1870–1875" at={10} x={30} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <g opacity={tween(frame, [c.at("connect") - 10, c.at("connect") + 10], [0, 1])}>
            <Glass x={1640} y={800} scale={0.6} level={0.3} sediment={1} />
          </g>
          <Arrow from={[1560, 700]} to={[820, 640]} at={c.at("connect") + 10} len={50} color={COLOR.poisonGlow} dashed bend={0.12} head={false} />
        </svg>
      </Shot>
      {/* palace corridors */}
      <Shot from={c.at("household") - 6} to={cardsAt} tag="reconstruction">
        <Corridor progress={tween(frame, [c.at("household") - 6, cardsAt], [0, 1], EASE.slow)} lampFlicker={0.85 + 0.15 * Math.sin(frame / 3)} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <Figure kind="courtier" x={tween(frame, [c.at("household"), c.at("household") + 150], [700, 1260], (t) => t)} y={760} scale={0.55} walk={frame / 6} fill="#050403" rim="#f2b565" />
          <Figure kind="servant" x={tween(frame, [c.at("moreThanOnce") - 30, c.at("other")], [1350, 820], (t) => t)} y={740} scale={0.45} walk={frame / 6 + 1} facing={-1} fill="#050403" rim="#f2b565" />
          <g opacity={tween(frame, [c.at("moreThanOnce") + 10, c.at("moreThanOnce") + 30], [0, 1])}>
            <Envelope x={tween(frame, [c.at("moreThanOnce") + 10, c.at("other")], [900, 1040])} y={640} scale={0.6} />
          </g>
        </svg>
        <Flicker x={50} y={45} radius={60} strength={0.5} />
      </Shot>
      {/* the evidence presented */}
      <Shot from={cardsAt} to={c.duration} tag="illustration">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #22180f, #070504 80%)" }} />
        <Dust count={40} seed="ev" opacity={0.25} />
        {cards.map((k, i) => (
          <EvidenceCard key={k.label} label={k.label} x={k.x} y={k.y} at={cardsAt + 10 + i * 26} width={440} strike={c.at("attacked") + 10 + i * 12} />
        ))}
        <AbsoluteFill style={{ backgroundColor: "#000", opacity: tween(frame, [c.at("certainty") - 10, c.at("certainty") + 20, c.at("attacked") - 10, c.at("attacked") + 10], [0, 0.6, 0.6, 0.15]) }} />
      </Shot>
      <HistoricalText text="EVIDENCE IS NOT CERTAINTY" at={c.at("certainty") + 4} hold={c.at("attacked") - c.at("certainty")} size={78} color={COLOR.candleSoft} />
    </SceneFrame>
  );
};
