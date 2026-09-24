import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Dust } from "../components/Atmosphere";
import { HistoricalText } from "../components/HistoricalText";
import { PalaceScene } from "../components/PalaceScene";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { Still } from "../components/Still";
import { IMAGES } from "../data/assets";
import { SOURCES } from "../data/sources";
import { COLOR, FONT, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { VIDEO } from "../data/video";

const END_SOURCES = [SOURCES.bhc.full, SOURCES.trial.full, SOURCES.ior.full, SOURCES.dnb.full, SOURCES.press.full];

// Scene 11 — The final question, closing cards and the end card.
export const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("ending");
  const cards = c.end("intervene") + 45;
  const summary = cards + 150;
  const question = summary + 165;
  const endCard = question + 140;
  return (
    <SceneFrame sceneId="ending" quiet={[[cards - 20, c.duration]]} fadeOut={30}>
      <Shot from={0} to={c.at("oneGlass") + 70} fadeIn={0} tag="ai">
        <Still src={IMAGES.handGlass} from={0} to={c.at("oneGlass") + 90} zoom={[1.6, 1.45]} focus={[44, 62]} filter="brightness(0.8)" />
      </Shot>
      <Shot from={c.at("oneGlass") + 70} to={cards} fade={70} tag="illustration">
        <PalaceScene mood="dusk" lit={0.55} sun={{ x: 1600, y: 860, r: 360 }} camera={{ from: c.at("oneGlass") + 70, to: cards + 60, zoom: [1.25, 1.02], y: [60, 0] }} />
      </Shot>
      <Shot from={cards} to={endCard - 20} fade={30}>
        <PalaceScene mood="dusk" lit={0.3} sun={{ x: 1600, y: 900, r: 300 }} camera={{ from: cards, to: endCard, zoom: [1.02, 1.0] }} />
        <AbsoluteFill style={{ backgroundColor: "#000", opacity: 0.62 }} />
      </Shot>
      <HistoricalText text="THE POISONED SHERBET" at={cards + 10} hold={summary - cards - 30} size={110} top="44%" />
      <HistoricalText text="BARODA  —  1874" at={cards + 40} hold={summary - cards - 60} mono size={30} spacing={0.4} top="56%" color={COLOR.brass} />
      <HistoricalText text={"AN ALLEGATION.\nA DIVIDED COMMISSION.\nA DEPOSED MAHARAJA."} at={summary} hold={question - summary - 30} size={70} top="48%" color={COLOR.candleSoft} />
      <HistoricalText text="WHAT DO YOU THINK THE EVIDENCE SHOWS?" at={question} hold={endCard - question - 40} size={54} top="48%" style={{ whiteSpace: "nowrap" }} />
      {frame >= endCard - 20 ? (
        <AbsoluteFill style={{ backgroundColor: "#060504", opacity: tween(frame, [endCard - 20, endCard + 10], [0, 1]) }}>
          <Dust count={40} seed="end" opacity={0.25} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", opacity: tween(frame, [endCard, endCard + 30], [0, 1]) }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 96, fontWeight: 600, letterSpacing: "0.08em", color: COLOR.text }}>THE POISONED SHERBET</div>
            <div style={{ fontFamily: FONT.serif, fontStyle: "italic", fontSize: 40, color: COLOR.textDim, marginTop: 10 }}>{VIDEO.subtitle}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: "0.4em", color: COLOR.brass, marginTop: 20 }}>BARODA, 1874  ·  HISTORICAL DOCUMENTARY</div>
          </div>
          <div style={{ position: "absolute", left: 300, right: 300, top: 520, opacity: tween(frame, [endCard + 20, endCard + 50], [0, 1]) }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 20, letterSpacing: "0.34em", color: COLOR.brass, marginBottom: 16 }}>SOURCES</div>
            {END_SOURCES.map((s) => (
              <div key={s} style={{ fontFamily: FONT.serif, fontSize: 28, lineHeight: 1.35, color: COLOR.text, marginBottom: 6 }}>
                {s}
              </div>
            ))}
            <div style={{ fontFamily: FONT.mono, fontSize: 17, lineHeight: 1.7, letterSpacing: "0.04em", color: COLOR.textFaint, marginTop: 26 }}>
              Dramatized scenes are illustrated reconstructions; portraits are silhouettes, not likenesses. One still is AI-generated (FLUX.2 Pro).
              <br />
              Narration: synthetic voice (Kokoro). Music and sound effects: synthesised for this film. No archival footage is used.
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </SceneFrame>
  );
};
