import type { SceneId } from "../data/af447";
import { BlackBox } from "./BlackBox";
import { Climb } from "./Climb";
import { Disappearance } from "./Disappearance";
import { Ending } from "./Ending";
import { Investigation } from "./Investigation";
import { Lessons } from "./Lessons";
import { NormalFlight } from "./NormalFlight";
import { Opening } from "./Opening";
import { PitotProblem } from "./PitotProblem";
import { RealMystery } from "./RealMystery";
import { Search } from "./Search";
import { Stall } from "./Stall";

export const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  opening: Opening,
  normalFlight: NormalFlight,
  pitotProblem: PitotProblem,
  climb: Climb,
  stall: Stall,
  disappearance: Disappearance,
  search: Search,
  twoYears: BlackBox,
  blackBox: Investigation,
  realMystery: RealMystery,
  lessons: Lessons,
  ending: Ending,
};
