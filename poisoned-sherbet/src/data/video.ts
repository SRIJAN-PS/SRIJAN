export const VIDEO = {
  id: "PoisonedSherbetDocumentary",
  title: "The Poisoned Sherbet",
  subtitle: "The Maharaja Accused of Trying to Kill a British Resident",
  dateline: "Baroda, 1874",
  width: 1920,
  height: 1080,
  fps: 30,
  // Burned-in subtitles for every narration line.
  showSubtitles: true,
  // Debug overlay: current cue, timecode and a cue timeline (for re-recording).
  showTimingMarkers: false,
};

// Safe areas (px). Titles and labels stay inside `title`; subtitles sit above `subtitleBottom`.
export const SAFE = {
  x: 120,
  top: 84,
  bottom: 96,
  subtitleBottom: 92,
};
