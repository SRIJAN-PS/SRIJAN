import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

export const FONT = {
  sans: "Inter",
  mono: "IBM Plex Mono",
};

for (const weight of ["400", "500", "600", "700", "800"]) {
  loadFont({ family: FONT.sans, url: staticFile(`fonts/Inter-${weight}.woff2`), weight });
}
for (const weight of ["400", "500"]) {
  loadFont({ family: FONT.mono, url: staticFile(`fonts/IBMPlexMono-${weight}.woff2`), weight });
}

export const COLOR = {
  bgDeep: "#05080C",
  bg: "#0A1016",
  bgLift: "#15202B",
  panel: "#111A23",
  line: "#243241",
  text: "#F2F4F7",
  muted: "#98A5B3",
  faint: "#5D6B7A",
  accent: "#E9A23B",
  // Waste streams
  wet: "#6CC08B",
  dry: "#5AA6E8",
  sanitary: "#B58CF0",
  hazardous: "#E5646A",
  ewaste: "#E5646A",
  // Concepts
  recovery: "#3FB8A6",
  contamination: "#A97C50",
  leachate: "#8A6A3E",
  gas: "#C9D3DC",
  // Claim types
  fact: "#3FB8A6",
  explanation: "#8AA4BF",
  solution: "#E9A23B",
};

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.33, 1, 0.68, 1),
};

// Clamped interpolation for computed values inside illustrations.
export const tween = (
  frame: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = EASE.out,
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

// 0 → 1 reveal starting at `start` and lasting `duration` frames.
export const reveal = (frame: number, start: number, duration = 18) =>
  tween(frame, [start, start + duration], [0, 1]);
