// Exports the narration timeline for editors and voice-over artists:
//   out/subtitles.srt       — subtitle file matching the burned-in subtitles
//   out/voiceover-script.md — the script with timecodes, claim types and sources
//   out/cues.json           — machine-readable cue list
// Run with: npm run export:cues

import { mkdirSync, writeFileSync } from "node:fs";
import { sourceLabel } from "../src/config/sources.ts";
import { SCENES, TOTAL_FRAMES, timecode, WORDS_PER_SECOND } from "../src/config/timing.ts";
import { VIDEO } from "../src/config/video.ts";

const fps = VIDEO.fps;
const srtTime = (frames: number) => {
  const ms = Math.round((frames / fps) * 1000);
  const pad = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`;
};

const cues = SCENES.flatMap((s) => s.cues.map((c) => ({ scene: s, cue: c })));

const srt = cues
  .map(({ cue }, i) => `${i + 1}\n${srtTime(cue.globalFrom)} --> ${srtTime(cue.globalFrom + cue.duration)}\n${cue.text}\n`)
  .join("\n");

const md = [
  `# ${VIDEO.title} — voice-over script`,
  "",
  `Total length: ${timecode(TOTAL_FRAMES)} (${(TOTAL_FRAMES / fps).toFixed(1)} s at ${fps} fps).`,
  `Line lengths are estimated at ${WORDS_PER_SECOND} words per second until real recordings are timed in src/config/narration.ts.`,
  "",
  ...SCENES.flatMap((s) => [
    `## ${s.number}. ${s.title}  ·  starts ${timecode(s.from)}  ·  ${(s.durationInFrames / fps).toFixed(1)} s`,
    "",
    "| Marker | In | Out | Type | Line | Source |",
    "|---|---|---|---|---|---|",
    ...s.cues.map(
      (c, i) =>
        `| VO ${s.number}.${i + 1} \`${c.id}\` | ${timecode(c.globalFrom)} | ${timecode(c.globalFrom + c.duration)} | ${c.kind} | ${c.text.replace(/\|/g, "\\|")} | ${(c.sources ?? []).map(sourceLabel).join("; ")} |`,
    ),
    "",
  ]),
].join("\n");

const json = cues.map(({ scene, cue }) => ({
  scene: scene.id,
  cue: cue.id,
  kind: cue.kind,
  text: cue.text,
  sources: cue.sources ?? [],
  startSeconds: +(cue.globalFrom / fps).toFixed(3),
  endSeconds: +((cue.globalFrom + cue.duration) / fps).toFixed(3),
}));

mkdirSync("out", { recursive: true });
writeFileSync("out/subtitles.srt", srt);
writeFileSync("out/voiceover-script.md", md);
writeFileSync("out/cues.json", JSON.stringify(json, null, 2));
console.log(`Wrote ${cues.length} cues (${timecode(TOTAL_FRAMES)}) to out/subtitles.srt, out/voiceover-script.md, out/cues.json`);
