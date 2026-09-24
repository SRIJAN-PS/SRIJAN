import { STORY } from "../src/data/af447.ts";

// Prints each scene's narration as one take (lines separated by blank lines),
// using the pronunciation text, for recording a scene in a single pass.
//   node --experimental-strip-types scripts/print-takes.ts [sceneId] [--json]
const args = process.argv.slice(2);
const json = args.includes("--json");
const only = args.find((a) => !a.startsWith("--"));
const scenes = STORY.filter((s) => !only || s.id === only);
if (json) {
  console.log(JSON.stringify(scenes.map((s) => ({ id: s.id, cues: s.cues.map((c) => ({ id: c.id, say: c.say ?? c.text })) }))));
} else {
  for (const scene of scenes) {
    const text = scene.cues.map((c) => c.say ?? c.text).join("\n\n");
    console.log(`=== ${scene.id} (${text.length} chars, ${scene.cues.length} lines)\n${text}\n`);
  }
}
