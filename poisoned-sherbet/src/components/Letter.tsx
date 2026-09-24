import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLOR, EASE, tween } from "../data/theme";

// Document and letter animations. None of them carries legible text: they
// show that documents moved and were written, never what they said.

// A sealed envelope with a wax seal (for letters travelling along arrows).
export const Envelope: React.FC<{ x: number; y: number; scale?: number; rotate?: number; opacity?: number; seal?: string }> = ({
  x,
  y,
  scale = 1,
  rotate = 0,
  opacity = 1,
  seal = COLOR.poison,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
    <rect x={-60} y={-38} width={120} height={76} rx={3} fill="#e2d3ae" stroke="#8a7350" strokeWidth={1.5} />
    <path d="M-60,-38 L0,8 L60,-38" fill="none" stroke="#8a7350" strokeWidth={1.5} />
    <circle cx={0} cy={6} r={13} fill={seal} />
    <circle cx={0} cy={6} r={8} fill="none" stroke="#5a1a14" strokeWidth={2} />
  </g>
);

// A sheet being written by hand: illegible lines of ink appear behind a pen.
export const PageWriting: React.FC<{ at: number; duration: number; lines?: number; seed?: string }> = ({ at, duration, lines = 14, seed = "page" }) => {
  const frame = useCurrentFrame();
  const p = tween(frame, [at, at + duration], [0, 1], (t) => t);
  const done = p * lines;
  const cur = Math.min(lines - 1, Math.floor(done));
  const curP = done - cur;
  const penX = 260 + curP * (1260 + random(`${seed}-w${cur}`) * 120);
  const penY = 250 + cur * 52;
  const scribble = (i: number, frac: number) => {
    const w = (1260 + random(`${seed}-w${i}`) * 120) * frac;
    let d = `M260,${250 + i * 52}`;
    for (let k = 0; k < w; k += 14) {
      d += ` q7,${-10 - random(`${seed}-${i}-${k}`) * 10} 14,${random(`${seed}-b${i}-${k}`) * 6 - 3}`;
    }
    return <path key={i} d={d} stroke="#2a1d12" strokeWidth={2.4} fill="none" opacity={0.8} />;
  };
  return (
    <AbsoluteFill>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id="lamp-page" cx="30%" cy="30%">
            <stop offset="0" stopColor="#f7e6bd" />
            <stop offset="1" stopColor="#a88c5d" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="#0b0806" />
        <g transform="rotate(-3 960 540)">
          <rect x={180} y={120} width={1560} height={1000} fill="url(#lamp-page)" />
          <rect x={180} y={120} width={1560} height={1000} fill="none" stroke="#6d5634" strokeWidth={2} />
          {new Array(lines).fill(0).map((_, i) => (i < cur ? scribble(i, 1) : i === cur ? scribble(i, curP) : null))}
          <g transform={`translate(${penX} ${penY - 6}) rotate(-35)`}>
            <rect x={-6} y={-330} width={12} height={300} rx={5} fill="#1c130c" />
            <path d="M-6,-30 L0,0 L6,-30 Z" fill="#8f8f8f" />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// A stack of bound trial-record pages, leafing over one after another.
export const RecordStack: React.FC<{ at: number; pages?: number; interval?: number }> = ({ at, pages = 8, interval = 14 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <div style={{ position: "absolute", left: "50%", top: "52%", width: 820, height: 1060, transform: "translate(-50%, -50%) rotateX(38deg) rotateZ(-6deg)" }}>
        {new Array(pages).fill(0).map((_, i) => {
          const flip = tween(frame, [at + i * interval, at + i * interval + 24], [0, 1], EASE.inOut);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: i % 2 ? "#e6d8b6" : "#dccb9f",
                border: "1px solid #8a7350",
                transformOrigin: "0% 50%",
                transform: `translateZ(${(pages - i) * 2}px) rotateY(${-flip * 170}deg)`,
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                padding: 70,
              }}
            >
              {new Array(26).fill(0).map((_, k) => (
                <div key={k} style={{ height: 6, width: `${70 + random(`rs-${i}-${k}`) * 28}%`, marginBottom: 22, backgroundColor: "rgba(40,30,20,0.45)" }} />
              ))}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
