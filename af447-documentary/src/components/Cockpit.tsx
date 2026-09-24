import { AbsoluteFill, random } from "remotion";
import { COLOR, FONT } from "../data/theme";

// 2009-era Airbus A330 cockpit displays, drawn as simplified reconstructions.
// Values come from flightState() (approximate, after the BEA report).

export type FlightState = {
  alt: number; // ft
  ias: number; // kt, true indicated airspeed
  shownIas: number; // kt, what the display showed (may be erroneous)
  speedFlag: boolean; // speed indication unreliable
  pitch: number; // deg, nose up +
  roll: number; // deg, right wing down +
  vs: number; // ft/min
  aoa: number; // deg
  ap: boolean; // autopilot engaged
  altn: boolean; // alternate law
  stall: boolean; // stall warning active
};

// Keyframes in seconds after 02:10:00 UTC, shaped after the BEA final report:
// autopilot off at 02:10:05; climb to about 38,000 ft; continuous stall
// warning from about 02:10:51; a 3 min 30 s descent in the stall; impact at
// 02:14:28 with pitch 16.2°, roll 5.3° left, vertical speed −10,912 ft/min.
const KEYS: [number, number, number, number, number, number, number][] = [
  // t, alt, ias, pitch, roll, vs, aoa
  [0, 35000, 275, 2.5, 0, 0, 2.5],
  [5, 35000, 274, 3, -3, 0, 3],
  [12, 35300, 265, 10, 6, 5000, 6],
  [25, 36400, 240, 12, -4, 4000, 7],
  [45, 37500, 215, 14, 3, 1500, 9],
  [70, 37900, 185, 16, -5, 0, 16],
  [100, 35500, 150, 12, 8, -8000, 35],
  [130, 31000, 120, 15, -10, -10000, 40],
  [190, 20500, 110, 14, 6, -10500, 41],
  [240, 11000, 108, 15, -4, -10800, 42],
  [268, 0, 107, 16.2, -5.3, -10912, 41],
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const flightState = (t: number): FlightState => {
  let i = 0;
  while (i < KEYS.length - 2 && KEYS[i + 1][0] <= t) {
    i++;
  }
  const [t0, ...a] = KEYS[i];
  const [t1, ...b] = KEYS[i + 1];
  const u = Math.max(0, Math.min(1, (t - t0) / (t1 - t0)));
  const s = (k: number) => lerp(a[k], b[k], u * u * (3 - 2 * u));
  const unreliable = t >= 5 && t < 34;
  const jitter = unreliable ? 60 + 40 * random(`ias-${Math.floor(t * 4)}`) : 0;
  const ias = s(1);
  return {
    alt: Math.max(0, s(0)),
    ias,
    shownIas: unreliable ? jitter : ias,
    speedFlag: unreliable,
    pitch: s(2),
    roll: s(3),
    vs: s(4),
    aoa: s(5),
    ap: t < 5,
    altn: t >= 5,
    stall: (t >= 10 && t < 12) || (t >= 51 && t < 268),
  };
};

// Clock label for a model time.
export const utc = (t: number) => {
  const total = 2 * 3600 + 10 * 60 + Math.floor(t);
  const h = Math.floor(total / 3600);
  const m = Math.floor(total / 60) % 60;
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} UTC`;
};

// Primary Flight Display.
export const PFD: React.FC<{ s: FlightState; size?: number; blink: boolean }> = ({ s, size = 620, blink }) => {
  const k = 7; // px per degree of pitch
  const cx = 300;
  const cy = 300;
  const tape = (value: number, step: number, px: number, count: number, fmt: (v: number) => string, x: number, w: number, align: "left" | "right") => {
    const base = Math.round(value / step) * step;
    const items = [];
    for (let i = -count; i <= count; i++) {
      const v = base + i * step;
      const yy = cy - (v - value) * (px / step);
      if (yy < 90 || yy > 510) {
        continue;
      }
      items.push(
        <g key={v}>
          <line x1={align === "left" ? x + w - 14 : x} y1={yy} x2={align === "left" ? x + w : x + 14} y2={yy} stroke="#fff" strokeWidth={2} />
          <text x={align === "left" ? x + w - 20 : x + 20} y={yy + 8} textAnchor={align === "left" ? "end" : "start"} fill="#fff" fontFamily={FONT.mono} fontSize={22}>
            {fmt(v)}
          </text>
        </g>,
      );
    }
    return items;
  };
  return (
    <svg width={size} height={size} viewBox="0 0 600 600">
      <defs>
        <clipPath id="adi">
          <rect x={150} y={110} width={300} height={380} rx={20} />
        </clipPath>
        <clipPath id="tapes">
          <rect x={0} y={90} width={600} height={420} />
        </clipPath>
      </defs>
      <rect width={600} height={600} rx={18} fill="#05070a" stroke="#2a3340" strokeWidth={4} />
      {/* attitude */}
      <g clipPath="url(#adi)">
        <g transform={`rotate(${-s.roll} ${cx} ${cy}) translate(0 ${s.pitch * k})`}>
          <rect x={-300} y={-900} width={1200} height={1200} fill={COLOR.sky} />
          <rect x={-300} y={cy} width={1200} height={1200} fill={COLOR.ground} />
          <line x1={-300} y1={cy} x2={900} y2={cy} stroke="#fff" strokeWidth={3} />
          {[-20, -15, -10, -5, 5, 10, 15, 20, 25, 30].map((p) => (
            <g key={p}>
              <line x1={cx - (p % 10 === 0 ? 50 : 25)} y1={cy - p * k} x2={cx + (p % 10 === 0 ? 50 : 25)} y2={cy - p * k} stroke="#fff" strokeWidth={2} />
              {p % 10 === 0 ? (
                <text x={cx - 62} y={cy - p * k + 7} textAnchor="end" fill="#fff" fontFamily={FONT.mono} fontSize={18}>
                  {Math.abs(p)}
                </text>
              ) : null}
            </g>
          ))}
        </g>
      </g>
      {/* aircraft symbol */}
      <g>
        <rect x={cx - 110} y={cy - 5} width={70} height={10} fill="#000" stroke={COLOR.amber} strokeWidth={3} />
        <rect x={cx + 40} y={cy - 5} width={70} height={10} fill="#000" stroke={COLOR.amber} strokeWidth={3} />
        <rect x={cx - 6} y={cy - 6} width={12} height={12} fill="#000" stroke={COLOR.amber} strokeWidth={3} />
      </g>
      {/* roll scale */}
      <path d={`M${cx - 120},160 A160,160 0 0,1 ${cx + 120},160`} fill="none" stroke="#fff" strokeWidth={2} transform={`translate(0 -20)`} />
      <path d={`M${cx},128 l-10,-16 l20,0 Z`} fill={COLOR.amber} transform={`rotate(${-s.roll} ${cx} ${cy})`} />
      {/* speed tape */}
      <g clipPath="url(#tapes)">
        <rect x={40} y={110} width={100} height={380} fill="#232a33" />
        {s.speedFlag ? null : tape(s.shownIas, 20, 60, 5, (v) => (v >= 0 ? String(v) : ""), 40, 100, "left")}
        {/* altitude tape */}
        <rect x={470} y={110} width={100} height={380} fill="#232a33" />
        {tape(s.alt, 500, 70, 4, (v) => String(Math.round(v / 100)), 470, 100, "right")}
      </g>
      {s.speedFlag ? (
        <text x={90} y={310} textAnchor="middle" fill={COLOR.red} fontFamily={FONT.mono} fontSize={34} opacity={blink ? 1 : 0.4}>
          SPD
        </text>
      ) : (
        <g>
          <rect x={30} y={cy - 22} width={112} height={44} fill="#000" stroke={COLOR.amber} strokeWidth={2} />
          <text x={86} y={cy + 10} textAnchor="middle" fill={COLOR.green} fontFamily={FONT.mono} fontSize={30}>
            {Math.round(s.shownIas)}
          </text>
        </g>
      )}
      <rect x={458} y={cy - 24} width={124} height={48} fill="#000" stroke={COLOR.amber} strokeWidth={2} />
      <text x={520} y={cy + 11} textAnchor="middle" fill={COLOR.green} fontFamily={FONT.mono} fontSize={30}>
        {Math.round(s.alt / 10) * 10}
      </text>
      {/* vertical speed */}
      <rect x={574} y={140} width={22} height={320} fill="#1a1f26" />
      <line x1={574} y1={cy} x2={596} y2={cy - Math.max(-150, Math.min(150, s.vs / 60))} stroke={Math.abs(s.vs) > 6000 ? COLOR.amber : COLOR.green} strokeWidth={4} />
      <text x={585} y={s.vs >= 0 ? 132 : 488} textAnchor="middle" fill={Math.abs(s.vs) > 6000 ? COLOR.amber : COLOR.green} fontFamily={FONT.mono} fontSize={16}>
        {Math.round(s.vs / 100)}
      </text>
      {/* FMA */}
      <rect x={20} y={20} width={560} height={60} fill="#000" stroke="#2a3340" />
      <text x={440} y={60} textAnchor="middle" fill={s.ap ? "#fff" : "#000"} fontFamily={FONT.mono} fontSize={24}>
        AP1
      </text>
      {s.altn ? (
        <text x={200} y={60} textAnchor="middle" fill={COLOR.amber} fontFamily={FONT.mono} fontSize={22}>
          ALTN LAW
        </text>
      ) : null}
      {/* heading */}
      <rect x={150} y={520} width={300} height={60} fill="#232a33" />
      <text x={300} y={558} textAnchor="middle" fill="#fff" fontFamily={FONT.mono} fontSize={22}>
        HDG
      </text>
    </svg>
  );
};

// Warning panel: the ECAM messages the BEA lists for the first seconds (shortened).
export const ECAM: React.FC<{ lines: { text: string; color: "amber" | "red" | "green" }[]; width?: number }> = ({ lines, width = 520 }) => (
  <div style={{ width, padding: "20px 24px", backgroundColor: "#05070a", border: "3px solid #2a3340", borderRadius: 14, fontFamily: FONT.mono }}>
    {lines.map((l) => (
      <div key={l.text} style={{ fontSize: 28, lineHeight: 1.5, color: l.color === "amber" ? COLOR.amber : l.color === "red" ? COLOR.red : COLOR.green }}>
        {l.text}
      </div>
    ))}
  </div>
);

// Navigation-display weather radar: range arcs, aircraft symbol, returns.
export const WeatherRadar: React.FC<{ frame: number; turn: number; intensity: number; size?: number }> = ({ frame, turn, intensity, size = 700 }) => {
  const sweep = (frame * 3) % 180;
  const cells = [
    { x: 330, y: 170, r: 90, c: "#2fbf5a" },
    { x: 360, y: 175, r: 60, c: "#e8d43a" },
    { x: 372, y: 182, r: 30, c: "#e5484d" },
    { x: 250, y: 220, r: 70, c: "#2fbf5a" },
    { x: 262, y: 226, r: 35, c: "#e8d43a" },
    { x: 440, y: 250, r: 55, c: "#2fbf5a" },
  ];
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 700 560">
      <defs>
        <clipPath id="nd">
          <path d="M350,500 L40,190 A440,440 0 0,1 660,190 Z" />
        </clipPath>
        <filter id="blur-nd">
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>
      <rect width={700} height={560} rx={18} fill="#05070a" stroke="#2a3340" strokeWidth={4} />
      <g clipPath="url(#nd)">
        <g transform={`rotate(${turn} 350 500)`} filter="url(#blur-nd)" opacity={intensity}>
          {cells.map((c) => (
            <ellipse key={`${c.x}-${c.r}`} cx={c.x} cy={c.y + Math.sin(frame / 50 + c.x) * 4} rx={c.r * 1.3} ry={c.r} fill={c.c} opacity={0.85} />
          ))}
        </g>
        <path d={`M350,500 L${350 + Math.cos(((180 + sweep) * Math.PI) / 180) * 480},${500 + Math.sin(((180 + sweep) * Math.PI) / 180) * 480}`} stroke="#9dffb0" strokeOpacity={0.35} strokeWidth={3} />
      </g>
      {[110, 220, 330].map((r) => (
        <path key={r} d={`M${350 - r * 0.7},${500 - r * 0.7} A${r},${r} 0 0,1 ${350 + r * 0.7},${500 - r * 0.7}`} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={2} strokeDasharray="6 8" />
      ))}
      <path d="M350,470 l-16,26 l32,0 Z" fill="none" stroke={COLOR.amber} strokeWidth={3} />
      <line x1={350} y1={470} x2={350} y2={80} stroke="#fff" strokeOpacity={0.35} strokeWidth={1.5} />
      <text x={40} y={50} fill={COLOR.cyan} fontFamily={FONT.mono} fontSize={22}>
        WXR
      </text>
    </svg>
  );
};

// The cockpit at night, seen from behind the seats: glareshield, windshield,
// the display glow and anonymous crew silhouettes (2 or 3 seats occupied).
export const CockpitView: React.FC<{ frame: number; crew?: 2 | 3; outside?: React.ReactNode; alarm?: number; children?: React.ReactNode }> = ({
  frame,
  crew = 2,
  outside,
  alarm = 0,
  children,
}) => {
  const pulse = alarm > 0 ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#020304" }}>
      {/* windshield */}
      <div style={{ position: "absolute", left: 180, right: 180, top: 70, height: 420, clipPath: "polygon(8% 100%, 0% 12%, 20% 0%, 80% 0%, 100% 12%, 92% 100%)", overflow: "hidden", backgroundColor: "#03060c" }}>
        {outside}
      </div>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <line x1={960} y1={70} x2={960} y2={490} stroke="#0b0f14" strokeWidth={26} />
        {/* glareshield and panel */}
        <path d="M0,470 L1920,470 L1920,1080 L0,1080 Z" fill="#0a0d12" />
        <path d="M120,470 Q960,430 1800,470 L1800,520 Q960,480 120,520 Z" fill="#141a22" />
        {[300, 620, 1170, 1490].map((x, i) => (
          <g key={x}>
            <rect x={x} y={560} width={260} height={230} rx={10} fill="#05070a" stroke="#222a34" strokeWidth={4} />
            <rect x={x + 10} y={570} width={240} height={210} fill={i === 0 || i === 3 ? "#1c3c66" : "#0b1a12"} opacity={0.55} />
            <rect x={x + 10} y={675} width={240} height={105} fill={i === 0 || i === 3 ? "#5a3a1f" : "#0b1a12"} opacity={i === 0 || i === 3 ? 0.55 : 0} />
          </g>
        ))}
        <rect x={880} y={560} width={160} height={230} rx={10} fill="#05070a" stroke="#222a34" strokeWidth={4} />
        <rect x={890} y={580} width={140} height={20} fill={COLOR.amber} opacity={0.25 + pulse * 0.5 * alarm} />
        {/* master warning lamps */}
        {[260, 1600].map((x) => (
          <g key={x}>
            <rect x={x} y={485} width={60} height={28} rx={4} fill={alarm ? `rgba(229,72,77,${0.3 + pulse * 0.7})` : "#2a0e10"} />
            {alarm ? <rect x={x - 20} y={470} width={100} height={60} fill={COLOR.red} opacity={pulse * 0.25} /> : null}
          </g>
        ))}
        {/* crew silhouettes */}
        {[620, 1300].map((x) => (
          <g key={x} transform={`translate(${x} 0)`}>
            <path d="M-150,1080 C-150,900 -120,800 -80,760 L80,760 C120,800 150,900 150,1080 Z" fill="#010203" />
            <ellipse cx={0} cy={690} rx={62} ry={78} fill="#010203" />
            <rect x={-170} y={650} width={34} height={430} rx={14} fill="#07090c" />
            <rect x={136} y={650} width={34} height={430} rx={14} fill="#07090c" />
          </g>
        ))}
        {crew === 3 ? (
          <g transform="translate(960 80) scale(1.35)">
            <path d="M-120,1080 C-120,960 -90,880 -60,850 L60,850 C90,880 120,960 120,1080 Z" fill="#000" />
            <ellipse cx={0} cy={790} rx={50} ry={62} fill="#000" />
          </g>
        ) : null}
      </svg>
      {children}
      {alarm > 0 ? <AbsoluteFill style={{ backgroundColor: COLOR.red, opacity: pulse * 0.06 * alarm, mixBlendMode: "screen" }} /> : null}
    </AbsoluteFill>
  );
};
