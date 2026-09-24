import type { SceneId } from "./af447.ts";

// Audio slots. Files live in public/audio and are registered by `npm run sync:audio`:
//   public/audio/voiceover/<sceneId>/<cueId>.mp3   one narration line
//   public/audio/music/<slotId>.mp3                one music slot
//   public/audio/sfx/<sound>.mp3                   one sound effect

export type Mark = { scene: SceneId; cue?: string; edge?: "start" | "end"; offset?: number };
export type MusicSlot = { id: string; description: string; from: Mark; to: Mark; volume: number; fadeIn: number; fadeOut: number };
export type SfxCue = { sound: string; at: Mark; volume: number; seconds?: number };

export const MUSIC: { duck: number; duckRampFrames: number; slots: MusicSlot[] } = {
  duck: 0.3,
  duckRampFrames: 12,
  slots: [
    { id: "opening", description: "Low, spacious night theme", from: { scene: "opening" }, to: { scene: "opening", edge: "end" }, volume: 0.4, fadeIn: 3, fadeOut: 2 },
    { id: "cruise", description: "Calm cruise, unease creeping in with the weather", from: { scene: "normalFlight" }, to: { scene: "pitotProblem", edge: "end" }, volume: 0.35, fadeIn: 2, fadeOut: 1.5 },
    { id: "tension", description: "Pulse and strings as the aircraft climbs and stalls; drops away as it falls", from: { scene: "climb" }, to: { scene: "stall", cue: "falling" }, volume: 0.36, fadeIn: 1.5, fadeOut: 3 },
    { id: "deep", description: "Dark, sparse: the disappearance and the search", from: { scene: "disappearance" }, to: { scene: "search", edge: "end" }, volume: 0.36, fadeIn: 3, fadeOut: 2 },
    { id: "discovery", description: "Investigative, slowly rising: two years, the discovery, the recorders", from: { scene: "twoYears" }, to: { scene: "blackBox", edge: "end" }, volume: 0.4, fadeIn: 2.5, fadeOut: 2 },
    { id: "reflection", description: "Reflective: why it happened and what changed", from: { scene: "realMystery" }, to: { scene: "lessons", edge: "end" }, volume: 0.38, fadeIn: 2.5, fadeOut: 2 },
    { id: "ending", description: "Restrained, emotional resolution", from: { scene: "ending" }, to: { scene: "ending", edge: "end" }, volume: 0.48, fadeIn: 2.5, fadeOut: 4 },
  ],
};

export const SFX: SfxCue[] = [
  { sound: "airport", at: { scene: "opening" }, volume: 0.2 },
  { sound: "takeoff", at: { scene: "opening", cue: "takeoff", offset: -0.5 }, volume: 0.3 },
  { sound: "cabin", at: { scene: "normalFlight" }, volume: 0.15 },
  { sound: "weather", at: { scene: "normalFlight", cue: "weather", offset: -0.5 }, volume: 0.2 },
  { sound: "cockpit", at: { scene: "pitotProblem" }, volume: 0.16 },
  { sound: "ice", at: { scene: "pitotProblem", cue: "crystals" }, volume: 0.3 },
  { sound: "ap-disconnect", at: { scene: "pitotProblem", cue: "autopilot", offset: -0.2 }, volume: 0.4 },
  { sound: "chime", at: { scene: "pitotProblem", cue: "law", offset: -0.1 }, volume: 0.35 },
  { sound: "cockpit", at: { scene: "climb" }, volume: 0.15 },
  { sound: "stall-warning", at: { scene: "climb", cue: "warning", offset: 0.4 }, volume: 0.22 },
  { sound: "cockpit", at: { scene: "stall" }, volume: 0.18 },
  { sound: "stall-warning", at: { scene: "stall", cue: "aoa" }, volume: 0.14 },
  { sound: "radio", at: { scene: "disappearance", cue: "lastContact", offset: -0.3 }, volume: 0.32 },
  { sound: "radar", at: { scene: "disappearance", cue: "ended" }, volume: 0.35 },
  { sound: "sea", at: { scene: "search" }, volume: 0.3 },
  { sound: "sonar", at: { scene: "search", cue: "depth", offset: -1.5 }, volume: 0.35 },
  { sound: "underwater", at: { scene: "search", cue: "depth", offset: -1.5 }, volume: 0.32 },
  { sound: "sonar", at: { scene: "twoYears", cue: "april" }, volume: 0.3 },
  { sound: "underwater", at: { scene: "twoYears", cue: "wreckage" }, volume: 0.28 },
  { sound: "data", at: { scene: "blackBox", cue: "fdr" }, volume: 0.25 },
  { sound: "sea", at: { scene: "ending" }, volume: 0.22 },
];
