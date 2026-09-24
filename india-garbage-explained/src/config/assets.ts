import type { SceneId } from "./narration.ts";

// Editable media placeholders. Everything is optional: with a slot left as
// null the video uses its built-in vector artwork and renders silently.
// Paths are relative to /public, e.g. "audio/voiceover/hook.mp3".

export const ASSETS = {
  music: {
    // Background music bed for the whole video (royalty-free / licensed only).
    src: null as string | null,
    volume: 0.22,
    // Volume while a narration line is playing.
    duckedVolume: 0.07,
    fadeSeconds: 2,
  },
  // One recorded voice-over file per scene, placed at the start of that scene.
  // After adding a file, set `seconds` on its cues in narration.ts so the
  // picture and subtitles follow the recording.
  voiceover: {
    hook: null,
    whatIsGarbage: null,
    segregation: null,
    truck: null,
    landfills: null,
    people: null,
    plasticEwaste: null,
    hierarchy: null,
    journey: null,
  } as Record<SceneId, string | null>,
  images: {
    // Optional photo/illustration behind the opening street scene.
    hookBackground: null as string | null,
    // Optional official outline of India (Survey of India-compliant) drawn
    // behind the city-lights map. Left empty, only city points are shown.
    indiaOutline: null as string | null,
  },
};
