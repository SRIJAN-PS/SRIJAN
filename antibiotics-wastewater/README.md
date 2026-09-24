# Antibiotics in Wastewater

A 60-second educational explainer (1920×1080, 30 fps) built with [Remotion](https://www.remotion.dev).

| # | Scene | Length |
|---|-------|--------|
| 1 | Title: "Antibiotics in Wastewater" | 6 s |
| 2 | Hospital wastewater flowing to a treatment plant | 9 s |
| 3 | Antibiotics passing through conventional treatment | 10 s |
| 4 | Antibiotic resistance with animated bacteria | 10 s |
| 5 | Biochar as an adsorbent | 9 s |
| 6 | g-C₃N₄ photocatalysis under visible light | 9 s |
| 7 | Biochar/g-C₃N₄ hydrogel removing contaminants | 10 s |

Scenes are joined by 0.5 s crossfades, so the 63 s of scene time plays as exactly 60 s.

## Structure

- `src/Root.tsx`: the `AntibioticsInWastewater` composition, plus each scene registered on its own under `Scenes/`
- `src/AntibioticsVideo/AntibioticsVideo.tsx`: scene order and transitions
- `src/AntibioticsVideo/scenes/`: one file per scene
- `src/AntibioticsVideo/components/`: shared illustrations (antibiotic molecule, bacterium, backdrop)
- `public/fonts/`: Poppins (SIL Open Font License), bundled locally so rendering needs no network

## Commands

```console
npm i
npm run dev                                   # preview in Remotion Studio
npx remotion render AntibioticsInWastewater   # writes out/AntibioticsInWastewater.mp4
```

If Remotion can't download its headless Chrome (for example on a locked-down network),
point it at an existing Chromium with `--browser-executable=/path/to/chrome`.
