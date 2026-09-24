import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Dust, Haze } from "../components/Atmosphere";
import { COMMISSIONERS } from "../components/CourtroomScene";
import { HistoricalText } from "../components/HistoricalText";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { COLOR, EASE, FONT, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { Figure } from "../illustrations/Figures";

// Scene 8 — The 3–3 division. Six silhouettes; three turn to "charge
// proved", three to "not proved". Then a slow orbit around them.
export const Commission: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("commission");
  const turnB = tween(frame, [c.at("proved"), c.at("proved") + 40], [0, 1], EASE.inOut);
  const turnI = tween(frame, [c.at("notProved"), c.at("notProved") + 40], [0, 1], EASE.inOut);
  const orbitFrom = c.at("fascinating");
  const orbit = tween(frame, [orbitFrom, c.duration], [0, 1], EASE.inOut);
  const spot = tween(frame, [0, 60], [0, 1]);
  return (
    <SceneFrame sceneId="commission" quiet={[[c.end("noUnanimous"), orbitFrom]]}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 55% at 50% 60%, rgba(60,45,30,${0.9 * spot}), #050403 75%)` }} />
      <Haze opacity={0.12} seed={21} />
      <Shot from={0} to={c.duration} fadeIn={30} tag="silhouette">
        <AbsoluteFill style={{ perspective: 2200 }}>
          {COMMISSIONERS.map((m, i) => {
            const british = m.side === "british";
            // Row positions, then a slow orbit on an ellipse.
            const rowX = 360 + i * 240;
            const angle = ((i - 2.5) / 6) * Math.PI * 1.1 + orbit * Math.PI * 0.55;
            const orbX = 960 + Math.sin(angle) * 720;
            const depth = Math.cos(angle);
            const x = rowX + (orbX - rowX) * tween(frame, [orbitFrom, orbitFrom + 60], [0, 1]);
            const s = 1 + (depth - 1) * 0.25 * tween(frame, [orbitFrom, orbitFrom + 60], [0, 1]);
            const turn = british ? -32 * turnB : 32 * turnI;
            const shift = british ? -70 * turnB : 70 * turnI;
            const color = british ? COLOR.british : COLOR.indian;
            return (
              <div
                key={m.name}
                style={{
                  position: "absolute",
                  left: x,
                  top: 820,
                  width: 0,
                  height: 0,
                  transform: `translateX(${shift * (1 - tween(frame, [orbitFrom, orbitFrom + 60], [0, 1]))}px) scale(${s}) rotateY(${turn}deg)`,
                  zIndex: Math.round(depth * 10) + 10,
                  opacity: tween(frame, [10 + i * 8, 40 + i * 8], [0, 1]),
                }}
              >
                <svg width="300" height="500" viewBox="-150 -440 300 500" style={{ position: "absolute", left: -150, top: -440, overflow: "visible" }}>
                  <ellipse cx={0} cy={0} rx={110} ry={20} fill={color} opacity={0.12} />
                  <Figure kind={british ? "barrister" : "courtier"} x={0} y={0} scale={1.25} fill="#060504" rim={color} rimOpacity={0.7} />
                </svg>
              </div>
            );
          })}
        </AbsoluteFill>
      </Shot>
      {/* verdict labels */}
      {[
        { text: "CHARGE PROVED", sub: "three British members", x: "27%", at: c.at("proved") + 20, color: COLOR.british },
        { text: "NOT PROVED", sub: "three Indian members", x: "73%", at: c.at("notProved") + 20, color: COLOR.indian },
      ].map((l) => (
        <div
          key={l.text}
          style={{
            position: "absolute",
            left: l.x,
            top: 190,
            transform: "translateX(-50%)",
            textAlign: "center",
            opacity: Math.min(tween(frame, [l.at, l.at + 30], [0, 1]), tween(frame, [orbitFrom - 20, orbitFrom + 10], [1, 0])),
          }}
        >
          <div style={{ fontFamily: FONT.mono, fontSize: 44, letterSpacing: "0.2em", color: l.color }}>{l.text}</div>
          <div style={{ fontFamily: FONT.serif, fontStyle: "italic", fontSize: 30, color: COLOR.textDim, marginTop: 6 }}>{l.sub}</div>
        </div>
      ))}
      <HistoricalText text="3  —  3" at={c.end("notProved") + 10} hold={c.at("noUnanimous") - 10 - c.end("notProved")} size={170} weight={600} top="38%" />
      <HistoricalText text="THE COMMISSION WAS DIVIDED" at={c.at("noUnanimous") + 20} hold={orbitFrom - c.at("noUnanimous") - 10} size={70} top="38%" color={COLOR.candleSoft} />
      <HistoricalText text="WAS THERE POISON?" at={c.at("wasPoison") + 20} hold={c.at("prove") - c.at("wasPoison") - 10} size={60} top="20%" color={COLOR.textDim} />
      <HistoricalText text={"WHAT DID THE EVIDENCE PROVE\nABOUT THE MAHARAJA'S RESPONSIBILITY?"} at={c.at("prove") + 20} size={52} top="20%" color={COLOR.candleSoft} />
      <Dust count={50} seed="com" opacity={0.3} />
    </SceneFrame>
  );
};
