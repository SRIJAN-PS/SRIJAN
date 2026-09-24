import type { SceneId } from "../data/story";
import { Accusation } from "./Accusation";
import { BarodaConflict } from "./BarodaConflict";
import { ColdOpen } from "./ColdOpen";
import { Commission } from "./Commission";
import { Defence } from "./Defence";
import { Deposition } from "./Deposition";
import { Ending } from "./Ending";
import { HistoricalAssessment } from "./HistoricalAssessment";
import { Investigation } from "./Investigation";
import { Phayre } from "./Phayre";
import { Poisoning } from "./Poisoning";

export const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  coldOpen: ColdOpen,
  phayre: Phayre,
  barodaConflict: BarodaConflict,
  poisoning: Poisoning,
  investigation: Investigation,
  accusation: Accusation,
  defence: Defence,
  commission: Commission,
  deposition: Deposition,
  assessment: HistoricalAssessment,
  ending: Ending,
};
