import { Sequence, useCurrentFrame } from "remotion";
import { COLOR, FONT, tween } from "../data/theme";
import type { CueTiming, SceneTiming } from "../data/timing";
import { SAFE, VIDEO } from "../data/video";

// Frames a subtitle lingers after its line ends (never into the next line).
const HOLD = 12;

const Line: React.FC<{ text: string; duration: number }> = ({ text, duration }) => {
  const frame = useCurrentFrame();
  const opacity = tween(frame, [0, 6, duration - 6, duration], [0, 1, 1, 0]);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: SAFE.subtitleBottom, display: "flex", justifyContent: "center", opacity }}>
      <div
        style={{
          maxWidth: 1400,
          padding: "10px 28px",
          borderRadius: 6,
          backgroundColor: "rgba(5,4,3,0.72)",
          fontFamily: FONT.sans,
          fontSize: 40,
          fontWeight: 500,
          lineHeight: 1.3,
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

// One named <Sequence> per narration line ("Sub 3.4 · phayreBelieved").
export const Subtitles: React.FC<{ scenes: SceneTiming[]; offset?: number }> = ({ scenes, offset = 0 }) => (
  <>
    {scenes.flatMap((scene) =>
      scene.cues.map((cue: CueTiming, i) => {
        const next = scene.cues[i + 1];
        const room = next ? next.from - (cue.from + cue.duration) : HOLD;
        const duration = cue.duration + Math.max(0, Math.min(HOLD, room));
        return (
          <Sequence key={`${scene.id}-${cue.id}`} name={`Sub ${scene.number}.${i + 1} · ${cue.id}`} from={cue.globalFrom - offset} durationInFrames={duration} layout="none">
            {VIDEO.showSubtitles ? <Line text={cue.text} duration={duration} /> : null}
          </Sequence>
        );
      }),
    )}
  </>
);
