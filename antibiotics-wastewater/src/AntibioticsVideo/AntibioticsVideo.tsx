import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene1Title } from "./scenes/Scene1Title";
import { Scene2Hospital } from "./scenes/Scene2Hospital";
import { Scene3Treatment } from "./scenes/Scene3Treatment";
import { Scene4Resistance } from "./scenes/Scene4Resistance";
import { Scene5Biochar } from "./scenes/Scene5Biochar";
import { Scene6Photocatalysis } from "./scenes/Scene6Photocatalysis";
import { Scene7Hydrogel } from "./scenes/Scene7Hydrogel";

// Scene lengths sum to 1890 frames; six 15-frame crossfades bring the
// total to 1800 frames (60 s at 30 fps).
export const AntibioticsVideo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={180} name="Title">
        <Scene1Title />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence durationInFrames={270} name="Hospital">
        <Scene2Hospital />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence durationInFrames={300} name="Conventional treatment">
        <Scene3Treatment />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence durationInFrames={300} name="Resistance">
        <Scene4Resistance />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence durationInFrames={270} name="Biochar">
        <Scene5Biochar />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence durationInFrames={270} name="Photocatalysis">
        <Scene6Photocatalysis />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence durationInFrames={300} name="Hydrogel">
        <Scene7Hydrogel />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
