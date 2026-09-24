import { AbsoluteFill, useCurrentFrame } from "remotion";
import { sourceLabel, type SourceId } from "../data/sources";
import { CLAIM_LABEL, type ClaimKind } from "../data/story";
import { COLOR, FONT, tween } from "../data/theme";
import type { CueTiming } from "../data/timing";
import { SAFE } from "../data/video";

const KIND_COLOR: Record<ClaimKind, string> = {
  record: COLOR.verdigris,
  account: COLOR.candle,
  allegation: COLOR.poisonGlow,
  context: COLOR.british,
  interpretation: COLOR.textDim,
};

// Small source line: "SOURCE  Trial and Deposition … 1875".
export const SourceLabel: React.FC<{ sources: readonly SourceId[]; opacity?: number }> = ({ sources, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: SAFE.x,
      bottom: SAFE.subtitleBottom + 118,
      maxWidth: 1100,
      fontFamily: FONT.mono,
      fontSize: 19,
      letterSpacing: "0.04em",
      color: COLOR.textDim,
      opacity,
      textShadow: "0 1px 10px rgba(0,0,0,0.95)",
    }}
  >
    <span style={{ color: COLOR.brass, letterSpacing: "0.18em", marginRight: 14 }}>SOURCE</span>
    {sourceLabel(sources)}
  </div>
);

// Badge naming what kind of claim the narration is making right now.
export const ClaimBadge: React.FC<{ kind: ClaimKind; opacity?: number }> = ({ kind, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      right: SAFE.x,
      top: SAFE.top,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "9px 18px",
      borderRadius: 3,
      border: `1px solid ${KIND_COLOR[kind]}`,
      backgroundColor: "rgba(6,5,4,0.55)",
      fontFamily: FONT.mono,
      fontSize: 18,
      letterSpacing: "0.16em",
      color: KIND_COLOR[kind],
      opacity,
    }}
  >
    <div style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: KIND_COLOR[kind] }} />
    {CLAIM_LABEL[kind]}
  </div>
);

// Badge + source for whichever line is active, cross-fading between lines.
export const ActiveClaim: React.FC<{ cue: CueTiming | null; hide?: boolean }> = ({ cue, hide }) => {
  const frame = useCurrentFrame();
  if (!cue || hide) {
    return null;
  }
  const fade = tween(frame, [cue.from, cue.from + 12], [0, 1]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <ClaimBadge kind={cue.kind} opacity={fade * 0.95} />
      {cue.sources?.length ? <SourceLabel sources={cue.sources} opacity={fade * 0.9} /> : null}
    </AbsoluteFill>
  );
};
