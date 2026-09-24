import { random } from "remotion";

// A plain tumbler of pale sherbet, side view. `level` 0..1 is the liquid,
// `sediment` 0..1 the dark residue at the bottom.
export const Glass: React.FC<{ x: number; y: number; scale?: number; level?: number; sediment?: number; glow?: string }> = ({
  x,
  y,
  scale = 1,
  level = 0.8,
  sediment = 0,
  glow = "#f0c27a",
}) => {
  const H = 260;
  const top = 92;
  const bot = 74;
  const liquidTop = -H * level;
  const wAt = (yy: number) => bot + (top - bot) * (-yy / H);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <linearGradient id="glass-liquid" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9cfa9" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#f4ecd0" stopOpacity="0.85" />
          <stop offset="1" stopColor="#bfb089" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="glass-wall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.12" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="0.85" stopColor="#fff" stopOpacity="0.03" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={6} rx={bot + 30} ry={14} fill="#000" opacity={0.5} />
      {level > 0 ? (
        <path d={`M${-bot + 4},-6 L${-wAt(liquidTop) + 5},${liquidTop} L${wAt(liquidTop) - 5},${liquidTop} L${bot - 4},-6 Z`} fill="url(#glass-liquid)" />
      ) : null}
      {level > 0 ? <ellipse cx={0} cy={liquidTop} rx={wAt(liquidTop) - 5} ry={9} fill="#f7f0da" opacity={0.6} /> : null}
      {sediment > 0
        ? new Array(46).fill(0).map((_, i) => {
            const px = (random(`sed-x${i}`) - 0.5) * bot * 1.6;
            const py = -8 - random(`sed-y${i}`) * 18;
            return <circle key={i} cx={px} cy={py} r={1.5 + random(`sed-r${i}`) * 3.2} fill={i % 7 === 0 ? "#c8c2b0" : "#231c16"} opacity={sediment * (0.6 + random(`sed-o${i}`) * 0.4)} />;
          })
        : null}
      <path d={`M${-top},${-H} L${-bot},0 Q0,8 ${bot},0 L${top},${-H}`} fill="url(#glass-wall)" stroke="#f3e6c6" strokeOpacity={0.45} strokeWidth={2.5} />
      <ellipse cx={0} cy={-H} rx={top} ry={12} fill="none" stroke="#f3e6c6" strokeOpacity={0.5} strokeWidth={2.5} />
      <path d={`M${-top + 16},${-H + 20} L${-bot + 12},-20`} stroke="#fff" strokeOpacity={0.35} strokeWidth={6} strokeLinecap="round" />
      <ellipse cx={-top * 0.3} cy={-H * 0.5} rx={6} ry={60} fill={glow} opacity={0.12} />
    </g>
  );
};

// Looking down into the bottom of the glass: a dark grainy residue that
// catches the candlelight.
export const Sediment: React.FC<{ reveal: number; frame: number; red?: number }> = ({ reveal, frame, red = 0 }) => (
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="sed-base" cx="50%" cy="46%">
        <stop offset="0" stopColor="#efe4c3" stopOpacity="0.95" />
        <stop offset="0.55" stopColor="#b9a67e" stopOpacity="0.8" />
        <stop offset="0.8" stopColor="#4a3c2a" />
        <stop offset="1" stopColor="#0b0806" />
      </radialGradient>
      <radialGradient id="sed-glint">
        <stop offset="0" stopColor="#fff8e6" />
        <stop offset="1" stopColor="#fff8e6" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="1920" height="1080" fill="#050403" />
    <ellipse cx="960" cy="520" rx="760" ry="470" fill="url(#sed-base)" />
    <ellipse cx="960" cy="520" rx="760" ry="470" fill="none" stroke="#f6ead0" strokeOpacity="0.35" strokeWidth="10" />
    <ellipse cx="960" cy="520" rx="700" ry="420" fill="none" stroke="#f6ead0" strokeOpacity="0.12" strokeWidth="3" />
    {new Array(420).fill(0).map((_, i) => {
      const a = random(`sa${i}`) * Math.PI * 2;
      const rr = Math.pow(random(`sr${i}`), 0.8) * 330;
      const cx = 1010 + Math.cos(a) * rr * 1.25;
      const cy = 590 + Math.sin(a) * rr * 0.7;
      const size = 2 + random(`ss${i}`) * (i % 9 === 0 ? 9 : 5);
      const shown = random(`sv${i}`) < reveal;
      const dark = `rgb(${34 + red * 70},${26 - red * 8},${20 - red * 6})`;
      return shown ? <circle key={i} cx={cx} cy={cy} r={size} fill={i % 11 === 0 ? "#d8d2c4" : dark} opacity={0.85} /> : null;
    })}
    {new Array(14).fill(0).map((_, i) => {
      const a = random(`ga${i}`) * Math.PI * 2;
      const rr = random(`gr${i}`) * 300;
      const tw = Math.max(0, Math.sin(frame / 9 + i * 1.7));
      return <circle key={`g${i}`} cx={1010 + Math.cos(a) * rr * 1.25} cy={590 + Math.sin(a) * rr * 0.7} r={16} fill="url(#sed-glint)" opacity={reveal * tw * 0.9} />;
    })}
  </svg>
);
