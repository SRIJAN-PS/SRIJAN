// Source registry. Every cue that states a historical fact names one or more
// of these ids, and the source label on screen is built from them.

export type Source = {
  id: string;
  // Short label shown on screen.
  label: string;
  // Full reference for the end card and README.
  full: string;
};

export const SOURCES = {
  trial: {
    id: "trial",
    label: "Trial and Deposition of Mulhar Rao Gaekwar of Baroda, 1875",
    full: "Trial and Deposition of Mulhar Rao Gaekwar of Baroda (1875): proceedings, evidence and cross-examination before the Baroda Commission",
  },
  bhc: {
    id: "bhc",
    label: "Bombay High Court · Historical Cases Archive",
    full: "Bombay High Court, Historical Cases Archive: the Baroda case (1875)",
  },
  ior: {
    id: "ior",
    label: "India Office Records · British Library / Qatar Digital Library",
    full: "British Library, India Office Records, Baroda correspondence 1873–75, digitised by the Qatar Digital Library",
  },
  dnb: {
    id: "dnb",
    label: "Dictionary of National Biography · Pelly (1895), Ballantine (1901)",
    full: "Dictionary of National Biography: 'Pelly, Lewis' (1895) and 'Ballantine, William' (1901 supplement)",
  },
  press: {
    id: "press",
    label: "The Argus, 10 Apr 1875, reprinting The Times of India, 8 Mar 1875",
    full: "'The Baroda Poisoning Case', The Argus (Melbourne), 10 April 1875, reprinted from The Times of India, 8 March 1875",
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

export const sourceLabel = (ids: readonly SourceId[]) => ids.map((id) => SOURCES[id].label).join("  ·  ");
