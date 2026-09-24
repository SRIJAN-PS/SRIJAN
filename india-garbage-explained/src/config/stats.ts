import type { SourceId } from "./sources.ts";

// Every number shown on screen comes from here, with its source and year.
//
// Editorial rule: never invent a statistic. If a figure cannot be confirmed,
// set `show: false` and <StatCard> falls back to a conceptual animation
// with no number.

export type Stat = {
  // Displayed value, already rounded for the screen.
  value: string;
  // Prefix such as "about" for rounded values.
  qualifier?: string;
  unit: string;
  label: string;
  year: string;
  sourceId: SourceId;
  // Share of generated waste (0–1), used by bar visualisations.
  share?: number;
  show: boolean;
  // Set to true once an editor has checked the figure against the source PDF.
  checkedAgainstSource: boolean;
  editorNote?: string;
};

const CPCB_2122_NOTE =
  "National totals reported for 2021–22: ~1,70,339 TPD generated, ~1,56,449 TPD collected, ~91,511 TPD treated/processed. Cross-checked in two official-source summaries (CPCB report; MoEFCC reply in Rajya Sabha, 2024). Rounded here; confirm against the CPCB PDF before publishing.";

export const STATS = {
  generatedPerDay: {
    value: "1.7 lakh",
    qualifier: "about",
    unit: "tonnes per day",
    label: "Municipal solid waste generated in India",
    year: "2021–22",
    sourceId: "cpcbAnnual2122",
    show: true,
    checkedAgainstSource: false,
    editorNote: CPCB_2122_NOTE,
  },
  collectedShare: {
    value: "92%",
    qualifier: "about",
    unit: "",
    label: "of generated waste was collected",
    year: "2021–22",
    sourceId: "cpcbAnnual2122",
    share: 0.92,
    show: true,
    checkedAgainstSource: false,
    editorNote: CPCB_2122_NOTE,
  },
  treatedShare: {
    value: "54%",
    qualifier: "about",
    unit: "",
    label: "of generated waste was treated or processed",
    year: "2021–22",
    sourceId: "cpcbAnnual2122",
    share: 0.54,
    show: true,
    checkedAgainstSource: false,
    editorNote: CPCB_2122_NOTE,
  },
} satisfies Record<string, Stat>;

export type StatId = keyof typeof STATS;
