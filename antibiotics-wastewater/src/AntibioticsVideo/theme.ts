import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

export const fontFamily = "Poppins";

for (const weight of ["400", "500", "600", "700"]) {
  loadFont({
    family: fontFamily,
    url: staticFile(`fonts/Poppins-${weight}.woff2`),
    weight,
  });
}

export const COLORS = {
  text: "#F2F6FA",
  muted: "#9DB4C7",
  water: "#3FA7D6",
  antibiotic: "#FF5A5F",
  susceptible: "#6FD08C",
  resistant: "#F4A259",
  dead: "#5E6B75",
  biochar: "#2A2A2E",
  gcn: "#F2C94C",
  light: "#FFE27A",
  radical: "#C77DFF",
  gel: "#5ED3E8",
  good: "#6FD08C",
};

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

// Clamped interpolation used by the SVG illustrations, where values are
// computed per particle rather than written inline.
export const tween = (
  frame: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = EASE_OUT,
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
