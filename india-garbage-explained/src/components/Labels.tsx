import { useCurrentFrame } from "remotion";
import type { CueKind, SceneId } from "../config/narration";
import { sourceLabel, type SourceId } from "../config/sources";
import { activeCue, sceneById, type CueTiming } from "../config/timing";
import { SAFE } from "../config/video";
import { COLOR, FONT, tween } from "../config/theme";

const KIND_LABEL: Record<CueKind, string> = {
  fact: "FACT · SOURCED",
  explanation: "EXPLANATION",
  solution: "POSSIBLE SOLUTION",
};

const KIND_COLOR: Record<CueKind, string> = {
  fact: COLOR.fact,
  explanation: COLOR.explanation,
  solution: COLOR.solution,
};

// First frame of the run of consecutive cues that share `same(cue)`, so a
// label fades in once per run instead of once per line.
const runStart = (cues: CueTiming[], active: CueTiming, same: (c: CueTiming) => string) => {
  let start = active.from;
  for (let i = active.index - 1; i >= 0; i--) {
    if (same(cues[i]) !== same(active)) {
      break;
    }
    start = cues[i].from;
  }
  return start;
};

// Top-right badge telling the viewer whether the current line is a sourced
// fact, a general explanation, or a possible solution.
export const ClaimBadge: React.FC<{ sceneId: SceneId; hidden?: boolean }> = ({ sceneId, hidden }) => {
  const frame = useCurrentFrame();
  const scene = sceneById(sceneId);
  const cue = activeCue(sceneId, frame);
  if (!cue || hidden) {
    return null;
  }
  const since = frame - runStart(scene.cues, cue, (c) => c.kind);
  const color = KIND_COLOR[cue.kind];
  return (
    <div
      style={{
        position: "absolute",
        right: SAFE.x,
        top: SAFE.top + 6,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 20px",
        borderRadius: 40,
        border: `2px solid ${color}`,
        backgroundColor: "rgba(5, 8, 12, 0.6)",
        fontFamily: FONT.mono,
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: 2,
        color,
        opacity: tween(since, [0, 12], [0, 1]),
      }}
    >
      <span style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
      {KIND_LABEL[cue.kind]}
    </div>
  );
};

export const SourceLabel: React.FC<{
  sourceIds: SourceId[];
  opacity?: number;
  left?: number;
  top?: number;
  maxWidth?: number;
}> = ({ sourceIds, opacity = 1, left = SAFE.x, top = SAFE.sourceTop, maxWidth = 1680 }) => {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        maxWidth,
        display: "flex",
        alignItems: "baseline",
        gap: 14,
        fontFamily: FONT.mono,
        fontSize: 22,
        lineHeight: 1.35,
        color: COLOR.muted,
        opacity,
      }}
    >
      <span style={{ color: COLOR.accent, fontWeight: 500, letterSpacing: 2, flexShrink: 0 }}>SOURCE</span>
      <span>{sourceIds.map(sourceLabel).join("  ·  ")}</span>
    </div>
  );
};

// Shows the sources of the line being spoken, beneath the claim.
export const ActiveSourceLabel: React.FC<{ sceneId: SceneId }> = ({ sceneId }) => {
  const frame = useCurrentFrame();
  const scene = sceneById(sceneId);
  const cue = activeCue(sceneId, frame);
  if (!cue || !cue.sources || cue.sources.length === 0) {
    return null;
  }
  const key = (c: CueTiming) => (c.sources ?? []).join(",");
  const since = frame - runStart(scene.cues, cue, key);
  return <SourceLabel sourceIds={cue.sources} opacity={tween(since, [0, 12], [0, 1])} />;
};
