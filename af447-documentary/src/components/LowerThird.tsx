import { useCurrentFrame } from "remotion";
import { COLOR, EASE, FONT, tween } from "../data/theme";
import { SAFE } from "../data/video";

// Documentary lower third: an accent bar, a label and a detail line.
export const LowerThird: React.FC<{ label: string; detail?: string; at: number; hold: number; accent?: string; position?: "lower" | "upper" }> = ({
  label,
  detail,
  at,
  hold,
  accent = COLOR.amber,
  position = "lower",
}) => {
  const frame = useCurrentFrame();
  const p = Math.min(tween(frame, [at, at + 24], [0, 1], EASE.out), tween(frame, [at + hold, at + hold + 18], [1, 0]));
  if (p <= 0) {
    return null;
  }
  const bar = tween(frame, [at, at + 30], [0, 1], EASE.out);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.x,
        ...(position === "lower" ? { bottom: SAFE.subtitleBottom + 160 } : { top: SAFE.top + 90 }),
        display: "flex",
        gap: 18,
        alignItems: "stretch",
        opacity: p,
        transform: `translateX(${(1 - p) * -20}px)`,
      }}
    >
      <div style={{ width: 5, backgroundColor: accent, transform: `scaleY(${bar})`, transformOrigin: "top" }} />
      <div style={{ textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 500, letterSpacing: "0.14em", color: COLOR.text }}>{label}</div>
        {detail ? <div style={{ fontFamily: FONT.sans, fontSize: 26, color: COLOR.textDim, marginTop: 4 }}>{detail}</div> : null}
      </div>
    </div>
  );
};
