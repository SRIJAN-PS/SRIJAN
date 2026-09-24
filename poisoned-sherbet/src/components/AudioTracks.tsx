import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile } from "remotion";
import { MUSIC, SFX, type MusicSlot } from "../data/assets";
import { AUDIO_MANIFEST } from "../data/audio-manifest";
import { markFrame, type SceneTiming } from "../data/timing";
import { VIDEO } from "../data/video";

// Voice-over lines, music slots (ducked under narration) and sound effects.
// Every slot is a named <Sequence>, so it shows on the Studio timeline,
// marked "[empty]" until a file is registered by `npm run sync:audio`.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const toFrames = (s: number) => Math.ceil(s * VIDEO.fps);

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

export const AudioTracks: React.FC<{ scenes: SceneTiming[]; offset?: number; totalFrames: number }> = ({ scenes, offset = 0, totalFrames }) => {
  const lines = scenes.flatMap((s) => s.cues.map((c) => [c.globalFrom - offset, c.globalFrom - offset + c.duration] as const));
  return (
    <>
      {scenes.flatMap((s) =>
        s.cues.map((c, i) => {
          const file = AUDIO_MANIFEST.lines[`${s.id}/${c.id}`];
          return (
            <Sequence
              key={`vo-${s.id}-${c.id}`}
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
      {MUSIC.slots.map((slot) => (
        <MusicTrack key={slot.id} slot={slot} offset={offset} lines={lines} totalFrames={totalFrames} />
      ))}
      {SFX.map((cue, i) => {
        const file = AUDIO_MANIFEST.sfx[cue.sound];
        const from = markFrame(cue.at) - offset;
        const len = file ? toFrames(cue.seconds ?? file.seconds) : VIDEO.fps;
        if (from + len <= 0 || from >= totalFrames) {
          return null;
        }
        return (
          <Sequence key={`sfx-${i}`} name={`SFX · ${cue.sound}${file ? "" : " [empty]"}`} from={from} durationInFrames={len} layout="none">
            {file ? <Audio src={staticFile(file.src)} volume={() => cue.volume} /> : null}
          </Sequence>
        );
      })}
    </>
  );
};

const MusicTrack: React.FC<{ slot: MusicSlot; offset: number; lines: (readonly [number, number])[]; totalFrames: number }> = ({ slot, offset, lines, totalFrames }) => {
  const start = markFrame(slot.from) - offset;
  const end = markFrame(slot.to) - offset;
  if (end <= 0 || start >= totalFrames || end <= start) {
    return null;
  }
  const file = AUDIO_MANIFEST.music[slot.id];
  const duration = end - start;
  const fi = Math.min(duration / 2, slot.fadeIn * VIDEO.fps);
  const fo = Math.min(duration / 2, slot.fadeOut * VIDEO.fps);
  return (
    <Sequence name={`Music · ${slot.id}${file ? "" : " [empty]"}`} from={start} durationInFrames={duration} layout="none">
      {file ? (
        <Audio
          src={staticFile(file.src)}
          volume={(f) => {
            const edges = interpolate(f, [0, fi, duration - fo, duration], [0, 1, 1, 0], clamp);
            const speaking = speakingAt(f + start, lines, MUSIC.duckRampFrames);
            return slot.volume * edges * (1 - speaking * (1 - MUSIC.duck));
          }}
        />
      ) : null}
    </Sequence>
  );
};
