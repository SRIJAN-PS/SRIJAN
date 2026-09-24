// Horse-drawn carriage silhouette. `phase` drives the wheels and the trot.
export const Carriage: React.FC<{ x: number; y: number; scale?: number; phase: number; fill?: string; rim?: string }> = ({
  x,
  y,
  scale = 1,
  phase,
  fill = "#070605",
  rim = "#d9a55b",
}) => {
  const wheel = (cx: number, r: number) => (
    <g transform={`translate(${cx} ${-r})`}>
      <circle r={r} fill="none" stroke={fill} strokeWidth={7} />
      <circle r={r} fill="none" stroke={rim} strokeOpacity={0.25} strokeWidth={1.5} />
      {new Array(10).fill(0).map((_, i) => (
        <line key={i} x1={0} y1={0} x2={Math.cos(phase * 1.6 + (i * Math.PI) / 5) * r} y2={Math.sin(phase * 1.6 + (i * Math.PI) / 5) * r} stroke={fill} strokeWidth={3.5} />
      ))}
      <circle r={7} fill={fill} />
    </g>
  );
  const leg = (hx: number, hy: number, off: number) => (
    <rect x={hx - 5} y={hy} width={10} height={70} rx={4} fill={fill} transform={`rotate(${Math.sin(phase * 2 + off) * 24} ${hx} ${hy})`} />
  );
  const bob = Math.abs(Math.sin(phase * 2)) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* carriage body */}
      <path d="M-20,-150 Q-20,-205 40,-212 L160,-212 Q210,-205 212,-150 L200,-78 L-8,-78 Z" fill={fill} stroke={rim} strokeOpacity={0.3} strokeWidth={2} />
      <rect x={20} y={-196} width={60} height={50} rx={5} fill={rim} opacity={0.18} />
      <rect x={100} y={-196} width={60} height={50} rx={5} fill={rim} opacity={0.12} />
      <path d="M200,-120 L262,-128 L262,-116 L200,-104 Z" fill={fill} />
      <rect x={210} y={-160} width={46} height={10} fill={fill} />
      {/* coachman */}
      <g transform="translate(236 -160) scale(0.42)">
        <rect x={-30} y={-150} width={60} height={150} rx={20} fill={fill} />
        <circle cx={0} cy={-172} r={24} fill={fill} />
        <ellipse cx={0} cy={-190} rx={28} ry={16} fill={fill} />
      </g>
      {wheel(20, 72)}
      {wheel(215, 52)}
      {/* shafts */}
      <line x1={250} y1={-110} x2={395} y2={-122} stroke={fill} strokeWidth={6} />
      {/* horse */}
      <g transform={`translate(340 ${-bob})`}>
        {leg(40, -80, 0)}
        {leg(56, -80, Math.PI)}
        {leg(128, -82, Math.PI)}
        {leg(144, -82, 0)}
        <ellipse cx={92} cy={-102} rx={72} ry={32} fill={fill} stroke={rim} strokeOpacity={0.3} strokeWidth={2} />
        <path d="M140,-120 L176,-196 L196,-196 L180,-110 Z" fill={fill} />
        <path d="M172,-200 L226,-176 L222,-160 L180,-168 Z" fill={fill} stroke={rim} strokeOpacity={0.3} strokeWidth={2} />
        <path d="M178,-202 l4,-18 l8,16 Z" fill={fill} />
        <path d={`M22,-112 Q-10,-100 ${-6 + Math.sin(phase * 2) * 6},-50`} stroke={fill} strokeWidth={12} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};
