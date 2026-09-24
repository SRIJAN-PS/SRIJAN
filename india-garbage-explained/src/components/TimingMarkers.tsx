import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, FONT } from "../config/theme";
import { timecode, type SceneTiming } from "../config/timing";

// Debug overlay for aligning a recorded voice-over: shows the current scene,
// cue id and timecode, plus a strip with every cue as a tick.
// Enabled with VIDEO.showTimingMarkers.
export const TimingMarkers: React.FC<{ scenes: SceneTiming[]; totalFrames: number; relative?: boolean }> = ({
  scenes,
  totalFrames,
  relative,
}) => {
  const frame = useCurrentFrame();
  const cues = scenes.flatMap((s) =>
    s.cues.map((c) => ({ scene: s, cue: c, start: relative ? c.from : c.globalFrom })),
  );
  const current = [...cues].reverse().find((c) => c.start <= frame);
  const width = 1920 - 80;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 24,
          padding: "6px 12px",
          backgroundColor: "rgba(0,0,0,0.75)",
          fontFamily: FONT.mono,
          fontSize: 20,
          color: "#9EF0A8",
        }}
      >
        {timecode(frame)} · {current ? `S${current.scene.number} ${current.cue.id} (${frame - current.start}f)` : "—"}
      </div>
      <div style={{ position: "absolute", left: 40, bottom: 14, width, height: 10, backgroundColor: "rgba(255,255,255,0.08)" }}>
        {cues.map((c) => (
          <div
            key={`${c.scene.id}-${c.cue.id}`}
            style={{
              position: "absolute",
              left: (c.start / totalFrames) * width,
              width: Math.max(2, (c.cue.duration / totalFrames) * width),
              top: 0,
              bottom: 0,
              backgroundColor: c.cue.kind === "fact" ? COLOR.fact : c.cue.kind === "solution" ? COLOR.solution : "#6E7F92",
            }}
          />
        ))}
        <div style={{ position: "absolute", left: (frame / totalFrames) * width, top: -6, width: 2, height: 22, backgroundColor: "#fff" }} />
      </div>
    </AbsoluteFill>
  );
};
