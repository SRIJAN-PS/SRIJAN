import { COLORS } from "../theme";

const flagellum = (phase: number, offsetY: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 12; i++) {
    const x = -38 - i * 4;
    const y = offsetY + Math.sin(i * 0.9 + phase) * 5 + offsetY * i * 0.08;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ");
};

// Rod-shaped bacterium. Resistant cells carry a plasmid (resistance genes)
// and a dashed protective outline.
export const Bacterium: React.FC<{
  x: number;
  y: number;
  frame: number;
  color: string;
  rotate?: number;
  scale?: number;
  opacity?: number;
  resistant?: boolean;
  seed?: number;
}> = ({
  x,
  y,
  frame,
  color,
  rotate = 0,
  scale = 1,
  opacity = 1,
  resistant = false,
  seed = 0,
}) => {
  const phase = frame * 0.35 + seed * 10;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
      opacity={opacity}
    >
      <path
        d={flagellum(phase, -8)}
        stroke={color}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
      />
      <path
        d={flagellum(phase + 1.7, 8)}
        stroke={color}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
      />
      {resistant ? (
        <rect
          x={-47}
          y={-25}
          width={94}
          height={50}
          rx={25}
          fill="none"
          stroke={COLORS.resistant}
          strokeWidth={3}
          strokeDasharray="8 6"
          opacity={0.9}
        />
      ) : null}
      <rect
        x={-40}
        y={-18}
        width={80}
        height={36}
        rx={18}
        fill={color}
        fillOpacity={0.85}
        stroke="#ffffff"
        strokeOpacity={0.35}
        strokeWidth={2}
      />
      <path
        d="M-24 0 q6 -8 12 0 t12 0 t12 0"
        stroke="#ffffff"
        strokeWidth={2.5}
        fill="none"
        opacity={0.55}
      />
      {resistant ? (
        <circle
          cx={22}
          cy={0}
          r={6}
          fill="none"
          stroke="#ffffff"
          strokeWidth={2.5}
          opacity={0.9}
        />
      ) : null}
    </g>
  );
};
