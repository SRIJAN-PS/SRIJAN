import { random } from "remotion";
import { Figure } from "./Figures";
import { Glass } from "./Glass";

// Lamp-lit interiors for the dramatised morning of 9 November 1874.

const Shutters: React.FC<{ x: number; y: number; w: number; h: number; light: number }> = ({ x, y, w, h, light }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#0a0806" stroke="#2c2118" strokeWidth={10} />
    {new Array(Math.floor(h / 26)).fill(0).map((_, i) => (
      <rect key={i} x={x + 10} y={y + 12 + i * 26} width={w - 20} height={5} fill="#f6d9a0" opacity={light * (0.55 + 0.45 * random(`sh-${i}`))} />
    ))}
    <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke="#2c2118" strokeWidth={8} />
  </g>
);

// The Resident's study at dawn: shuttered window, desk, papers, candle.
export const Study: React.FC<{ frame: number; light?: number; glass?: boolean }> = ({ frame, light = 0.8, glass = true }) => {
  const flick = 0.85 + 0.1 * Math.sin(frame / 3.2) + 0.05 * Math.sin(frame / 1.9);
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="study-candle" cx="0.5" cy="0.5">
          <stop offset="0" stopColor="#ffd08a" stopOpacity={0.55 * flick} />
          <stop offset="0.35" stopColor="#e0a75a" stopOpacity={0.18 * flick} />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="study-beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6d9a0" stopOpacity={0.22 * light} />
          <stop offset="1" stopColor="#f6d9a0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1920" height="1080" fill="#0e0a07" />
      <rect x={0} y={760} width={1920} height={320} fill="#140e09" />
      <Shutters x={1240} y={170} w={360} h={520} light={light} />
      <path d={`M1250,190 L1590,190 L1100,1080 L520,1080 Z`} fill="url(#study-beam)" />
      <circle cx={560} cy={500} r={520} fill="url(#study-candle)" />
      {/* bookcase */}
      <rect x={90} y={120} width={330} height={640} fill="#120d09" stroke="#241910" strokeWidth={6} />
      {new Array(5).fill(0).map((_, r) =>
        new Array(11).fill(0).map((__, c) => (
          <rect key={`${r}-${c}`} x={104 + c * 28} y={140 + r * 124 + random(`bk${r}${c}`) * 16} width={22} height={100 - random(`bk${r}${c}`) * 16} fill={["#2a1a10", "#3a2414", "#221812", "#3b2a1a"][(r + c) % 4]} />
        )),
      )}
      {/* desk */}
      <rect x={380} y={640} width={1020} height={36} fill="#3a2414" />
      <rect x={380} y={676} width={1020} height={14} fill="#1f140b" />
      <rect x={420} y={690} width={60} height={390} fill="#1a110a" />
      <rect x={1300} y={690} width={60} height={390} fill="#1a110a" />
      <rect x={560} y={612} width={260} height={30} fill="#d9c9a2" opacity={0.8} transform="rotate(-2 690 627)" />
      <rect x={600} y={598} width={220} height={20} fill="#cbb892" opacity={0.7} transform="rotate(3 710 608)" />
      {/* inkstand */}
      <rect x={880} y={604} width={90} height={36} fill="#241810" />
      <circle cx={905} cy={600} r={12} fill="#0a0706" />
      <line x1={950} y1={604} x2={990} y2={540} stroke="#e8e0cc" strokeWidth={3} />
      {/* candle */}
      <rect x={540} y={520} width={28} height={120} fill="#e9dcc0" />
      <rect x={520} y={632} width={68} height={12} rx={4} fill="#b8894a" />
      <ellipse cx={554} cy={500 - 2 * Math.sin(frame / 4)} rx={9 * flick} ry={22 * flick} fill="#ffcf7a" />
      <ellipse cx={554} cy={506} rx={4} ry={10} fill="#fff6d8" />
      {glass ? <Glass x={1110} y={640} scale={0.62} level={0.8} /> : null}
      {/* chair */}
      <path d="M760,1080 L770,720 Q850,690 930,720 L940,1080 Z" fill="#0b0806" />
    </svg>
  );
};

// The Residency pantry: a table with halved pomelos and the prepared glass,
// a servant at work (anonymous silhouette).
export const Pantry: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="pantry-door" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#f5d7a0" stopOpacity="0.9" />
        <stop offset="1" stopColor="#f5d7a0" stopOpacity="0.2" />
      </linearGradient>
      <radialGradient id="pantry-light" cx="0.25" cy="0.4">
        <stop offset="0" stopColor="#f5d7a0" stopOpacity="0.35" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="1920" height="1080" fill="#110c08" />
    <rect x={140} y={140} width={360} height={720} fill="url(#pantry-door)" />
    <rect width="1920" height="1080" fill="url(#pantry-light)" />
    <rect x={0} y={860} width={1920} height={220} fill="#1a120b" />
    {/* shelf with vessels */}
    <rect x={1100} y={300} width={640} height={16} fill="#2a1c12" />
    {[1140, 1250, 1370, 1500, 1620].map((vx, i) => (
      <ellipse key={vx} cx={vx} cy={260} rx={36 + (i % 2) * 10} ry={44} fill={i % 2 ? "#6b3b1f" : "#8a5a2a"} opacity={0.7} />
    ))}
    {/* table */}
    <rect x={700} y={700} width={960} height={30} fill="#3a2414" />
    <rect x={740} y={730} width={40} height={300} fill="#1c130b" />
    <rect x={1580} y={730} width={40} height={300} fill="#1c130b" />
    {[
      [980, 690],
      [1080, 694],
    ].map(([px, py], i) => (
      <g key={i}>
        <path d={`M${px - 46},${py} A46,40 0 0,1 ${px + 46},${py} Z`} fill="#c9d38a" />
        <path d={`M${px - 38},${py} A38,32 0 0,1 ${px + 38},${py} Z`} fill="#f0b8a0" />
        {new Array(8).fill(0).map((_, k) => (
          <line key={k} x1={px} y1={py} x2={px + Math.cos(Math.PI + (k * Math.PI) / 7) * 36} y2={py + Math.sin(Math.PI + (k * Math.PI) / 7) * 30} stroke="#e39e84" strokeWidth={2} />
        ))}
      </g>
    ))}
    <Glass x={1300} y={700} scale={0.55} level={0.1 + 0.7 * Math.min(1, frame / 90)} />
    <Figure kind="servant" x={1500} y={1010} scale={1.35} facing={-1} rim="#f5d7a0" rimOpacity={0.45} />
  </svg>
);

// Specimen bottle for the sample sent for examination.
export const Specimen: React.FC = () => (
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="spec-light" cx="0.5" cy="0.45">
        <stop offset="0" stopColor="#2a2016" />
        <stop offset="1" stopColor="#070504" />
      </radialGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#spec-light)" />
    <g transform="translate(960 800)">
      <ellipse cx={0} cy={6} rx={170} ry={22} fill="#000" opacity={0.6} />
      <path d="M-120,0 L-120,-300 Q-120,-340 -60,-350 L-60,-420 L60,-420 L60,-350 Q120,-340 120,-300 L120,0 Z" fill="#9fb3a8" opacity={0.18} stroke="#d8e2d8" strokeOpacity={0.5} strokeWidth={3} />
      <rect x={-70} y={-470} width={140} height={60} rx={10} fill="#3a2a1a" />
      <path d="M-110,-6 L-110,-60 Q0,-80 110,-60 L110,-6 Z" fill="#c8bb95" opacity={0.5} />
      {new Array(40).fill(0).map((_, i) => (
        <circle key={i} cx={(random(`sp${i}`) - 0.5) * 200} cy={-12 - random(`spy${i}`) * 26} r={2 + random(`spr${i}`) * 3} fill="#2a2018" />
      ))}
      <rect x={-90} y={-250} width={180} height={110} fill="#e6d8b6" />
      <rect x={-90} y={-250} width={180} height={110} fill="none" stroke="#7a6445" strokeWidth={2} />
      <line x1={-66} y1={-210} x2={66} y2={-210} stroke="#6b5840" strokeWidth={3} />
      <line x1={-66} y1={-180} x2={40} y2={-180} stroke="#6b5840" strokeWidth={3} />
      <path d="M-100,-290 L-100,-40" stroke="#fff" strokeOpacity={0.3} strokeWidth={8} strokeLinecap="round" />
    </g>
  </svg>
);
