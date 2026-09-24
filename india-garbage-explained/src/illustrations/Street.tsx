import { random } from "remotion";

// Vector artwork for the opening street scene. All shapes are original,
// drawn in a flat documentary style (no photos, no logos).

export const GROUND_Y = 790;

type Block = { x: number; w: number; h: number; tank: boolean; balcony: boolean };

const makeBlocks = (seed: string, count: number, minH: number, maxH: number, spread: number): Block[] => {
  let x = -40;
  return Array.from({ length: count }, (_, i) => {
    const w = 110 + random(`${seed}-w-${i}`) * 130;
    const block = {
      x,
      w,
      h: minH + random(`${seed}-h-${i}`) * (maxH - minH),
      tank: random(`${seed}-t-${i}`) > 0.45,
      balcony: random(`${seed}-b-${i}`) > 0.4,
    };
    x += w + random(`${seed}-g-${i}`) * spread;
    return block;
  });
};

const FAR = makeBlocks("far", 16, 200, 420, 20);
const NEAR = makeBlocks("near", 11, 250, 460, 90);

const Windows: React.FC<{ b: Block; seed: string; lit: number }> = ({ b, seed, lit }) => {
  const cols = Math.max(2, Math.floor((b.w - 24) / 34));
  const rows = Math.floor((b.h - 40) / 44);
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const on = random(`${seed}-${b.x}-${r}-${c}`);
      if (on < 1 - lit) {
        continue;
      }
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={b.x + 16 + c * 34}
          y={GROUND_Y - b.h + 26 + r * 44}
          width={18}
          height={22}
          rx={2}
          fill={on > 0.93 ? "#BFD8F2" : "#F2C66D"}
          opacity={0.35 + (on - (1 - lit)) * 1.2}
        />,
      );
    }
  }
  return <>{cells}</>;
};

export const CityStreet: React.FC = () => {
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="street-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#070C13" />
          <stop offset="0.65" stopColor="#132436" />
          <stop offset="1" stopColor="#1D3246" />
        </linearGradient>
        <radialGradient id="street-lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD9A0" stopOpacity={0.55} />
          <stop offset="1" stopColor="#FFD9A0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1920} height={GROUND_Y} fill="url(#street-sky)" />
      {FAR.map((b, i) => (
        <g key={i} opacity={0.75}>
          <rect x={b.x} y={GROUND_Y - b.h} width={b.w} height={b.h} fill="#0E1A26" />
          <Windows b={b} seed="far" lit={0.18} />
        </g>
      ))}
      {NEAR.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={GROUND_Y - b.h + 60} width={b.w} height={b.h - 60} fill="#122130" />
          {b.tank ? (
            <g>
              <rect x={b.x + b.w - 56} y={GROUND_Y - b.h + 30} width={34} height={30} rx={4} fill="#1C2E40" />
              <rect x={b.x + b.w - 60} y={GROUND_Y - b.h + 26} width={42} height={6} rx={3} fill="#22384D" />
            </g>
          ) : null}
          {b.balcony
            ? Array.from({ length: Math.floor((b.h - 100) / 88) }, (_, r) => (
                <rect
                  key={r}
                  x={b.x + 8}
                  y={GROUND_Y - b.h + 130 + r * 88}
                  width={b.w - 16}
                  height={5}
                  fill="#1B2D3E"
                />
              ))
            : null}
          <Windows b={{ ...b, h: b.h - 60 }} seed="near" lit={0.32} />
        </g>
      ))}
      {/* Overhead cables between poles */}
      <path d="M-20 430 Q 480 480 980 440 T 1960 450" stroke="#0A121A" strokeWidth={3} fill="none" />
      <path d="M-20 455 Q 520 505 1000 468 T 1960 478" stroke="#0A121A" strokeWidth={2} fill="none" />
      {/* Street light */}
      <circle cx={1520} cy={520} r={170} fill="url(#street-lamp)" />
      <rect x={1560} y={512} width={8} height={GROUND_Y - 512} fill="#1B2733" />
      <path d="M1564 516 Q 1560 500 1528 506" stroke="#1B2733" strokeWidth={6} fill="none" />
      <rect x={1506} y={504} width={30} height={10} rx={4} fill="#FFE2B0" />
      {/* Pavement and road */}
      <rect x={0} y={GROUND_Y} width={1920} height={40} fill="#1A2733" />
      <rect x={0} y={GROUND_Y + 40} width={1920} height={1080 - GROUND_Y - 40} fill="#0E161E" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={i * 180 + 20} y={958} width={90} height={8} rx={4} fill="#26343F" />
      ))}
    </svg>
  );
};

// Standing figure. `arm` rotates the throwing arm in degrees
// (0 = hanging, positive = forward/up). `step` bobs the legs while walking.
export const Person: React.FC<{ x: number; arm: number; step?: number; opacity?: number; flip?: boolean }> = ({
  x,
  arm,
  step = 0,
  opacity = 1,
  flip = false,
}) => {
  const swing = Math.sin(step) * 14;
  return (
    <g transform={`translate(${x} ${GROUND_Y}) scale(${flip ? -1 : 1} 1)`} opacity={opacity}>
      <rect x={-22 + swing * 0.3} y={-120} width={18} height={120} rx={8} fill="#1F2C38" transform={`rotate(${swing} -13 -120)`} />
      <rect x={4 - swing * 0.3} y={-120} width={18} height={120} rx={8} fill="#1F2C38" transform={`rotate(${-swing} 13 -120)`} />
      <path d="M-34 -120 L-30 -236 Q 0 -252 30 -236 L34 -120 Z" fill="#3E6079" />
      <rect x={-36} y={-238} width={16} height={92} rx={8} fill="#35546B" />
      <g transform={`rotate(${-arm} 26 -228)`}>
        <rect x={18} y={-236} width={16} height={96} rx={8} fill="#35546B" />
        <circle cx={26} cy={-140} r={9} fill="#B98A68" />
      </g>
      <rect x={-8} y={-262} width={16} height={18} fill="#B98A68" />
      <circle cx={0} cy={-282} r={26} fill="#B98A68" />
      <path d="M-26 -286 Q -24 -314 0 -312 Q 26 -312 26 -286 Q 12 -298 -26 -286 Z" fill="#1B1F24" />
    </g>
  );
};

// Hand position for the throwing arm (matches Person's geometry).
export const handPosition = (x: number, arm: number) => {
  const a = (-arm * Math.PI) / 180;
  const dx = 0;
  const dy = 88;
  return {
    x: x + 26 + dx * Math.cos(a) - dy * Math.sin(a),
    y: GROUND_Y - 228 + dx * Math.sin(a) + dy * Math.cos(a),
  };
};

// Pair of street bins: green for wet waste, blue for dry waste.
export const StreetBins: React.FC<{ x: number; lid?: number }> = ({ x, lid = 0 }) => {
  const bin = (bx: number, color: string, open: number, label: string) => (
    <g>
      <path d={`M${bx - 44} ${GROUND_Y - 128} L${bx + 44} ${GROUND_Y - 128} L${bx + 36} ${GROUND_Y} L${bx - 36} ${GROUND_Y} Z`} fill={color} />
      <rect x={bx - 30} y={GROUND_Y - 96} width={60} height={4} rx={2} fill="#00000033" />
      <text x={bx} y={GROUND_Y - 40} textAnchor="middle" fontSize={20} fontWeight={700} fill="#0B141C" opacity={0.6}>
        {label}
      </text>
      <g transform={`rotate(${-open * 35} ${bx - 48} ${GROUND_Y - 130})`}>
        <rect x={bx - 50} y={GROUND_Y - 142} width={100} height={16} rx={6} fill={color} />
        <rect x={bx - 50} y={GROUND_Y - 142} width={100} height={16} rx={6} fill="#FFFFFF" opacity={0.12} />
      </g>
    </g>
  );
  return (
    <g>
      {bin(x, "#3E9C63", 0, "WET")}
      {bin(x + 110, "#2F79B8", lid, "DRY")}
    </g>
  );
};

// Municipal garbage truck, side view, facing left. `x` is the front bumper.
// Set `flip` to face right (then `x` is still the front bumper).
export const GarbageTruck: React.FC<{
  x: number;
  y?: number;
  wheel: number;
  scale?: number;
  opacity?: number;
  flip?: boolean;
}> = ({ x, y = 930, wheel, scale = 1, opacity = 1, flip = false }) => {
  const Wheel = ({ cx }: { cx: number }) => (
    <g transform={`translate(${cx} -34) rotate(${wheel})`}>
      <circle r={34} fill="#0B0F13" />
      <circle r={16} fill="#5A6773" />
      <rect x={-2} y={-16} width={4} height={32} fill="#0B0F13" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} opacity={opacity}>
      <path d="M8 -150 L110 -150 L126 -96 L126 -40 L0 -40 L0 -120 Z" fill="#D8DEE4" />
      <path d="M22 -138 L96 -138 L108 -100 L22 -100 Z" fill="#23384A" />
      <rect x={0} y={-66} width={126} height={10} fill="#B9C2CB" />
      <path d="M134 -196 L420 -196 L436 -40 L134 -40 Z" fill="#2E7C78" />
      <path d="M150 -180 L404 -180 L414 -60 L150 -60 Z" fill="#35908B" />
      <rect x={180} y={-150} width={200} height={14} rx={7} fill="#2A6E6A" />
      <rect x={180} y={-110} width={200} height={14} rx={7} fill="#2A6E6A" />
      <rect x={-6} y={-44} width={450} height={14} rx={6} fill="#1A242D" />
      <Wheel cx={70} />
      <Wheel cx={300} />
      <Wheel cx={380} />
      <rect x={-4} y={-92} width={10} height={18} rx={3} fill="#FFE2B0" />
    </g>
  );
};

export const PlasticBottle: React.FC<{ x: number; y: number; rotate?: number; scale?: number; opacity?: number }> = ({
  x,
  y,
  rotate = 0,
  scale = 1,
  opacity = 1,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
    <rect x={-7} y={-40} width={14} height={8} rx={2} fill="#4C8FD6" />
    <path d="M-7 -32 L7 -32 L9 -24 Q 15 -18 15 -8 L15 34 Q 15 40 9 40 L-9 40 Q -15 40 -15 34 L-15 -8 Q -15 -18 -9 -24 Z" fill="#9CD3F5" fillOpacity={0.75} stroke="#D8F0FF" strokeWidth={2} />
    <rect x={-15} y={2} width={30} height={14} fill="#5AA6E8" opacity={0.9} />
  </g>
);
