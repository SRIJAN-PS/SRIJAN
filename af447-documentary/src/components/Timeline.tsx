import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, EASE, FONT, tween } from "../data/theme";

export type Step = { time?: string; label: string; at: number; tone?: "normal" | "warn" | "danger" };

// Vertical chain of events: each step drops in at its frame, joined by a line.
export const Timeline: React.FC<{ steps: Step[]; x?: number; top?: number; gap?: number; width?: number }> = ({ steps, x = 960, top = 170, gap = 104, width = 760 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {steps.slice(1).map((s, i) => {
          const p = tween(frame, [s.at - 12, s.at + 6], [0, 1], EASE.out);
          return <line key={s.label} x1={x - width / 2 + 34} y1={top + i * gap + 34} x2={x - width / 2 + 34} y2={top + i * gap + 34 + (gap - 20) * p} stroke={COLOR.steel} strokeWidth={2} opacity={0.6} />;
        })}
      </svg>
      {steps.map((s, i) => {
        const p = tween(frame, [s.at, s.at + 20], [0, 1], EASE.out);
        const color = s.tone === "danger" ? COLOR.red : s.tone === "warn" ? COLOR.amber : COLOR.cyan;
        return (
          <div
            key={s.label}
            style={{
              position: "absolute",
              left: x - width / 2,
              top: top + i * gap,
              width,
              display: "flex",
              alignItems: "center",
              gap: 22,
              opacity: p,
              transform: `translateX(${(1 - p) * -24}px)`,
            }}
          >
            <div style={{ width: 68, height: 68, borderRadius: 34, border: `3px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(2,6,12,0.85)" }}>
              <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: color }} />
            </div>
            <div>
              {s.time ? <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: "0.12em", color }}>{s.time}</div> : null}
              <div style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 500, color: COLOR.text, textShadow: "0 2px 12px #000" }}>{s.label}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
