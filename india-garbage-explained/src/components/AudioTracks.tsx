import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile } from "remotion";
import { ASSETS, type MusicSlot } from "../config/assets";
import { AUDIO_MANIFEST } from "../config/audio-manifest";
import { sceneById, type SceneTiming } from "../config/timing";
import { VIDEO } from "../config/video";

// Voice-over and music slots. Every slot is a named <Sequence>, so it shows
// on the Remotion Studio timeline even while empty ("[empty]"). Files are
// picked up from public/audio by `npm run sync:audio`.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const toFrames = (seconds: number) => Math.ceil(seconds * VIDEO.fps);

// 0 = silence, 1 = narration playing; ramps smoothly around each line.
const speakingAt = (f: number, lines: (readonly [number, number])[], ramp: number) => {
  let amount = 0;
  for (const [a, b] of lines) {
    if (f < a - ramp || f > b + ramp) {
      continue;
    }
    amount = Math.max(amount, interpolate(f, [a - ramp, a, b, b + ramp], [0, 1, 1, 0], clamp));
  }
  return amount;
};

export const AudioTracks: React.FC<{ scenes: SceneTiming[]; relative?: boolean; totalFrames: number }> = ({
  scenes,
  relative,
  totalFrames,
}) => {
  // Offset that turns global frames into this composition's frames.
  const offset = relative ? scenes[0].from : 0;
  const lines = scenes.flatMap((s) => s.cues.map((c) => [c.globalFrom - offset, c.globalFrom - offset + c.duration] as const));

  return (
    <>
      {/* Voice-over: one slot per scene (whole-scene recording) */}
      {scenes.map((s) => {
        const file = AUDIO_MANIFEST.scenes[s.id];
        return (
          <Sequence
            key={`scene-${s.id}`}
            name={`VO scene ${s.number} · ${s.id}${file ? "" : " [empty]"}`}
            from={s.from - offset}
            durationInFrames={file ? Math.max(1, toFrames(file.seconds)) : s.durationInFrames}
            layout="none"
          >
            {file ? <Audio src={staticFile(file.src)} /> : null}
          </Sequence>
        );
      })}

      {/* Voice-over: one slot per narration line */}
      {scenes.flatMap((s) =>
        s.cues.map((c, i) => {
          const file = AUDIO_MANIFEST.lines[`${s.id}/${c.id}`];
          return (
            <Sequence
              key={`line-${s.id}-${c.id}`}
              name={`VO ${s.number}.${i + 1} · ${c.id}${file ? "" : " [empty]"}`}
              from={c.globalFrom - offset}
              durationInFrames={file ? Math.max(1, toFrames(file.seconds)) : c.duration}
              layout="none"
            >
              {file ? <Audio src={staticFile(file.src)} /> : null}
            </Sequence>
          );
        }),
      )}

      {/* Music slots */}
      {ASSETS.music.slots.map((slot) => (
        <MusicTrack key={slot.id} slot={slot} offset={offset} lines={lines} totalFrames={totalFrames} />
      ))}
    </>
  );
};

const MusicTrack: React.FC<{
  slot: MusicSlot;
  offset: number;
  lines: (readonly [number, number])[];
  totalFrames: number;
}> = ({ slot, offset, lines, totalFrames }) => {
  const start = sceneById(slot.from).from - offset;
  const endScene = sceneById(slot.to);
  const end = endScene.from + endScene.durationInFrames - offset;
  // Skip slots that fall entirely outside this composition (standalone scenes).
  if (end <= 0 || start >= totalFrames) {
    return null;
  }
  const file = AUDIO_MANIFEST.music[slot.id];
  const duration = end - start;
  const fade = Math.min(duration / 2, ASSETS.music.fadeSeconds * VIDEO.fps);
  const { duck, duckRampFrames } = ASSETS.music;
  return (
    <Sequence name={`Music · ${slot.id}${file ? "" : " [empty]"}`} from={start} durationInFrames={duration} layout="none">
      {file ? (
        <Audio
          src={staticFile(file.src)}
          loop={slot.loop}
          volume={(f) => {
            const edges = interpolate(f, [0, fade, duration - fade, duration], [0, 1, 1, 0], clamp);
            const speaking = speakingAt(f + start, lines, duckRampFrames);
            return slot.volume * edges * (1 - speaking * (1 - duck));
          }}
        />
      ) : null}
    </Sequence>
  );
};
