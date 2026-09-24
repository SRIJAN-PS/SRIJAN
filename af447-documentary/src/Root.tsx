import { Composition, Folder } from "remotion";
import { SCENES, TOTAL_FRAMES } from "./data/timing";
import { VIDEO } from "./data/video";
import { AF447Documentary, SceneStandalone } from "./Video";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id={VIDEO.id} component={AF447Documentary} durationInFrames={TOTAL_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Folder name="Scenes">
      {SCENES.map((scene) => (
        <Composition
          key={scene.id}
          id={`Scene${String(scene.number).padStart(2, "0")}-${scene.id}`}
          component={SceneStandalone}
          defaultProps={{ sceneId: scene.id }}
          durationInFrames={scene.durationInFrames}
          fps={VIDEO.fps}
          width={VIDEO.width}
          height={VIDEO.height}
        />
      ))}
    </Folder>
  </>
);
