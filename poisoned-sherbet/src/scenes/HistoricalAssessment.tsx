import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Dust, Flicker } from "../components/Atmosphere";
import { HistoricalText } from "../components/HistoricalText";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { Still } from "../components/Still";
import { Timeline } from "../components/Timeline";
import { IMAGES } from "../data/assets";
import { COLOR, EASE, FONT, tween } from "../data/theme";
import { cuesOf } from "../data/timing";

// Scene 10 — What really happened? What the record establishes, what it
// does not, and three readings of the evidence.
export const HistoricalAssessment: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("assessment");
  const tlFrom = c.at("confidence") - 6;
  const splitFrom = c.at("matters") - 10;
  const optionsFrom = c.at("readings") - 10;
  const options = ["THE PROSECUTION WAS RIGHT", "THE EVIDENCE WAS INSUFFICIENT", "A LARGER POLITICAL CONFLICT SHAPED THE CASE"];
  return (
    <SceneFrame sceneId="assessment">
      <Shot from={0} to={tlFrom} fadeIn={0} tag="ai">
        <Still src={IMAGES.handGlass} from={0} to={tlFrom + 20} zoom={[1.4, 1.6]} focus={[44, 62]} filter="brightness(0.85)" />
        <Flicker x={8} y={10} radius={80} strength={0.4} />
      </Shot>
      <Shot from={tlFrom} to={splitFrom}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1d150f, #060504 80%)" }} />
        <Dust count={40} seed="tl" opacity={0.25} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: FONT.mono, fontSize: 24, letterSpacing: "0.36em", color: COLOR.verdigris, opacity: tween(frame, [tlFrom + 10, tlFrom + 40], [0, 1]) * (1 - tween(frame, [c.at("uncontested"), c.at("uncontested") + 30], [0, 1])) }}>
          ESTABLISHED BY THE RECORD
        </div>
        <Timeline
          top={520}
          dim={tween(frame, [c.at("uncontested"), c.at("uncontested") + 40], [0, 1])}
          events={[
            { date: "9 NOV 1874", label: "Phayre reports suspicious material", at: c.at("reported") },
            { date: "NOV 1874 –", label: "Investigation and testimony", at: c.at("followed") },
            { date: "JAN 1875", label: "The Maharaja accused and arrested", at: c.at("accused") },
            { date: "FEB–MAR 1875", label: "Commission divided, 3–3", at: c.at("divided") },
            { date: "APR 1875", label: "Malhar Rao deposed", at: c.at("deposed") },
          ]}
        />
        <HistoricalText text="?" at={c.at("uncontested") + 30} size={320} weight={600} top="50%" color={COLOR.poisonGlow} style={{ opacity: 0.8 }} />
      </Shot>
      <Shot from={splitFrom} to={optionsFrom}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1d150f, #060504 80%)" }} />
        {[
          { x: "29%", title: "WHAT THE RECORDS ESTABLISH", color: COLOR.verdigris, at: c.at("separate") + 10 },
          { x: "71%", title: "WHAT HISTORIANS INTERPRET", color: COLOR.candle, at: c.at("separate") + 50 },
        ].map((s) => (
          <div key={s.title} style={{ position: "absolute", left: s.x, top: "44%", transform: "translate(-50%, -50%)", width: 700, textAlign: "center", opacity: tween(frame, [s.at, s.at + 30], [0, 1]) }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 30, letterSpacing: "0.22em", color: s.color, padding: "34px 0", borderTop: `1px solid ${s.color}`, borderBottom: `1px solid ${s.color}` }}>{s.title}</div>
          </div>
        ))}
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <line x1={960} y1={330} x2={960} y2={330 + 300 * tween(frame, [c.at("separate"), c.at("separate") + 40], [0, 1], EASE.out)} stroke={COLOR.brass} strokeWidth={2} />
        </svg>
      </Shot>
      <HistoricalText text="THAT DISTINCTION MATTERS" at={c.at("matters") - 4} hold={c.at("separate") - c.at("matters")} size={60} top="44%" color={COLOR.candleSoft} />
      <Shot from={optionsFrom} to={c.duration} tag="ai">
        <Still src={IMAGES.handGlass} from={optionsFrom} to={c.duration} zoom={[1.55, 1.7]} focus={[44, 62]} filter="brightness(0.4) saturate(0.7)" />
        {options.map((o, i) => {
          const at = optionsFrom + 30 + i * 40;
          const p = tween(frame, [at, at + 30], [0, 1], EASE.out);
          return (
            <div key={o} style={{ position: "absolute", left: 300 + i * 660, top: 470, width: 560, transform: `translate(-50%, ${(1 - p) * 30}px)`, opacity: p, textAlign: "center" }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: "0.3em", color: COLOR.brass }}>{`OPTION ${i + 1}`}</div>
              <div style={{ marginTop: 16, padding: "28px 24px", border: `1px solid ${COLOR.brass}`, backgroundColor: "rgba(8,6,4,0.75)", fontFamily: FONT.serif, fontSize: 42, fontWeight: 600, lineHeight: 1.12, color: COLOR.text }}>{o}</div>
            </div>
          );
        })}
      </Shot>
    </SceneFrame>
  );
};
