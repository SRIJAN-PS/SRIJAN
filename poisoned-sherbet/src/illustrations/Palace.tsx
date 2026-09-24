import { random } from "remotion";

// A Maratha princely palace: tiers of arched jharokha windows, a great
// arched gateway, chhatris on the roofline and a central dome. Stylised, not
// a depiction of any specific Baroda building.

const arch = (x: number, y: number, w: number, h: number) =>
  `M${x},${y} L${x},${y - h + w / 2} Q${x},${y - h} ${x + w / 2},${y - h - w * 0.18} Q${x + w},${y - h} ${x + w},${y - h + w / 2} L${x + w},${y} Z`;

const chhatriDome = (x: number, y: number, w: number) =>
  `M${x},${y} C${x},${y - w * 0.55} ${x + w * 0.25},${y - w * 0.7} ${x + w / 2},${y - w * 0.78} C${x + w * 0.75},${y - w * 0.7} ${x + w},${y - w * 0.55} ${x + w},${y} Z`;

export const Palace: React.FC<{
  x: number;
  y: number;
  scale?: number;
  body?: string;
  rim?: string;
  glow?: string;
  // 0..1 share of windows lit.
  lit?: number;
  // 0 = gate open, 1 = gate closed.
  gate?: number;
}> = ({ x, y, scale = 1, body = "#16110d", rim = "#d59a52", glow = "#f2b565", lit = 0.5, gate = 0 }) => {
  const W = 1300;
  const tiers = [
    { y: -120, h: 110, n: 12, w: 46 },
    { y: -260, h: 100, n: 14, w: 40 },
    { y: -380, h: 80, n: 16, w: 32 },
  ];
  const gw = 190;
  const gh = 250;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* central dome and flag */}
      <path d={chhatriDome(W / 2 - 150, -440, 300)} fill={body} stroke={rim} strokeOpacity={0.3} strokeWidth={2} />
      <rect x={W / 2 - 3} y={-700} width={6} height={80} fill={body} />
      <path d={`M${W / 2 + 3},-700 l62,14 l-62,16 Z`} fill={body} stroke={rim} strokeOpacity={0.25} />
      {/* corner chhatris */}
      {[40, W - 160, 260, W - 380].map((cx, i) => (
        <g key={`ch${i}`}>
          <path d={chhatriDome(cx, -470, 120)} fill={body} stroke={rim} strokeOpacity={0.3} strokeWidth={1.5} />
          <rect x={cx + 6} y={-470} width={9} height={32} fill={body} />
          <rect x={cx + 105} y={-470} width={9} height={32} fill={body} />
          <rect x={cx + 55} y={-470} width={9} height={32} fill={body} />
          <rect x={cx + 58} y={-575} width={4} height={20} fill={body} />
        </g>
      ))}
      <rect x={0} y={-440} width={W} height={440} fill={body} />
      {/* cornices */}
      {[-440, -300, -160].map((cy) => (
        <rect key={cy} x={-18} y={cy} width={W + 36} height={12} fill={body} stroke={rim} strokeOpacity={0.3} />
      ))}
      {/* jharokha windows */}
      {tiers.map((t, ti) =>
        new Array(t.n).fill(0).map((_, i) => {
          const wx = 30 + i * ((W - 60) / t.n) + ((W - 60) / t.n - t.w) / 2;
          if (ti === 0 && Math.abs(wx + t.w / 2 - W / 2) < gw / 2 + 40) {
            return null;
          }
          const on = random(`pal-${ti}-${i}`) < lit;
          return (
            <g key={`${ti}-${i}`}>
              <path d={arch(wx, t.y, t.w, t.h * 0.75)} fill={on ? glow : "#0a0806"} opacity={on ? 0.55 + random(`palo-${ti}-${i}`) * 0.4 : 0.9} />
              <rect x={wx - 6} y={t.y} width={t.w + 12} height={7} fill={body} stroke={rim} strokeOpacity={0.25} />
              {ti === 1 ? <path d={`M${wx - 4},${t.y - t.h * 0.75 - 18} h${t.w + 8} l-6,-10 h${-t.w + 4} Z`} fill={body} /> : null}
            </g>
          );
        }),
      )}
      {/* gateway */}
      <path d={arch(W / 2 - gw / 2 - 30, 0, gw + 60, gh + 40)} fill={body} stroke={rim} strokeOpacity={0.35} strokeWidth={2} />
      <path d={arch(W / 2 - gw / 2, 0, gw, gh)} fill="#070504" />
      <rect x={W / 2 - gw / 2} y={-gh + 20} width={(gw / 2) * gate} height={gh - 20} fill="#2a1b10" stroke={rim} strokeOpacity={0.25} />
      <rect x={W / 2 + gw / 2 - (gw / 2) * gate} y={-gh + 20} width={(gw / 2) * gate} height={gh - 20} fill="#2a1b10" stroke={rim} strokeOpacity={0.25} />
      {gate < 0.98 ? <path d={arch(W / 2 - gw / 2 + (gw / 2) * gate, 0, gw * (1 - gate), gh - 20)} fill={glow} opacity={0.25 * (1 - gate)} /> : null}
      <rect x={-40} y={0} width={W + 80} height={26} fill={body} />
    </g>
  );
};

// Full-frame carved palace doors. `closed` 0..1 slides the two leaves shut.
export const PalaceDoors: React.FC<{ closed: number; light?: string }> = ({ closed, light = "#f2b565" }) => {
  const leafW = 960 * closed;
  const leaf = (x: number, flip: boolean) => (
    <g transform={`translate(${x} 0)`}>
      <rect x={0} y={0} width={960} height={1080} fill="#2b1c11" />
      <rect x={30} y={30} width={900} height={1020} fill="none" stroke="#5a3d22" strokeWidth={10} />
      {new Array(3).fill(0).map((_, r) =>
        new Array(2).fill(0).map((__, c) => (
          <rect key={`${r}-${c}`} x={80 + c * 420} y={80 + r * 330} width={380} height={290} fill="#24170e" stroke="#6d4a28" strokeWidth={4} />
        )),
      )}
      {new Array(7).fill(0).map((_, r) =>
        new Array(5).fill(0).map((__, c) => (
          <circle key={`s${r}-${c}`} cx={130 + c * 175} cy={60 + r * 160} r={13} fill="#3a3129" stroke="#8a7050" strokeWidth={2} />
        )),
      )}
      <rect x={flip ? 0 : 930} y={0} width={30} height={1080} fill="#150d07" />
    </g>
  );
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <rect width="1920" height="1080" fill={light} opacity={0.5} />
      <rect width="1920" height="1080" fill="url(#doorlight)" />
      <defs>
        <radialGradient id="doorlight">
          <stop offset="0" stopColor="#fff0c8" stopOpacity={0.9} />
          <stop offset="1" stopColor="#000" stopOpacity={0.6} />
        </radialGradient>
      </defs>
      {leaf(-960 + leafW, false)}
      {leaf(1920 - leafW, true)}
    </svg>
  );
};

// A palace corridor of receding pointed arches, lit by hanging lamps and
// brighter towards the far end. `progress` moves the viewer forward.
export const Corridor: React.FC<{ progress: number; lampFlicker?: number }> = ({ progress, lampFlicker = 1 }) => {
  const n = 11;
  const vy = 540;
  const frames = [];
  for (let i = n - 1; i >= 0; i--) {
    const z = i + 1 - progress * 2.2;
    if (z < 0.45) {
      continue;
    }
    const s = 1 / z;
    const w = 760 * s;
    const h = 1150 * s;
    const floor = vy + 560 * s;
    const lum = 0.12 + 0.55 * Math.min(1, (z - 0.45) / 9);
    const opening = `M${-w / 2},0 L${-w / 2},${-h * 0.6} Q${-w / 2},${-h * 0.93} 0,${-h} Q${w / 2},${-h * 0.93} ${w / 2},${-h * 0.6} L${w / 2},0 Z`;
    const wall = `M${-w * 1.9},${h * 0.5} L${-w * 1.9},${-h * 1.6} L${w * 1.9},${-h * 1.6} L${w * 1.9},${h * 0.5} Z`;
    frames.push(
      <g key={i} transform={`translate(960 ${floor})`}>
        <path d={`${wall} ${opening}`} fillRule="evenodd" fill={`rgb(${Math.round(92 * lum)},${Math.round(62 * lum)},${Math.round(38 * lum)})`} />
        <path d={opening} fill="none" stroke="#e9b86a" strokeOpacity={0.18 + 0.2 * lum} strokeWidth={Math.max(1, 5 * s)} />
        <line x1={0} y1={-h * 1.6} x2={0} y2={-h * 1.08} stroke="#000" strokeWidth={Math.max(1, 3 * s)} />
        <circle cx={0} cy={-h * 1.04} r={Math.max(1.5, 13 * s)} fill="#ffe0a6" opacity={0.9 * lampFlicker} />
        <circle cx={0} cy={-h * 1.04} r={Math.max(4, 80 * s)} fill="#f2b565" opacity={0.14 * lampFlicker} />
      </g>,
    );
  }
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="corr-end">
          <stop offset="0" stopColor="#f6c47a" stopOpacity="0.8" />
          <stop offset="0.4" stopColor="#d18c45" stopOpacity="0.25" />
          <stop offset="1" stopColor="#d18c45" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="corr-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a331f" />
          <stop offset="1" stopColor="#0c0806" />
        </linearGradient>
      </defs>
      <rect width="1920" height="1080" fill="#0d0907" />
      <path d={`M0,1080 L940,${vy + 40} L980,${vy + 40} L1920,1080 Z`} fill="url(#corr-floor)" />
      <ellipse cx={960} cy={vy} rx={320} ry={260} fill="url(#corr-end)" />
      {frames}
    </svg>
  );
};
