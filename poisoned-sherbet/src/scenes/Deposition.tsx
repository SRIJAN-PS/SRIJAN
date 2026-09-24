import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Dust } from "../components/Atmosphere";
import { DateCard } from "../components/DateCard";
import { HistoricalText } from "../components/HistoricalText";
import { MapAnimation, PLACES } from "../components/MapAnimation";
import { PalaceScene } from "../components/PalaceScene";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { COLOR, EASE, FONT, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { Figure } from "../illustrations/Figures";
import { PalaceDoors } from "../illustrations/Palace";

const Column: React.FC<{ x: string; title: string; lines: string[]; at: number; color: string; frame: number }> = ({ x, title, lines, at, color, frame }) => (
  <div style={{ position: "absolute", left: x, top: 300, width: 640, transform: "translateX(-50%)", textAlign: "center", opacity: tween(frame, [at, at + 30], [0, 1]) }}>
    <div style={{ fontFamily: FONT.mono, fontSize: 24, letterSpacing: "0.3em", color, paddingBottom: 18, borderBottom: `1px solid ${color}` }}>{title}</div>
    {lines.map((l, i) => (
      <div key={l} style={{ fontFamily: FONT.serif, fontSize: 42, lineHeight: 1.25, color: COLOR.text, marginTop: 26, opacity: tween(frame, [at + 20 + i * 20, at + 45 + i * 20], [0, 1]) }}>
        {l}
      </div>
    ))}
  </div>
);

// Scene 9 — The fate of the Maharaja. Officials enter; the palace doors
// close; the distinction between the poisoning charge and the grounds for
// deposition; exile to Madras.
export const Deposition: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("deposition");
  const doorsFrom = c.at("deposed") - 10;
  const compareFrom = c.at("notPoisoning") - 6;
  return (
    <SceneFrame sceneId="deposition">
      <Shot from={0} to={doorsFrom} fadeIn={0} tag="reconstruction">
        <PalaceScene mood="dusk" lit={0.35} gate={0} sun={{ x: 1650, y: 820, r: 300 }} camera={{ from: 0, to: doorsFrom, zoom: [1.0, 1.1], y: [0, 10] }}>
          {new Array(6).fill(0).map((_, i) => (
            <Figure
              key={i}
              kind={i % 3 === 0 ? "officer" : "sepoy"}
              x={tween(frame, [c.at("control") - 20 + i * 8, doorsFrom], [1900 + i * 70, 1080 + i * 36], (t) => t)}
              y={968}
              scale={0.5}
              walk={frame / 5 + i}
              facing={-1}
              rim="#e3a15c"
            />
          ))}
        </PalaceScene>
      </Shot>
      <Shot from={doorsFrom} to={compareFrom} fade={20} tag="illustration">
        <PalaceDoors closed={tween(frame, [doorsFrom + 10, c.at("deposed") + 36], [0.05, 1], EASE.inOut)} />
      </Shot>
      <HistoricalText text="APRIL 1875" at={c.at("deposed") + 40} hold={compareFrom - c.at("deposed") - 50} mono size={34} spacing={0.4} top="40%" color={COLOR.brass} />
      <HistoricalText text="DEPOSED" at={c.at("deposed") + 55} hold={compareFrom - c.at("deposed") - 65} size={130} top="52%" />
      <Shot from={compareFrom} to={c.at("exile") - 6} tag="illustration">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1e1610, #060504 80%)" }} />
        <Dust count={40} seed="cmp" opacity={0.25} />
        <Column x="29%" title="THE POISONING CHARGE" lines={["Commission divided, 3–3", "No unanimous finding"]} at={compareFrom + 10} color={COLOR.poisonGlow} frame={frame} />
        <Column x="71%" title="THE DEPOSITION" lines={["Grounds given:", "misconduct, misgovernment,", "unfitness to rule"]} at={c.at("grounds") - 10} color={COLOR.verdigris} frame={frame} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <line x1={960} y1={280} x2={960} y2={280 + 480 * tween(frame, [c.at("separate"), c.at("separate") + 30], [0, 1])} stroke={COLOR.brass} strokeWidth={2} />
        </svg>
        <div style={{ position: "absolute", left: "50%", top: 820, transform: "translateX(-50%)", fontFamily: FONT.mono, fontSize: 26, letterSpacing: "0.34em", color: COLOR.candleSoft, opacity: tween(frame, [c.at("separate") + 20, c.at("separate") + 50], [0, 1]) }}>
          SEPARATE MATTERS
        </div>
      </Shot>
      <Shot from={c.at("exile") - 6} to={c.at("larger") - 6} tag="illustration">
        <MapAnimation
          keys={[
            { at: c.at("exile") - 6, center: PLACES.baroda, zoom: 3.6 },
            { at: c.at("exile") + 30, center: { lon: 76.8, lat: 17.8 }, zoom: 1.7 },
          ]}
          markers={[
            { place: PLACES.baroda, label: "BARODA", at: c.at("exile"), side: "left" },
            { place: PLACES.madras, label: "MADRAS", sub: "exile · died 1882", at: c.at("exile") + 70, color: COLOR.poisonGlow, big: true },
          ]}
          routes={[{ from: PLACES.baroda, to: PLACES.madras, at: c.at("exile") + 30, len: 70 }]}
        />
      </Shot>
      <DateCard text="EXILED" at={c.at("exile") + 40} hold={c.at("larger") - c.at("exile") - 60} position="upper" />
      <Shot from={c.at("larger") - 6} to={c.duration} tag="illustration">
        <PalaceScene mood="dusk" lit={tween(frame, [c.at("larger"), c.duration - 30], [0.45, 0], (t) => t)} sun={{ x: 1650, y: 900, r: 260 }} camera={{ from: c.at("larger") - 6, to: c.duration, zoom: [1.12, 1.0] }} />
        <AbsoluteFill style={{ backgroundColor: "#000", opacity: tween(frame, [c.duration - 70, c.duration], [0, 1]) }} />
      </Shot>
    </SceneFrame>
  );
};
