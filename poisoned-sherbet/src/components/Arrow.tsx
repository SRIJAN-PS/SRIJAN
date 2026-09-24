import { useCurrentFrame } from "remotion";
import { EASE, tween } from "../data/theme";

// A line that draws itself from `from` to `to` (SVG coordinates), with an
// optional curve and arrowhead. Place inside a 1920×1080 <svg>.
export const Arrow: React.FC<{
  from: [number, number];
  to: [number, number];
  at: number;
  len?: number;
  bend?: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  head?: boolean;
  opacity?: number;
}> = ({ from, to, at, len = 30, bend = 0, color = "#d9a55b", width = 3, dashed, head = true, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const p = tween(frame, [at, at + len], [0, 1], EASE.inOut);
  if (p <= 0) {
    return null;
  }
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const d = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
  // Approximate length for the dash animation.
  const L = Math.hypot(mx - x1, my - y1) + Math.hypot(x2 - mx, y2 - my);
  const ang = Math.atan2(y2 - my, x2 - mx);
  const hx = x2;
  const hy = y2;
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? "10 12" : `${L} ${L}`} strokeDashoffset={dashed ? 0 : L * (1 - p)} opacity={dashed ? p : 1} />
      {head && p > 0.95 ? (
        <path
          d={`M${hx},${hy} L${hx - 18 * Math.cos(ang - 0.45)},${hy - 18 * Math.sin(ang - 0.45)} L${hx - 18 * Math.cos(ang + 0.45)},${hy - 18 * Math.sin(ang + 0.45)} Z`}
          fill={color}
          opacity={(p - 0.95) * 20}
        />
      ) : null}
    </g>
  );
};

// Point along the same quadratic curve at t (0..1): for moving objects along an arrow.
export const alongCurve = (from: [number, number], to: [number, number], t: number, bend = 0): [number, number] => {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const u = 1 - t;
  return [u * u * x1 + 2 * u * t * mx + t * t * x2, u * u * y1 + 2 * u * t * my + t * t * y2];
};
