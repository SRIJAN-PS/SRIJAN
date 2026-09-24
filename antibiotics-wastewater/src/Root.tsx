import { Composition, Folder } from "remotion";
import { AntibioticsVideo } from "./AntibioticsVideo/AntibioticsVideo";
import { Scene1Title } from "./AntibioticsVideo/scenes/Scene1Title";
import { Scene2Hospital } from "./AntibioticsVideo/scenes/Scene2Hospital";
import { Scene3Treatment } from "./AntibioticsVideo/scenes/Scene3Treatment";
import { Scene4Resistance } from "./AntibioticsVideo/scenes/Scene4Resistance";
import { Scene5Biochar } from "./AntibioticsVideo/scenes/Scene5Biochar";
import { Scene6Photocatalysis } from "./AntibioticsVideo/scenes/Scene6Photocatalysis";
import { Scene7Hydrogel } from "./AntibioticsVideo/scenes/Scene7Hydrogel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AntibioticsInWastewater"
        component={AntibioticsVideo}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Scenes">
        <Composition id="Scene1-Title" component={Scene1Title} durationInFrames={165} fps={30} width={1920} height={1080} />
        <Composition id="Scene2-Hospital" component={Scene2Hospital} durationInFrames={255} fps={30} width={1920} height={1080} />
        <Composition id="Scene3-Treatment" component={Scene3Treatment} durationInFrames={285} fps={30} width={1920} height={1080} />
        <Composition id="Scene4-Resistance" component={Scene4Resistance} durationInFrames={300} fps={30} width={1920} height={1080} />
        <Composition id="Scene5-Biochar" component={Scene5Biochar} durationInFrames={300} fps={30} width={1920} height={1080} />
        <Composition id="Scene6-Photocatalysis" component={Scene6Photocatalysis} durationInFrames={295} fps={30} width={1920} height={1080} />
        <Composition id="Scene7-Hydrogel" component={Scene7Hydrogel} durationInFrames={290} fps={30} width={1920} height={1080} />
      </Folder>
    </>
  );
};
