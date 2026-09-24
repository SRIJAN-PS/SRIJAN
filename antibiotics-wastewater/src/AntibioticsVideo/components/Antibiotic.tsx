import { COLORS } from "../theme";

// Stylised beta-lactam-like antibiotic: a six-membered ring fused to a
// four-membered ring with a carbonyl oxygen.
const HEX = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 3) * i + Math.PI / 6;
  return [Math.cos(a) * 14 - 6, Math.sin(a) * 14];
});
const SQUARE = [
  [6.12, -7],
  [20, -7],
  [20, 7],
  [6.12, 7],
];
const toPoints = (pts: number[][]) => pts.map((p) => p.join(",")).join(" ");

export const Antibiotic: React.FC<{
  x: number;
  y: number;
  size?: number;
  rotate?: number;
  opacity?: number;
  color?: string;
}> = ({ x, y, size = 40, rotate = 0, opacity = 1, color = COLORS.antibiotic }) => {
  const s = size / 40;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}
      opacity={opacity}
    >
      <polygon
        points={toPoints(HEX)}
        fill={color}
        fillOpacity={0.2}
        stroke={color}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      <polygon
        points={toPoints(SQUARE)}
        fill={color}
        fillOpacity={0.2}
        stroke={color}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      <line
        x1={20}
        y1={-7}
        x2={25}
        y2={-16}
        stroke={color}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <circle cx={26.5} cy={-18.5} r={4.5} fill={color} />
      {HEX.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={2.6} fill="#fff" opacity={0.9} />
      ))}
    </g>
  );
};
