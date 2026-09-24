import { Composition, Folder } from "remotion";
import { SCENES, TOTAL_FRAMES } from "./config/timing";
import { VIDEO } from "./config/video";
import { SceneStandalone, WasteDocumentary } from "./WasteDocumentary";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={VIDEO.compositionId}
        component={WasteDocumentary}
        durationInFrames={TOTAL_FRAMES}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
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
};
