import { AUDIO_MANIFEST } from "./audio-manifest.ts";
import { SCRIPT, type Cue, type SceneId } from "./narration.ts";
import { VIDEO } from "./video.ts";

// Centralised timing. Scene lengths, cue positions, subtitles and the
// voice-over markers are all computed from narration.ts:
//
//   scene = leadIn + (cue + gap + cue + …) + tail
//
// A cue's length comes from, in order of preference:
//   1. `seconds` set on the cue in narration.ts
//   2. the measured length of its recorded line (public/audio/voiceover/<scene>/<cue>.*,
//      registered by `npm run sync:audio`)
//   3. an estimate from its word count

export const WORDS_PER_SECOND = 2.5;
export const CUE_GAP_SECONDS = 0.25;
const MIN_CUE_SECONDS = 1.4;
// Figures such as "2021–22" or "92%" take longer to say than one word.
const WORDS_PER_NUMBER = 2.5;

const toFrames = (seconds: number) => Math.round(seconds * VIDEO.fps);

export const estimateSeconds = (text: string) => {
  const tokens = text.split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t));
  const words = tokens.reduce((sum, t) => sum + (/\d/.test(t) ? WORDS_PER_NUMBER : 1), 0);
  return Math.max(MIN_CUE_SECONDS, words / WORDS_PER_SECOND);
};

export type CueTiming = Cue & {
  sceneId: SceneId;
  index: number;
  // Frames, relative to the start of the scene.
  from: number;
  duration: number;
  // Frames, relative to the start of the full video.
  globalFrom: number;
};

export type SceneTiming = {
  id: SceneId;
  number: number;
  title: string;
  from: number;
  durationInFrames: number;
  cues: CueTiming[];
};

const buildTimeline = () => {
  let sceneStart = 0;
  return SCRIPT.map((scene): SceneTiming => {
    let cursor = toFrames(scene.leadIn);
    const cues = scene.cues.map((cue, index): CueTiming => {
      if (index > 0) {
        cursor += toFrames(CUE_GAP_SECONDS);
      }
      cursor += toFrames(cue.pauseBefore ?? 0);
      const recorded = AUDIO_MANIFEST.lines[`${scene.id}/${cue.id}`]?.seconds;
      const duration = toFrames(cue.seconds ?? recorded ?? estimateSeconds(cue.text));
      const timing = { ...cue, sceneId: scene.id, index, from: cursor, duration, globalFrom: sceneStart + cursor };
      cursor += duration;
      return timing;
    });
    const durationInFrames = cursor + toFrames(scene.tail);
    const result = { id: scene.id, number: scene.number, title: scene.title, from: sceneStart, durationInFrames, cues };
    sceneStart += durationInFrames;
    return result;
  });
};

export const SCENES = buildTimeline();

export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + s.durationInFrames, 0);

export const sceneById = (id: SceneId): SceneTiming => {
  const scene = SCENES.find((s) => s.id === id);
  if (!scene) {
    throw new Error(`Unknown scene "${id}"`);
  }
  return scene;
};

// Cue lookups for scene components. All values are frames relative to the scene.
export const cuesOf = (id: SceneId) => {
  const scene = sceneById(id);
  const get = (cueId: string) => {
    const cue = scene.cues.find((c) => c.id === cueId);
    if (!cue) {
      throw new Error(`Unknown cue "${cueId}" in scene "${id}"`);
    }
    return cue;
  };
  return {
    duration: scene.durationInFrames,
    at: (cueId: string) => get(cueId).from,
    end: (cueId: string) => get(cueId).from + get(cueId).duration,
    len: (cueId: string) => get(cueId).duration,
    // Evenly spaced beats inside one cue, e.g. items named in a list.
    beat: (cueId: string, i: number, count: number) => {
      const cue = get(cueId);
      return cue.from + Math.round((cue.duration * i) / count);
    },
  };
};

// The cue whose badge/source should be on screen at `frame` (scene-relative).
// It stays active through the gap until the next cue starts.
export const activeCue = (id: SceneId, frame: number): CueTiming | null => {
  const scene = sceneById(id);
  let current: CueTiming | null = null;
  for (const cue of scene.cues) {
    if (cue.from <= frame) {
      current = cue;
    }
  }
  return current;
};

export const timecode = (frames: number) => {
  const fps = VIDEO.fps;
  const totalSeconds = Math.floor(frames / fps);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(totalSeconds / 3600))}:${pad(Math.floor(totalSeconds / 60) % 60)}:${pad(totalSeconds % 60)}:${pad(frames % fps)}`;
};
