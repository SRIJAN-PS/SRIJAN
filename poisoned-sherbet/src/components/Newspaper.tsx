import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLOR, EASE, FONT, tween } from "../data/theme";

// A period newspaper column carrying the headline under which the case was
// reported. Body text is deliberately illegible (no invented quotations);
// the headline is as printed, and a source label names the paper.
export const Newspaper: React.FC<{ headline: string; kicker?: string; at: number }> = ({ headline, kicker, at }) => {
  const frame = useCurrentFrame();
  const p = tween(frame, [at, at + 40], [0, 1], EASE.out);
  const rot = tween(frame, [at, at + 200], [-4, -1.5]);
  const line = (key: string, w: number) => <div key={key} style={{ height: 7, width: `${w}%`, marginBottom: 9, backgroundColor: "rgba(40,30,20,0.55)", borderRadius: 2 }} />;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: p }}>
      <div
        style={{
          width: 1000,
          height: 1300,
          transform: `translateY(${120 + (1 - p) * 60}px) rotate(${rot}deg)`,
          backgroundColor: "#e4d6b4",
          backgroundImage: "radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.25), rgba(120,90,50,0.25) 80%)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.75)",
          padding: "60px 64px",
          color: COLOR.paperInk,
        }}
      >
        <div style={{ borderTop: "3px double #3a2c1e", borderBottom: "3px double #3a2c1e", padding: "10px 0", textAlign: "center", fontFamily: FONT.mono, fontSize: 18, letterSpacing: "0.4em" }}>
          {kicker ?? "·  1875  ·"}
        </div>
        <div style={{ fontFamily: FONT.serif, fontWeight: 700, fontSize: 84, lineHeight: 1.02, textAlign: "center", margin: "34px 0 26px", letterSpacing: "0.02em" }}>{headline}</div>
        <div style={{ height: 2, backgroundColor: "#3a2c1e", marginBottom: 28 }} />
        <div style={{ display: "flex", gap: 36 }}>
          {[0, 1, 2].map((c) => (
            <div key={c} style={{ flex: 1 }}>
              {new Array(46).fill(0).map((_, i) => line(`${c}-${i}`, i % 11 === 10 ? 45 : 88 + random(`np-${c}-${i}`) * 12))}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
