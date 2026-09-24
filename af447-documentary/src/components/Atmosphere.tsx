import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";

// Film texture laid over everything: grain, vignette, drifting dust in the
// light and a candle-like flicker. Deterministic (seeded) so renders repeat.

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 16;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.8 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 75% 70% at 50% 48%, transparent 40%, rgba(0,0,0,${0.55 * strength}) 78%, rgba(0,0,0,${0.92 * strength}) 100%)`,
    }}
  />
);

export const Dust: React.FC<{ count?: number; seed?: string; color?: string; opacity?: number; area?: [number, number, number, number] }> = ({
  count = 60,
  seed = "dust",
  color = "#ffe9c7",
  opacity = 0.5,
  area = [0, 0, 1920, 1080],
}) => {
  const frame = useCurrentFrame();
  const [x0, y0, w, h] = area;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {new Array(count).fill(0).map((_, i) => {
          const r = 0.8 + random(`${seed}-r-${i}`) * 2.2;
          const speed = 0.15 + random(`${seed}-s-${i}`) * 0.35;
          const x = x0 + ((random(`${seed}-x-${i}`) * w + Math.sin((frame + i * 37) / 90) * 30 + frame * speed * 0.4) % w);
          const y = y0 + ((random(`${seed}-y-${i}`) * h - frame * speed + h * 10) % h);
          const tw = 0.4 + 0.6 * Math.abs(Math.sin((frame + i * 13) / (30 + i)));
          return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={opacity * tw * (0.3 + random(`${seed}-o-${i}`) * 0.7)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// Multiplies the picture by a warm light that breathes like a flame.
export const Flicker: React.FC<{ x?: number; y?: number; radius?: number; strength?: number }> = ({ x = 30, y = 30, radius = 70, strength = 1 }) => {
  const frame = useCurrentFrame();
  const f = 0.85 + 0.1 * Math.sin(frame / 3.1) + 0.05 * Math.sin(frame / 1.7 + 2) + 0.04 * (random(`fl-${Math.floor(frame / 2)}`) - 0.5);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "soft-light",
        opacity: strength,
        background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,190,110,${0.55 * f}) 0%, rgba(255,160,80,${0.18 * f}) ${radius * 0.5}%, rgba(0,0,0,${0.35 * (1.1 - f)}) ${radius}%)`,
      }}
    />
  );
};

// Soft drifting smoke / haze bands.
export const Haze: React.FC<{ opacity?: number; color?: string; seed?: number }> = ({ opacity = 0.25, color = "rgba(220,200,170,1)", seed = 3 }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none", mixBlendMode: "screen" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <filter id={`haze-${seed}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0022 0.006" numOctaves="3" seed={seed} />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.4 -0.55" />
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <g transform={`translate(${-((frame * 0.6) % width)} 0)`}>
          <rect x="0" y="0" width={width * 2} height="1080" filter={`url(#haze-${seed})`} fill={color} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
