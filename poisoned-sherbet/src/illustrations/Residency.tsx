// The British Residency: a two-storey classical building with a columned
// verandah and a central pediment. Drawn as a dark mass with rim light and
// warm windows, like a building seen against a low sun.

export const Residency: React.FC<{ x: number; y: number; scale?: number; body?: string; rim?: string; glow?: string; glowOpacity?: number }> = ({
  x,
  y,
  scale = 1,
  body = "#1a1612",
  rim = "#d9a55b",
  glow = "#f0b867",
  glowOpacity = 0.7,
}) => {
  const W = 1100;
  const cols = 12;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* roof and pediment */}
      <path d={`M${W / 2 - 170},-360 L${W / 2},-455 L${W / 2 + 170},-360 Z`} fill={body} stroke={rim} strokeOpacity={0.35} strokeWidth={2} />
      <rect x={-20} y={-362} width={W + 40} height={22} fill={body} stroke={rim} strokeOpacity={0.3} strokeWidth={1.5} />
      {/* balustrade */}
      {new Array(44).fill(0).map((_, i) => (
        <rect key={i} x={-10 + i * 25.5} y={-392} width={8} height={30} fill={body} />
      ))}
      <rect x={-20} y={-398} width={W + 40} height={8} fill={body} />
      {/* main mass */}
      <rect x={0} y={-340} width={W} height={340} fill={body} />
      {/* upper floor windows */}
      {new Array(cols - 1).fill(0).map((_, i) => (
        <g key={`uw${i}`}>
          <rect x={45 + i * 96} y={-318} width={40} height={78} rx={20} fill={glow} opacity={glowOpacity * (0.35 + ((i * 37) % 10) / 16)} />
          <rect x={41 + i * 96} y={-230} width={48} height={6} fill={rim} opacity={0.18} />
        </g>
      ))}
      {/* floor band */}
      <rect x={-10} y={-212} width={W + 20} height={14} fill={body} stroke={rim} strokeOpacity={0.25} />
      {/* verandah columns */}
      {new Array(cols).fill(0).map((_, i) => (
        <g key={`c${i}`}>
          <rect x={10 + i * (W - 40) / (cols - 1)} y={-198} width={22} height={198} fill={body} stroke={rim} strokeOpacity={0.28} strokeWidth={1.5} />
          <rect x={4 + i * (W - 40) / (cols - 1)} y={-204} width={34} height={10} fill={body} />
        </g>
      ))}
      {/* shadowed verandah with doors */}
      <rect x={32} y={-190} width={W - 64} height={190} fill="#0c0a08" opacity={0.75} />
      {new Array(cols - 1).fill(0).map((_, i) => (
        <rect key={`d${i}`} x={52 + i * 96} y={-160} width={36} height={130} fill={glow} opacity={glowOpacity * 0.35 * (((i * 53) % 7) / 7 + 0.2)} />
      ))}
      {/* steps */}
      <rect x={W / 2 - 150} y={-8} width={300} height={8} fill={body} />
      <rect x={W / 2 - 180} y={0} width={360} height={10} fill={body} />
      <rect x={-60} y={0} width={W + 120} height={30} fill={body} />
    </g>
  );
};
