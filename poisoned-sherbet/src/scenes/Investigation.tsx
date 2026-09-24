import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Arrow } from "../components/Arrow";
import { Dust, Haze } from "../components/Atmosphere";
import { Camera, Layer } from "../components/Camera";
import { DateCard } from "../components/DateCard";
import { EvidenceCard } from "../components/EvidenceCard";
import { HistoricalText } from "../components/HistoricalText";
import { PalaceScene } from "../components/PalaceScene";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { COLOR, EASE, FONT, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { Carriage } from "../illustrations/Carriage";
import { Figure } from "../illustrations/Figures";
import { DOORS, FloorPlan } from "../illustrations/FloorPlan";
import { Residency } from "../illustrations/Residency";
import { Sky } from "../illustrations/Sky";

const CHAIN = [
  { label: "SHERBET", note: "the drink" },
  { label: "SERVANTS", note: "access to the office" },
  { label: "MESSENGERS", note: "alleged go-betweens" },
  { label: "PALACE", note: "the Gaekwad's household" },
  { label: "MAHARAJA?", note: "the question" },
];

// Scene 5 — The strange part. Who had access; statements; the chain the
// prosecution tried to build; the special commissioner; the arrest.
export const Investigation: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("investigation");
  const chainFrom = c.at("connection") - 10;
  const [dx1, dy1] = DOORS.hallOffice;
  const [dx2, dy2] = DOORS.officePantry;
  const [dx3, dy3] = DOORS.officeVerandah;
  const [dx4, dy4] = DOORS.officePassage;
  return (
    <SceneFrame sceneId="investigation">
      {/* schematic plan: who could reach the drink? */}
      <Shot from={0} to={chainFrom} fadeIn={0}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #1b140e, #070504 80%)" }} />
        <Camera from={0} to={chainFrom} zoom={[0.92, 1.05]} origin={[50, 45]}>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
            <FloorPlan
              reveal={tween(frame, [10, 80], [0, 1])}
              frame={frame}
              paths={[
                { points: [[470, 900], [470, 630], [600, 440], [dx1, dy1], [930, 470]], start: c.at("access"), speed: 0.03, color: COLOR.candle },
                { points: [[1430, 360], [dx2, dy2], [1010, 450]], start: c.at("access") + 20, speed: 0.035, color: COLOR.candle },
                { points: [[960, 900], [dx3, dy3], [960, 520]], start: c.at("access") + 40, speed: 0.03, color: COLOR.candle },
                { points: [[1430, 900], [1430, 630], [1430, 560], [dx4, dy4], [1060, 500]], start: c.at("questioned"), speed: 0.03, color: COLOR.textDim },
              ]}
            />
          </svg>
        </Camera>
        <div style={{ position: "absolute", left: 250, top: 860, fontFamily: FONT.mono, fontSize: 18, letterSpacing: "0.2em", color: COLOR.textFaint, opacity: tween(frame, [60, 90], [0, 1]) }}>
          SCHEMATIC · NOT THE ACTUAL RESIDENCY PLAN
        </div>
        {[0, 1, 2].map((i) => (
          <EvidenceCard key={i} label="STATEMENT" x={1700 - i * 24} y={420 + i * 70} at={c.at("questioned") + 10 + i * 12} width={260} accent={COLOR.brass} />
        ))}
      </Shot>
      <HistoricalText text={"WHO PUT THE SUBSTANCE\nINTO THE SHERBET?"} at={c.at("who")} hold={c.len("who") + 60} size={58} top="15%" color={COLOR.candleSoft} weight={600} />

      {/* the chain the prosecution tried to establish */}
      <Shot from={chainFrom} to={c.at("pelly") - 4} tag="illustration">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #241a12, #080605 80%)" }} />
        <Dust count={40} seed="board" opacity={0.25} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {CHAIN.slice(0, -1).map((_, i) => (
            <Arrow key={i} from={[560 + i * 200, 200 + i * 125 + 40]} to={[560 + (i + 1) * 200, 200 + (i + 1) * 125 - 40]} at={chainFrom + 24 + i * 22} color={COLOR.poisonGlow} width={3} head={false} bend={0.2} />
          ))}
        </svg>
        {CHAIN.map((k, i) => (
          <EvidenceCard key={k.label} label={k.label} note={k.note} x={560 + i * 200} y={200 + i * 125} at={chainFrom + i * 22} width={320} highlight={i === 4 ? tween(frame, [c.at("testimony"), c.at("testimony") + 30], [0, 1]) : 0} />
        ))}
        <div style={{ position: "absolute", left: 1320, top: 170, width: 480, fontFamily: FONT.mono, fontSize: 20, letterSpacing: "0.16em", color: COLOR.poisonGlow, opacity: tween(frame, [chainFrom + 20, chainFrom + 50], [0, 1]) }}>
          THE CONNECTION INVESTIGATORS LOOKED FOR
          <div style={{ fontFamily: FONT.serif, fontStyle: "italic", fontSize: 26, letterSpacing: 0, color: COLOR.textDim, marginTop: 8 }}>as later argued by the prosecution</div>
        </div>
      </Shot>

      {/* the special commissioner arrives */}
      <Shot from={c.at("pelly") - 4} to={c.at("testimony") - 4} tag="reconstruction">
        <Camera from={c.at("pelly") - 4} to={c.at("testimony")} zoom={[1.05, 1.12]} x={[0, -30]}>
          <Layer depth={0.2}>
            <Sky mood="dusk" sun={{ x: 300, y: 700, r: 360, opacity: 0.8 }} />
          </Layer>
          <Layer depth={0.7}>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080">
              <Residency x={410} y={900} glowOpacity={0.8} />
              <rect x={0} y={898} width={1920} height={200} fill="#120e0b" />
            </svg>
          </Layer>
          <Layer depth={1.05}>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080">
              <Carriage x={tween(frame, [c.at("pelly"), c.at("testimony")], [-600, 760], EASE.out)} y={1010} scale={0.9} phase={Math.min(frame - c.at("pelly"), c.len("pelly")) / 5} rim="#e3a15c" />
            </svg>
          </Layer>
          <Haze opacity={0.18} seed={14} />
        </Camera>
      </Shot>
      <DateCard text="30 NOVEMBER 1874" sub="Sir Lewis Pelly arrives as special commissioner" at={c.at("pelly") + 10} hold={c.len("pelly") + 10} position="upper" />

      {/* the question; the arrest */}
      <Shot from={c.at("testimony") - 4} to={c.at("arrest") - 4} tag="illustration">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #1f1610, #060504 80%)" }} />
        <Dust count={40} seed="q" opacity={0.3} />
      </Shot>
      <HistoricalText text="THE QUESTION:" at={c.at("testimony") + 10} hold={c.at("arrest") - c.at("testimony") - 30} mono size={30} spacing={0.4} top="38%" color={COLOR.brass} />
      <HistoricalText text="WHO ORDERED THE POISONING?" at={c.at("testimony") + 30} hold={c.at("arrest") - c.at("testimony") - 50} size={84} top="50%" />
      <Shot from={c.at("arrest") - 4} to={c.duration} tag="reconstruction">
        <PalaceScene mood="night" lit={0.25} camera={{ from: c.at("arrest") - 4, to: c.duration, zoom: [1.1, 1.2], y: [30, 0] }}>
          {[760, 840, 1090, 1170].map((x, i) => (
            <Figure key={x} kind={i % 2 ? "officer" : "sepoy"} x={x} y={968} scale={0.55} facing={i < 2 ? 1 : -1} rim="#b8894a" />
          ))}
        </PalaceScene>
      </Shot>
      <DateCard text="JANUARY 1875" sub="The Maharaja is arrested on the orders of the Government of India" at={c.at("arrest") + 10} hold={c.duration - c.at("arrest") - 40} position="upper" />
    </SceneFrame>
  );
};
