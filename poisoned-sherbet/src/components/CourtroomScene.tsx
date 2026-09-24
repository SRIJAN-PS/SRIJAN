import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Figure } from "../illustrations/Figures";
import { COLOR, FONT, tween } from "../data/theme";
import { Dust } from "./Atmosphere";
import { Camera, Layer, type CameraMove } from "./Camera";

export const COMMISSIONERS = [
  { name: "Sir Richard Couch", side: "british" as const },
  { name: "Sir Richard Meade", side: "british" as const },
  { name: "P. S. Melvill", side: "british" as const },
  { name: "Maharaja Scindia", side: "indian" as const },
  { name: "Maharaja of Jaipur", side: "indian" as const },
  { name: "Sir Dinkar Rao", side: "indian" as const },
];

// Reconstruction of the 1875 commission hearing: a colonial hall with tall
// windows and a swinging punkah, the six commissioners at a long table,
// a witness rail and defence counsel. Figures are anonymous silhouettes.
export const CourtroomScene: React.FC<{
  camera: CameraMove;
  names?: { at: number; until?: number };
  barrister?: number;
  witness?: number;
  dimBench?: number;
}> = ({ camera, names, barrister, witness, dimBench = 0 }) => {
  const frame = useCurrentFrame();
  const punkah = Math.sin(frame / 38) * 9;
  const showNames = names ? Math.min(tween(frame, [names.at, names.at + 30], [0, 1]), names.until ? tween(frame, [names.until, names.until + 20], [1, 0]) : 1) : 0;
  const bx = [610, 750, 890, 1030, 1170, 1310];
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0a08" }}>
      <Camera {...camera}>
        <Layer depth={0.4}>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <defs>
              <linearGradient id="ct-wall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1a130d" />
                <stop offset="1" stopColor="#2b2016" />
              </linearGradient>
              <linearGradient id="ct-ray" x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0" stopColor="#ffe2a8" stopOpacity="0.28" />
                <stop offset="1" stopColor="#ffe2a8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#ct-wall)" />
            {[260, 620, 980, 1340, 1700].map((wx) => (
              <g key={wx}>
                <path d={`M${wx - 70},560 L${wx - 70},230 Q${wx},120 ${wx + 70},230 L${wx + 70},560 Z`} fill="#c9a36c" opacity={0.55} />
                <path d={`M${wx - 70},560 L${wx - 70},230 Q${wx},120 ${wx + 70},230 L${wx + 70},560 Z`} fill="none" stroke="#0d0a08" strokeWidth={8} />
                <line x1={wx} y1={150} x2={wx} y2={560} stroke="#0d0a08" strokeWidth={6} />
                <line x1={wx - 70} y1={380} x2={wx + 70} y2={380} stroke="#0d0a08" strokeWidth={6} />
                <path d={`M${wx - 70},230 L${wx + 70},230 L${wx + 420},1080 L${wx + 60},1080 Z`} fill="url(#ct-ray)" />
              </g>
            ))}
            <rect x={0} y={560} width={1920} height={520} fill="#1c150f" />
          </svg>
        </Layer>
        <Layer depth={0.55}>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <g transform={`translate(960 150) skewX(${punkah})`}>
              <rect x={-760} y={0} width={1520} height={70} fill="#d8c7a0" opacity={0.85} />
              <rect x={-760} y={62} width={1520} height={10} fill="#8a6f47" />
            </g>
            {[-600, -200, 200, 600].map((rx) => (
              <line key={rx} x1={960 + rx} y1={0} x2={960 + rx} y2={150} stroke="#3a2c1e" strokeWidth={3} />
            ))}
          </svg>
        </Layer>
        <Layer depth={0.75}>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            {bx.map((x, i) => (
              <Figure
                key={x}
                kind={i < 3 ? "barrister" : "courtier"}
                x={x}
                y={900}
                scale={0.95}
                fill="#070605"
                rim={i < 3 ? COLOR.british : COLOR.indian}
                rimOpacity={0.6}
                opacity={1 - dimBench * 0.6}
              />
            ))}
            <rect x={520} y={742} width={890} height={24} fill="#2a1c12" />
            <rect x={530} y={766} width={870} height={150} fill="#1f3326" />
            <rect x={530} y={766} width={870} height={150} fill="none" stroke="#0a0806" strokeWidth={4} />
            {bx.map((x) => (
              <rect key={`p${x}`} x={x - 26} y={732} width={52} height={10} fill="#e6d8b6" opacity={0.7} />
            ))}
            {/* witness rail */}
            <g opacity={witness ?? 0}>
              <Figure kind="servant" x={1640} y={820} scale={0.7} rim={COLOR.candle} rimOpacity={0.5} facing={-1} />
              <rect x={1560} y={700} width={170} height={16} fill="#2a1c12" />
              <rect x={1570} y={716} width={150} height={120} fill="#1a120c" />
            </g>
          </svg>
        </Layer>
        <Layer depth={1.1}>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <g opacity={barrister ?? 0}>
              <Figure kind="barrister" x={330} y={1010} scale={1.25} rim={COLOR.candle} rimOpacity={0.5} facing={1} />
            </g>
          </svg>
        </Layer>
        <Layer depth={1.35}>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ filter: "blur(3px)" }}>
            {new Array(14).fill(0).map((_, i) => (
              <g key={i} transform={`translate(${60 + i * 140} ${1080})`}>
                <ellipse cx={0} cy={-90} rx={46} ry={56} fill="#040303" />
                {i % 3 === 0 ? <ellipse cx={0} cy={-140} rx={52} ry={30} fill="#040303" /> : null}
                <rect x={-80} y={-50} width={160} height={60} rx={30} fill="#040303" />
              </g>
            ))}
          </svg>
        </Layer>
        <Dust count={70} seed="court" opacity={0.35} />
      </Camera>
      {showNames > 0 ? (
        <AbsoluteFill style={{ opacity: showNames }}>
          {COMMISSIONERS.map((c, i) => (
            <div
              key={c.name}
              style={{
                position: "absolute",
                left: [610, 750, 890, 1030, 1170, 1310][i],
                top: i % 2 ? 470 : 438,
                width: 240,
                transform: "translateX(-50%)",
                textAlign: "center",
                fontFamily: FONT.mono,
                fontSize: 22,
                letterSpacing: "0.02em",
                backgroundColor: "rgba(6,5,4,0.6)",
                padding: "4px 0",
                color: c.side === "british" ? COLOR.british : COLOR.indian,
                textShadow: "0 2px 10px #000",
              }}
            >
              {c.name}
            </div>
          ))}
          <div style={{ position: "absolute", left: 540, top: 392, width: 420, textAlign: "center", fontFamily: FONT.mono, fontSize: 17, letterSpacing: "0.3em", color: COLOR.british, textShadow: "0 2px 10px #000" }}>
            BRITISH MEMBERS
          </div>
          <div style={{ position: "absolute", left: 960, top: 392, width: 420, textAlign: "center", fontFamily: FONT.mono, fontSize: 17, letterSpacing: "0.3em", color: COLOR.indian, textShadow: "0 2px 10px #000" }}>
            INDIAN MEMBERS
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
