import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Bundled fonts (SIL Open Font License): Noto Sans/Serif Devanagari for Hindi,
// Inter and IBM Plex Mono for Latin text and instruments.
for (const weight of ["400", "500", "600", "700"]) {
  loadFont({ family: "Noto Sans Devanagari", url: staticFile(`fonts/NotoSansDeva-${weight}.woff2`), weight });
  loadFont({ family: "Inter", url: staticFile(`fonts/Inter-${weight}.woff2`), weight });
}
for (const weight of ["500", "600", "700"]) {
  loadFont({ family: "Noto Serif Devanagari", url: staticFile(`fonts/NotoSerifDeva-${weight}.woff2`), weight });
}
for (const weight of ["400", "500"]) {
  loadFont({ family: "IBM Plex Mono", url: staticFile(`fonts/IBMPlexMono-${weight}.woff2`), weight });
}
