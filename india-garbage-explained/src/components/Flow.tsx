import type { LucideIcon } from "lucide-react";
import { useCurrentFrame } from "remotion";
import { COLOR, EASE, FONT, tween } from "../config/theme";

export type Point = [number, number];

// Icon-in-a-ring node used by every flowchart. (x, y) is the ring's centre
// in 1920×1080 scene coordinates.
export const FlowNode: React.FC<{
  x: number;
  y: number;
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  appear: number;
  color?: string;
  size?: number;
  labelPosition?: "below" | "right" | "left";
  labelWidth?: number;
  labelSize?: number;
  // Opacity multiplier, e.g. 0.35 to push a node into the background.
  dim?: number;
  // 0–1 glow for the node currently being discussed.
  highlight?: number;
}> = ({
  x,
  y,
  icon: Icon,
  label,
  sublabel,
  appear,
  color = COLOR.accent,
  size = 96,
  labelPosition = "below",
  labelWidth = 260,
  labelSize = 28,
  dim = 1,
  highlight = 0,
}) => {
  const frame = useCurrentFrame();
  const t = tween(frame, [appear, appear + 18], [0, 1]);
  const pop = tween(frame, [appear, appear + 22], [0.7, 1], EASE.out);
  const labelStyle: React.CSSProperties =
    labelPosition === "below"
      ? { left: x - labelWidth / 2, top: y + size / 2 + 14, width: labelWidth, textAlign: "center" }
      : labelPosition === "right"
        ? { left: x + size / 2 + 22, top: y, width: labelWidth, translate: "0px -50%" }
        : { left: x - size / 2 - 22 - labelWidth, top: y, width: labelWidth, textAlign: "right", translate: "0px -50%" };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: t * dim }}>
      <div
        style={{
          position: "absolute",
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          border: `3px solid ${color}`,
          backgroundColor: `${color}1F`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: String(pop),
          boxShadow: `0 0 ${12 + highlight * 36}px ${color}${highlight > 0 ? "88" : "33"}`,
        }}
      >
        <Icon size={size * 0.46} color={color} strokeWidth={1.8} />
      </div>
      <div style={{ position: "absolute", ...labelStyle }}>
        <div style={{ fontFamily: FONT.sans, fontSize: labelSize, fontWeight: 600, lineHeight: 1.2, color: COLOR.text }}>
          {label}
        </div>
        {sublabel ? (
          <div style={{ marginTop: 4, fontSize: labelSize * 0.78, lineHeight: 1.25, color: COLOR.muted }}>{sublabel}</div>
        ) : null}
      </div>
    </div>
  );
};

const lengthOf = (pts: Point[]) =>
  pts.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

// Arrow that draws itself along a polyline.
export const Arrow: React.FC<{
  points: Point[];
  start: number;
  duration?: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  opacity?: number;
}> = ({ points, start, duration = 16, color = COLOR.muted, width = 3, dashed = false, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const progress = tween(frame, [start, start + duration], [0, 1], EASE.inOut);
  if (progress <= 0) {
    return null;
  }
  const total = lengthOf(points);
  let remaining = progress * total;
  const drawn: Point[] = [points[0]];
  let dir: Point = [1, 0];
  for (let i = 1; i < points.length && remaining > 0; i++) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    const seg = Math.hypot(bx - ax, by - ay);
    dir = [(bx - ax) / seg, (by - ay) / seg];
    const take = Math.min(seg, remaining);
    drawn.push([ax + dir[0] * take, ay + dir[1] * take]);
    remaining -= take;
  }
  const [ex, ey] = drawn[drawn.length - 1];
  const head = 14;
  const nx = -dir[1];
  const ny = dir[0];
  const d = drawn.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", opacity }}>
      <path
        d={d}
        stroke={color}
        strokeWidth={width}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? "10 10" : undefined}
      />
      <path
        d={`M${ex - dir[0] * head + nx * head * 0.6} ${ey - dir[1] * head + ny * head * 0.6} L${ex} ${ey} L${ex - dir[0] * head - nx * head * 0.6} ${ey - dir[1] * head - ny * head * 0.6}`}
        stroke={color}
        strokeWidth={width}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Straight connector between two node centres, trimmed so it stops short of
// both rings.
export const link = (a: Point, b: Point, gapA = 62, gapB = gapA): Point[] => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ux = (b[0] - a[0]) / len;
  const uy = (b[1] - a[1]) / len;
  return [
    [a[0] + ux * gapA, a[1] + uy * gapA],
    [b[0] - ux * gapB, b[1] - uy * gapB],
  ];
};
