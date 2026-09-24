import { AbsoluteFill, useCurrentFrame } from "remotion";
import { A330Side } from "../components/Aircraft";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { TitleText } from "../components/TitleText";
import { SOURCE } from "../data/af447";
import { COLOR, FONT, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { VIDEO } from "../data/video";
import { OceanSurface } from "../illustrations/Ocean";

// Scene 12 — Final: the night crossing, dawn over the Atlantic, the camera
// rising to the sky, the title and the sources.
export const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("ending");
  const dawnFrom = c.at("minutes") - 6;
  const riseFrom = c.at("sometimes") - 6;
  const titleAt = c.end("decisions") + 20;
  const endCard = titleAt + 170;
  const rise = tween(frame, [riseFrom, titleAt], [0, 1]);
  return (
    <SceneFrame sceneId="ending" quiet={[[titleAt - 20, c.duration]]} fadeOut={30}>
      <Shot from={0} to={dawnFrom} fadeIn={0} tag="reconstruction">
        <OceanSurface frame={frame} mood="night" horizon={520} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <A330Side x={tween(frame, [0, dawnFrom], [200, 1500], (t) => t)} y={300} scale={0.2} frame={frame} />
        </svg>
      </Shot>
      <Shot from={dawnFrom} to={titleAt} fade={60} tag="illustration">
        <AbsoluteFill style={{ background: "linear-gradient(#070f1e 0%, #121f38 45%, #1a2742 100%)" }} />
        <AbsoluteFill style={{ transform: `translateY(${rise * 380}px)` }}>
          <OceanSurface frame={frame} mood="dawn" horizon={560} />
        </AbsoluteFill>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <A330Side x={tween(frame, [riseFrom, titleAt], [1100, 1500], (t) => t)} y={tween(frame, [riseFrom, titleAt], [380, 300])} scale={0.16} frame={frame} night={false} opacity={tween(frame, [riseFrom, riseFrom + 60], [0, 0.9])} />
        </svg>
      </Shot>
      {frame >= titleAt - 20 ? <AbsoluteFill style={{ backgroundColor: "#000", opacity: tween(frame, [titleAt - 20, titleAt + 10], [0, 1]) }} /> : null}
      <TitleText text={VIDEO.title} at={titleAt + 10} hold={endCard - titleAt - 30} size={110} spacing={0.16} top="40%" />
      <TitleText text="THE FLIGHT THAT DISAPPEARED OVER THE ATLANTIC" at={titleAt + 40} hold={endCard - titleAt - 60} size={34} spacing={0.2} top="52%" color={COLOR.textDim} font="mono" weight={500} />
      <TitleText text={VIDEO.titleHi} at={titleAt + 60} hold={endCard - titleAt - 80} size={46} spacing={0.02} top="61%" font="serif" color={COLOR.amber} />
      <TitleText text="Based on the official BEA investigation" at={titleAt + 80} hold={endCard - titleAt - 100} size={24} spacing={0.2} top="72%" font="mono" color={COLOR.textFaint} weight={400} />
      {frame >= endCard - 10 ? (
        <AbsoluteFill style={{ backgroundColor: "#020406", opacity: tween(frame, [endCard - 10, endCard + 15], [0, 1]), alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 1400, textAlign: "center" }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: "0.3em", color: COLOR.amber }}>PRIMARY SOURCE</div>
            <div style={{ fontFamily: FONT.latin, fontSize: 38, fontWeight: 600, color: COLOR.text, marginTop: 16 }}>BEA — Bureau d’Enquêtes et d’Analyses</div>
            <div style={{ fontFamily: FONT.latin, fontSize: 32, color: COLOR.textDim, marginTop: 8 }}>Final Safety Investigation Report — AF447 (July 2012)</div>
            <div style={{ fontFamily: FONT.latin, fontSize: 32, color: COLOR.textDim, marginTop: 8 }}>Accident: 1 June 2009</div>
            <div style={{ fontFamily: FONT.sans, fontSize: 30, color: COLOR.text, marginTop: 44 }}>विमान में सवार 228 लोगों की स्मृति में</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 16, lineHeight: 1.8, color: COLOR.textFaint, marginTop: 40 }}>
              Cockpit and aircraft scenes are illustrated reconstructions; instrument values are approximate. No cockpit dialogue is shown or invented.
              <br />
              Narration: synthetic Hindi voice (Kokoro). Music and sound effects synthesised for this film. Primary source: {SOURCE.short}.
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </SceneFrame>
  );
};
