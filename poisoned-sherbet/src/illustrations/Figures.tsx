// Silhouette figures for dramatised reconstructions. Anonymous by design:
// period dress identifies the role, never a face.

export type FigureKind =
  | "british" // frock coat and top hat
  | "officer" // coat and pith helmet
  | "barrister" // frock coat, bare head
  | "servant" // turban, kurta and dhoti
  | "courtier" // pagdi and long angarkha
  | "sepoy"; // shako-like cap and tunic

export const Figure: React.FC<{
  kind: FigureKind;
  x: number;
  y: number;
  scale?: number;
  facing?: 1 | -1;
  // Walk cycle phase in radians; undefined = standing still.
  walk?: number;
  sitting?: boolean;
  fill?: string;
  rim?: string;
  rimOpacity?: number;
  opacity?: number;
}> = ({ kind, x, y, scale = 1, facing = 1, walk, sitting, fill = "#060504", rim = "#d9a55b", rimOpacity = 0.35, opacity = 1 }) => {
  const swing = walk === undefined ? 0 : Math.sin(walk) * 22;
  const bob = walk === undefined ? 0 : Math.abs(Math.cos(walk)) * 4;
  const indian = kind === "servant" || kind === "courtier";
  const hem = kind === "courtier" ? -40 : kind === "servant" ? -90 : kind === "british" || kind === "barrister" ? -95 : -120;
  const stroke = { stroke: rim, strokeOpacity: rimOpacity, strokeWidth: 2 / scale };
  const legs = sitting ? (
    <g>
      <rect x={-18} y={-150} width={70} height={24} rx={8} fill={fill} {...stroke} />
      <rect x={38} y={-150} width={18} height={150} rx={6} fill={fill} {...stroke} />
      <rect x={-6} y={-150} width={70} height={22} rx={8} fill={fill} />
      <rect x={50} y={-146} width={16} height={146} rx={6} fill={fill} />
    </g>
  ) : (
    <g>
      <rect x={-17} y={-140} width={17} height={140} rx={6} fill={fill} {...stroke} transform={`rotate(${swing} -8 -140)`} />
      <rect x={1} y={-140} width={17} height={140} rx={6} fill={fill} {...stroke} transform={`rotate(${-swing} 9 -140)`} />
    </g>
  );
  const torso =
    kind === "servant" ? (
      <path d={`M-34,-250 Q-40,-180 -48,${hem} L48,${hem} Q40,-180 34,-250 Z`} fill={fill} {...stroke} />
    ) : kind === "courtier" ? (
      <path d={`M-36,-250 Q-44,-170 -62,${hem} L62,${hem} Q44,-170 36,-250 Z`} fill={fill} {...stroke} />
    ) : (
      <path d={`M-36,-250 L-42,-120 L-46,${hem} L-12,${hem + 8} L0,-150 L12,${hem + 8} L46,${hem} L42,-120 L36,-250 Z`} fill={fill} {...stroke} />
    );
  const head = <ellipse cx={0} cy={-280} rx={21} ry={25} fill={fill} {...stroke} />;
  const hat = {
    british: (
      <g>
        <rect x={-19} y={-338} width={38} height={40} rx={3} fill={fill} {...stroke} />
        <ellipse cx={0} cy={-299} rx={31} ry={6} fill={fill} />
      </g>
    ),
    officer: (
      <g>
        <path d="M-26,-296 Q-26,-332 0,-334 Q26,-332 26,-296 Z" fill={fill} {...stroke} />
        <ellipse cx={0} cy={-296} rx={36} ry={8} fill={fill} />
        <rect x={-2} y={-342} width={4} height={10} fill={fill} />
      </g>
    ),
    barrister: null,
    servant: (
      <g>
        <ellipse cx={0} cy={-300} rx={27} ry={17} fill={fill} {...stroke} />
        <path d="M18,-300 q22,6 16,30" stroke={fill} strokeWidth={7} fill="none" />
      </g>
    ),
    courtier: (
      <g>
        <path d="M-28,-290 Q-34,-328 -4,-336 Q30,-340 34,-306 Q40,-296 26,-290 Z" fill={fill} {...stroke} />
        <circle cx={22} cy={-322} r={4} fill={rim} opacity={0.7} />
      </g>
    ),
    sepoy: (
      <g>
        <path d="M-20,-298 L-17,-330 L17,-330 L20,-298 Z" fill={fill} {...stroke} />
        <rect x={-24} y={-302} width={48} height={6} fill={fill} />
      </g>
    ),
  }[kind];
  const arms = sitting ? (
    <g>
      <rect x={-10} y={-246} width={14} height={92} rx={6} fill={fill} transform="rotate(-50 -3 -246)" />
      <rect x={-4} y={-246} width={14} height={92} rx={6} fill={fill} transform="rotate(-40 3 -246)" />
    </g>
  ) : (
    <g>
      <rect x={-44} y={-246} width={14} height={110} rx={6} fill={fill} {...stroke} transform={`rotate(${-swing * 0.8 + 4} -37 -246)`} />
      <rect x={30} y={-246} width={14} height={110} rx={6} fill={fill} {...stroke} transform={`rotate(${swing * 0.8 - 4} 37 -246)`} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y - bob * scale}) scale(${scale * facing} ${scale})`} opacity={opacity}>
      {indian && !sitting ? <path d={`M-40,${hem} L-30,0 L-6,0 L0,${hem + 20} L6,0 L30,0 L40,${hem} Z`} fill={fill} opacity={0.9} /> : null}
      {legs}
      {torso}
      {arms}
      <rect x={-9} y={-262} width={18} height={16} fill={fill} />
      {head}
      {hat}
    </g>
  );
};
