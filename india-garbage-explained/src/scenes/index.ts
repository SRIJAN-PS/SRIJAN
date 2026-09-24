import type { SceneId } from "../config/narration";
import { Scene01Hook } from "./Scene01Hook";
import { Scene02WhatIsGarbage } from "./Scene02WhatIsGarbage";
import { Scene03Segregation } from "./Scene03Segregation";
import { Scene04Truck } from "./Scene04Truck";
import { Scene05Landfills } from "./Scene05Landfills";
import { Scene06People } from "./Scene06People";
import { Scene07PlasticEwaste } from "./Scene07PlasticEwaste";
import { Scene08Hierarchy } from "./Scene08Hierarchy";
import { Scene09Journey } from "./Scene09Journey";

export const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  hook: Scene01Hook,
  whatIsGarbage: Scene02WhatIsGarbage,
  segregation: Scene03Segregation,
  truck: Scene04Truck,
  landfills: Scene05Landfills,
  people: Scene06People,
  plasticEwaste: Scene07PlasticEwaste,
  hierarchy: Scene08Hierarchy,
  journey: Scene09Journey,
};
