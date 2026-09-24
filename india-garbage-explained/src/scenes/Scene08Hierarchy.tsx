import { useCurrentFrame } from "remotion";
import { SceneShell } from "../components/SceneShell";
import type { SceneId } from "../config/narration";
import { COLOR, EASE, FONT, tween } from "../config/theme";
import { cuesOf } from "../config/timing";

const ID: SceneId = "hierarchy";

const CX = 1100;
const TOP = 262;
const H = 80;
const GAP = 8;

// Inverted pyramid: the widest (most preferred) option is at the top.
const TIERS = [
  { name: "PREVENT", desc: "avoid creating waste", color: "#3FB8A6", cue: "prevent", beat: 0 },
  { name: "REDUCE", desc: "use less", color: "#5BB98F", cue: "reduce", beat: 0 },
  { name: "REUSE", desc: "use again", color: "#8DBB6A", cue: "reduce", beat: 1 },
  { name: "RECYCLE", desc: "make new material", color: "#C9B04E", cue: "recycle", beat: 0 },
  { name: "RECOVER", desc: "energy or value", color: "#E39A3F", cue: "recycle", beat: 1 },
  { name: "DISPOSE", desc: "", color: "#E5646A", cue: "dispose", beat: 0 },
];

const topWidth = (i: number) => 1100 - i * 150;
const bottomWidth = (i: number) => topWidth(i) - 150 * (H / (H + GAP));

export const Scene08Hierarchy: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf(ID);
  const ghosts = tween(frame, [c.at("hierarchy"), c.at("hierarchy") + 20], [0, 1]);
  const preferred = tween(frame, [c.at("preferred"), c.at("preferred") + 18], [0, 1]);

  return (
    <SceneShell sceneId={ID}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="pref" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3FB8A6" />
            <stop offset="1" stopColor="#E5646A" />
          </linearGradient>
        </defs>
        <g opacity={ghosts}>
          <rect x={226} y={296} width={8} height={440} rx={4} fill="url(#pref)" />
          <path d="M216 736 L230 760 L244 736 Z" fill="#E5646A" />
        </g>
        {TIERS.map((t, i) => {
          const y = TOP + i * (H + GAP);
          const wt = topWidth(i);
          const wb = bottomWidth(i);
          const points = `${CX - wt / 2},${y} ${CX + wt / 2},${y} ${CX + wb / 2},${y + H} ${CX - wb / 2},${y + H}`;
          const at = c.beat(t.cue, t.beat, 2);
          const fill = tween(frame, [at, at + 18], [0, 1], EASE.out);
          const dim = i === TIERS.length - 1 ? 1 - preferred * 0.5 : 1;
          const glow = i < 2 ? preferred : 0;
          return (
            <g key={t.name}>
              <polygon points={points} fill="none" stroke={COLOR.line} strokeWidth={2} strokeDasharray="8 8" opacity={ghosts * (1 - fill)} />
              <g opacity={fill * dim} transform={`translate(0 ${(1 - fill) * -14})`}>
                <polygon points={points} fill={t.color} stroke="#FFFFFF" strokeOpacity={0.75 * glow} strokeWidth={5} strokeLinejoin="round" />
                <text
                  x={CX}
                  y={y + H / 2 + 12}
                  textAnchor="middle"
                  fontFamily={FONT.sans}
                  fill="#0A1016"
                >
                  <tspan fontSize={34} fontWeight={800} letterSpacing={2}>
                    {t.name}
                  </tspan>
                  {t.desc ? (
                    <tspan fontSize={24} fontWeight={500} dx={16}>
                      {t.desc}
                    </tspan>
                  ) : null}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      <div style={{ opacity: ghosts }}>
        <SideLabel top={276} text="MOST PREFERRED" color="#3FB8A6" />
        <SideLabel top={742} text="LEAST PREFERRED" color="#E5646A" />
      </div>
      <div
        style={{
          position: "absolute",
          left: CX + topWidth(5) / 2 + 24,
          top: TOP + 5 * (H + GAP) + 22,
          fontSize: 26,
          color: COLOR.muted,
          opacity: tween(frame, [c.at("dispose") + 10, c.at("dispose") + 26], [0, 1]),
        }}
      >
        last resort, for residue
      </div>
    </SceneShell>
  );
};

const SideLabel: React.FC<{ top: number; text: string; color: string }> = ({ top, text, color }) => (
  <div style={{ position: "absolute", left: 256, top, fontFamily: FONT.mono, fontSize: 22, letterSpacing: 3, color }}>{text}</div>
);
