import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, EASE, FONT, tween } from "../data/theme";
import { SAFE } from "../data/video";

// Title and caption text that resolves out of a soft blur. `hold` frames after
// `at` it fades out again (omit to stay).
export const TitleText: React.FC<{
  text: string;
  at: number;
  hold?: number;
  size?: number;
  color?: string;
  weight?: number;
  font?: "sans" | "serif" | "latin" | "mono";
  spacing?: number;
  top?: number | string;
  align?: "center" | "left";
  style?: React.CSSProperties;
}> = ({ text, at, hold, size = 80, color = COLOR.text, weight = 600, font = "latin", spacing = 0.08, top = "50%", align = "center", style }) => {
  const frame = useCurrentFrame();
  const inP = tween(frame, [at, at + 26], [0, 1], EASE.out);
  const outP = hold === undefined ? 1 : tween(frame, [at + hold, at + hold + 20], [1, 0]);
  const opacity = Math.min(inP, outP);
  if (opacity <= 0) {
    return null;
  }
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top,
          left: SAFE.x,
          right: SAFE.x,
          transform: `translateY(-50%) translateY(${(1 - inP) * 12}px)`,
          textAlign: align,
          fontFamily: FONT[font],
          fontSize: size,
          fontWeight: weight,
          letterSpacing: `${spacing + (1 - inP) * 0.06}em`,
          lineHeight: 1.25,
          color,
          opacity,
          filter: `blur(${(1 - inP) * 8}px)`,
          textShadow: "0 2px 24px rgba(0,0,0,0.9)",
          whiteSpace: "pre-line",
          ...style,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
