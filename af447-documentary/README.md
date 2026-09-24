# AIR FRANCE 447

**अटलांटिक के ऊपर गायब हुआ विमान — और 3,900 मीटर नीचे मिला सच**

A 10-minute Hindi aviation documentary built with [Remotion](https://www.remotion.dev). 1920×1080, 30 fps. The composition is `AF447Documentary`.

| # | Scene | Starts | What it covers |
|---|-------|-------|----------------|
| 1 | आख़िरी उड़ान | 0:00 | Rio at night, take-off, 216 passengers + 12 crew, title |
| 2 | एक सामान्य उड़ान | 0:50 | Great-circle route Rio → Paris, cruise at FL350, weather radar and the course change |
| 3 | पहली चेतावनी | 1:41 | 02:10 UTC, ice crystals, the pitot probe diagram, unreliable speed, autopilot off, alternate law |
| 4 | विमान ऊपर उठने लगा | 2:38 | Nose up, climb to about 38,000 ft, speed decaying, leaving the flight envelope |
| 5 | स्टॉल | 3:25 | What a stall is (wing diagram), angle of attack, the descent, impact at 02:14:28 |
| 6 | विमान गायब | 4:19 | Last radio contact with Brazilian ATC, the last known position, the search begins |
| 7 | तलाश | 4:56 | Search area, surface debris, 3,900 m depth, recorders not found |
| 8 | दो साल के सवाल | 5:34 | Calendars 2009 → 2011, side-scan sonar, wreckage found 3 April 2011, FDR (1 May) and CVR (2 May) |
| 9 | ब्लैक बॉक्स ने बताया क्रम | 6:11 | The recorders, data traces, the event chain, the BEA final report (July 2012) |
| 10 | असली सवाल | 7:06 | Solved, yes; the chain of factors rather than a single cause |
| 11 | AF447 के बाद क्या बदला? | 8:06 | Unreliable-airspeed and high-altitude stall training, simulator sessions, pitot probe replacement |
| 12 | अंत | 8:59 | Closing lines, source end screen, memorial card |

## Accuracy

**The film does not call AF447 an unexplained mystery.** Scene 10 answers its own question ("हां…"), and scenes 9–12 follow the causal sequence set out in the BEA Final Report.

**No cockpit dialogue.** No word spoken in the cockpit appears on screen or in the narration.
- The CVR section shows abstract level bars with the note "NO COCKPIT WORDS ARE SHOWN".
- Every shot of the crew is tagged **DRAMATIZED RECONSTRUCTION**.

**Instrument values follow the BEA timeline, approximately.** The PFD and ECAM are driven by `flightState()` in `src/components/Cockpit.tsx`. Those shots are tagged **RECONSTRUCTED FROM BEA DATA · VALUES APPROXIMATE**. The key points are:

| Time (UTC) | Event |
|---|---|
| 02:10:05 | Autopilot disconnects |
| 02:10:05–02:10:34 | Unreliable speed (SPD flag) |
| 02:10:51 | Stall warning begins |
| Peak | Climb to about 37,900 ft |
| 02:14:28 | Last recorded values: pitch 16.2°, roll 5.3° left, vertical speed −10,912 ft/min |

The displays are A330 glass-cockpit instruments of 2009, with no modern additions.

**Tags.** Maps, diagrams and exterior shots carry **ILLUSTRATIVE ANIMATION**. Each narration line that states a finding of the report shows "BEA Final Report · AF447 · July 2012" on screen (● in `out/narration-script.md`).

**Images and sound kept out:**
- no newspaper headlines
- no explosions
- no supernatural or conspiracy imagery
- no horror music

The wreckage on the seabed is a quiet, schematic field of debris.

### Facts used and how they were checked

The build environment could not open the BEA site or Wikipedia, because its network policy blocks them. Facts were checked against search-result summaries of the BEA report and of reporting on it. **Check them against the BEA Final Report before publishing.**

| Claim | Where it appears |
|---|---|
| 216 passengers and 12 crew; departure from Rio at 22:29 UTC, 31 May 2009 | Scene 1 |
| Cruise at FL350; weather avoidance with a slight course change | Scene 2 |
| Pitot probes obstructed by ice crystals; AP disconnect at 02:10:05; alternate law | Scene 3 |
| Nose-up inputs; climb to about 38,000 ft; stall warning; stall | Scenes 4–5 |
| Impact at 02:14:28, about 3 min 30 s after the autopilot disconnected | Scene 5 |
| Wreck at about 3,900 m; found 3 April 2011; FDR recovered 1 May, CVR 2 May 2011 | Scenes 7–8 |
| Final report published July 2012 | Scene 9 |
| Thales AA pitot probes replaced (Goodrich) on Airbus A330/A340s; training changes | Scene 11 |

### Changes from the brief

- **No on-screen headlines.** The brief allowed news graphics, but a real-looking headline would have to be invented, so none are shown.
- **The narration is fully in Devanagari for the voice.** Subtitles keep the brief's Hinglish exactly (`text` in `src/data/af447.ts`). The voice reads a Devanagari transliteration (`say`), so English terms such as "Pitot", "autopilot" and "stall" are pronounced correctly.

## Pictures, voice and music

### Pictures

Everything is original vector illustration built in code:
- the A330 side and top views
- the PFD, ECAM and weather radar
- the Rio skyline
- the night sky and storm cells
- the ocean surface, underwater scenes, the ROV and seabed
- the side-scan sonar
- the diagrams

Maps are drawn from Natural Earth coastlines (public domain, via `world-atlas`), with no political borders. No AI images were used: the image services had no credits left.

### Voice-over

The narration uses the Hindi voice `hm_omega` from Kokoro v1.0 (Apache-2.0). It is generated locally with [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx) at 0.92× speed, then prepared by `scripts/prepare-voiceover.py`:
- tempo ×1.03
- pitch lowered 1 semitone for a deeper voice
- trimmed
- normalised to −18 dBFS

Net speed is about 0.95×, and each of the 123 lines is its own clip.

The ElevenLabs account had no credits left. To switch to another voice, put one file per line in `public/audio/voiceover/<scene>/<cue>.mp3` and run `npm run sync:audio`; the film re-times itself.

### Music and sound

Music and sound effects are synthesised from scratch by `scripts/synthesize-score.py` (numpy, no samples). Each cue is composed to the exact length of its section, read from `out/timeline.json`:

| Cue | Scenes | Character |
|---|---|---|
| Opening | 1 | Low strings, night |
| Cruise | 2–3 | Calm, unease creeping in with the weather |
| Tension | 4–5 | Pulse and strings; drops away as the aircraft falls |
| Deep | 6–7 | Sparse, low, underwater |
| Discovery | 8–9 | Measured lift at the sonar find |
| Reflection | 10–11 | Quiet strings |
| Ending | 12 | Resolves on the end screen |

Music ducks to 30% under narration. `scripts/check-mix.py` simulates the mix: the voice sits about 13 dB above everything under it. The sound effects are:
- airport and take-off
- cabin hum and cockpit air
- weather, ice and the autopilot-disconnect "cavalry charge"
- master caution chime and stall warning
- radio, radar, sea, sonar, underwater and data

## Project structure

```
src/
  Root.tsx                 compositions: the film, plus each scene on its own (Scenes folder)
  Video.tsx                twelve scenes in series + subtitles + audio
  data/
    af447.ts               every narration line: subtitle text, spoken Devanagari, BEA flag, pauses
    timing.ts              scene and line timing derived from af447.ts and the recordings
    assets.ts              music slots and sound cues
    audio-manifest.ts      generated by sync:audio
    theme.ts, video.ts     palette, fonts, easing; size, fps, safe areas
  scenes/                  Opening, NormalFlight, PitotProblem, Climb, Stall, Disappearance, Search,
                           BlackBox (two years), Investigation (black box), RealMystery, Lessons, Ending
  components/
    Aircraft.tsx           A330 side and top views      Cockpit.tsx     PFD, ECAM, radar, BEA flight state
    FlightMap.tsx          great-circle route map       Timeline.tsx    event chain
    ReconstructionTag.tsx  reconstruction / illustrative tags
    Exterior.tsx, EvidenceCard.tsx, LowerThird.tsx, TitleText.tsx, SceneFrame.tsx,
    Camera.tsx, Atmosphere.tsx, Shot.tsx, CinematicTransition.tsx, Subtitle.tsx, AudioTracks.tsx
  illustrations/           Scenery (sky, clouds, Rio, runway), Ocean (surface, ROV, seabed, sonar),
                           Diagrams (pitot, wing, recorder, data plot, calendar)
scripts/
  export-cues.ts           out/subtitles.srt, out/narration-script.md, out/timeline.json
  sync-audio.ts            registers audio files and re-times the film
  synthesize-voiceover.py  local Kokoro Hindi narration
  prepare-voiceover.py     tempo, pitch, trim and level for each line
  synthesize-score.py      music and sound effects
  check-mix.py             offline mix check
  render-stills.mjs        review stills
```

## Commands

```console
npm i
npm run dev              # Remotion Studio
npm run render           # out/af447-hindi.mp4
npm run export:cues      # subtitles, narration script, timeline
npm run sync:audio       # after adding or replacing audio
npm run score            # re-synthesise music and sound effects to the current timing
npm run lint
```

If Remotion can't download its headless Chrome, add `--browser-executable=/path/to/chrome` to the render command.

Fonts are bundled in `public/fonts/`, so rendering needs no network: Noto Sans Devanagari, Noto Serif Devanagari, Inter and IBM Plex Mono, all under the SIL Open Font License.

## Source

Bureau d'Enquêtes et d'Analyses (BEA), *Final Report on the accident on 1st June 2009 to the Airbus A330-203 registered F-GZCP operated by Air France, flight AF 447 Rio de Janeiro – Paris*, July 2012.

*In memory of the 228 people on board.*
