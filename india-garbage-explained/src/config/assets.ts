import type { SceneId } from "./narration.ts";

// Editable media placeholders. Everything is optional: an empty slot renders
// silently (audio) or falls back to the built-in vector artwork (images).
//
// AUDIO: drop files into public/audio and run `npm run sync:audio`.
//   Voice-over, one file per narration line (recommended; the video re-times to fit):
//     public/audio/voiceover/<sceneId>/<cueId>.mp3      e.g. voiceover/hook/throw.mp3
//   Voice-over, one file per scene (alternative; plays from the scene's start):
//     public/audio/voiceover/<sceneId>.mp3
//   Music, one file per slot below:
//     public/audio/music/<slotId>.mp3                   e.g. music/main.mp3
// .wav, .m4a, .aac and .ogg also work. Use only licensed or royalty-free music.

export type MusicSlot = {
  id: string;
  // Plays from the start of `from` to the end of `to` (inclusive).
  from: SceneId;
  to: SceneId;
  loop: boolean;
  // Full volume when nobody is speaking.
  volume: number;
};

export const ASSETS = {
  music: {
    slots: [
      { id: "opening", from: "hook", to: "hook", loop: false, volume: 0.3 },
      { id: "main", from: "whatIsGarbage", to: "hierarchy", loop: true, volume: 0.2 },
      { id: "closing", from: "journey", to: "journey", loop: false, volume: 0.28 },
    ] as MusicSlot[],
    // Volume multiplier while narration is playing.
    duck: 0.3,
    // Frames for the duck to ramp in and out around each line.
    duckRampFrames: 10,
    // Fade at the start and end of each slot.
    fadeSeconds: 1.5,
  },
  images: {
    // Optional photo/illustration behind the opening street scene.
    hookBackground: null as string | null,
    // Optional official outline of India (Survey of India-compliant) drawn
    // behind the city-lights map. Left empty, only city points are shown.
    indiaOutline: null as string | null,
  },
};
