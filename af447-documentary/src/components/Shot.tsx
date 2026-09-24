import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tween } from "../data/theme";
import { ReconstructionTag, type TagKind } from "./ReconstructionTag";

// One shot inside a scene: visible from `from` to `to` (scene frames),
// cross-dissolving over `fade` frames, optionally carrying a lower-third tag.
export const Shot: React.FC<{ from: number; to: number; fade?: number; fadeIn?: number; fadeOut?: number; tag?: TagKind; children: React.ReactNode }> = ({
  from,
  to,
  fade = 24,
  fadeIn,
  fadeOut,
  tag,
  children,
}) => {
  const frame = useCurrentFrame();
  const fi = fadeIn ?? fade;
  const fo = fadeOut ?? fade;
  if (frame < from - 1 || frame > to + fo) {
    return null;
  }
  const o = Math.min(fi ? tween(frame, [from, from + fi], [0, 1]) : 1, fo ? tween(frame, [to, to + fo], [1, 0]) : frame <= to ? 1 : 0);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {children}
      {tag ? <ReconstructionTag kind={tag} from={from} to={to + fo} /> : null}
    </AbsoluteFill>
  );
};
