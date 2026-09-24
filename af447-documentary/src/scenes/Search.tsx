import { useCurrentFrame } from "remotion";
import { A330Top } from "../components/Aircraft";
import { BigCounter } from "../components/Exterior";
import { FlightMap, PLACES } from "../components/FlightMap";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { TitleText } from "../components/TitleText";
import { COLOR, tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { OceanSurface, ROV, Ship, SonarImage, Underwater } from "../illustrations/Ocean";

// Scene 7 — The search: the grid, ships and debris, the descent to 3,900 m,
// months of searching, recorders still missing.
export const Search: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("search");
  const shipsFrom = c.at("debris") - 6;
  const diveFrom = c.at("notSurface") - 6;
  const rovFrom = c.at("months") - 6;
  const depth = tween(frame, [diveFrom + 20, c.end("depth")], [0, 3900], (t) => t * t * (3 - 2 * t));
  return (
    <SceneFrame sceneId="search">
      <Shot from={0} to={shipsFrom} fadeIn={0} tag="illustration">
        <FlightMap
          keys={[{ at: 0, center: PLACES.lastPosition, zoom: 4.5 }]}
          grid={{ at: 10 }}
          searchCircle={{ at: 0, radiusNm: 40 }}
          markers={[{ place: PLACES.lastPosition, label: "SEARCH AREA", at: 10 }]}
        />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <A330Top x={tween(frame, [0, shipsFrom], [300, 1600], (t) => t)} y={300} heading={90} size={0.8} color="#cfd8e3" />
        </svg>
      </Shot>
      <Shot from={shipsFrom} to={diveFrom} tag="reconstruction">
        <OceanSurface frame={frame} mood="dawn" horizon={480} debris={tween(frame, [c.at("debris"), c.at("debris") + 30], [0, 1])} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <Ship x={1450} y={500} scale={0.7} frame={frame} />
          <Ship x={380} y={492} scale={0.45} frame={frame + 30} />
        </svg>
      </Shot>
      <Shot from={diveFrom} to={rovFrom} tag="illustration">
        <Underwater frame={frame} depth={depth / 3900} />
        <BigCounter value={`${Math.round(depth / 10) * 10 >= 3890 ? "3,900" : (Math.round(depth / 10) * 10).toLocaleString("en-US")} m`} label="DEPTH" color={depth > 3800 ? COLOR.amber : COLOR.text} />
      </Shot>
      <Shot from={rovFrom} to={c.duration} tag="reconstruction">
        <Underwater frame={frame} depth={0.95} light={0.4} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <ROV x={tween(frame, [rovFrom, c.duration], [700, 1100])} y={520} scale={0.9} frame={frame} />
        </svg>
        <div style={{ position: "absolute", left: 120, bottom: 300, transform: "scale(0.35)", transformOrigin: "left bottom", opacity: 0.85 }}>
          <SonarImage progress={tween(frame, [rovFrom, c.duration], [0.1, 1])} target={false} />
        </div>
      </Shot>
      <TitleText text="THE BLACK BOXES WERE STILL MISSING" at={c.end("notFound") + 6} size={56} spacing={0.14} top="30%" color={COLOR.amber} />
    </SceneFrame>
  );
};
