// Airbus A330-200 drawn in side profile (nose to the right) and from above.
// At night it is a dark shape with rim light, lit cabin windows, a flashing
// red beacon, white strobes and the right-wing green navigation light.

export const A330Side: React.FC<{
  x: number;
  y: number;
  scale?: number;
  frame: number;
  night?: boolean;
  pitch?: number;
  gear?: boolean;
  engineGlow?: number;
  opacity?: number;
}> = ({ x, y, scale = 1, frame, night = true, pitch = 0, gear = false, engineGlow = 0, opacity = 1 }) => {
  const body = night ? "#1a2230" : "#e9eef3";
  const rim = night ? "#8fb3d9" : "#9fb0c0";
  const strobe = frame % 36 < 2 || (frame % 36 > 5 && frame % 36 < 7);
  const beacon = frame % 30 < 10;
  return (
    <g transform={`translate(${x} ${y}) rotate(${-pitch}) scale(${scale})`} opacity={opacity}>
      {/* far-side horizontal stabiliser and wing (darker) */}
      <path d="M118,-6 L44,-20 L36,-15 L112,2 Z" fill={night ? "#0e141d" : "#c9d2da"} />
      <path d="M392,6 L250,-12 L236,-8 L380,18 Z" fill={night ? "#0e141d" : "#c9d2da"} />
      {/* vertical stabiliser */}
      <path d="M160,-28 L78,-150 L40,-150 L26,-30 Z" fill={night ? "#15233a" : "#1d3a6b"} stroke={rim} strokeOpacity={0.35} strokeWidth={1.2} />
      <path d="M150,-44 L96,-128 L84,-128 L118,-60 Z" fill="#c8102e" opacity={night ? 0.35 : 0.8} />
      <path d="M134,-44 L80,-128 L70,-128 L104,-60 Z" fill="#ffffff" opacity={night ? 0.15 : 0.6} />
      {/* fuselage */}
      <path
        d="M16,-28 C60,-31 120,-31 180,-31 L520,-31 C560,-31 588,-22 602,-4 C606,2 602,8 594,12 C580,24 556,31 520,31 L180,31 C130,31 60,20 18,2 C10,-4 10,-22 16,-28 Z"
        fill={body}
        stroke={rim}
        strokeOpacity={0.45}
        strokeWidth={1.4}
      />
      {/* cockpit windows */}
      <path d="M560,-17 L584,-13 L592,-6 L566,-8 Z" fill={night ? "#3a5a7a" : "#1a2b3c"} opacity={0.9} />
      {/* cabin windows */}
      {new Array(44).fill(0).map((_, i) => (
        <rect key={i} x={140 + i * 9} y={-12} width={4} height={6} rx={2} fill={night ? "#ffd38a" : "#2a3a4a"} opacity={night ? 0.55 + ((i * 37) % 10) / 25 : 0.8} />
      ))}
      {/* doors */}
      {[152, 300, 470, 534].map((dx) => (
        <rect key={dx} x={dx} y={-22} width={10} height={36} rx={2} fill="none" stroke={night ? "#2c3a4d" : "#b9c4ce"} strokeWidth={1.2} />
      ))}
      {/* near wing, pylon, engine */}
      <path d="M392,14 L246,6 L232,12 L384,28 Z" fill={night ? "#1f2a3a" : "#d6dee6"} stroke={rim} strokeOpacity={0.35} strokeWidth={1} />
      <path d="M356,24 L396,24 L404,38 L362,38 Z" fill={night ? "#18212e" : "#cfd8e0"} />
      <ellipse cx={380} cy={50} rx={58} ry={19} fill={night ? "#202b3b" : "#dfe6ec"} stroke={rim} strokeOpacity={0.4} strokeWidth={1.2} />
      <ellipse cx={436} cy={50} rx={5} ry={16} fill="#0a0e14" />
      {engineGlow > 0 ? <ellipse cx={318} cy={50} rx={26} ry={12} fill="#ffb867" opacity={engineGlow * 0.55} /> : null}
      {/* horizontal stabiliser (near) */}
      <path d="M124,0 L44,-6 L38,0 L118,8 Z" fill={night ? "#1f2a3a" : "#d6dee6"} />
      {gear ? (
        <g fill="#0a0e14">
          <rect x={540} y={30} width={5} height={30} />
          <circle cx={542} cy={64} r={8} />
          <rect x={330} y={30} width={7} height={34} />
          <circle cx={326} cy={68} r={10} />
          <circle cx={346} cy={68} r={10} />
        </g>
      ) : null}
      {/* lights */}
      {beacon ? <circle cx={300} cy={-33} r={4} fill="#ff3b30" /> : <circle cx={300} cy={-33} r={2.5} fill="#5a1a18" />}
      {beacon ? <circle cx={300} cy={-33} r={16} fill="#ff3b30" opacity={0.25} /> : null}
      <circle cx={240} cy={8} r={3.5} fill="#34f28a" />
      <circle cx={240} cy={8} r={12} fill="#34f28a" opacity={0.2} />
      <circle cx={16} cy={-12} r={3} fill="#ffffff" opacity={0.8} />
      {strobe ? (
        <g>
          <circle cx={236} cy={8} r={30} fill="#ffffff" opacity={0.5} />
          <circle cx={14} cy={-12} r={24} fill="#ffffff" opacity={0.45} />
        </g>
      ) : null}
    </g>
  );
};

// Top view, for maps: a small A330 silhouette pointing up (rotate to heading).
export const A330Top: React.FC<{ x: number; y: number; heading: number; size?: number; color?: string }> = ({ x, y, heading, size = 1, color = "#ffffff" }) => (
  <g transform={`translate(${x} ${y}) rotate(${heading}) scale(${size})`}>
    <path
      d="M0,-30 C3,-30 4,-24 4,-18 L4,-6 L30,8 L30,12 L4,6 L3,20 L11,26 L11,29 L0,27 L-11,29 L-11,26 L-3,20 L-4,6 L-30,12 L-30,8 L-4,-6 L-4,-18 C-4,-24 -3,-30 0,-30 Z"
      fill={color}
      stroke="#000"
      strokeOpacity={0.4}
    />
  </g>
);
