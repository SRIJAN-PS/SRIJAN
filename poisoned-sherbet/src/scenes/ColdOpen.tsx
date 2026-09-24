import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Dust, Flicker, Haze } from "../components/Atmosphere";
import { Camera } from "../components/Camera";
import { CinematicTransition } from "../components/CinematicTransition";
import { DateCard } from "../components/DateCard";
import { HistoricalText } from "../components/HistoricalText";
import { PalaceScene } from "../components/PalaceScene";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { Still } from "../components/Still";
import { IMAGES } from "../data/assets";
import { COLOR, EASE, FONT, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { VIDEO } from "../data/video";
import { Sediment } from "../illustrations/Glass";
import { Study } from "../illustrations/Interior";

// Scene 1 — Cold open. Black, footsteps, a lamp-lit study; the glass, the
// sips, the sediment; then the name at the centre of the case and the title.
export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("coldOpen");
  const end = c.duration;
  const title = c.end("name") + 40;
  const wrong = c.at("wrong");
  return (
    <SceneFrame sceneId="coldOpen" heading={false} quiet={[[0, c.at("date")], [title - 10, end]]} fadeIn={0} fadeOut={1}>
      {/* the study at dawn */}
      <Shot from={70} to={c.end("officer") + 6} fadeIn={60} tag="reconstruction">
        <Camera from={70} to={c.end("officer") + 30} zoom={[1.02, 1.12]} origin={[45, 60]}>
          <Study frame={frame} light={tween(frame, [70, 300], [0.3, 0.9])} />
          <Dust count={70} seed="study" area={[500, 100, 1100, 900]} />
        </Camera>
        <Flicker x={29} y={46} radius={60} strength={0.6} />
      </Shot>
      <DateCard text="BARODA  —  9 NOVEMBER 1874" at={c.at("date")} hold={c.len("date") + 60} position="upper" />

      {/* the glass is waiting */}
      <Shot from={c.at("glass") - 8} to={c.at("sips")} fade={16} tag="ai">
        <Still src={IMAGES.handGlass} from={c.at("glass") - 8} to={c.at("sips") + 20} zoom={[1.7, 1.85]} focus={[44, 62]} />
        <Flicker x={8} y={10} radius={80} strength={0.4} />
      </Shot>
      {/* he takes a few sips */}
      <Shot from={c.at("sips") - 4} to={wrong} fade={14} fadeOut={0} tag="ai">
        <Still src={IMAGES.handGlass} from={c.at("sips") - 4} to={wrong} zoom={[1.08, 1.2]} focus={[42, 52]} />
        <Flicker x={4} y={8} radius={70} strength={0.5} />
      </Shot>
      {/* something feels wrong: hard cut in, image unsteady */}
      <Shot from={wrong} to={c.end("throws")} fadeIn={0} fade={10} tag="ai">
        <AbsoluteFill style={{ transform: `translate(${Math.sin(frame * 1.7) * 3}px, ${Math.cos(frame * 1.3) * 2}px)` }}>
          <Still
            src={IMAGES.handGlass}
            from={wrong}
            to={c.end("throws")}
            zoom={[1.9, 2.05]}
            focus={[50, 30]}
            filter={`blur(${tween(frame, [c.at("throws"), c.at("throws") + 12, c.end("throws")], [0, 6, 14])}px) contrast(1.15)`}
          />
        </AbsoluteFill>
      </Shot>
      <CinematicTransition type="cut" at={wrong} len={3} />

      {/* the sediment */}
      <Shot from={c.at("notices") + 10} to={c.end("suspects") + 30} fade={30}>
        <Camera from={c.at("notices")} to={c.end("suspects") + 40} zoom={[1.0, 1.22]} origin={[53, 55]}>
          <Sediment
            reveal={tween(frame, [c.at("notices") + 40, c.end("sediment")], [0, 1], EASE.out)}
            frame={frame}
            red={tween(frame, [c.at("suspects"), c.end("suspects") + 30], [0, 1])}
          />
        </Camera>
        <Flicker x={30} y={20} radius={90} strength={0.5} />
      </Shot>

      {/* an accusation takes shape */}
      <Shot from={c.at("accusation") - 10} to={title} fade={40} tag="illustration">
        <PalaceScene mood="night" lit={tween(frame, [c.at("accusation"), c.at("name")], [0.05, 0.4])} camera={{ from: c.at("accusation"), to: title + 30, zoom: [1.0, 1.14], y: [0, 20] }} />
        <Haze opacity={0.2} seed={9} />
      </Shot>
      <HistoricalText text="MAHARAJA MALHAR RAO GAEKWAD" at={c.at("name") + 4} hold={title - c.at("name") - 30} size={76} spacing={0.14} color={COLOR.candleSoft} />

      {/* title over the glass, slow push, cut to black */}
      <Shot from={title} to={end - 12} fade={30} fadeOut={0}>
        <Still src={IMAGES.handGlass} from={title} to={end} zoom={[1.45, 1.75]} focus={[44, 60]} filter="brightness(0.55) saturate(0.8)" />
      </Shot>
      <HistoricalText text="THE POISONED SHERBET" at={title + 20} size={104} weight={600} spacing={0.1} top="43%" style={{ whiteSpace: "nowrap" }} />
      <HistoricalText text={VIDEO.subtitle} at={title + 60} size={40} weight={500} italic spacing={0.02} top="55%" color={COLOR.textDim} />
      <HistoricalText text={VIDEO.dateline.toUpperCase()} at={title + 90} size={24} mono spacing={0.4} top="63%" color={COLOR.brass} />
      {frame >= end - 12 ? <AbsoluteFill style={{ backgroundColor: "#000" }} /> : null}
      {frame < 80 ? <AbsoluteFill style={{ backgroundColor: "#000", opacity: tween(frame, [0, 80], [1, 0.0]) }} /> : null}
      {frame < 60 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 18, letterSpacing: "0.4em", color: COLOR.textFaint, opacity: tween(frame, [10, 30, 50, 60], [0, 0.8, 0.8, 0]) }}>
            BASED ON THE TRIAL RECORD OF 1875
          </div>
        </AbsoluteFill>
      ) : null}
    </SceneFrame>
  );
};
