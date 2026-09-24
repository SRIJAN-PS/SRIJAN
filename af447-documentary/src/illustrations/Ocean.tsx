import { random } from "remotion";

// The Atlantic: surface at night or dawn, the descent to 3,900 m, search
// ships, the ROV, the wreckage field and the recorders. Reconstructions.

export const OceanSurface: React.FC<{ frame: number; mood?: "night" | "dawn"; horizon?: number; debris?: number }> = ({ frame, mood = "night", horizon = 560, debris = 0 }) => {
  const sky = mood === "night" ? ["#01040a", "#081626"] : ["#1a2742", "#d88a52"];
  const sea = mood === "night" ? ["#04101c", "#010408"] : ["#2a3a55", "#0b1522"];
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id={`os-sky-${mood}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
        <linearGradient id={`os-sea-${mood}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sea[0]} />
          <stop offset="1" stopColor={sea[1]} />
        </linearGradient>
        <radialGradient id="os-sun">
          <stop offset="0" stopColor="#fff2d0" />
          <stop offset="0.3" stopColor="#ffb866" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffb866" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1920" height={horizon} fill={`url(#os-sky-${mood})`} />
      {mood === "dawn" ? <circle cx={1260} cy={horizon + 10} r={380} fill="url(#os-sun)" /> : null}
      <rect y={horizon} width="1920" height={1080 - horizon} fill={`url(#os-sea-${mood})`} />
      {new Array(60).fill(0).map((_, i) => {
        const yy = horizon + Math.pow(i / 60, 1.8) * (1080 - horizon);
        const w = 40 + (i / 60) * 380;
        const x = ((random(`wv-x${i}`) * 2200 + frame * (0.3 + i / 60)) % 2200) - 140;
        return <rect key={i} x={x} y={yy} width={w} height={1 + (i / 60) * 3} rx={2} fill={mood === "dawn" ? "#ffc58a" : "#6d8fb5"} opacity={(mood === "dawn" ? 0.25 : 0.12) * (0.5 + 0.5 * Math.sin(frame / 20 + i))} />;
      })}
      {debris > 0
        ? new Array(18).fill(0).map((_, i) => {
            const x = 500 + random(`db-x${i}`) * 900;
            const yy = horizon + 80 + random(`db-y${i}`) * 300;
            const bob = Math.sin(frame / 25 + i) * 3;
            return <rect key={`d${i}`} x={x} y={yy + bob} width={8 + random(`db-w${i}`) * 26} height={3 + random(`db-h${i}`) * 6} rx={2} fill="#c9d2dc" opacity={debris * 0.55} transform={`rotate(${random(`db-r${i}`) * 40 - 20} ${x} ${yy})`} />;
          })
        : null}
    </svg>
  );
};

// Underwater column: colour darkens with depth (0..1 → surface..seabed).
export const Underwater: React.FC<{ frame: number; depth: number; light?: number }> = ({ frame, depth, light = 0 }) => {
  const c = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
  const top = c([18, 70, 110], [1, 4, 10], Math.min(1, depth * 1.4));
  const bot = c([4, 30, 55], [0, 1, 3], Math.min(1, depth * 1.2));
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="uw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bot} />
        </linearGradient>
        <radialGradient id="uw-light" cx="0.5" cy="0.4">
          <stop offset="0" stopColor="#bfe6ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#bfe6ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#uw)" />
      {depth < 0.35
        ? new Array(6).fill(0).map((_, i) => (
            <path key={i} d={`M${300 + i * 260},0 L${200 + i * 280},1080 L${260 + i * 280},1080 L${340 + i * 260},0 Z`} fill="#9fd8ff" opacity={(0.06 - depth * 0.15) * (0.6 + 0.4 * Math.sin(frame / 30 + i))} />
          ))
        : null}
      {new Array(90).fill(0).map((_, i) => {
        const x = random(`mar-x${i}`) * 1920;
        const yy = ((random(`mar-y${i}`) * 1080 - frame * (0.4 + random(`mar-s${i}`))) % 1080 + 1080) % 1080;
        return <circle key={i} cx={x} cy={yy} r={0.8 + random(`mar-r${i}`) * 1.8} fill="#cfe8ff" opacity={0.15 + 0.25 * random(`mar-o${i}`)} />;
      })}
      {light > 0 ? <ellipse cx={960} cy={520} rx={700} ry={420} fill="url(#uw-light)" opacity={light} /> : null}
    </svg>
  );
};

// A deep-sea ROV with lights and a tether.
export const ROV: React.FC<{ x: number; y: number; scale?: number; frame: number }> = ({ x, y, scale = 1, frame }) => (
  <g transform={`translate(${x} ${y + Math.sin(frame / 18) * 6}) scale(${scale})`}>
    <line x1={0} y1={-60} x2={40} y2={-900} stroke="#d4a53a" strokeWidth={3} opacity={0.6} />
    <path d="M-140,40 L-110,90 L120,90 L150,40 Z" fill="#2b3440" />
    <rect x={-150} y={-60} width={300} height={110} rx={10} fill="#f0c43a" />
    <rect x={-150} y={-60} width={300} height={30} rx={8} fill="#d8a92a" />
    <rect x={-110} y={-20} width={60} height={40} rx={6} fill="#1a2028" />
    <circle cx={-80} cy={0} r={12} fill="#9fd4ff" />
    <rect x={40} y={-24} width={90} height={34} rx={6} fill="#1a2028" />
    {[-130, 110].map((lx) => (
      <g key={lx}>
        <circle cx={lx} cy={60} r={10} fill="#fffbe6" />
        <path d={`M${lx},60 L${lx - 260},560 L${lx + 260},560 Z`} fill="#e8f6ff" opacity={0.08} />
      </g>
    ))}
    <path d="M100,70 L160,120 L150,130 L95,90 Z" fill="#4a5563" />
  </g>
);

// Wreckage scattered on the seabed (abstract fragments, no bodies, no fire).
export const Seabed: React.FC<{ frame: number; reveal: number; recorder?: number }> = ({ frame, reveal, recorder = 0 }) => (
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="sb-light" cx="0.5" cy="0.55">
        <stop offset="0" stopColor="#9fb7c4" stopOpacity={0.55 * reveal} />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="1920" height="1080" fill="#010305" />
    <path d="M0,640 Q480,600 960,630 T1920,620 L1920,1080 L0,1080 Z" fill="#161a1c" />
    <ellipse cx={960} cy={760} rx={900} ry={360} fill="url(#sb-light)" />
    {new Array(30).fill(0).map((_, i) => {
      const x = 260 + random(`wr-x${i}`) * 1400;
      const yy = 680 + random(`wr-y${i}`) * 300;
      const w = 30 + random(`wr-w${i}`) * 180;
      const h = 8 + random(`wr-h${i}`) * 40;
      const d = Math.hypot(x - 960, (yy - 760) * 2) / 900;
      return (
        <path
          key={i}
          d={`M${x},${yy} l${w * 0.3},${-h} l${w * 0.7},${h * 0.4} l${-w * 0.2},${h * 0.8} Z`}
          fill={i % 5 === 0 ? "#8e9aa6" : "#5b6570"}
          opacity={Math.max(0, reveal * (1.1 - d))}
        />
      );
    })}
    {recorder > 0 ? (
      <g transform="translate(1040 790)" opacity={recorder}>
        <rect x={-60} y={-40} width={120} height={70} rx={8} fill="#ff7a1a" />
        <rect x={-60} y={-40} width={120} height={16} rx={6} fill="#e06110" />
        <circle cx={-40} cy={20} r={10} fill="#2a2a2a" />
        <ellipse cx={0} cy={0} rx={160} ry={90} fill="#ff9a4a" opacity={0.12 + 0.06 * Math.sin(frame / 8)} />
      </g>
    ) : null}
    {new Array(60).fill(0).map((_, i) => (
      <circle key={`p${i}`} cx={random(`sbp-x${i}`) * 1920} cy={((random(`sbp-y${i}`) * 1080 + frame * 0.3) % 1080)} r={1 + random(`sbp-r${i}`)} fill="#b8d0e0" opacity={0.2} />
    ))}
  </svg>
);

// Search ship silhouette.
export const Ship: React.FC<{ x: number; y: number; scale?: number; frame: number; lights?: boolean }> = ({ x, y, scale = 1, frame, lights = true }) => (
  <g transform={`translate(${x} ${y + Math.sin(frame / 22) * 3}) scale(${scale})`}>
    <path d="M-260,0 L240,0 L200,50 L-230,50 Z" fill="#0b1119" />
    <rect x={-160} y={-60} width={180} height={60} fill="#0e1520" />
    <rect x={-120} y={-100} width={90} height={40} fill="#0e1520" />
    <rect x={60} y={-120} width={8} height={120} fill="#0e1520" />
    <path d="M64,-120 L160,-40 L150,-36 L64,-100 Z" fill="#0e1520" />
    {lights ? (
      <g>
        {new Array(6).fill(0).map((_, i) => (
          <rect key={i} x={-150 + i * 26} y={-40} width={10} height={8} fill="#ffd38a" opacity={0.7} />
        ))}
        <circle cx={64} cy={-124} r={4} fill="#ffffff" opacity={frame % 40 < 20 ? 1 : 0.3} />
      </g>
    ) : null}
  </g>
);

// Side-scan sonar strip being drawn line by line.
export const SonarImage: React.FC<{ progress: number; target?: boolean }> = ({ progress, target = true }) => (
  <svg width="1400" height="760" viewBox="0 0 1400 760">
    <rect width="1400" height="760" fill="#0a0703" stroke="#3a2a14" strokeWidth={4} />
    {new Array(Math.floor(95 * progress)).fill(0).map((_, row) => (
      <g key={row}>
        {new Array(35).fill(0).map((__, col) => {
          const x = col * 40;
          const yy = row * 8;
          const nearTarget = target && Math.hypot(x - 880, (yy - 420) * 1.6) < 140;
          const v = random(`son-${row}-${col}`) * 0.5 + (nearTarget ? 0.5 * random(`sot-${row}-${col}`) : 0) + (col === 17 ? -0.5 : 0);
          return <rect key={col} x={x} y={yy} width={40} height={8} fill={`rgb(${Math.round(60 + 190 * v)},${Math.round(40 + 140 * v)},${Math.round(10 + 40 * v)})`} />;
        })}
      </g>
    ))}
    <line x1={0} y1={760 * progress} x2={1400} y2={760 * progress} stroke="#ffd38a" strokeWidth={2} opacity={0.8} />
    <rect x={0} y={0} width={1400} height={56} fill="#0a0703" opacity={0.85} />
    <text x={24} y={38} fill="#ffd38a" fontFamily="IBM Plex Mono, monospace" fontSize={28} letterSpacing="4">
      SIDE-SCAN SONAR
    </text>
  </svg>
);
