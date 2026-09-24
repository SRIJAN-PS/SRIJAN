import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, EASE, FONT, tween } from "../data/theme";

export type TimelineEvent = { date: string; label: string; at: number; tone?: "record" | "question" };

// Horizontal dated timeline; each event appears at its frame.
export const Timeline: React.FC<{ events: TimelineEvent[]; top?: number; dim?: number }> = ({ events, top = 470, dim = 0 }) => {
  const frame = useCurrentFrame();
  const x0 = 180;
  const x1 = 1740;
  const first = events[0]?.at ?? 0;
  const lineP = tween(frame, [first - 20, first + 30], [0, 1], EASE.out);
  return (
    <AbsoluteFill style={{ opacity: 1 - dim * 0.75 }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <line x1={x0} y1={top} x2={x0 + (x1 - x0) * lineP} y2={top} stroke={COLOR.brass} strokeWidth={2} opacity={0.7} />
        {events.map((e, i) => {
          const x = x0 + ((x1 - x0) * (i + 0.5)) / events.length;
          const p = tween(frame, [e.at, e.at + 18], [0, 1], EASE.out);
          return (
            <g key={e.label} opacity={p}>
              <circle cx={x} cy={top} r={10 * p} fill={e.tone === "question" ? COLOR.poison : COLOR.candle} />
              <circle cx={x} cy={top} r={22 * p} fill="none" stroke={e.tone === "question" ? COLOR.poison : COLOR.candle} strokeOpacity={0.4} />
            </g>
          );
        })}
      </svg>
      {events.map((e, i) => {
        const x = x0 + ((x1 - x0) * (i + 0.5)) / events.length;
        const p = tween(frame, [e.at, e.at + 22], [0, 1], EASE.out);
        const below = i % 2 === 1;
        return (
          <div
            key={e.label}
            style={{
              position: "absolute",
              left: x,
              top: below ? top + 42 : top - 42,
              width: 250,
              transform: `translate(-50%, ${below ? 0 : -100}%) translateY(${(1 - p) * (below ? 12 : -12)}px)`,
              opacity: p,
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: FONT.mono, fontSize: 19, letterSpacing: "0.14em", color: COLOR.candleSoft }}>{e.date}</div>
            <div style={{ fontFamily: FONT.serif, fontSize: 30, lineHeight: 1.15, color: COLOR.text, marginTop: 6 }}>{e.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
