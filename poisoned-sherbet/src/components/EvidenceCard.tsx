import { random, useCurrentFrame } from "remotion";
import { COLOR, EASE, FONT, tween } from "../data/theme";

// A pinned paper card, dropped onto a dark board. `strike` greys the card
// out and stamps a question mark over it (evidence under challenge).
export const EvidenceCard: React.FC<{
  label: string;
  note?: string;
  x: number;
  y: number;
  at: number;
  width?: number;
  accent?: string;
  strike?: number;
  highlight?: number;
}> = ({ label, note, x, y, at, width = 380, accent = COLOR.poison, strike = 0, highlight = 0 }) => {
  const frame = useCurrentFrame();
  const p = tween(frame, [at, at + 22], [0, 1], EASE.out);
  if (p <= 0) {
    return null;
  }
  const rot = (random(`card-${label}`) - 0.5) * 5;
  const s = strike > 0 ? tween(frame, [strike, strike + 20], [0, 1]) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${1.25 - 0.25 * p})`,
        opacity: p,
        padding: "26px 28px 22px",
        backgroundColor: COLOR.parchment,
        backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(80,60,30,0.12) 100%)",
        boxShadow: `0 18px 40px rgba(0,0,0,0.6), 0 0 ${60 * highlight}px rgba(208,80,60,${0.5 * highlight})`,
        filter: `saturate(${1 - s * 0.7}) brightness(${1 - s * 0.35})`,
      }}
    >
      <div style={{ position: "absolute", top: -12, left: "50%", width: 22, height: 22, marginLeft: -11, borderRadius: 11, backgroundColor: accent, boxShadow: "0 3px 6px rgba(0,0,0,0.5)" }} />
      <div style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 500, letterSpacing: "0.14em", color: COLOR.paperInk, textAlign: "center" }}>{label}</div>
      {note ? <div style={{ fontFamily: FONT.serif, fontStyle: "italic", fontSize: 26, color: "#5b4a36", textAlign: "center", marginTop: 8 }}>{note}</div> : null}
      {s > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT.serif,
            fontSize: 230,
            lineHeight: 1,
            fontWeight: 700,
            color: COLOR.poison,
            opacity: s * 0.92,
            textShadow: "0 4px 18px rgba(0,0,0,0.5)",
            transform: `scale(${1.4 - 0.4 * s})`,
          }}
        >
          ?
        </div>
      ) : null}
    </div>
  );
};
