import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Dust, Flicker, Haze } from "../components/Atmosphere";
import { Camera, Layer } from "../components/Camera";
import { DateCard } from "../components/DateCard";
import { HistoricalText, StackedWords } from "../components/HistoricalText";
import { PageWriting } from "../components/Letter";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { Still } from "../components/Still";
import { IMAGES } from "../data/assets";
import { COLOR, EASE, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { Figure } from "../illustrations/Figures";
import { Sediment } from "../illustrations/Glass";
import { Pantry, Specimen } from "../illustrations/Interior";
import { Residency } from "../illustrations/Residency";
import { Sky } from "../illustrations/Sky";
import { Skyline } from "../illustrations/Skyline";

// Diamond dust: fine glints drifting in the dark.
const Glints: React.FC<{ frame: number; at: number }> = ({ frame, at }) => (
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    {new Array(120).fill(0).map((_, i) => {
      const tw = Math.max(0, Math.sin((frame - at) / 7 + i * 2.3));
      const x = random(`gl-x${i}`) * 1920;
      const y = (random(`gl-y${i}`) * 1080 + (frame - at) * (0.3 + random(`gl-s${i}`) * 0.6)) % 1080;
      return <circle key={i} cx={x} cy={y} r={1 + random(`gl-r${i}`) * 2.2} fill="#f4f1ea" opacity={tw * 0.8 * tween(frame, [at, at + 40], [0, 1])} />;
    })}
  </svg>
);

// Scene 4 — The morning of 9 November. Sunrise, the walk, the prepared
// glass, the drink, the sediment, the analysis, the report.
export const Poisoning: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("poisoning");
  const sunY = tween(frame, [0, c.at("ready")], [900, 620], EASE.slow);
  return (
    <SceneFrame sceneId="poisoning">
      {/* sunrise over Baroda */}
      <Shot from={0} to={c.at("morning") + 30} fadeIn={0} tag="illustration">
        <Camera from={0} to={c.at("morning") + 60} zoom={[1.0, 1.06]} y={[10, -10]}>
          <Layer depth={0.15}>
            <Sky mood="dawn" sun={{ x: 1180, y: sunY, r: 420 }} />
          </Layer>
          <Layer depth={0.4}>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080">
              <Skyline seed="dawn-far" baseY={860} height={0.8} color="#3a2a2c" />
            </svg>
          </Layer>
          <Layer depth={0.75}>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080">
              <Skyline seed="dawn-near" baseY={960} height={1.6} color="#120c0a" rim="#f2c07a" />
            </svg>
          </Layer>
          <Haze opacity={0.3} seed={11} color="rgba(255,210,170,1)" />
        </Camera>
      </Shot>
      <DateCard text="MORNING  ·  9 NOVEMBER 1874" at={20} hold={c.at("morning") + 20} position="upper" />
      {/* the walk back to the Residency */}
      <Shot from={c.at("morning") + 30} to={c.at("ready") - 6} tag="reconstruction">
        <Camera from={c.at("morning")} to={c.at("ready")} zoom={[1.1, 1.18]} x={[40, -20]}>
          <Layer depth={0.2}>
            <Sky mood="dawn" sun={{ x: 1600, y: 640, r: 380 }} />
          </Layer>
          <Layer depth={0.7}>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080">
              <Residency x={560} y={880} scale={0.85} glowOpacity={0.35} />
              <rect x={0} y={878} width={1920} height={220} fill="#15110d" />
              {new Array(9).fill(0).map((_, i) => (
                <g key={i}>
                  <rect x={60 + i * 230} y={780} width={14} height={120} fill="#0b0807" />
                  <circle cx={67 + i * 230} cy={760} r={60} fill="#0b0807" />
                </g>
              ))}
            </svg>
          </Layer>
          <Layer depth={1.1}>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080">
              <path d="M0,1080 C600,1000 1200,1000 1920,960 L1920,1080 Z" fill="#1d1712" />
              <Figure kind="british" x={tween(frame, [c.at("morning") + 30, c.at("ready")], [1500, 1080], (t) => t)} y={1010} scale={0.8} walk={frame / 5} facing={-1} rim="#f2c07a" />
            </svg>
          </Layer>
          <Haze opacity={0.22} seed={12} color="rgba(255,210,170,1)" />
        </Camera>
      </Shot>
      {/* the pomelo sherbet is prepared */}
      <Shot from={c.at("ready") - 6} to={c.at("drank") - 4} tag="reconstruction">
        <Camera from={c.at("ready") - 6} to={c.at("drank") + 10} zoom={[1.0, 1.1]} origin={[65, 65]}>
          <Pantry frame={frame - c.at("ready")} />
          <Dust count={60} seed="pantry" area={[100, 100, 900, 800]} />
        </Camera>
      </Shot>
      {/* he drinks; nausea */}
      <Shot from={c.at("drank") - 4} to={c.at("discarded") + 10} fade={14} tag="ai">
        <Still
          src={IMAGES.handGlass}
          from={c.at("drank") - 4}
          to={c.at("discarded") + 10}
          zoom={[1.25, 1.4]}
          focus={[45, 45]}
          filter={`blur(${tween(frame, [c.at("nausea"), c.at("nausea") + 60], [0, 3])}px) saturate(${tween(frame, [c.at("nausea"), c.end("nausea")], [1, 0.6])})`}
        />
        <AbsoluteFill style={{ opacity: tween(frame, [c.at("nausea"), c.at("nausea") + 50], [0, 0.35]), transform: `translateX(${8 + Math.sin(frame / 9) * 10}px)` }}>
          <Still src={IMAGES.handGlass} from={c.at("drank") - 4} to={c.at("discarded") + 10} zoom={[1.27, 1.42]} focus={[45, 45]} filter="blur(4px)" />
        </AbsoluteFill>
        <Flicker x={4} y={8} radius={70} strength={0.4} />
      </Shot>
      {/* the dark substance */}
      <Shot from={c.at("discarded") + 10} to={c.at("examined") - 4} fade={24}>
        <Camera from={c.at("discarded")} to={c.at("examined")} zoom={[1.15, 1.35]} origin={[52, 55]}>
          <Sediment reveal={tween(frame, [c.at("noticed"), c.end("noticed")], [0.3, 1])} frame={frame} red={0.3} />
        </Camera>
      </Shot>
      {/* sent for examination; arsenic and diamond dust */}
      <Shot from={c.at("examined") - 4} to={c.at("reported") - 6} tag="illustration">
        <Camera from={c.at("examined")} to={c.at("reported")} zoom={[1.0, 1.1]}>
          <AbsoluteFill style={{ filter: `brightness(${tween(frame, [c.at("found"), c.at("found") + 30], [1, 0.35])})` }}>
            <Specimen />
          </AbsoluteFill>
        </Camera>
        <Glints frame={frame} at={c.at("found")} />
      </Shot>
      <DateCard text="SENT FOR CHEMICAL EXAMINATION" at={c.at("examined") + 6} hold={c.len("examined") + 10} position="upper" />
      <StackedWords
        words={[
          { text: "ARSENIC", at: c.at("found") + 30, color: COLOR.poisonGlow },
          { text: "DIAMOND DUST", at: c.at("found") + 60, color: "#f1ede4" },
        ]}
        size={110}
        top="44%"
        hold={c.end("found") + 60 - c.at("found") - 30}
      />
      {/* the report */}
      <Shot from={c.at("reported") - 6} to={c.duration} tag="reconstruction">
        <AbsoluteFill style={{ transform: "translateY(150px) scale(0.9)" }}>
          <PageWriting at={c.at("reported") - 6} duration={c.duration - c.at("reported")} lines={10} />
        </AbsoluteFill>
        <Flicker x={20} y={20} radius={80} strength={0.5} />
      </Shot>
      <HistoricalText text="ATTEMPT TO POISON" at={c.at("reported") + 30} mono size={56} spacing={0.3} top="12%" color={COLOR.poisonGlow} style={{ textShadow: "0 0 30px #000, 0 0 60px #000" }} />
    </SceneFrame>
  );
};
