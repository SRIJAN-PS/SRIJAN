# The Poisoned Sherbet

**The Maharaja Accused of Trying to Kill a British Resident · Baroda, 1874**

A 9 min 54 s historical documentary built with [Remotion](https://www.remotion.dev). 1920×1080, 30 fps. The composition is `PoisonedSherbetDocumentary`.

| # | Scene | Starts | What it covers |
|---|-------|-------|----------------|
| 1 | Cold open | 0:00 | 9 November 1874: the glass, the sips, the sediment; the name at the centre of the case; title |
| 2 | Who was Colonel Phayre? | 1:02 | The Resident's role; the Residency and the Gaekwad palace; strained relations |
| 3 | A state under pressure | 1:49 | Map: India → Bombay Presidency → Baroda; the 1873 inquiry; letters between palace, Resident and government |
| 4 | The morning of 9 November | 2:37 | The walk, the pummelo sherbet, the sediment, the analysis (arsenic, diamond dust), the report |
| 5 | The strange part | 3:24 | Who had access; statements; the chain investigators looked for; Pelly's arrival; the arrest (January 1875) |
| 6 | The case against the Maharaja | 4:19 | The prosecution's argument; testimony, access, palace connection, alleged instructions; the challenge |
| 7 | The Maharaja's defence | 5:08 | The commission (February 1875), its six members, Serjeant Ballantine, cross-examination, the press |
| 8 | The 3–3 division | 6:17 | Three British members: charge proved. Three Indian members: not proved |
| 9 | The fate of the Maharaja | 7:05 | Deposed in April 1875 on grounds other than the poisoning charge; exile in Madras |
| 10 | What really happened? | 8:04 | What the record establishes, what it does not, three readings |
| 11 | The final question | 9:08 | Closing cards, the question to the viewer, end card with sources |

## Historical approach

**The poisoning is always an allegation.** No line says that Malhar Rao ordered it. Lines about the case against him are attributed: "was accused", "the prosecution argued", "according to the evidence presented", "one line of testimony described".

**Every narration line carries a label** (top right of the frame), set by `kind` in `src/data/story.ts`:

| Label | Meaning |
|---|---|
| HISTORICAL RECORD | Documented in the trial record or official correspondence |
| PHAYRE'S ACCOUNT | What Colonel Phayre reported happened to him |
| ALLEGATION · AS ARGUED AT THE INQUIRY | The prosecution's case |
| CONTEXT | General background on how the system worked |
| INTERPRETATION | An open question or reading, not a finding |

**Every factual line shows its source** (bottom left) from `src/data/sources.ts`, and the end card lists them all.

**Every picture that is not a record says so** (bottom right):

| Tag | Used for |
|---|---|
| DRAMATIZED RECONSTRUCTION | Re-enacted moments |
| ILLUSTRATIVE · NOT A HISTORICAL IMAGE | Maps, diagrams, the newspaper and document animations |
| SILHOUETTE · NOT A LIKENESS | The two oval portraits and the commissioners |
| AI-GENERATED RECONSTRUCTION | The one AI still |

The portraits are Victorian cut-paper silhouettes, a period form that shows a role without inventing a face. The office floor plan is marked as schematic, not the real Residency plan. The newspaper shows only the headline as printed; its body text is deliberately illegible. No document on screen contains invented words.

**The poisoning charge and the deposition are kept apart.** Scene 9 shows them side by side: the commission split 3–3 on the poisoning charge, and the deposition, where the government cited misconduct, misgovernment and unfitness to rule.

### Facts used and how they were checked

The build environment could not open the archives themselves: Wikipedia, the British Library, the Qatar Digital Library and archive.org were all blocked by its network policy. Facts were checked against search-result summaries of the sources below. **Check them against the 1875 trial record before publishing.**

| Claim | Source | Check |
|---|---|---|
| Phayre was Resident at Baroda, 1873–74; relations with Malhar Rao were hostile; Malhar Rao sought his removal | India Office Records; Wikipedia summaries | Consistent across sources |
| An inquiry examined maladministration in Baroda in 1873 | Government of India commission of 1873 (summaries) | Consistent |
| 9 November 1874: Phayre took a few sips of sherbet, felt nausea, found sediment; analysis reported arsenic and diamond dust | Dictionary of National Biography ('Pelly'); trial record | The DNB says "arsenic and diamond dust in his sherbet". "Pummelo" and "nausea" follow the brief and common accounts; check them against the trial record |
| Sir Lewis Pelly arrived as special commissioner on 30 November 1874, and arrested the Gaekwad in January 1875 on the Government of India's orders | DNB, 'Pelly, Lewis' (1895) | Direct from the DNB summary |
| The commission sat at Baroda from February 1875. Members: Sir Richard Couch, Sir Richard Meade and P. S. Melvill (British); Maharaja Scindia, the Maharaja of Jaipur and Sir Dinkar Rao (Indian). Defence counsel: Serjeant William Ballantine | DNB, 'Ballantine, William' (1901); Qatar Digital Library catalogue | Consistent |
| British members found the charge proved; Indian members did not | DNB; trial record | Consistent |
| Deposed in April 1875 on grounds of misconduct, misgovernment and unfitness, not on the commission's finding; exiled to Madras; died 1882 | DNB ("deposed on the grounds of incapacity and misconduct"); Wikipedia | Sources give 10 April and 22 April, so the film says only "April 1875" |
| Headline "The Baroda Poisoning Case" | *The Argus* (Melbourne), 10 April 1875, reprinting *The Times of India*, 8 March 1875 (Trove) | As printed |

### Changes from the brief, and why

- **Scene 4 clock "6:00 AM" was dropped.** No source consulted gives the time of the walk. The card reads "MORNING · 9 NOVEMBER 1874".
- **"Within hours" became "Soon",** because the timing was not verified.
- **"Phayre immediately reported" became "Phayre reported to his government".** "Immediately" was not verified.
- **"Telegram" is shown as a hand-written report.** The form of the first report was not verified.
- **Verified lines were added** so the story is complete and fair:
  - the year of the earlier inquiry (1873)
  - Pelly's arrival
  - the arrest (January 1875)
  - the commission's six members and defence counsel
  - press coverage
  - the grounds given for deposition, kept separate from the poisoning charge
  - exile in Madras and death in 1882

## Pictures, voice and music

### Pictures

One still is AI-generated: the hand and glass (ElevenLabs, FLUX.2 Pro, `public/images/hand-glass.png`). It is used in several crops. The account's free plan allows three images a day, and two of those three generations failed.

Everything else is original vector illustration built in code:

- the Residency, the Maratha palace and its doors and corridor
- the Baroda skyline
- figures and a horse-drawn carriage
- the courtroom
- interiors and the sediment
- maps drawn from Natural Earth coastlines (public domain, via `world-atlas`), with no political borders

### Voice-over

The narration uses the voice `bm_fable` from Kokoro (Apache-2.0). It is generated locally with [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx), with a small pronunciation dictionary for the names (`scripts/names-lexicon.txt`). Each of the 91 lines is its own clip, trimmed and sped up 5% without a pitch change. Every line was checked with Whisper speech recognition.

- **Why Kokoro.** The ElevenLabs account ran out of its 10,000 monthly credits partway through the narration.
- **The ElevenLabs recordings are kept.** Takes for 8 of 11 scenes in the ElevenLabs voice "Kundan" (a deep Indian baritone) are in `recordings/elevenlabs-kundan/`. To switch to that voice, record scenes 8, 10 and 11 (about 1,400 characters) with ElevenLabs, then run `python3 scripts/prepare-voiceover.py recordings/elevenlabs-kundan` and `npm run sync:audio`. `prepare-voiceover.py` splits whole-scene takes into lines at the pauses.

### Music and sound

Music and sound effects are synthesised from scratch by `scripts/synthesize-score.py`, with no samples. The music uses:

- additive strings with ensemble detune
- Karplus–Strong pizzicato
- timpani
- glass harmonics
- convolution reverb

Each music cue is composed to the exact length of its section, read from `out/timeline.json`:

| Cue | Scenes | Character |
|---|---|---|
| Opening | Cold open | Drone, cut dead at "something feels wrong" |
| Title | Cold open | Swell under the accusation and the title |
| Investigation | 2–6 | Heartbeat pulse and strings, building |
| Courtroom | 7 | Minimal tension |
| Verdict | 8 | Almost silent |
| Ending | 9–11 | Resolves to D major on the end card |

Music drops to 40% under narration. There are 12 sound effects:

| Sound | Sound |
|---|---|
| Footsteps | Candle-room tone |
| Glass | Liquid |
| Carriage | City |
| Morning birds | Paper |
| Pen | Palace |
| Courtroom | Palace doors |

## Project structure

```
src/
  Root.tsx                 compositions: the film, plus each scene on its own (Scenes folder)
  Video.tsx                eleven scenes in series + subtitles + audio
  data/
    story.ts               every narration line: text, pronunciation, claim type, sources, pauses
    sources.ts             source registry
    timing.ts              scene and line timing derived from story.ts and the recordings
    assets.ts              music slots, sound cues, image slots
    audio-manifest.ts      generated by sync:audio
    theme.ts, video.ts     palette, fonts, easing; size, fps, safe areas
  scenes/                  ColdOpen, Phayre, BarodaConflict, Poisoning, Investigation, Accusation,
                           Defence, Commission, Deposition, HistoricalAssessment, Ending
  components/
    HistoricalText.tsx     serif title reveals        DateCard.tsx        dateline cards
    EvidenceCard.tsx       pinned evidence cards      MapAnimation.tsx    engraved map with camera moves
    Newspaper.tsx          period newspaper           Timeline.tsx        dated timeline
    CinematicTransition.tsx  fade, cut, flash, iris   Subtitle.tsx        burned-in subtitles
    Portrait.tsx           silhouette portraits       Arrow.tsx           self-drawing arrows
    CourtroomScene.tsx     the 1875 hearing           PalaceScene.tsx     palace exteriors
    Letter.tsx             envelopes, writing, record pages
    SourceLabel.tsx        claim badge + source       ReconstructionTag.tsx  lower-third tags
    Camera.tsx             camera moves and parallax layers
    Atmosphere.tsx         grain, vignette, dust, haze, candle flicker
    Still.tsx, Shot.tsx, SceneFrame.tsx, AudioTracks.tsx
  illustrations/           Residency, Palace (+ doors, corridor), Skyline, Sky, Figures, Carriage,
                           Glass (+ sediment), Interior (study, pantry, specimen), FloorPlan
scripts/
  export-cues.ts           out/subtitles.srt, out/narration-script.md, out/timeline.json
  sync-audio.ts            registers audio files and re-times the film
  synthesize-voiceover.py  local Kokoro narration
  prepare-voiceover.py     splits, trims and tempo-adjusts narration into per-line clips
  synthesize-score.py      music and sound effects
  render-stills.mjs        review stills
```

## Commands

```console
npm i
npm run dev              # Remotion Studio
npm run render           # out/poisoned-sherbet.mp4
npm run export:cues      # subtitles, narration script, timeline
npm run sync:audio       # after adding or replacing audio
npm run score            # re-synthesise music and sound effects to the current timing
npm run lint
```

If Remotion can't download its headless Chrome, add `--browser-executable=/path/to/chrome` to the render command.

Fonts are bundled in `public/fonts/`, so rendering needs no network: Cormorant Garamond, Inter and IBM Plex Mono, all under the SIL Open Font License.
