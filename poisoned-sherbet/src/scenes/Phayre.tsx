import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Dust, Haze } from "../components/Atmosphere";
import { Camera, Layer } from "../components/Camera";
import { PalaceScene } from "../components/PalaceScene";
import { Portrait } from "../components/Portrait";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { COLOR, EASE, FONT, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { Carriage } from "../illustrations/Carriage";
import { Figure } from "../illustrations/Figures";
import { Residency } from "../illustrations/Residency";
import { Sky } from "../illustrations/Sky";
import { Skyline } from "../illustrations/Skyline";
import { Glass } from "../illustrations/Glass";

const ResidencyView: React.FC<{ frame: number; from: number; to: number; carriageAt?: number; tint?: string }> = ({ frame, from, to, carriageAt, tint }) => (
  <AbsoluteFill>
    <Camera from={from} to={to} zoom={[1.04, 1.12]} x={[30, -30]}>
      <Layer depth={0.2}>
        <Sky mood="dawn" sun={{ x: 1500, y: 640, r: 340, opacity: 0.8 }} />
      </Layer>
      <Layer depth={0.4}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          <Skyline seed="res-far" baseY={860} height={0.6} color="#2a2024" />
        </svg>
      </Layer>
      <Layer depth={0.7}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          <Residency x={410} y={900} scale={1} glowOpacity={0.45} />
          <rect x={0} y={898} width={1920} height={200} fill="#15110d" />
          <path d="M860,1080 L940,900 L1020,900 L1140,1080 Z" fill="#2a2119" />
          <Figure kind="sepoy" x={330} y={930} scale={0.5} rim="#f2c07a" />
          <Figure kind="sepoy" x={1600} y={930} scale={0.5} rim="#f2c07a" facing={-1} />
        </svg>
      </Layer>
      <Layer depth={1.05}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          {carriageAt !== undefined ? (
            <Carriage x={tween(frame, [carriageAt, carriageAt + 260], [-700, 2100], (t) => t)} y={1010} scale={0.9} phase={(frame - carriageAt) / 5} rim="#f2c07a" />
          ) : null}
          <Figure kind="british" x={tween(frame, [from, to], [1300, 1180], (t) => t)} y={1000} scale={0.62} walk={frame / 5} facing={-1} rim="#f2c07a" />
        </svg>
      </Layer>
      <Haze opacity={0.16} seed={2} />
    </Camera>
    {tint ? <AbsoluteFill style={{ backgroundColor: tint, mixBlendMode: "color" }} /> : null}
  </AbsoluteFill>
);

const CityView: React.FC<{ frame: number; from: number; to: number }> = ({ frame, from, to }) => (
  <Camera from={from} to={to} zoom={[1.02, 1.1]} x={[-30, 30]}>
    <Layer depth={0.2}>
      <Sky mood="dawn" sun={{ x: 420, y: 700, r: 420, opacity: 0.7 }} />
    </Layer>
    <Layer depth={0.45}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <Skyline seed="city-far" baseY={780} height={0.9} color="#3a2c28" />
      </svg>
    </Layer>
    <Layer depth={0.7}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <Skyline seed="city-mid" baseY={880} height={1.5} color="#261d17" rim="#e6b77a" windows="#e6a95a" />
        <rect x={0} y={878} width={1920} height={220} fill="#1c1510" />
      </svg>
    </Layer>
    <Layer depth={1.1}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {[
          ["servant", 200, 1.0, 1],
          ["courtier", 620, 0.8, -1],
          ["servant", 1100, 1.1, 1],
          ["courtier", 1500, 0.9, -1],
          ["servant", 1760, 1.2, -1],
        ].map(([k, x0, s, dir], i) => (
          <Figure
            key={i}
            kind={k as "servant" | "courtier"}
            x={(x0 as number) + (dir as number) * (frame - from) * 1.1}
            y={1040}
            scale={(s as number) * 0.75}
            facing={dir as 1 | -1}
            walk={frame / 6 + i}
            rim="#e6b77a"
          />
        ))}
      </svg>
    </Layer>
    <Dust count={60} seed="city" opacity={0.4} />
  </Camera>
);

// Scene 2 — Who was Colonel Phayre? The Resident, the Residency, the
// Gaekwad state, and the split between them.
export const Phayre: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("phayre");
  const split = c.at("strained") - 10;
  const splitOpen = tween(frame, [c.at("notStory"), c.end("building") + 40], [0, 1], EASE.inOut);
  return (
    <SceneFrame sceneId="phayre">
      <Shot from={0} to={c.at("notDiplomat")} fadeIn={0} tag="silhouette">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 45%, #2a2016, #080605 70%)" }} />
        <Dust count={40} seed="p1" opacity={0.3} />
        <Portrait kind="resident" name="Colonel Robert Phayre" role="BRITISH RESIDENT AT BARODA, 1873–74" at={10} x={33} />
      </Shot>
      <Shot from={c.at("notDiplomat")} to={c.at("gaekwad") - 6} tag="reconstruction">
        <ResidencyView frame={frame} from={c.at("notDiplomat")} to={c.at("gaekwad")} carriageAt={c.at("notDiplomat") + 20} />
      </Shot>
      <Shot from={c.at("gaekwad") - 6} to={split} tag="reconstruction">
        <CityView frame={frame} from={c.at("gaekwad") - 6} to={c.at("strained") + 10} />
      </Shot>
      <Shot from={split} to={c.duration} tag="illustration">
        {/* split screen: Residency | Palace */}
        <AbsoluteFill style={{ clipPath: `inset(0 ${50 + splitOpen * 4}% 0 0)`, transform: `translateX(${-splitOpen * 60}px)` }}>
          <ResidencyView frame={frame} from={split} to={c.duration} tint="rgba(80,110,160,0.35)" />
        </AbsoluteFill>
        <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${50 + splitOpen * 4}%)`, transform: `translateX(${splitOpen * 60}px)` }}>
          <PalaceScene mood="dusk" camera={{ from: split, to: c.duration, zoom: [1.05, 1.12], x: [-420, -460] }} lit={0.5} />
        </AbsoluteFill>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <line x1={960} y1={0} x2={960} y2={1080} stroke={COLOR.candle} strokeWidth={3} opacity={0.7 * (1 - splitOpen)} />
          {splitOpen > 0.05 ? <Glass x={960} y={640} scale={0.7 * splitOpen} level={0.75} /> : null}
        </svg>
        {[
          { x: "25%", top: "BRITISH RESIDENCY", bottom: "BRITISH RESIDENT", color: COLOR.british },
          { x: "75%", top: "GAEKWAD PALACE", bottom: "MAHARAJA OF BARODA", color: COLOR.indian },
        ].map((s) => (
          <div key={s.top} style={{ position: "absolute", left: s.x, top: 230, transform: "translateX(-50%)", textAlign: "center", opacity: tween(frame, [split + 10, split + 40], [0, 1]) * (1 - splitOpen * 0.6) }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: "0.3em", color: s.color }}>{s.top}</div>
            <div style={{ fontFamily: FONT.serif, fontSize: 52, fontWeight: 600, color: COLOR.text, marginTop: 10, textShadow: "0 2px 20px #000" }}>{s.bottom}</div>
          </div>
        ))}
      </Shot>
      <Haze opacity={0.1} seed={4} />
    </SceneFrame>
  );
};
