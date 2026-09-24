import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Dust } from "../components/Atmosphere";
import { CinematicTransition } from "../components/CinematicTransition";
import { CourtroomScene } from "../components/CourtroomScene";
import { DateCard } from "../components/DateCard";
import { HistoricalText } from "../components/HistoricalText";
import { RecordStack } from "../components/Letter";
import { Newspaper } from "../components/Newspaper";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { COLOR, FONT, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { SAFE } from "../data/video";

// Scene 7 — The Maharaja's defence. The commission assembles; its six
// members; defence counsel cross-examines; the questions that mattered; the
// press; the trial record.
export const Defence: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("defence");
  const courtEnd = c.at("press") - 6;
  const questions = ["WHO SAID IT?", "WHEN?", "HOW RELIABLE?", "WHAT PROVES THE CONNECTION?"];
  const qAt = c.at("moreThan") + 20;
  const qStep = Math.max(20, Math.floor((c.end("instigated") - qAt) / 4));
  return (
    <SceneFrame sceneId="defence">
      <Shot from={0} to={courtEnd} fadeIn={0} tag="reconstruction">
        <CourtroomScene
          camera={{
            from: 0,
            to: courtEnd,
            zoom: frame < c.at("ballantine") ? [1.0, 1.06] : [1.06, 1.3],
            x: frame < c.at("moreThan") ? [0, 0] : [0, -260],
            origin: [50, 55],
          }}
          names={{ at: c.at("british") + 10, until: c.at("denied") + 20 }}
          barrister={tween(frame, [c.at("ballantine") - 10, c.at("ballantine") + 20], [0, 1])}
          witness={tween(frame, [c.at("ballantine"), c.at("ballantine") + 30], [0, 1])}
          dimBench={tween(frame, [c.at("moreThan"), c.at("moreThan") + 40], [0, 0.7])}
        />
      </Shot>
      <DateCard text="FEBRUARY 1875  ·  BARODA" sub="The commission of inquiry" at={c.at("assembled") + 10} hold={c.len("assembled") + 10} position="upper" />
      {frame >= c.at("ballantine") && frame < c.at("moreThan") + 20 ? (
        <div
          style={{
            position: "absolute",
            left: SAFE.x,
            top: 300,
            opacity: Math.min(tween(frame, [c.at("ballantine") + 20, c.at("ballantine") + 45], [0, 1]), tween(frame, [c.at("moreThan"), c.at("moreThan") + 20], [1, 0])),
            textShadow: "0 2px 14px #000",
          }}
        >
          <div style={{ fontFamily: FONT.serif, fontSize: 44, fontWeight: 600, color: COLOR.text }}>Serjeant William Ballantine</div>
          <div style={{ fontFamily: FONT.mono, fontSize: 18, letterSpacing: "0.2em", color: COLOR.textDim, marginTop: 4 }}>COUNSEL FOR THE DEFENCE</div>
        </div>
      ) : null}
      {questions.map((q, i) => (
        <HistoricalText
          key={q}
          text={q}
          at={qAt + i * qStep}
          hold={courtEnd - (qAt + i * qStep) - 10}
          size={i === 3 ? 56 : 50}
          mono
          spacing={0.16}
          top={`${24 + i * 11}%`}
          align="left"
          color={i === 3 ? COLOR.poisonGlow : COLOR.candleSoft}
          style={{ left: 980 }}
        />
      ))}
      <Shot from={courtEnd} to={c.at("crossExam") - 6} tag="illustration">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #2a2016, #080605 80%)" }} />
        <Newspaper headline="THE BARODA POISONING CASE" at={courtEnd} />
      </Shot>
      <Shot from={c.at("crossExam") - 6} to={c.duration} tag="illustration">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #241a12, #060504 80%)" }} />
        <RecordStack at={c.at("crossExam") + 10} pages={9} interval={16} />
        <Dust count={50} seed="rec" opacity={0.3} />
      </Shot>
      <CinematicTransition type="iris" at={c.duration} len={50} />
    </SceneFrame>
  );
};
