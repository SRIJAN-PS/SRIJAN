import { useCurrentFrame } from "remotion";
import { COLOR, EASE, FONT, tween } from "../data/theme";

// A clean data card for key facts and evidence (e.g. a recorder, a figure).
export const EvidenceCard: React.FC<{ title: string; value?: string; note?: string; x: number; y: number; at: number; width?: number; accent?: string; until?: number }> = ({
  title,
  value,
  note,
  x,
  y,
  at,
  width = 420,
  accent = COLOR.amber,
  until,
}) => {
  const frame = useCurrentFrame();
  const p = Math.min(tween(frame, [at, at + 22], [0, 1], EASE.out), until ? tween(frame, [until, until + 18], [1, 0]) : 1);
  if (p <= 0) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        transform: `translate(-50%, -50%) translateY(${(1 - p) * 20}px)`,
        opacity: p,
        padding: "22px 26px",
        borderTop: `3px solid ${accent}`,
        backgroundColor: "rgba(4,10,18,0.82)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: "0.16em", color: accent }}>{title}</div>
      {value ? <div style={{ fontFamily: FONT.latin, fontSize: 56, fontWeight: 700, color: COLOR.text, marginTop: 6 }}>{value}</div> : null}
      {note ? <div style={{ fontFamily: FONT.sans, fontSize: 26, color: COLOR.textDim, marginTop: 6, lineHeight: 1.35 }}>{note}</div> : null}
    </div>
  );
};
