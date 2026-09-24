import { Easing, interpolate } from "remotion";

// Muted 19th-century palette: lamp-black, umber, candle ochre, parchment,
// faded indigo. Red is reserved for poison and for the prosecution's chain.
export const COLOR = {
  black: "#060504",
  night: "#0b0a09",
  umber: "#1d1510",
  umberLight: "#34261b",
  ink: "#141a22",
  indigo: "#28334a",
  indigoLight: "#4a5a78",
  candle: "#e0a75a",
  candleSoft: "#f3cf8e",
  brass: "#b8894a",
  parchment: "#e9dcc0",
  parchmentDark: "#c9b690",
  paperInk: "#2a2118",
  text: "#efe6d4",
  textDim: "#b7ab96",
  textFaint: "#7d7466",
  poison: "#a3372b",
  poisonGlow: "#d0503c",
  verdigris: "#6f8f82",
  british: "#8fa3c4",
  indian: "#d4a55f",
};

export const FONT = {
  serif: "Cormorant, Georgia, serif",
  sans: "Inter, Helvetica, Arial, sans-serif",
  mono: "IBM Plex Mono, Menlo, monospace",
};

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  slow: Easing.bezier(0.33, 0, 0.2, 1),
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// interpolate() with clamping and an ease-in-out default.
// Degenerate ranges (e.g. a zero-length fade) are nudged apart instead of throwing.
export const tween = (frame: number, input: number[], output: number[], easing: (t: number) => number = EASE.inOut) => {
  const safe = input.slice();
  for (let i = 1; i < safe.length; i++) {
    if (safe[i] <= safe[i - 1]) {
      safe[i] = safe[i - 1] + 0.001;
    }
  }
  return interpolate(frame, safe, output, { ...clamp, easing });
};

// 0→1 fade over `len` frames starting at `start`.
export const fadeIn = (frame: number, start: number, len = 20) => tween(frame, [start, start + len], [0, 1], EASE.out);

// 1 inside [start, end], fading in and out over `len` frames.
export const window = (frame: number, start: number, end: number, len = 18) =>
  Math.min(tween(frame, [start, start + len], [0, 1], EASE.out), tween(frame, [end - len, end], [1, 0], EASE.inOut));
