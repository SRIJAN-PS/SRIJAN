import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CockpitView, PFD, flightState } from "../components/Cockpit";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { COLOR, EASE, FONT, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { NightSky } from "../illustrations/Scenery";

const CHAIN = ["Pitot probe", "Sensor problem", "Autopilot disconnect", "Conflicting information", "Human response", "Stall"];

// Scene 10 — The real mystery: not only what happened, but why.
export const RealMystery: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("realMystery");
  const splitFrom = c.at("question") - 6;
  const chainFrom = c.at("notOne") - 6;
  const lit = [c.at("f1"), c.at("f1") + 20, c.at("f2"), c.at("f3"), c.at("f4"), c.at("f5")];
  const items = [
    { text: "modern passenger aircraft", at: c.at("modern") },
    { text: "advanced computers", at: c.at("computers") },
    { text: "experienced pilots", at: c.at("pilots") },
    { text: "multiple safety systems", at: c.at("systems") },
  ];
  return (
    <SceneFrame sceneId="realMystery">
      <Shot from={0} to={splitFrom} fadeIn={0} tag="reconstruction">
        <AbsoluteFill style={{ transform: `scale(${tween(frame, [0, splitFrom], [1.05, 1.15])})` }}>
          <CockpitView frame={frame} crew={2} outside={<NightSky frame={frame} horizon={380} stars={60} />}>
            <div style={{ position: "absolute", left: 300, top: 560, opacity: 0.7 }}>
              <PFD s={flightState(0)} size={260} blink />
            </div>
            <div style={{ position: "absolute", left: 1490, top: 560, opacity: 0.7 }}>
              <PFD s={flightState(0)} size={260} blink />
            </div>
          </CockpitView>
        </AbsoluteFill>
      </Shot>
      <Shot from={splitFrom} to={chainFrom} tag="illustration">
        <AbsoluteFill style={{ background: "linear-gradient(90deg, #06101c 0%, #06101c 50%, #120a06 50%, #120a06 100%)" }} />
        {[
          { x: "25%", title: "WHAT HAPPENED", color: COLOR.cyan, sub: "क्या हुआ" },
          { x: "75%", title: "WHY IT HAPPENED", color: COLOR.amber, sub: "क्यों हुआ" },
        ].map((s) => (
          <div key={s.title} style={{ position: "absolute", left: s.x, top: 190, transform: "translateX(-50%)", textAlign: "center" }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 40, letterSpacing: "0.2em", color: s.color }}>{s.title}</div>
            <div style={{ fontFamily: FONT.sans, fontSize: 32, color: COLOR.textDim, marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
        <div style={{ position: "absolute", left: "25%", top: 380, transform: "translateX(-50%)", width: 700, textAlign: "center", fontFamily: FONT.sans, fontSize: 36, lineHeight: 1.6, color: COLOR.text }}>
          Pitot probes → unreliable airspeed → autopilot off → climb → stall → impact
          <div style={{ fontFamily: FONT.mono, fontSize: 20, color: COLOR.textFaint, marginTop: 14 }}>ESTABLISHED BY THE FLIGHT RECORDERS</div>
        </div>
        {items.map((it, i) => (
          <div
            key={it.text}
            style={{
              position: "absolute",
              left: "75%",
              top: 360 + i * 90,
              transform: `translateX(-50%) translateY(${(1 - tween(frame, [it.at, it.at + 16], [0, 1], EASE.out)) * 16}px)`,
              opacity: tween(frame, [it.at, it.at + 16], [0, 1]),
              fontFamily: FONT.latin,
              fontSize: 40,
              color: COLOR.text,
            }}
          >
            ✓ {it.text}
          </div>
        ))}
        <div style={{ position: "absolute", left: "75%", top: 740, transform: "translateX(-50%)", fontFamily: FONT.sans, fontSize: 48, fontWeight: 600, color: COLOR.amber, opacity: tween(frame, [c.at("how"), c.at("how") + 20], [0, 1]) }}>
          …फिर भी?
        </div>
      </Shot>
      <Shot from={chainFrom} to={c.duration} tag="illustration">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #0d1827, #020408 80%)" }} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {CHAIN.map((step, i) => {
              const on = tween(frame, [lit[i], lit[i] + 16], [0, 1]);
              const last = i === CHAIN.length - 1;
              return (
                <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 230,
                      height: 150,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      padding: 12,
                      border: `2px solid ${last ? COLOR.red : COLOR.amber}`,
                      backgroundColor: `rgba(${last ? "229,72,77" : "242,169,59"},${0.08 + 0.25 * on})`,
                      fontFamily: FONT.latin,
                      fontSize: 28,
                      fontWeight: 600,
                      color: COLOR.text,
                      opacity: 0.25 + 0.75 * on,
                      transform: `scale(${0.94 + 0.06 * on})`,
                    }}
                  >
                    {step}
                  </div>
                  {!last ? <div style={{ fontSize: 34, color: COLOR.textDim, opacity: 0.3 + 0.7 * on }}>→</div> : null}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Shot>
    </SceneFrame>
  );
};
