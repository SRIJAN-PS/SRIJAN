import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Sequence, staticFile } from "remotion";
import { Scene1Title } from "./scenes/Scene1Title";
import { Scene2Hospital } from "./scenes/Scene2Hospital";
import { Scene3Treatment } from "./scenes/Scene3Treatment";
import { Scene4Resistance } from "./scenes/Scene4Resistance";
import { Scene5Biochar } from "./scenes/Scene5Biochar";
import { Scene6Photocatalysis } from "./scenes/Scene6Photocatalysis";
import { Scene7Hydrogel } from "./scenes/Scene7Hydrogel";

// Each scene's narration starts 0.3 s in. Scene lengths are sized so every
// clip finishes before the next one begins.
const Narration: React.FC<{ file: string }> = ({ file }) => {
  return (
    <Sequence from={9} name="Voiceover" layout="none">
      <Audio src={staticFile(`voiceover/${file}`)} />
    </Sequence>
  );
};

// Scene lengths sum to 1890 frames; six 15-frame crossfades bring the
// total to 1800 frames (60 s at 30 fps).
export const AntibioticsVideo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={165} name="Title">
        <Scene1Title />
        <Narration file="scene1.mp3" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence durationInFrames={255} name="Hospital">
        <Scene2Hospital />
        <Narration file="scene2.mp3" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence durationInFrames={285} name="Conventional treatment">
        <Scene3Treatment />
        <Narration file="scene3.mp3" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence durationInFrames={300} name="Resistance">
        <Scene4Resistance />
        <Narration file="scene4.mp3" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence durationInFrames={300} name="Biochar">
        <Scene5Biochar />
        <Narration file="scene5.mp3" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence durationInFrames={295} name="Photocatalysis">
        <Scene6Photocatalysis />
        <Narration file="scene6.mp3" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence durationInFrames={290} name="Hydrogel">
        <Scene7Hydrogel />
        <Narration file="scene7.mp3" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
