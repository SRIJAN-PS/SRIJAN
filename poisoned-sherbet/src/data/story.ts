import type { SourceId } from "./sources.ts";

// The whole film as data: every narration line, what kind of claim it makes,
// its sources, and the pauses around it. Scene lengths, subtitles, voice-over
// slots and animation timing are all derived from this file (see timing.ts).
//
// HISTORICAL RULE: the poisoning is an allegation. No line states that
// Malhar Rao ordered it. Lines about the case against him are marked
// "allegation" and attributed to the prosecution or the evidence presented.

export type ClaimKind =
  // Documented in the trial record or official correspondence.
  | "record"
  // What Colonel Phayre reported happened to him.
  | "account"
  // The prosecution's case, as argued at the 1875 inquiry.
  | "allegation"
  // General background on how the system worked.
  | "context"
  // Interpretation or open question; not a finding of the record.
  | "interpretation";

export const CLAIM_LABEL: Record<ClaimKind, string> = {
  record: "HISTORICAL RECORD",
  account: "PHAYRE'S ACCOUNT",
  allegation: "ALLEGATION · AS ARGUED AT THE INQUIRY",
  context: "CONTEXT",
  interpretation: "INTERPRETATION",
};

export type Cue = {
  id: string;
  // Subtitle text, exactly as shown.
  text: string;
  // What the narrator says, when it differs (numbers, pronunciation).
  say?: string;
  kind: ClaimKind;
  sources?: SourceId[];
  // Seconds of silence before / after the line (dramatic pauses).
  pauseBefore?: number;
  pauseAfter?: number;
  // Fixed length in seconds; overrides the recording and the estimate.
  seconds?: number;
};

export type SceneId =
  | "coldOpen"
  | "phayre"
  | "barodaConflict"
  | "poisoning"
  | "investigation"
  | "accusation"
  | "defence"
  | "commission"
  | "deposition"
  | "assessment"
  | "ending";

export type Scene = {
  id: SceneId;
  number: number;
  title: string;
  // Seconds of picture before the first line and after the last.
  leadIn: number;
  tail: number;
  cues: Cue[];
};

// Pronunciation helpers for the narrator.
const PHAYRE = "Fair";
const GAEKWAD = "Gaikwad";

export const STORY: Scene[] = [
  {
    id: "coldOpen",
    number: 1,
    title: "Cold open",
    leadIn: 4,
    tail: 6,
    cues: [
      { id: "date", text: "Baroda. November the 9th, 1874.", say: "Baroda. November the ninth, eighteen seventy-four.", kind: "record", sources: ["trial"] },
      { id: "officer", text: "A British officer returns from his morning routine and sits down to work.", kind: "account", sources: ["trial"], pauseBefore: 0.6 },
      { id: "glass", text: "As usual, a glass of sherbet has been prepared for him.", kind: "account", sources: ["trial"] },
      { id: "sips", text: "He takes a few sips.", kind: "account", sources: ["trial"], pauseBefore: 0.4 },
      { id: "wrong", text: "Then something feels wrong.", kind: "account", sources: ["trial"], pauseBefore: 1.2 },
      { id: "throws", text: "He throws the drink away.", kind: "account", sources: ["trial"] },
      { id: "notices", text: "But before the glass leaves his hand, he notices something unusual at the bottom.", kind: "account", sources: ["trial"] },
      { id: "sediment", text: "A dark sediment.", kind: "account", sources: ["trial"], pauseBefore: 1.0, pauseAfter: 0.6 },
      { id: "suspects", text: "He suspects poison.", kind: "account", sources: ["trial"], pauseAfter: 2 },
      { id: "accusation", text: "Soon, an accusation begins to take shape.", kind: "record", sources: ["trial"] },
      { id: "centre", text: "And eventually, one of the most powerful men in Baroda will be placed at the centre of the investigation:", kind: "record", sources: ["trial"] },
      { id: "name", text: "Maharaja Malhar Rao Gaekwad.", say: `Maharaja Malhar Rao ${GAEKWAD}.`, kind: "record", sources: ["trial"], pauseBefore: 0.8, pauseAfter: 2 },
    ],
  },
  {
    id: "phayre",
    number: 2,
    title: "Who was Colonel Phayre?",
    leadIn: 2.5,
    tail: 2.5,
    cues: [
      { id: "resident", text: "Robert Phayre was the British Resident at Baroda.", say: `Robert ${PHAYRE} was the British Resident at Baroda.`, kind: "record", sources: ["ior"] },
      { id: "notDiplomat", text: "The Resident was not simply a diplomat.", kind: "context", pauseBefore: 0.5 },
      { id: "role", text: "In the princely states of British India, a Resident represented British political authority and kept in close contact with the ruler.", kind: "context" },
      { id: "complicated", text: "That relationship could become complicated.", kind: "context", pauseBefore: 0.5 },
      { id: "gaekwad", text: "Baroda was a princely state ruled by the Gaekwad dynasty.", say: `Baroda was a princely state, ruled by the ${GAEKWAD} dynasty.`, kind: "record", sources: ["ior"], pauseBefore: 0.8 },
      { id: "strained", text: "And by 1874, relations between Phayre and Maharaja Malhar Rao had become deeply strained.", say: `And by eighteen seventy-four, relations between ${PHAYRE} and Maharaja Malhar Rao had become deeply strained.`, kind: "record", sources: ["ior"] },
      { id: "notStory", text: "This was not a story that began with a mysterious glass of sherbet.", kind: "interpretation", pauseBefore: 1.2 },
      { id: "building", text: "The political conflict had already been building.", kind: "record", sources: ["ior"], pauseAfter: 1 },
    ],
  },
  {
    id: "barodaConflict",
    number: 3,
    title: "A state under pressure",
    leadIn: 2,
    tail: 2,
    cues: [
      { id: "concerns", text: "Before the poisoning incident, British authorities had already raised serious concerns about the administration of Baroda.", kind: "record", sources: ["ior"] },
      { id: "inquiry", text: "An earlier inquiry, in 1873, had examined allegations of maladministration.", say: "An earlier inquiry, in eighteen seventy-three, had examined allegations of maladministration.", kind: "record", sources: ["ior"] },
      { id: "deteriorated", text: "The relationship between the Maharaja and the British Resident deteriorated further.", kind: "record", sources: ["ior"], pauseBefore: 0.6 },
      { id: "phayreBelieved", text: "Phayre believed that the ruler was responsible for serious problems within the state.", say: `${PHAYRE} believed that the ruler was responsible for serious problems within the state.`, kind: "record", sources: ["ior"] },
      { id: "grievances", text: "Malhar Rao, meanwhile, had his own grievances against Phayre, and had sought his removal.", say: `Malhar Rao, meanwhile, had his own grievances against ${PHAYRE}, and had sought his removal.`, kind: "record", sources: ["ior"] },
      { id: "hostile", text: "By late 1874, the political relationship had become deeply hostile.", say: "By late eighteen seventy-four, the political relationship had become deeply hostile.", kind: "record", sources: ["ior"], pauseBefore: 1 },
      { id: "then", text: "Then came the sherbet.", kind: "record", sources: ["trial"], pauseBefore: 1.4, pauseAfter: 2.5 },
    ],
  },
  {
    id: "poisoning",
    number: 4,
    title: "The morning of 9 November",
    leadIn: 3,
    tail: 1.5,
    cues: [
      { id: "morning", text: "On the morning of November the 9th, Phayre returned from his morning walk.", say: `On the morning of November the ninth, ${PHAYRE} returned from his morning walk.`, kind: "account", sources: ["trial"] },
      { id: "ready", text: "A glass of pummelo sherbet was ready for him.", say: "A glass of pomelo sherbet was ready for him.", kind: "account", sources: ["trial"] },
      { id: "drank", text: "He drank.", kind: "account", sources: ["trial"], pauseBefore: 0.6, pauseAfter: 0.6 },
      { id: "nausea", text: "Soon afterwards, he experienced nausea and an unusual sensation.", kind: "account", sources: ["trial"] },
      { id: "discarded", text: "He discarded the remaining drink.", kind: "account", sources: ["trial"] },
      { id: "noticed", text: "Then he noticed a dark substance at the bottom of the glass.", kind: "account", sources: ["trial"], pauseAfter: 1.5 },
      { id: "examined", text: "The substance was sent for examination.", kind: "record", sources: ["trial"] },
      { id: "found", text: "The analysis reported the presence of arsenic and diamond dust.", kind: "record", sources: ["trial", "dnb"], pauseAfter: 2.5 },
      { id: "reported", text: "Phayre reported to his government that he believed an attempt had been made to poison him.", say: `${PHAYRE} reported to his government that he believed an attempt had been made to poison him.`, kind: "record", sources: ["ior"], pauseAfter: 1.5 },
    ],
  },
  {
    id: "investigation",
    number: 5,
    title: "The strange part",
    leadIn: 2,
    tail: 2,
    cues: [
      { id: "difficult", text: "But now came the difficult question.", kind: "interpretation" },
      { id: "who", text: "Who put the substance into the sherbet?", kind: "interpretation", pauseBefore: 0.6, pauseAfter: 1.8 },
      { id: "access", text: "The investigation focused on people who had access to Phayre's office, and to the preparation of his drink.", say: `The investigation focused on people who had access to ${PHAYRE}'s office, and to the preparation of his drink.`, kind: "record", sources: ["trial"] },
      { id: "questioned", text: "Witnesses were questioned. Statements were collected.", kind: "record", sources: ["trial"] },
      { id: "connection", text: "And investigators began looking for a connection between the Residency and the Gaekwad's palace.", say: `And investigators began looking for a connection between the Residency and the ${GAEKWAD}'s palace.`, kind: "record", sources: ["trial"] },
      { id: "pelly", text: "At the end of November, a special commissioner, Sir Lewis Pelly, arrived in Baroda, replacing Phayre as the British representative.", say: `At the end of November, a special commissioner, Sir Lewis Pelly, arrived in Baroda, replacing ${PHAYRE} as the British representative.`, kind: "record", sources: ["dnb"], pauseBefore: 1 },
      { id: "testimony", text: "Eventually, testimony from individuals connected with the Residency became central to the prosecution's case.", kind: "allegation", sources: ["trial"] },
      { id: "arrest", text: "In January 1875, on the orders of the Government of India, the Maharaja himself was arrested.", say: "In January eighteen seventy-five, on the orders of the Government of India, the Maharaja himself was arrested.", kind: "record", sources: ["dnb"], pauseBefore: 1, pauseAfter: 2.5 },
    ],
  },
  {
    id: "accusation",
    number: 6,
    title: "The case against the Maharaja",
    leadIn: 2.5,
    tail: 2,
    cues: [
      { id: "notSimply", text: "The prosecution's argument was not simply that poison had appeared in the sherbet.", kind: "allegation", sources: ["trial"] },
      { id: "connect", text: "It sought to connect the attempted poisoning to the Maharaja himself.", kind: "allegation", sources: ["trial"] },
      { id: "household", text: "According to the evidence presented at the inquiry, individuals associated with the Gaekwad's household were alleged to have taken part in the plot.", say: `According to the evidence presented at the inquiry, individuals associated with the ${GAEKWAD}'s household were alleged to have taken part in the plot.`, kind: "allegation", sources: ["trial"], pauseBefore: 0.6 },
      { id: "moreThanOnce", text: "One line of testimony described attempts to place poison in Phayre's drink on more than one occasion.", say: `One line of testimony described attempts to place poison in ${PHAYRE}'s drink on more than one occasion.`, kind: "allegation", sources: ["trial"] },
      { id: "other", text: "Other evidence was presented concerning communications, servants, and people connected to the palace.", kind: "allegation", sources: ["trial"] },
      { id: "certainty", text: "But evidence is not the same thing as certainty.", kind: "interpretation", pauseBefore: 1.6, pauseAfter: 1 },
      { id: "attacked", text: "And the defence attacked the reliability of the testimony.", kind: "record", sources: ["trial"], pauseAfter: 1.5 },
    ],
  },
  {
    id: "defence",
    number: 7,
    title: "The Maharaja's defence",
    leadIn: 2.5,
    tail: 2,
    cues: [
      { id: "assembled", text: "In February 1875, a special commission assembled at Baroda to hear the case.", say: "In February eighteen seventy-five, a special commission assembled at Baroda to hear the case.", kind: "record", sources: ["dnb", "trial"] },
      { id: "british", text: "Three of its members were senior British officials: Sir Richard Couch, Sir Richard Meade and Philip Melvill.", kind: "record", sources: ["dnb", "trial"] },
      { id: "indian", text: "Three were Indian: the Maharaja Scindia of Gwalior, the Maharaja of Jaipur, and Sir Dinkar Rao.", kind: "record", sources: ["dnb", "trial"] },
      { id: "denied", text: "Malhar Rao denied responsibility.", kind: "record", sources: ["trial"], pauseBefore: 1.2, pauseAfter: 0.5 },
      { id: "ballantine", text: "His defence, led by the English barrister Serjeant William Ballantine, challenged the credibility of the witnesses and the interpretation placed on their statements.", say: "His defence, led by the English barrister Sergeant William Ballantine, challenged the credibility of the witnesses, and the interpretation placed on their statements.", kind: "record", sources: ["dnb", "trial"] },
      { id: "moreThan", text: "The case therefore became more than a question of whether poison had been found.", kind: "interpretation", pauseBefore: 0.8 },
      { id: "instigated", text: "It became a question of whether the evidence could establish that the Maharaja had actually instigated the attempt.", kind: "interpretation", pauseAfter: 1.5 },
      { id: "press", text: "The proceedings were followed closely, in India and far beyond.", kind: "record", sources: ["press"] },
      { id: "crossExam", text: "The trial record contains extensive cross-examination and conflicting evidence.", kind: "record", sources: ["trial", "bhc"] },
      { id: "remarkable", text: "And eventually, the inquiry reached a remarkable conclusion.", kind: "record", sources: ["trial"], pauseBefore: 0.8, pauseAfter: 2 },
    ],
  },
  {
    id: "commission",
    number: 8,
    title: "The 3–3 division",
    leadIn: 3,
    tail: 2.5,
    cues: [
      { id: "divided", text: "The commission was divided.", kind: "record", sources: ["trial", "dnb"], pauseAfter: 1.8 },
      { id: "proved", text: "Three British members considered the charge proved.", kind: "record", sources: ["trial", "dnb"], pauseAfter: 0.8 },
      { id: "notProved", text: "Three Indian members did not consider the evidence sufficient to establish the charge.", kind: "record", sources: ["trial", "dnb"], pauseAfter: 2.5 },
      { id: "noUnanimous", text: "There was no unanimous finding.", kind: "record", sources: ["trial", "dnb"], pauseAfter: 3 },
      { id: "fascinating", text: "The disagreement is one reason this case remains historically fascinating.", kind: "interpretation" },
      { id: "wasPoison", text: "The question was no longer simply: was there poison?", kind: "interpretation", pauseBefore: 0.6, pauseAfter: 1.2 },
      { id: "prove", text: "The larger question was: what did the evidence actually prove about the Maharaja's responsibility?", kind: "interpretation", pauseAfter: 2.5 },
    ],
  },
  {
    id: "deposition",
    number: 9,
    title: "The fate of the Maharaja",
    leadIn: 2.5,
    tail: 3,
    cues: [
      { id: "despite", text: "Despite the divided commission, the crisis did not end with the disagreement.", kind: "record", sources: ["ior"] },
      { id: "control", text: "The British government moved to take control of the administration of Baroda.", kind: "record", sources: ["ior"] },
      { id: "deposed", text: "In April 1875, Malhar Rao was deposed.", say: "In April eighteen seventy-five, Malhar Rao was deposed.", kind: "record", sources: ["ior", "dnb"], pauseBefore: 0.8, pauseAfter: 2 },
      { id: "notPoisoning", text: "Importantly, the government did not rest that decision on the poisoning charge.", kind: "record", sources: ["ior", "dnb"] },
      { id: "grounds", text: "It pointed instead to misconduct, misgovernment of the state, and his unfitness to rule.", kind: "record", sources: ["ior", "dnb"] },
      { id: "separate", text: "The poisoning allegation and the judgement on his administration were separate matters.", kind: "context", pauseBefore: 0.6, pauseAfter: 1.2 },
      { id: "exile", text: "He was removed from power and sent into exile in Madras, where he died in 1882.", say: "He was removed from power, and sent into exile in Madras, where he died in eighteen eighty-two.", kind: "record", sources: ["ior"], pauseAfter: 1.2 },
      { id: "larger", text: "The poisoning case had become part of a much larger political confrontation over the administration and future of Baroda.", kind: "interpretation", pauseAfter: 2 },
    ],
  },
  {
    id: "assessment",
    number: 10,
    title: "What really happened?",
    leadIn: 2.5,
    tail: 2,
    cues: [
      { id: "what", text: "So what really happened on that November morning?", kind: "interpretation", pauseAfter: 1.5 },
      { id: "confidence", text: "We can establish some things with confidence.", kind: "record" },
      { id: "reported", text: "Colonel Phayre reported that he found suspicious material in his sherbet.", say: `Colonel ${PHAYRE} reported that he found suspicious material in his sherbet.`, kind: "record", sources: ["trial"] },
      { id: "followed", text: "An investigation followed. Evidence and testimony were presented.", kind: "record", sources: ["trial"] },
      { id: "accused", text: "The Maharaja was accused.", kind: "record", sources: ["trial"] },
      { id: "divided", text: "The commission was divided.", kind: "record", sources: ["trial", "dnb"] },
      { id: "deposed", text: "And Malhar Rao was deposed.", kind: "record", sources: ["ior"], pauseAfter: 1 },
      { id: "uncontested", text: "But the historical record does not give us a simple, uncontested answer to every question surrounding the alleged plot.", kind: "interpretation", pauseBefore: 1.5, pauseAfter: 1.5 },
      { id: "matters", text: "That distinction matters.", kind: "interpretation", pauseBefore: 2.5 },
      { id: "separate", text: "A historical documentary should separate what the records establish from what later historians interpret.", kind: "interpretation", pauseAfter: 1.2 },
      { id: "readings", text: "Three broad readings remain possible, and they are not mutually exclusive.", kind: "interpretation", pauseBefore: 0.6, pauseAfter: 3.2 },
    ],
  },
  {
    id: "ending",
    number: 11,
    title: "The final question",
    leadIn: 2.5,
    tail: 22,
    cues: [
      { id: "oneGlass", text: "One glass of sherbet brought together a Maharaja, a British Resident, palace servants, investigators, and an empire.", kind: "interpretation" },
      { id: "struggle", text: "But behind the poisoning allegation was a much larger struggle.", kind: "interpretation", pauseBefore: 1 },
      { id: "power", text: "Who held power in a princely state?", kind: "interpretation", pauseBefore: 0.8 },
      { id: "intervene", text: "And how far could the British intervene in the affairs of an Indian ruler?", kind: "interpretation", pauseBefore: 0.6 },
    ],
  },
];
