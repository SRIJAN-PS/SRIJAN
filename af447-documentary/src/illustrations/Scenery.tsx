import { random } from "remotion";

// Night sky, clouds and the Rio de Janeiro departure: runway lights, the city
// and its mountains (Sugarloaf and Corcovado), seen as silhouettes.

export const NightSky: React.FC<{ frame: number; stars?: number; glow?: string; horizon?: number }> = ({ frame, stars = 160, glow = "#16304f", horizon = 760 }) => (
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id={`ns-${horizon}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#01040a" />
        <stop offset={`${(horizon / 1080) * 100}%`} stopColor={glow} />
        <stop offset="1" stopColor="#01040a" />
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill={`url(#ns-${horizon})`} />
    {new Array(stars).fill(0).map((_, i) => (
      <circle
        key={i}
        cx={random(`st-x${i}`) * 1920}
        cy={random(`st-y${i}`) * horizon * 0.95}
        r={0.6 + random(`st-r${i}`) * 1.4}
        fill="#dfe9ff"
        opacity={0.3 + 0.6 * Math.abs(Math.sin(frame / (40 + i) + i))}
      />
    ))}
  </svg>
);

// Layered cloud bank; `speed` px/frame drift, `lightning` 0..1 flashes.
export const Clouds: React.FC<{ frame: number; y: number; seed: string; color?: string; opacity?: number; speed?: number; scale?: number; lightning?: number }> = ({
  frame,
  y,
  seed,
  color = "#1b2a3d",
  opacity = 0.9,
  speed = 1,
  scale = 1,
  lightning = 0,
}) => {
  const flash = lightning > 0 && random(`lt-${seed}-${Math.floor(frame / 7)}`) > 1 - 0.08 * lightning ? 1 : 0;
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id={`cl-${seed}`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation={10 * scale} />
        </filter>
      </defs>
      <g filter={`url(#cl-${seed})`} opacity={opacity}>
        {new Array(26).fill(0).map((_, i) => {
          const x = ((random(`${seed}-x${i}`) * 2600 - frame * speed * (0.6 + random(`${seed}-s${i}`) * 0.6)) % 2600 + 2600) % 2600 - 340;
          const r = (60 + random(`${seed}-r${i}`) * 140) * scale;
          return <ellipse key={i} cx={x} cy={y + (random(`${seed}-y${i}`) - 0.5) * 90 * scale} rx={r * 1.8} ry={r * 0.7} fill={flash && i % 3 === 0 ? "#8fb3ff" : color} />;
        })}
      </g>
      {flash ? <rect width="1920" height="1080" fill="#9ec0ff" opacity={0.08} /> : null}
    </svg>
  );
};

// Rio at night: mountains, city lights down to the bay.
export const RioSkyline: React.FC<{ frame: number; y?: number; scale?: number }> = ({ frame, y = 820, scale = 1 }) => (
  <g transform={`translate(0 ${y}) scale(1 ${scale})`}>
    <path d="M-20,40 L180,-40 L260,-10 L420,-120 L470,-160 L520,-120 L600,-20 L760,-60 L900,-10 L1040,-70 L1120,-30 L1300,-240 L1360,-250 L1420,-200 L1480,-40 L1600,-80 L1720,-20 L1940,-50 L1940,300 L-20,300 Z" fill="#050912" />
    <rect x={1352} y={-282} width={6} height={30} fill="#d9e2f0" opacity={0.8} />
    <rect x={1343} y={-274} width={24} height={5} fill="#d9e2f0" opacity={0.8} />
    {new Array(420).fill(0).map((_, i) => {
      const x = random(`rio-x${i}`) * 1920;
      const yy = 10 + random(`rio-y${i}`) * 240;
      const warm = random(`rio-c${i}`) > 0.3;
      return <circle key={i} cx={x} cy={yy} r={0.8 + random(`rio-r${i}`) * 1.6} fill={warm ? "#ffcf86" : "#cfe3ff"} opacity={0.35 + 0.5 * Math.abs(Math.sin(frame / 30 + i))} />;
    })}
  </g>
);

// Runway at night in perspective: edge and centre-line lights.
export const Runway: React.FC<{ frame: number; speed?: number }> = ({ frame, speed = 0 }) => {
  const rows = 22;
  const vx = 960;
  const vy = 600;
  const lights = [];
  for (let i = 0; i < rows; i++) {
    const z = ((i + (frame * speed) / 30) % rows) + 1;
    const s = 1 / (z * 0.18 + 0.2);
    const yy = vy + 480 * s * 0.2;
    const half = 900 * s * 0.2;
    const r = Math.max(1.2, 6 * s * 0.2);
    lights.push(
      <g key={i} opacity={Math.min(1, s)}>
        <circle cx={vx - half} cy={yy} r={r} fill="#fff4d6" />
        <circle cx={vx + half} cy={yy} r={r} fill="#fff4d6" />
        <circle cx={vx} cy={yy} r={r * 0.8} fill="#ffffff" />
        <circle cx={vx - half} cy={yy} r={r * 4} fill="#ffd38a" opacity={0.12} />
        <circle cx={vx + half} cy={yy} r={r * 4} fill="#ffd38a" opacity={0.12} />
      </g>,
    );
  }
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <path d={`M${vx - 40},${vy} L${vx + 40},${vy} L1900,1080 L20,1080 Z`} fill="#0b0f15" />
      {lights}
      <g opacity={0.9}>
        {new Array(12).fill(0).map((_, i) => (
          <circle key={i} cx={vx - 120 + i * 22} cy={vy - 2} r={2.2} fill={i % 2 ? "#3ddc84" : "#ff5a4a"} />
        ))}
      </g>
    </svg>
  );
};
