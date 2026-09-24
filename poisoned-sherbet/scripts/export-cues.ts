// Writes the film's timing for people and tools:
//   out/subtitles.srt        subtitles for every narration line
//   out/narration-script.md  the narration with timecodes, claim types and sources
//   out/timeline.json        scenes, lines, music slots and sound cues (read by synthesize-score.py)
//
// Run with: npm run export:cues

import { mkdirSync, writeFileSync } from "node:fs";
import { MUSIC, SFX } from "../src/data/assets.ts";
import { SOURCES } from "../src/data/sources.ts";
import { CLAIM_LABEL } from "../src/data/story.ts";
import { markFrame, SCENES, TOTAL_FRAMES } from "../src/data/timing.ts";
import { VIDEO } from "../src/data/video.ts";

const fps = VIDEO.fps;
const srtTime = (f: number) => {
  const ms = Math.round((f / fps) * 1000);
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};
const mmss = (f: number) => `${Math.floor(f / fps / 60)}:${String(Math.floor(f / fps) % 60).padStart(2, "0")}`;

mkdirSync("out", { recursive: true });

const srt: string[] = [];
let n = 1;
for (const scene of SCENES) {
  for (const cue of scene.cues) {
    srt.push(`${n++}\n${srtTime(cue.globalFrom)} --> ${srtTime(cue.globalFrom + cue.duration)}\n${cue.text}\n`);
  }
}
writeFileSync("out/subtitles.srt", srt.join("\n"));

const md: string[] = [`# ${VIDEO.title}: narration script`, "", `${VIDEO.subtitle}. ${VIDEO.dateline}. Length ${mmss(TOTAL_FRAMES)}.`, ""];
for (const scene of SCENES) {
  md.push(`## ${scene.number}. ${scene.title} (${mmss(scene.from)})`, "", "| Time | Line | Claim | Sources |", "|---|---|---|---|");
  for (const cue of scene.cues) {
    const src = (cue.sources ?? []).map((s) => SOURCES[s].label).join("; ");
    md.push(`| ${mmss(cue.globalFrom)} | ${cue.text.replace(/\|/g, "\\|")} | ${CLAIM_LABEL[cue.kind]} | ${src} |`);
  }
  md.push("");
}
writeFileSync("out/narration-script.md", md.join("\n"));

const seconds = (f: number) => Math.round((f / fps) * 1000) / 1000;
writeFileSync(
  "out/timeline.json",
  JSON.stringify(
    {
      fps,
      totalSeconds: seconds(TOTAL_FRAMES),
      scenes: SCENES.map((s) => ({
        id: s.id,
        start: seconds(s.from),
        end: seconds(s.from + s.durationInFrames),
        cues: s.cues.map((c) => ({ id: c.id, start: seconds(c.globalFrom), end: seconds(c.globalFrom + c.duration) })),
      })),
      music: MUSIC.slots.map((m) => ({ id: m.id, start: seconds(markFrame(m.from)), end: seconds(markFrame(m.to)) })),
      sfx: SFX.map((s) => ({ sound: s.sound, start: seconds(markFrame(s.at)) })),
    },
    null,
    2,
  ),
);
console.log(`wrote out/subtitles.srt, out/narration-script.md, out/timeline.json (${mmss(TOTAL_FRAMES)})`);
