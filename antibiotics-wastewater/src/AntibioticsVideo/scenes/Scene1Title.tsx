import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { Antibiotic } from "../components/Antibiotic";
import { Backdrop } from "../components/Backdrop";
import { COLORS, fontFamily } from "../theme";

const FLOATERS = Array.from({ length: 16 }, (_, i) => ({
  x: random(`s1-x-${i}`) * 1920,
  y: random(`s1-y-${i}`) * 1080,
  size: 40 + random(`s1-s-${i}`) * 50,
  rot: random(`s1-r-${i}`) * 360,
  speed: 0.3 + random(`s1-v-${i}`) * 0.6,
}));

export const Scene1Title: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Scene 1 - Title" style={{ fontFamily }}>
      <Backdrop />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", top: 0, left: 0 }}>
        {FLOATERS.map((f, i) => (
          <Antibiotic
            key={i}
            x={f.x}
            y={f.y - frame * f.speed}
            size={f.size}
            rotate={f.rot + frame * f.speed * 0.6}
            opacity={0.16}
          />
        ))}
      </svg>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Kicker"
          style={{
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: 8,
            color: COLORS.water,
            textTransform: "uppercase",
            opacity: interpolate(frame, [5, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          An environmental science explainer
        </Interactive.Div>
        <Interactive.Div
          name="Title"
          style={{
            marginTop: 24,
            fontSize: 150,
            fontWeight: 700,
            lineHeight: 1.05,
            color: COLORS.text,
            opacity: interpolate(frame, [15, 45], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: interpolate(frame, [15, 45], ["0px 60px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          Antibiotics in
          <br />
          <span style={{ color: COLORS.water }}>Wastewater</span>
        </Interactive.Div>
        <Interactive.Div
          name="Accent line"
          style={{
            marginTop: 36,
            height: 8,
            borderRadius: 4,
            backgroundColor: COLORS.antibiotic,
            width: interpolate(frame, [40, 75], [0, 360], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        />
        <Interactive.Div
          name="Subtitle"
          style={{
            marginTop: 40,
            fontSize: 48,
            fontWeight: 400,
            color: COLORS.muted,
            opacity: interpolate(frame, [60, 90], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          Where they come from, why they matter, and how to remove them
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
