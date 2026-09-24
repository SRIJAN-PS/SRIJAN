import { Img, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { staticFile } from "remotion";
import { STATS, type Stat, type StatId } from "../config/stats";
import { COLOR, FONT, tween } from "../config/theme";

// Big-number card. If the statistic is switched off in stats.ts it shows a
// conceptual "large and growing" animation with no number.
export const StatCard: React.FC<{
  statId: StatId;
  x: number;
  y: number;
  width?: number;
  appear: number;
  opacity?: number;
}> = ({ statId, x, y, width = 620, appear, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const stat: Stat = STATS[statId];
  const t = tween(frame, [appear, appear + 20], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        padding: "32px 36px",
        borderRadius: 20,
        backgroundColor: "rgba(17, 26, 35, 0.88)",
        border: `1px solid ${COLOR.line}`,
        opacity: t * opacity,
        translate: `0px ${(1 - t) * 24}px`,
      }}
    >
      {stat.show ? (
        <>
          {stat.qualifier ? (
            <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: 4, color: COLOR.muted }}>
              {stat.qualifier.toUpperCase()}
            </div>
          ) : null}
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 92, fontWeight: 800, letterSpacing: -2, color: COLOR.accent, lineHeight: 1.05 }}>
              {stat.value}
            </span>
            <span style={{ fontSize: 34, fontWeight: 600, color: COLOR.text }}>{stat.unit}</span>
          </div>
        </>
      ) : (
        <ConceptualScale frame={frame - appear} />
      )}
      <div style={{ marginTop: 12, fontSize: 30, lineHeight: 1.3, color: COLOR.muted }}>{stat.label}</div>
      <div
        style={{
          marginTop: 18,
          display: "inline-block",
          padding: "6px 14px",
          borderRadius: 8,
          border: `1px solid ${COLOR.line}`,
          fontFamily: FONT.mono,
          fontSize: 20,
          color: COLOR.muted,
        }}
      >
        DATA YEAR · {stat.year}
      </div>
    </div>
  );
};

// Stand-in used when a figure isn't available: rows of blocks that keep
// filling in, suggesting scale without implying a number.
const ConceptualScale: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, width: 440, height: 110 }}>
      {Array.from({ length: 40 }, (_, i) => (
        <div
          key={i}
          style={{
            width: 36,
            height: 22,
            borderRadius: 4,
            backgroundColor: COLOR.accent,
            opacity: tween(frame, [i * 2, i * 2 + 10], [0, 0.85]),
          }}
        />
      ))}
    </div>
  );
};

// Horizontal bar showing a share of generated waste (generated = 100%).
export const StatBar: React.FC<{
  statId: StatId;
  title: string;
  x: number;
  y: number;
  width: number;
  appear: number;
  color: string;
}> = ({ statId, title, x, y, width, appear, color }) => {
  const frame = useCurrentFrame();
  const stat: Stat = STATS[statId];
  const t = tween(frame, [appear, appear + 15], [0, 1]);
  const fill = tween(frame, [appear + 5, appear + 45], [0, stat.share ?? 0]);
  if (!stat.show) {
    return null;
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, width, opacity: t }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 30, fontWeight: 600 }}>{title}</span>
        <span style={{ fontSize: 40, fontWeight: 800, color }}>
          <span style={{ fontSize: 22, fontWeight: 500, color: COLOR.muted, marginRight: 10 }}>{stat.qualifier}</span>
          {stat.value}
        </span>
      </div>
      <div style={{ marginTop: 10, height: 22, borderRadius: 11, backgroundColor: COLOR.line, overflow: "hidden" }}>
        <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 11, backgroundColor: color }} />
      </div>
      <div style={{ marginTop: 8, fontSize: 22, color: COLOR.muted }}>
        {stat.label} · {stat.year}
      </div>
    </div>
  );
};

// Framed text card for rules and definitions.
export const InfoCard: React.FC<{
  x: number;
  y: number;
  width: number;
  appear: number;
  accent: string;
  eyebrow: string;
  children: React.ReactNode;
  opacity?: number;
}> = ({ x, y, width, appear, accent, eyebrow, children, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const t = tween(frame, [appear, appear + 18], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        padding: "26px 32px",
        borderRadius: 16,
        borderLeft: `5px solid ${accent}`,
        backgroundColor: "rgba(17, 26, 35, 0.92)",
        opacity: t * opacity,
        translate: `0px ${(1 - t) * 18}px`,
      }}
    >
      <div style={{ fontFamily: FONT.mono, fontSize: 21, letterSpacing: 3, color: accent }}>{eyebrow}</div>
      <div style={{ marginTop: 10, fontSize: 32, lineHeight: 1.35, fontWeight: 500, color: COLOR.text }}>{children}</div>
    </div>
  );
};

// Replaceable media slot: shows the image/video at `src` (from /public) if
// one is configured, otherwise the vector fallback passed as children.
export const MediaSlot: React.FC<{ src: string | null; children: React.ReactNode; style?: React.CSSProperties }> = ({
  src,
  children,
  style,
}) => {
  if (!src) {
    return <>{children}</>;
  }
  const fill: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style };
  return /\.(mp4|webm|mov)$/i.test(src) ? (
    <Video src={staticFile(src)} muted style={fill} />
  ) : (
    <Img src={staticFile(src)} style={fill} />
  );
};
