import type { SceneId } from "./story.ts";

// Audio and image slots. Every slot is optional: an empty audio slot is
// silent, an empty image slot falls back to the built-in illustration.
//
// Files live in public/ and are registered by `npm run sync:audio`:
//   public/audio/voiceover/<sceneId>/<cueId>.mp3   one narration line
//   public/audio/music/<slotId>.mp3                one music slot
//   public/audio/sfx/<sfxId>.mp3                   one sound effect

// A point on the timeline: a scene's start or end, or a narration line's start or end.
export type Mark = { scene: SceneId; cue?: string; edge?: "start" | "end"; offset?: number };

export type MusicSlot = {
  id: string;
  description: string;
  from: Mark;
  to: Mark;
  // Full volume when nobody is speaking.
  volume: number;
  fadeIn: number;
  fadeOut: number;
};

export type SfxCue = {
  // File name in public/audio/sfx (without extension).
  sound: string;
  at: Mark;
  volume: number;
  // Seconds; defaults to the file's length.
  seconds?: number;
};

export const MUSIC: { duck: number; duckRampFrames: number; slots: MusicSlot[] } = {
  // Volume multiplier while narration plays.
  duck: 0.3,
  duckRampFrames: 12,
  slots: [
    { id: "opening", description: "Low drone, glass harmonics; cuts dead when 'something feels wrong'", from: { scene: "coldOpen", offset: 2 }, to: { scene: "coldOpen", cue: "wrong" }, volume: 0.5, fadeIn: 3, fadeOut: 0.15 },
    { id: "title", description: "Low swell under the accusation and the title card", from: { scene: "coldOpen", cue: "accusation" }, to: { scene: "coldOpen", edge: "end" }, volume: 0.55, fadeIn: 2, fadeOut: 1.2 },
    { id: "investigation", description: "Low percussion and strings, restrained tension (scenes 2–6)", from: { scene: "phayre" }, to: { scene: "accusation", edge: "end" }, volume: 0.42, fadeIn: 2.5, fadeOut: 2.5 },
    { id: "courtroom", description: "Minimal tension under the commission hearing", from: { scene: "defence" }, to: { scene: "defence", edge: "end" }, volume: 0.32, fadeIn: 2, fadeOut: 2 },
    { id: "verdict", description: "Almost silent: a single high sustained note", from: { scene: "commission" }, to: { scene: "commission", edge: "end" }, volume: 0.28, fadeIn: 3, fadeOut: 2 },
    { id: "ending", description: "Slow orchestral resolution (scenes 9–11)", from: { scene: "deposition" }, to: { scene: "ending", edge: "end" }, volume: 0.45, fadeIn: 3, fadeOut: 4 },
  ],
};

export const SFX: SfxCue[] = [
  { sound: "footsteps", at: { scene: "coldOpen", offset: 0.2 }, volume: 0.55 },
  { sound: "room-tone", at: { scene: "coldOpen" }, volume: 0.16 },
  { sound: "glass-set", at: { scene: "coldOpen", cue: "glass", offset: 0.6 }, volume: 0.45 },
  { sound: "glass-throw", at: { scene: "coldOpen", cue: "throws", offset: 0.3 }, volume: 0.5 },
  { sound: "carriage", at: { scene: "phayre", cue: "notDiplomat", offset: -0.5 }, volume: 0.32 },
  { sound: "city", at: { scene: "phayre", cue: "gaekwad", offset: -0.6 }, volume: 0.2 },
  { sound: "paper", at: { scene: "barodaConflict", cue: "deteriorated" }, volume: 0.4 },
  { sound: "paper", at: { scene: "barodaConflict", cue: "grievances" }, volume: 0.35 },
  { sound: "morning", at: { scene: "poisoning" }, volume: 0.3 },
  { sound: "footsteps", at: { scene: "poisoning", cue: "morning", offset: 0.5 }, volume: 0.3 },
  { sound: "glass-set", at: { scene: "poisoning", cue: "ready", offset: 0.4 }, volume: 0.4 },
  { sound: "pen", at: { scene: "poisoning", cue: "reported" }, volume: 0.4 },
  { sound: "paper", at: { scene: "investigation", cue: "questioned" }, volume: 0.35 },
  { sound: "palace", at: { scene: "accusation", cue: "household", offset: -0.5 }, volume: 0.22 },
  { sound: "courtroom", at: { scene: "defence" }, volume: 0.14 },
  { sound: "paper", at: { scene: "defence", cue: "crossExam" }, volume: 0.35 },
  { sound: "footsteps", at: { scene: "deposition", cue: "control" }, volume: 0.35 },
  { sound: "door", at: { scene: "deposition", cue: "deposed", offset: 0.9 }, volume: 0.6 },
  { sound: "city", at: { scene: "ending" }, volume: 0.22 },
];

// Image slots. The one AI-generated still (ElevenLabs, FLUX.2 Pro) is used in
// several crops; every other shot is a vector illustration built in code.
export const IMAGES = {
  handGlass: "images/hand-glass.png",
};
