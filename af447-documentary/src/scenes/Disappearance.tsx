import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RadarScope } from "../components/Exterior";
import { FlightMap, PLACES } from "../components/FlightMap";
import { LowerThird } from "../components/LowerThird";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { tween } from "../data/theme";
import { cuesOf } from "../data/timing";
import { OceanSurface, Underwater } from "../illustrations/Ocean";

// Scene 6 — The aircraft vanishes: the empty ocean, the last contact, the
// radar, the search area, the recorders somewhere below.
export const Disappearance: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("disappearance");
  const radarFrom = c.at("lastContact") - 6;
  const mapFrom = c.at("searchBegins") - 6;
  const deepFrom = c.at("important") - 6;
  return (
    <SceneFrame sceneId="disappearance">
      <Shot from={0} to={radarFrom} fadeIn={0} tag="illustration">
        <OceanSurface frame={frame} mood="night" horizon={420} />
      </Shot>
      <Shot from={radarFrom} to={mapFrom} tag="illustration">
        <AbsoluteFill style={{ backgroundColor: "#010603", alignItems: "center", justifyContent: "center" }}>
          <RadarScope frame={frame} lostAt={c.at("ended") + 20} size={780} />
        </AbsoluteFill>
      </Shot>
      <LowerThird label="BRAZILIAN AIR TRAFFIC CONTROL" detail="अंतिम normal radio communication" at={c.at("lastContact") + 10} hold={c.len("lastContact")} />
      <Shot from={mapFrom} to={deepFrom} tag="illustration">
        <FlightMap
          keys={[
            { at: mapFrom, center: [-31, 1], zoom: 3 },
            { at: c.at("location"), center: PLACES.lastPosition, zoom: 5.5 },
          ]}
          route={{ from: mapFrom, to: mapFrom + 1, progress: [0.36, 0.36] }}
          lostAt={mapFrom}
          searchCircle={{ at: c.at("vast"), radiusNm: 40 }}
          markers={[
            { place: PLACES.lastPosition, label: "LAST KNOWN POSITION", sub: "02:10 UTC", at: mapFrom + 20 },
            { place: PLACES.noronha, label: "FERNANDO DE NORONHA", at: mapFrom + 30, color: "#a9b8c8", side: "left" },
          ]}
        />
      </Shot>
      <Shot from={deepFrom} to={c.duration} tag="illustration">
        <Underwater frame={frame} depth={tween(frame, [deepFrom, c.duration], [0.3, 0.95])} />
      </Shot>
    </SceneFrame>
  );
};
