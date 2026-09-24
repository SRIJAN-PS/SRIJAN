import type { SourceId } from "./sources.ts";

// The complete narration script. Every subtitle, voice-over marker and
// scene length is derived from this file (see timing.ts), and scenes key
// their animations to cue ids, so editing text here re-times the video.
//
// kind: tells the viewer what sort of statement is on screen.
//   fact        — a sourced statement; `sources` is required and shown on screen
//   explanation — how something works, in general terms
//   solution    — a possible improvement, not a claim about current practice

export type CueKind = "fact" | "explanation" | "solution";

export type Cue = {
  id: string;
  text: string;
  kind: CueKind;
  sources?: SourceId[];
  // Extra silence before this cue, in seconds.
  pauseBefore?: number;
  // Measured length of the recorded line, in seconds. Leave unset to use the
  // words-per-second estimate in timing.ts; set it once real voice-over exists.
  seconds?: number;
  // The line is already shown as on-screen typography, so skip the subtitle.
  onScreen?: boolean;
};

export type SceneScript = {
  id: SceneId;
  number: number;
  title: string;
  // Seconds of picture before the first line (covers the dark-to-light reveal).
  leadIn: number;
  // Seconds of picture after the last line.
  tail: number;
  cues: Cue[];
};

export type SceneId =
  | "hook"
  | "whatIsGarbage"
  | "segregation"
  | "truck"
  | "landfills"
  | "people"
  | "plasticEwaste"
  | "hierarchy"
  | "journey";

export const SCRIPT: SceneScript[] = [
  {
    id: "hook",
    number: 1,
    title: "The hook",
    leadIn: 1.5,
    tail: 5,
    cues: [
      { id: "throw", kind: "explanation", text: "You throw something into a dustbin." },
      { id: "truck", kind: "explanation", text: "A few minutes later, a garbage truck takes it away." },
      { id: "forget", kind: "explanation", text: "And then… you stop thinking about it.", pauseBefore: 0.4 },
      { id: "where", kind: "explanation", text: "But where does it actually go?", pauseBefore: 0.8 },
      {
        id: "scale",
        kind: "fact",
        sources: ["cpcbAnnual2122"],
        text: "For millions of tonnes of waste generated every year,",
        pauseBefore: 0.4,
      },
      { id: "bigger", kind: "explanation", text: "that question is much bigger than a garbage truck." },
    ],
  },
  {
    id: "whatIsGarbage",
    number: 2,
    title: "What is garbage?",
    leadIn: 1.5,
    tail: 1.5,
    cues: [
      { id: "notOne", kind: "explanation", text: "What we call “garbage” isn't one material. It's a mix of very different things." },
      {
        id: "items",
        kind: "explanation",
        text: "Food waste. Plastic. Paper. Glass. Metal. Sanitary waste. And sometimes, electronic waste.",
      },
      { id: "behave", kind: "explanation", text: "Food waste rots quickly. Glass and metal can often be recycled." },
      { id: "care", kind: "explanation", text: "Sanitary and electronic waste need careful handling, for hygiene and safety." },
      { id: "streams", kind: "explanation", text: "So different materials need different ways of being managed." },
    ],
  },
  {
    id: "segregation",
    number: 3,
    title: "The segregation problem",
    leadIn: 1.5,
    tail: 1.5,
    cues: [
      { id: "oneBin", kind: "explanation", text: "Now imagine it all goes into one bin." },
      { id: "mixed", kind: "explanation", text: "Food, plastic, paper and batteries, mixed together." },
      {
        id: "contaminate",
        kind: "explanation",
        text: "Wet food soils paper and plastic, and batteries can add hazardous substances to the mix.",
      },
      { id: "hardRecover", kind: "explanation", text: "Once contaminated, materials become much harder to recover." },
      { id: "separate", kind: "explanation", text: "Kept separate, each stream has a clearer path.", pauseBefore: 0.6 },
      { id: "wet", kind: "explanation", text: "Wet waste can be composted or processed biologically." },
      { id: "dry", kind: "explanation", text: "Dry waste can go for material recovery and recycling." },
      { id: "hazardous", kind: "explanation", text: "Domestic hazardous waste needs specialised management." },
      {
        id: "rule2016",
        kind: "fact",
        sources: ["swm2016"],
        text: "India's Solid Waste Management Rules, 2016 required waste generators to segregate their waste",
        pauseBefore: 0.4,
      },
      {
        id: "handover",
        kind: "fact",
        sources: ["swm2016"],
        text: "and hand it over to authorised waste pickers or waste collectors.",
      },
      {
        id: "rule2026",
        kind: "fact",
        sources: ["swm2026"],
        text: "The updated Solid Waste Management Rules, 2026 extend this to four streams:",
      },
      { id: "fourStreams", kind: "fact", sources: ["swm2026"], text: "wet, dry, sanitary, and special-care waste." },
    ],
  },
  {
    id: "truck",
    number: 4,
    title: "Where the truck takes it",
    leadIn: 1.5,
    tail: 2,
    cues: [
      { id: "notDisappear", kind: "explanation", text: "A garbage truck doesn't make waste disappear." },
      { id: "moves", kind: "explanation", text: "It moves the waste from one location to another." },
      { id: "question", kind: "explanation", text: "The important question is what happens after collection." },
      {
        id: "route",
        kind: "explanation",
        text: "From homes, waste is collected and transported to facilities where it can be sorted and processed.",
        pauseBefore: 0.4,
      },
      {
        id: "recover",
        kind: "explanation",
        text: "There, materials can be recycled, wet waste composted, and some waste used to recover energy.",
      },
      { id: "residual", kind: "explanation", text: "What remains, the residual waste, goes for disposal." },
      {
        id: "gap",
        kind: "fact",
        sources: ["cpcbAnnual2122"],
        text: "CPCB's figures for 2021–22 show that not everything collected is treated:",
        pauseBefore: 0.4,
      },
      {
        id: "shares",
        kind: "fact",
        sources: ["cpcbAnnual2122"],
        text: "about 92% of generated waste was collected, and about 54% was treated or processed.",
      },
    ],
  },
  {
    id: "landfills",
    number: 5,
    title: "Landfills and dumpsites",
    leadIn: 1.5,
    tail: 1.5,
    cues: [
      {
        id: "intro",
        kind: "explanation",
        text: "Residual waste usually ends up in a landfill, or, where proper facilities are missing, an open dumpsite.",
      },
      {
        id: "rain",
        kind: "explanation",
        text: "When rainwater passes through waste, it can pick up dissolved and suspended contaminants.",
        pauseBefore: 0.4,
      },
      { id: "leachate", kind: "explanation", text: "This contaminated liquid is called leachate." },
      {
        id: "liner",
        kind: "explanation",
        text: "Engineered landfills use liners and drains to collect leachate for treatment. Open dumpsites lack these safeguards.",
      },
      {
        id: "organic",
        kind: "explanation",
        text: "Organic waste, like food scraps, also decomposes inside the pile, where oxygen is limited.",
        pauseBefore: 0.5,
      },
      {
        id: "gas",
        kind: "explanation",
        text: "This anaerobic decomposition produces landfill gas, mainly methane and carbon dioxide.",
      },
      { id: "methane", kind: "explanation", text: "Methane is a potent greenhouse gas, and it is flammable." },
      {
        id: "rule",
        kind: "fact",
        sources: ["swm2026"],
        text: "Under the 2026 Rules, landfills are restricted to waste that can't be recycled or used for energy, and inert material.",
        pauseBefore: 0.4,
      },
    ],
  },
  {
    id: "people",
    number: 6,
    title: "The people behind recycling",
    leadIn: 1.5,
    tail: 1.5,
    cues: [
      { id: "hands", kind: "explanation", text: "Much of what does get recycled passes through many hands." },
      {
        id: "pickers",
        kind: "explanation",
        text: "After collection, waste pickers sort through waste to recover materials that still have value.",
      },
      {
        id: "sold",
        kind: "explanation",
        text: "Plastic, paper, metal and glass are sold, directly or through intermediaries, to recyclers.",
      },
      { id: "products", kind: "explanation", text: "Recyclers process them into raw material for new products." },
      {
        id: "recognised",
        kind: "fact",
        sources: ["swm2016"],
        text: "The Solid Waste Management Rules, 2016 recognised waste pickers as people who collect and recover reusable and recyclable waste for their livelihood.",
        pauseBefore: 0.4,
      },
      {
        id: "integrate",
        kind: "fact",
        sources: ["swm2026"],
        text: "The 2026 Rules call for integrating waste pickers and kabadiwalas into the formal system.",
      },
    ],
  },
  {
    id: "plasticEwaste",
    number: 7,
    title: "Plastic and e-waste",
    leadIn: 1.5,
    tail: 2,
    cues: [
      { id: "notSame", kind: "explanation", text: "Not all waste follows the same path." },
      {
        id: "bottle",
        kind: "explanation",
        text: "A plastic bottle, if collected separately and kept clean, can be sorted by type and sent for recycling or recovery.",
      },
      {
        id: "phone",
        kind: "explanation",
        text: "An old mobile phone is e-waste. It should go through an authorised channel, so its materials can be recovered safely.",
      },
      {
        id: "frameworks",
        kind: "fact",
        sources: ["wasteRules"],
        text: "That's why India has separate rules for plastic waste, e-waste, batteries, biomedical waste, and construction and demolition waste.",
        pauseBefore: 0.4,
      },
      { id: "own", kind: "fact", sources: ["wasteRules"], text: "Each has its own framework, responsibilities and pathways." },
    ],
  },
  {
    id: "hierarchy",
    number: 8,
    title: "What better waste management looks like",
    leadIn: 1.5,
    tail: 2,
    cues: [
      { id: "better", kind: "solution", text: "So what does better waste management look like?" },
      { id: "hierarchy", kind: "solution", text: "Many waste-management frameworks follow a hierarchy of preferred options." },
      { id: "prevent", kind: "solution", text: "Best of all: prevent waste from being created." },
      { id: "reduce", kind: "solution", text: "Then reduce what we use, and reuse what we can." },
      { id: "recycle", kind: "solution", text: "Next, recycle materials, then recover energy or value from what's left." },
      { id: "dispose", kind: "solution", text: "Disposal comes last, for the residue nothing else can handle." },
      { id: "preferred", kind: "solution", text: "Prevention and reduction are preferred over disposal." },
    ],
  },
  {
    id: "journey",
    number: 9,
    title: "The complete journey",
    leadIn: 1.5,
    tail: 8.5,
    cues: [
      { id: "back", kind: "explanation", text: "Let's go back to that plastic bottle." },
      {
        id: "works",
        kind: "solution",
        text: "In a system that works, it's segregated at home, collected, sorted and recovered,",
      },
      { id: "processed", kind: "solution", text: "then recycled or processed. Only the residue goes for disposal." },
      {
        id: "disappear",
        kind: "explanation",
        text: "Waste doesn't disappear when we throw it away.",
        pauseBefore: 1,
        onScreen: true,
      },
      { id: "sight", kind: "explanation", text: "It only leaves our sight.", onScreen: true },
      {
        id: "measure",
        kind: "explanation",
        text: "The real measure of a waste-management system isn't how quickly garbage disappears from our streets.",
        pauseBefore: 0.6,
        onScreen: true,
      },
      { id: "letGo", kind: "explanation", text: "It's what happens to that waste after we let go of it.", onScreen: true },
    ],
  },
];
