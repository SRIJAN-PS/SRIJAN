import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// All fonts are bundled (SIL Open Font License), so rendering needs no network.
for (const weight of ["400", "500", "600", "700"]) {
  loadFont({ family: "Cormorant", url: staticFile(`fonts/Cormorant-${weight}.woff2`), weight });
}
loadFont({ family: "Cormorant", url: staticFile("fonts/Cormorant-500-italic.woff2"), weight: "500", style: "italic" });
for (const weight of ["400", "500", "600", "700"]) {
  loadFont({ family: "Inter", url: staticFile(`fonts/Inter-${weight}.woff2`), weight });
}
for (const weight of ["400", "500"]) {
  loadFont({ family: "IBM Plex Mono", url: staticFile(`fonts/IBMPlexMono-${weight}.woff2`), weight });
}
