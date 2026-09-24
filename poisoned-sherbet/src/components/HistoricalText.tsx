import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, EASE, FONT, tween } from "../data/theme";
import { SAFE } from "../data/video";

// Serif text that resolves out of a soft blur, letter-spaced like a period
// title card. `hold` frames after `at` it fades out again (omit to stay).
export const HistoricalText: React.FC<{
  text: string;
  at: number;
  hold?: number;
  size?: number;
  color?: string;
  weight?: number;
  italic?: boolean;
  spacing?: number;
  align?: "center" | "left";
  top?: number | string;
  mono?: boolean;
  style?: React.CSSProperties;
}> = ({ text, at, hold, size = 96, color = COLOR.text, weight = 600, italic, spacing = 0.12, align = "center", top = "50%", mono, style }) => {
  const frame = useCurrentFrame();
  const inP = tween(frame, [at, at + 28], [0, 1], EASE.out);
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
          transform: `translateY(-50%) translateY(${(1 - inP) * 14}px)`,
          textAlign: align,
          fontFamily: mono ? FONT.mono : FONT.serif,
          fontSize: size,
          fontWeight: weight,
          fontStyle: italic ? "italic" : "normal",
          letterSpacing: `${spacing + (1 - inP) * 0.08}em`,
          lineHeight: 1.15,
          color,
          opacity,
          filter: `blur(${(1 - inP) * 8}px)`,
          textShadow: "0 2px 24px rgba(0,0,0,0.85)",
          whiteSpace: "pre-line",
          ...style,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// Several lines revealed one after another, e.g. "ARSENIC" then "DIAMOND DUST".
export const StackedWords: React.FC<{ words: { text: string; at: number; color?: string }[]; size?: number; top?: string; hold?: number; gap?: number }> = ({
  words,
  size = 88,
  top = "50%",
  hold,
  gap = 1.25,
}) => {
  return (
    <>
      {words.map((w, i) => (
        <HistoricalText
          key={w.text}
          text={w.text}
          at={w.at}
          hold={hold === undefined ? undefined : hold - (w.at - words[0].at)}
          size={size}
          color={w.color}
          top={`calc(${top} + ${(i - (words.length - 1) / 2) * size * gap}px)`}
        />
      ))}
    </>
  );
};
