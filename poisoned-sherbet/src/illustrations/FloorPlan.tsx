import { random } from "remotion";
import { COLOR, FONT } from "../data/theme";

// Schematic plan of a Resident's office and the rooms around it, used to
// show who could reach the desk and the drink. Not the actual Residency plan
// (none is used here); labelled as schematic on screen.

const ROOMS = [
  { id: "office", label: "PRIVATE OFFICE", x: 700, y: 250, w: 520, h: 380 },
  { id: "hall", label: "HALL", x: 250, y: 250, w: 450, h: 380 },
  { id: "pantry", label: "PANTRY", x: 1220, y: 250, w: 420, h: 220 },
  { id: "passage", label: "PASSAGE", x: 1220, y: 470, w: 420, h: 160 },
  { id: "verandah", label: "VERANDAH", x: 250, y: 630, w: 1390, h: 150 },
];

// Door positions (x, y, orientation) on shared walls.
export const DOORS: Record<string, [number, number, "v" | "h"]> = {
  hallOffice: [700, 440, "v"],
  officePantry: [1220, 360, "v"],
  officePassage: [1220, 560, "v"],
  officeVerandah: [960, 630, "h"],
  hallVerandah: [470, 630, "h"],
  passageVerandah: [1430, 630, "h"],
};

export const FloorPlan: React.FC<{ reveal: number; frame: number; paths?: { points: [number, number][]; start: number; speed: number; color?: string }[] }> = ({
  reveal,
  frame,
  paths = [],
}) => {
  const ink = "#c8a86f";
  return (
    <g>
      {ROOMS.map((r, i) => (
        <g key={r.id} opacity={Math.max(0, Math.min(1, reveal * 5 - i))}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.id === "office" ? "rgba(224,167,90,0.07)" : "none"} stroke={ink} strokeWidth={5} />
          <text x={r.x + r.w / 2} y={r.y + (r.id === "office" ? 60 : r.h / 2 + 10)} textAnchor="middle" fill={ink} opacity={0.75} fontFamily={FONT.mono} fontSize={22} letterSpacing="4">
            {r.label}
          </text>
        </g>
      ))}
      {Object.entries(DOORS).map(([id, [x, y, o]]) => (
        <g key={id} opacity={reveal}>
          {o === "v" ? <rect x={x - 6} y={y - 36} width={12} height={72} fill="#0f0c09" /> : <rect x={x - 36} y={y - 6} width={72} height={12} fill="#0f0c09" />}
          {o === "v" ? (
            <path d={`M${x},${y - 36} A72,72 0 0,1 ${x + 72},${y + 36}`} fill="none" stroke={ink} strokeWidth={1.5} strokeDasharray="4 6" />
          ) : (
            <path d={`M${x - 36},${y} A72,72 0 0,0 ${x + 36},${y - 72}`} fill="none" stroke={ink} strokeWidth={1.5} strokeDasharray="4 6" />
          )}
        </g>
      ))}
      {/* desk and glass */}
      <g opacity={reveal}>
        <rect x={880} y={380} width={200} height={100} fill="none" stroke={ink} strokeWidth={3} />
        <circle cx={1040} cy={410} r={13} fill={COLOR.candle} opacity={0.9} />
        <circle cx={1040} cy={410} r={26 + 6 * Math.sin(frame / 10)} fill="none" stroke={COLOR.candle} strokeOpacity={0.5} strokeWidth={2} />
      </g>
      {paths.map((p, pi) => {
        const t = (frame - p.start) * p.speed;
        if (t < 0) {
          return null;
        }
        const segs = p.points.length - 1;
        const u = Math.min(segs, t);
        const k = Math.min(segs - 1, Math.floor(u));
        const f = u - k;
        const [x1, y1] = p.points[k];
        const [x2, y2] = p.points[k + 1];
        const x = x1 + (x2 - x1) * f;
        const y = y1 + (y2 - y1) * f;
        const trail = p.points.slice(0, k + 1).map(([a, b]) => `${a},${b}`).join(" ") + ` ${x},${y}`;
        return (
          <g key={pi}>
            <polyline points={trail} fill="none" stroke={p.color ?? COLOR.textDim} strokeWidth={2} strokeDasharray="3 8" opacity={0.7} />
            <circle cx={x} cy={y} r={14} fill={p.color ?? COLOR.textDim} opacity={0.95} />
            <text x={x} y={y + 7} textAnchor="middle" fontFamily={FONT.serif} fontWeight={700} fontSize={20} fill="#0d0a08">
              ?
            </text>
            <circle cx={x} cy={y} r={22 + 4 * random(`fp-${pi}`)} fill="none" stroke={p.color ?? COLOR.textDim} strokeOpacity={0.35} />
          </g>
        );
      })}
    </g>
  );
};
