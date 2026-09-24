// Every source the video cites. Cues and statistics refer to these by id, and
// <SourceLabel> renders "PUBLISHER — Title" beneath the claim on screen.
//
// Editorial rule: regulatory claims cite CPCB / MoEFCC documents only.
// `url` is filled in only where the link has been confirmed.

export type Source = {
  publisher: string;
  title: string;
  year: string;
  // Extra context printed after the title, e.g. "in force from 1 April 2026".
  detail?: string;
  url?: string;
  // Internal note for editors; never rendered.
  editorNote?: string;
};

export const SOURCES = {
  swm2016: {
    publisher: "CPCB",
    title: "Solid Waste Management Rules, 2016",
    year: "2016",
    editorNote:
      "Notified by MoEFCC under the Environment (Protection) Act, 1986; text hosted by CPCB. Superseded by the SWM Rules, 2026 from 1 April 2026, so the video refers to it in the past tense.",
  },
  swm2026: {
    publisher: "MoEFCC",
    title: "Solid Waste Management Rules, 2026",
    year: "2026",
    detail: "in force from 1 April 2026",
    url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2219676",
    editorNote:
      "Four-stream segregation (wet, dry, sanitary, special care); landfill restricted to non-recyclable, non-energy-recoverable waste and inert material; integration of waste pickers and kabadiwalas. Summarised from the PIB release.",
  },
  cpcbAnnual2122: {
    publisher: "CPCB",
    title: "Annual Report on Solid Waste Management, 2021–22",
    year: "2021–22",
    url: "https://cpcb.nic.in/uploads/MSW/MSW_AnnualReport_2021-22.pdf",
  },
  wasteRules: {
    publisher: "MoEFCC",
    title: "Waste-specific rules under the Environment (Protection) Act, 1986",
    year: "2016–2025",
  },
  plastic2016: {
    publisher: "MoEFCC",
    title: "Plastic Waste Management Rules, 2016",
    year: "2016",
    detail: "as amended",
  },
  ewaste2022: {
    publisher: "MoEFCC",
    title: "E-Waste (Management) Rules, 2022",
    year: "2022",
  },
  battery2022: {
    publisher: "MoEFCC",
    title: "Battery Waste Management Rules, 2022",
    year: "2022",
  },
  biomedical2016: {
    publisher: "MoEFCC",
    title: "Bio-Medical Waste Management Rules, 2016",
    year: "2016",
    detail: "as amended",
  },
  cnd2025: {
    publisher: "MoEFCC",
    title: "Environment (Construction and Demolition) Waste Management Rules, 2025",
    year: "2025",
    detail: "in force from 1 April 2026",
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

export const sourceLabel = (id: SourceId) => {
  const s: Source = SOURCES[id];
  return `${s.publisher} — ${s.title}${s.detail ? ` (${s.detail})` : ""}`;
};
