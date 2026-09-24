import { AbsoluteFill, Series } from "remotion";
import { AudioTracks } from "./components/AudioTracks";
import { Subtitles } from "./components/Subtitles";
import { TimingMarkers } from "./components/TimingMarkers";
import type { SceneId } from "./config/narration";
import { COLOR } from "./config/theme";
import { sceneById, SCENES, TOTAL_FRAMES } from "./config/timing";
import { VIDEO } from "./config/video";
import { SCENE_COMPONENTS } from "./scenes";

// The full documentary: scenes back to back (each fades through black),
// with subtitles, voice-over markers, music and voice-over on top.
export const WasteDocumentary: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.bgDeep }}>
      <Series>
        {SCENES.map((scene) => {
          const Scene = SCENE_COMPONENTS[scene.id];
          return (
            <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames} name={`${scene.number}. ${scene.title}`}>
              <Scene />
            </Series.Sequence>
          );
        })}
      </Series>
      <Subtitles scenes={SCENES} />
      <AudioTracks scenes={SCENES} totalFrames={TOTAL_FRAMES} />
      {VIDEO.showTimingMarkers ? <TimingMarkers scenes={SCENES} totalFrames={TOTAL_FRAMES} /> : null}
    </AbsoluteFill>
  );
};

// A single scene on its own, with its subtitles, markers and audio, so each
// scene can be previewed and rendered independently.
export const SceneStandalone: React.FC<{ sceneId: SceneId }> = ({ sceneId }) => {
  const scene = sceneById(sceneId);
  const Scene = SCENE_COMPONENTS[sceneId];
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.bgDeep }}>
      <Scene />
      <Subtitles scenes={[scene]} relative />
      <AudioTracks scenes={[scene]} totalFrames={scene.durationInFrames} relative />
      {VIDEO.showTimingMarkers ? <TimingMarkers scenes={[scene]} totalFrames={scene.durationInFrames} relative /> : null}
    </AbsoluteFill>
  );
};
