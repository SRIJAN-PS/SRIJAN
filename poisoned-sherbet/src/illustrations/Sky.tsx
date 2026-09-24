import { AbsoluteFill } from "remotion";

export type SkyMood = "night" | "predawn" | "dawn" | "day" | "dusk" | "lamplight";

const GRADIENTS: Record<SkyMood, string[]> = {
  night: ["#05070c", "#0b1120", "#141b2c"],
  predawn: ["#070a12", "#1a2033", "#4a3a3a"],
  dawn: ["#141a2b", "#5a4a55", "#d08a55", "#f2c07a"],
  day: ["#3b4a5c", "#8d8f8a", "#d7c29a"],
  dusk: ["#0c0d16", "#3a2433", "#9b4a32", "#d9894a"],
  lamplight: ["#070504", "#140d08", "#24160c"],
};

// Full-frame sky gradient with an optional sun or glow low on the horizon.
export const Sky: React.FC<{ mood: SkyMood; sun?: { x: number; y: number; r: number; opacity?: number } }> = ({ mood, sun }) => {
  const stops = GRADIENTS[mood];
  return (
    <AbsoluteFill>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id={`sky-${mood}`} x1="0" y1="0" x2="0" y2="1">
            {stops.map((c, i) => (
              <stop key={c} offset={`${(i / (stops.length - 1)) * 100}%`} stopColor={c} />
            ))}
          </linearGradient>
          <radialGradient id={`sun-${mood}`}>
            <stop offset="0%" stopColor="#fff1c9" />
            <stop offset="18%" stopColor="#ffd08a" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#e8894a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#e8894a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill={`url(#sky-${mood})`} />
        {sun ? <circle cx={sun.x} cy={sun.y} r={sun.r} fill={`url(#sun-${mood})`} opacity={sun.opacity ?? 1} /> : null}
      </svg>
    </AbsoluteFill>
  );
};
