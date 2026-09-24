# Audio slots

Drop files here, then run `npm run sync:audio` from the project root.

- `voiceover/<sceneId>/<cueId>.mp3`: one narration line. Scene and cue ids are listed in `src/config/narration.ts` and in the File column of `out/voiceover-script.md` (`npm run export:cues`). Recorded lines set the timing of the video.
- `voiceover/<sceneId>.mp3`: alternatively, one recording for a whole scene, played from the start of that scene.
- `music/opening.mp3`, `music/main.mp3`, `music/closing.mp3`: music slots (see `ASSETS.music` in `src/config/assets.ts`). Use only licensed or royalty-free music.

Scene ids: hook, whatIsGarbage, segregation, truck, landfills, people, plasticEwaste, hierarchy, journey.

Empty slots render silently.
