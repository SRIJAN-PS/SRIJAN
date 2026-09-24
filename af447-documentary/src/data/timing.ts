import { AUDIO_MANIFEST } from "./audio-manifest.ts";
import { STORY, type Cue, type SceneId } from "./af447.ts";
import { VIDEO } from "./video.ts";

// Centralised timing. Scene lengths, cue positions, subtitles and voice-over
// slots all derive from af447.ts:
//
//   scene = leadIn + (pauseBefore + line + pauseAfter + gap) × lines + tail
//
// A line's length is `seconds` if set, else its recording's length
// (registered by `npm run sync:audio`), else an estimate from its word count.

export const WORDS_PER_SECOND = 2.3;
export const CUE_GAP_SECONDS = 0.2;
// Scales every scripted pause (pauseBefore / pauseAfter) at once.
export const PAUSE_SCALE = 0.75;
const MIN_CUE_SECONDS = 1.0;

const toFrames = (seconds: number) => Math.round(seconds * VIDEO.fps);

export const estimateSeconds = (text: string) => {
  const words = text.split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t)).length;
  return Math.max(MIN_CUE_SECONDS, words / WORDS_PER_SECOND);
};

export type CueTiming = Cue & { sceneId: SceneId; index: number; from: number; duration: number; globalFrom: number };
export type SceneTiming = { id: SceneId; number: number; title: string; from: number; durationInFrames: number; cues: CueTiming[] };

const buildTimeline = () => {
  let sceneStart = 0;
  return STORY.map((scene): SceneTiming => {
    let cursor = toFrames(scene.leadIn);
    const cues = scene.cues.map((cue, index): CueTiming => {
      if (index > 0) {
        cursor += toFrames(CUE_GAP_SECONDS);
      }
      cursor += toFrames((cue.pauseBefore ?? 0) * PAUSE_SCALE);
      const recorded = AUDIO_MANIFEST.lines[`${scene.id}/${cue.id}`]?.seconds;
      const duration = toFrames(cue.seconds ?? recorded ?? estimateSeconds(cue.text));
      const timing = { ...cue, sceneId: scene.id, index, from: cursor, duration, globalFrom: sceneStart + cursor };
      cursor += duration + toFrames((cue.pauseAfter ?? 0) * PAUSE_SCALE);
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

// Cue lookups for scene components (frames relative to the scene).
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
  };
};

export const activeCue = (id: SceneId, frame: number): CueTiming | null => {
  let current: CueTiming | null = null;
  for (const cue of sceneById(id).cues) {
    if (cue.from <= frame) {
      current = cue;
    }
  }
  return current;
};

// Frame (from the start of the film) of a scene or line edge, plus an offset in seconds.
export const markFrame = (mark: { scene: SceneId; cue?: string; edge?: "start" | "end"; offset?: number }) => {
  const scene = sceneById(mark.scene);
  let frame: number;
  if (mark.cue) {
    const cue = scene.cues.find((c) => c.id === mark.cue);
    if (!cue) {
      throw new Error(`Unknown cue "${mark.cue}" in scene "${mark.scene}"`);
    }
    frame = cue.globalFrom + (mark.edge === "end" ? cue.duration : 0);
  } else {
    frame = scene.from + (mark.edge === "end" ? scene.durationInFrames : 0);
  }
  return frame + Math.round((mark.offset ?? 0) * VIDEO.fps);
};
