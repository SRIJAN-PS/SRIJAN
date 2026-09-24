import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile } from "remotion";
import { ASSETS } from "../config/assets";
import type { SceneTiming } from "../config/timing";
import { VIDEO } from "../config/video";

// Background music (ducked under narration) and per-scene voice-over files.
// Both are placeholders until files are set in config/assets.ts.
export const AudioTracks: React.FC<{ scenes: SceneTiming[]; relative?: boolean; totalFrames: number }> = ({
  scenes,
  relative,
  totalFrames,
}) => {
  const music = ASSETS.music;
  const lines = scenes.flatMap((s) =>
    s.cues.map((c) => {
      const start = relative ? c.from : c.globalFrom;
      return [start, start + c.duration] as const;
    }),
  );
  const fade = music.fadeSeconds * VIDEO.fps;

  return (
    <>
      {music.src ? (
        <Audio
          src={staticFile(music.src)}
          loop
          volume={(f) => {
            const speaking = lines.some(([a, b]) => f >= a - 6 && f <= b + 6);
            const base = speaking ? music.duckedVolume : music.volume;
            const edges = interpolate(f, [0, fade, totalFrames - fade, totalFrames], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return base * edges;
          }}
        />
      ) : null}
      {scenes.map((s) => {
        const src = ASSETS.voiceover[s.id];
        if (!src) {
          return null;
        }
        return (
          <Sequence
            key={s.id}
            name={`Voice-over · ${s.id}`}
            from={relative ? 0 : s.from}
            durationInFrames={s.durationInFrames}
            layout="none"
          >
            <Audio src={staticFile(src)} />
          </Sequence>
        );
      })}
    </>
  );
};
