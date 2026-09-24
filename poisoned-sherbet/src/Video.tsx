import { AbsoluteFill, Sequence, Series } from "remotion";
import "./fonts";
import { AudioTracks } from "./components/AudioTracks";
import { Subtitles } from "./components/Subtitle";
import type { SceneId } from "./data/story";
import { SCENES, sceneById, TOTAL_FRAMES } from "./data/timing";
import { SCENE_COMPONENTS } from "./scenes";

// The full documentary: eleven scenes in series, with subtitles and the
// voice-over, music and sound-effect tracks laid over the whole film.
export const PoisonedSherbetDocumentary: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Series>
      {SCENES.map((scene) => {
        const Scene = SCENE_COMPONENTS[scene.id];
        return (
          <Series.Sequence key={scene.id} name={`${String(scene.number).padStart(2, "0")} ${scene.title}`} durationInFrames={scene.durationInFrames}>
            <Scene />
          </Series.Sequence>
        );
      })}
    </Series>
    <Sequence name="Subtitles" layout="none">
      <Subtitles scenes={SCENES} />
    </Sequence>
    <Sequence name="Audio" layout="none">
      <AudioTracks scenes={SCENES} totalFrames={TOTAL_FRAMES} />
    </Sequence>
  </AbsoluteFill>
);

// One scene on its own, with its own subtitles and audio (for previews).
export const SceneStandalone: React.FC<{ sceneId: SceneId }> = ({ sceneId }) => {
  const scene = sceneById(sceneId);
  const Scene = SCENE_COMPONENTS[sceneId];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Scene />
      <Subtitles scenes={[scene]} offset={scene.from} />
      <AudioTracks scenes={[scene]} offset={scene.from} totalFrames={scene.durationInFrames} />
    </AbsoluteFill>
  );
};
