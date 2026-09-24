// Global video settings. Kept free of Remotion/React imports so that
// scripts/export-cues.ts can load it with plain Node.

export const VIDEO = {
  compositionId: "IndiaGarbageExplained",
  title: "WHERE DOES INDIA'S GARBAGE ACTUALLY GO?",
  series: "INDIA — EXPLAINED",
  width: 1920,
  height: 1080,
  fps: 30,
  // Burned-in subtitles generated from the narration script.
  showSubtitles: true,
  // Debug overlay: current cue id, timecode and a cue timeline strip.
  // Turn on while recording or aligning the voice-over; keep off for the final render.
  showTimingMarkers: false,
};

// Layout guides in pixels (1920×1080). Everything important stays inside
// these bounds so it survives title-safe cropping and small phone screens.
export const SAFE = {
  x: 120,
  top: 90,
  // Scene content lives between these two lines.
  contentTop: 250,
  contentBottom: 800,
  // Source labels sit just above the subtitle band.
  sourceTop: 818,
  // Subtitle band is anchored to the bottom edge.
  subtitleBottom: 56,
};
