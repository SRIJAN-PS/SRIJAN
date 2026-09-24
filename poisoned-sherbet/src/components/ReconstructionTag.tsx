import { useCurrentFrame } from "remotion";
import { COLOR, FONT, tween } from "../data/theme";
import { SAFE } from "../data/video";

export type TagKind = "reconstruction" | "illustration" | "silhouette" | "ai";

const TEXT: Record<TagKind, string> = {
  reconstruction: "DRAMATIZED RECONSTRUCTION",
  illustration: "ILLUSTRATIVE · NOT A HISTORICAL IMAGE",
  silhouette: "SILHOUETTE · NOT A LIKENESS",
  ai: "AI-GENERATED RECONSTRUCTION",
};

// Lower-third tag for anything that is not a historical record: dramatized
// moments, illustrations and silhouettes standing in for real people.
export const ReconstructionTag: React.FC<{ kind?: TagKind; from: number; to: number }> = ({ kind = "reconstruction", from, to }) => {
  const frame = useCurrentFrame();
  const o = Math.min(tween(frame, [from + 8, from + 24], [0, 1]), tween(frame, [to - 16, to], [1, 0]));
  if (o <= 0) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        right: SAFE.x,
        bottom: SAFE.subtitleBottom + 118,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: FONT.mono,
        fontSize: 17,
        letterSpacing: "0.2em",
        color: COLOR.textDim,
        opacity: o * 0.9,
        textShadow: "0 1px 10px rgba(0,0,0,0.95)",
      }}
    >
      <div style={{ width: 18, height: 1, backgroundColor: COLOR.textDim }} />
      {TEXT[kind]}
    </div>
  );
};
