import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, FONT } from "../data/theme";
import { Clouds, NightSky } from "../illustrations/Scenery";
import { A330Side } from "./Aircraft";
import { Dust } from "./Atmosphere";

// The A330 at night above (or inside) a cloud deck, with drifting clouds for
// motion. `crystals` streaks ice crystals past; `lightning` flashes the clouds.
export const Exterior: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  pitch?: number;
  cloudY?: number;
  crystals?: number;
  lightning?: number;
  inCloud?: number;
  speed?: number;
  sink?: number;
}> = ({ x = 660, y = 520, scale = 1.1, pitch = 0, cloudY = 800, crystals = 0, lightning = 0, inCloud = 0, speed = 3, sink = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <NightSky frame={frame} horizon={900} />
      <Clouds frame={frame} y={cloudY + sink} seed="deck-far" color="#101b2a" speed={speed * 0.4} scale={1.4} lightning={lightning} />
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <A330Side x={x} y={y + Math.sin(frame / 40) * 4} scale={scale} frame={frame} pitch={pitch} />
      </svg>
      <Clouds frame={frame} y={cloudY + 140 + sink * 1.4} seed="deck-near" color="#0b1422" speed={speed} scale={1.8} lightning={lightning} />
      {inCloud > 0 ? <Clouds frame={frame} y={520} seed="in-cloud" color="#1a2638" speed={speed * 2} scale={2.4} opacity={inCloud} lightning={lightning} /> : null}
      {crystals > 0 ? (
        <AbsoluteFill style={{ opacity: crystals }}>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            {new Array(120).fill(0).map((_, i) => {
              const yy = (i * 97) % 1080;
              const xx = 1920 - ((frame * (40 + (i % 7) * 8) + i * 211) % 2300);
              return <line key={i} x1={xx} y1={yy} x2={xx + 40} y2={yy - 3} stroke="#dff3ff" strokeWidth={1.5} opacity={0.5} />;
            })}
          </svg>
        </AbsoluteFill>
      ) : null}
      <Dust count={30} seed="ext" color="#cfe3ff" opacity={0.25} />
    </AbsoluteFill>
  );
};

export const Clock: React.FC<{ text: string; top?: number; size?: number; color?: string }> = ({ text, top = 150, size = 64, color = COLOR.amber }) => (
  <div
    style={{
      position: "absolute",
      right: 140,
      top,
      padding: "10px 22px",
      border: `2px solid ${color}`,
      backgroundColor: "rgba(2,6,12,0.8)",
      fontFamily: FONT.mono,
      fontSize: size,
      letterSpacing: "0.06em",
      color,
      textShadow: `0 0 18px ${color}55`,
    }}
  >
    {text}
  </div>
);

export const BigCounter: React.FC<{ value: string; label: string; color?: string; top?: string }> = ({ value, label, color = COLOR.text, top = "46%" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, transform: "translateY(-50%)", textAlign: "center", textShadow: "0 4px 30px #000" }}>
    <div style={{ fontFamily: FONT.latin, fontSize: 150, fontWeight: 800, color, letterSpacing: "0.02em" }}>{value}</div>
    <div style={{ fontFamily: FONT.mono, fontSize: 28, letterSpacing: "0.3em", color: COLOR.textDim }}>{label}</div>
  </div>
);

// Ground radar scope: sweep, range rings and a target that fades out at `lostAt`.
export const RadarScope: React.FC<{ frame: number; lostAt: number; size?: number }> = ({ frame, lostAt, size = 760 }) => {
  const sweep = (frame * 4) % 360;
  const target = { x: 470, y: 250 };
  const seen = frame < lostAt ? 1 : Math.max(0, 1 - (frame - lostAt) / 40);
  const ang = (Math.atan2(target.y - 380, target.x - 380) * 180) / Math.PI;
  const since = (((sweep - ang) % 360) + 360) % 360;
  const glow = Math.max(0, 1 - since / 300) * seen;
  return (
    <svg width={size} height={size} viewBox="0 0 760 760">
      <circle cx={380} cy={380} r={360} fill="#020b06" stroke="#1d5a34" strokeWidth={4} />
      {[90, 180, 270].map((r) => (
        <circle key={r} cx={380} cy={380} r={r} fill="none" stroke="#1d5a34" strokeWidth={2} />
      ))}
      <line x1={20} y1={380} x2={740} y2={380} stroke="#1d5a34" strokeWidth={1.5} />
      <line x1={380} y1={20} x2={380} y2={740} stroke="#1d5a34" strokeWidth={1.5} />
      <g transform={`rotate(${sweep} 380 380)`}>
        <path d="M380,380 L740,380 A360,360 0 0,0 720,260 Z" fill="#3ddc84" opacity={0.18} />
        <line x1={380} y1={380} x2={740} y2={380} stroke="#3ddc84" strokeWidth={3} />
      </g>
      <circle cx={target.x} cy={target.y} r={9} fill="#3ddc84" opacity={0.3 + 0.7 * glow} />
      <text x={target.x + 18} y={target.y - 12} fill="#3ddc84" fontFamily={FONT.mono} fontSize={22} opacity={0.4 + 0.6 * seen}>
        AF447
      </text>
    </svg>
  );
};
