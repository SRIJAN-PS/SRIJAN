import { Sequence, useCurrentFrame } from "remotion";
import { COLOR, FONT, tween } from "../config/theme";
import type { CueTiming, SceneTiming } from "../config/timing";
import { SAFE, VIDEO } from "../config/video";

// Frames a subtitle lingers after its line ends (never into the next line).
const HOLD = 10;

const SubtitleLine: React.FC<{ text: string; duration: number }> = ({ text, duration }) => {
  const frame = useCurrentFrame();
  const opacity = tween(frame, [0, 5, duration - 5, duration], [0, 1, 1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: SAFE.subtitleBottom,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          padding: "12px 30px",
          borderRadius: 12,
          backgroundColor: "rgba(4, 7, 10, 0.8)",
          fontFamily: FONT.sans,
          fontSize: 42,
          fontWeight: 500,
          lineHeight: 1.32,
          color: COLOR.text,
          textAlign: "center",
          textWrap: "balance",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// One named <Sequence> per narration line ("Sub 3.9 · rule2016"), carrying
// the burned-in subtitle. The matching voice-over slots live in AudioTracks.
export const Subtitles: React.FC<{ scenes: SceneTiming[]; relative?: boolean }> = ({ scenes, relative }) => {
  return (
    <>
      {scenes.flatMap((scene) =>
        scene.cues.map((cue: CueTiming, i) => {
          const next = scene.cues[i + 1];
          const room = next ? next.from - (cue.from + cue.duration) : HOLD;
          const duration = cue.duration + Math.max(0, Math.min(HOLD, room));
          const show = VIDEO.showSubtitles && !cue.onScreen;
          return (
            <Sequence
              key={`${scene.id}-${cue.id}`}
              name={`Sub ${scene.number}.${i + 1} · ${cue.id}`}
              from={relative ? cue.from : cue.globalFrom}
              durationInFrames={duration}
              layout="none"
            >
              {show ? <SubtitleLine text={cue.text} duration={duration} /> : null}
            </Sequence>
          );
        }),
      )}
    </>
  );
};
