// Renders review stills without re-bundling for each frame:
//   node scripts/render-stills.mjs out/stills 300,900,1500
// Set REMOTION_BROWSER to a Chrome/Chromium binary if Remotion cannot download one.
/* global process, console, URL */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const out = process.argv[2];
const frames = process.argv[3].split(",").map(Number);
mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const composition = await selectComposition({ serveUrl, id: "AF447Documentary", browserExecutable });
for (const f of frames) {
  await renderStill({ composition, serveUrl, frame: f, output: path.join(out, `f${String(f).padStart(5, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 80, browserExecutable, scale: 0.5 });
  console.log("frame", f);
}
