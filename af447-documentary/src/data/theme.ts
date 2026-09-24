import { Easing, interpolate } from "remotion";

// Night-flight palette: deep navy sky and ocean, instrument colours (Airbus
// PFD blue/brown, green, amber, magenta), warm runway light and warning red.
export const COLOR = {
  black: "#020406",
  night: "#050a12",
  navy: "#0a1628",
  ocean: "#04111f",
  oceanLight: "#0d2c45",
  steel: "#8fa6bd",
  text: "#eef3f8",
  textDim: "#a9b8c8",
  textFaint: "#6c7c8e",
  amber: "#f2a93b",
  runway: "#ffd38a",
  red: "#e5484d",
  green: "#3ddc84",
  cyan: "#4cc9f0",
  magenta: "#d65db1",
  sky: "#2f6db5",
  ground: "#7a4b25",
  white: "#ffffff",
};

// Hindi first; Latin glyphs fall back to Inter.
export const FONT = {
  sans: "Noto Sans Devanagari, Inter, sans-serif",
  serif: "Noto Serif Devanagari, Noto Sans Devanagari, serif",
  latin: "Inter, sans-serif",
  mono: "IBM Plex Mono, monospace",
};

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  slow: Easing.bezier(0.33, 0, 0.2, 1),
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// interpolate() with clamping and an ease-in-out default. Degenerate ranges
// (e.g. a zero-length fade) are nudged apart instead of throwing.
export const tween = (frame: number, input: number[], output: number[], easing: (t: number) => number = EASE.inOut) => {
  const safe = input.slice();
  for (let i = 1; i < safe.length; i++) {
    if (safe[i] <= safe[i - 1]) {
      safe[i] = safe[i - 1] + 0.001;
    }
  }
  return interpolate(frame, safe, output, { ...clamp, easing });
};
