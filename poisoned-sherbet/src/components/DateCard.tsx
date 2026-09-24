import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, EASE, FONT, tween } from "../data/theme";
import { SAFE } from "../data/video";

// Dateline card: thin rules either side of a place and date, as on a
// 19th-century printed notice. `position` "center" for full-screen cards,
// "lower" for a lower-third over a shot.
export const DateCard: React.FC<{ text: string; sub?: string; at: number; hold: number; position?: "center" | "lower" | "upper" }> = ({
  text,
  sub,
  at,
  hold,
  position = "center",
}) => {
  const frame = useCurrentFrame();
  const p = Math.min(tween(frame, [at, at + 30], [0, 1], EASE.out), tween(frame, [at + hold, at + hold + 22], [1, 0]));
  if (p <= 0) {
    return null;
  }
  const rule = tween(frame, [at + 6, at + 40], [0, 1], EASE.out);
  const top = position === "center" ? "50%" : position === "lower" ? "74%" : "22%";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top, left: SAFE.x, right: SAFE.x, transform: "translateY(-50%)", textAlign: "center", opacity: p }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
          <div style={{ height: 1, width: 180 * rule, background: `linear-gradient(90deg, transparent, ${COLOR.brass})` }} />
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: position === "center" ? 34 : 28,
              letterSpacing: "0.32em",
              color: COLOR.candleSoft,
              textShadow: "0 2px 18px rgba(0,0,0,0.9)",
            }}
          >
            {text}
          </div>
          <div style={{ height: 1, width: 180 * rule, background: `linear-gradient(270deg, transparent, ${COLOR.brass})` }} />
        </div>
        {sub ? (
          <div style={{ marginTop: 14, fontFamily: FONT.serif, fontStyle: "italic", fontSize: 34, color: COLOR.textDim, textShadow: "0 2px 18px rgba(0,0,0,0.9)" }}>
            {sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
