import { random } from "remotion";

// Procedural silhouette of an old Indian city: flat-roofed houses, havelis
// with chhatris, temple spires (shikharas), domes and trees. Seeded, so the
// same seed always draws the same skyline.

const shikhara = (x: number, y: number, w: number, h: number) =>
  `M${x},${y} C${x},${y - h * 0.55} ${x + w * 0.28},${y - h} ${x + w / 2},${y - h} C${x + w * 0.72},${y - h} ${x + w},${y - h * 0.55} ${x + w},${y} Z`;
const dome = (x: number, y: number, w: number, h: number) =>
  `M${x},${y} C${x},${y - h * 0.9} ${x + w * 0.2},${y - h} ${x + w / 2},${y - h * 1.05} C${x + w * 0.8},${y - h} ${x + w},${y - h * 0.9} ${x + w},${y} Z`;

export const Skyline: React.FC<{ seed: string; baseY: number; height?: number; color: string; rim?: string; windows?: string; density?: number; x0?: number; x1?: number }> = ({
  seed,
  baseY,
  height = 1,
  color,
  rim,
  windows,
  density = 1,
  x0 = -40,
  x1 = 1960,
}) => {
  const parts: React.ReactNode[] = [];
  let x = x0;
  let i = 0;
  while (x < x1) {
    const r = random(`${seed}-${i}`);
    const w = (60 + random(`${seed}-w-${i}`) * 120) / density;
    const h = (60 + random(`${seed}-h-${i}`) * 110) * height;
    const top = baseY - h;
    const key = `${seed}-${i}`;
    parts.push(<rect key={`${key}-b`} x={x} y={top} width={w + 1} height={1080 - top} fill={color} />);
    // parapet crenellation
    if (r < 0.5) {
      for (let k = 0; k < w / 16; k++) {
        parts.push(<rect key={`${key}-p${k}`} x={x + k * 16} y={top - 8} width={9} height={8} fill={color} />);
      }
    }
    if (r > 0.82) {
      parts.push(<path key={`${key}-s`} d={shikhara(x + w * 0.15, top, w * 0.7, h * 0.9)} fill={color} />);
      parts.push(<rect key={`${key}-f`} x={x + w / 2 - 1.5} y={top - h * 0.9 - 26} width={3} height={26} fill={color} />);
      parts.push(<path key={`${key}-flag`} d={`M${x + w / 2 + 1.5},${top - h * 0.9 - 26} l18,5 l-18,6 Z`} fill={color} />);
    } else if (r > 0.68) {
      parts.push(<path key={`${key}-d`} d={dome(x + w * 0.2, top, w * 0.6, w * 0.45)} fill={color} />);
      parts.push(<rect key={`${key}-df`} x={x + w / 2 - 1.5} y={top - w * 0.47 - 18} width={3} height={18} fill={color} />);
    } else if (r > 0.56) {
      // chhatri: small dome on pillars
      const cw = w * 0.4;
      const cx = x + w * 0.3;
      parts.push(<path key={`${key}-c`} d={dome(cx, top - 26, cw, cw * 0.5)} fill={color} />);
      parts.push(<rect key={`${key}-c1`} x={cx + 2} y={top - 27} width={5} height={27} fill={color} />);
      parts.push(<rect key={`${key}-c2`} x={cx + cw - 7} y={top - 27} width={5} height={27} fill={color} />);
    } else if (r < 0.07) {
      // tree
      const tx = x + w / 2;
      for (let k = 0; k < 4; k++) {
        parts.push(
          <circle
            key={`${key}-t${k}`}
            cx={tx + (random(`${key}-tx${k}`) - 0.5) * w * 0.9}
            cy={top - 16 - random(`${key}-ty${k}`) * 30}
            r={14 + random(`${key}-tr${k}`) * 16}
            fill={color}
          />,
        );
      }
    }
    if (windows) {
      for (let k = 0; k < 3; k++) {
        if (random(`${key}-win${k}`) > 0.72) {
          parts.push(
            <rect
              key={`${key}-win${k}`}
              x={x + 12 + random(`${key}-wx${k}`) * (w - 30)}
              y={top + 24 + random(`${key}-wy${k}`) * Math.max(10, h - 60)}
              width={7}
              height={11}
              rx={3}
              fill={windows}
              opacity={0.55 + random(`${key}-wo${k}`) * 0.45}
            />,
          );
        }
      }
    }
    x += w * (0.75 + random(`${seed}-g-${i}`) * 0.3);
    i++;
  }
  return (
    <g>
      {rim ? <g style={{ filter: `drop-shadow(0 -1px 0 ${rim})` }}>{parts}</g> : parts}
    </g>
  );
};
