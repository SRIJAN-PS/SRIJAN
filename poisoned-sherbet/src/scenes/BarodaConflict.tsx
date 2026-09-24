import { AbsoluteFill, useCurrentFrame } from "remotion";
import { alongCurve, Arrow } from "../components/Arrow";
import { Dust } from "../components/Atmosphere";
import { DateCard } from "../components/DateCard";
import { MapAnimation, PLACES } from "../components/MapAnimation";
import { SceneFrame } from "../components/SceneFrame";
import { Shot } from "../components/Shot";
import { Still } from "../components/Still";
import { Envelope } from "../components/Letter";
import { IMAGES } from "../data/assets";
import { COLOR, EASE, FONT, tween } from "../data/theme";
import { cuesOf } from "../data/timing";

const NODES = {
  palace: { x: 360, y: 560, label: "PALACE", sub: "Maharaja Malhar Rao", color: COLOR.indian },
  resident: { x: 960, y: 360, label: "RESIDENT", sub: "Colonel Phayre", color: COLOR.british },
  government: { x: 1560, y: 560, label: "GOVERNMENT", sub: "Bombay · Calcutta", color: COLOR.parchmentDark },
};

const Node: React.FC<{ n: (typeof NODES)[keyof typeof NODES]; at: number; frame: number; hostile: number }> = ({ n, at, frame, hostile }) => {
  const p = tween(frame, [at, at + 24], [0, 1], EASE.out);
  return (
    <div style={{ position: "absolute", left: n.x, top: n.y, transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * p})`, opacity: p, textAlign: "center" }}>
      <div
        style={{
          width: 250,
          padding: "22px 10px",
          border: `2px solid ${hostile > 0 ? COLOR.poisonGlow : n.color}`,
          backgroundColor: "rgba(12,9,7,0.85)",
          boxShadow: `0 0 ${40 * hostile}px rgba(208,80,60,${0.5 * hostile})`,
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontSize: 28, letterSpacing: "0.24em", color: n.color }}>{n.label}</div>
        <div style={{ fontFamily: FONT.serif, fontStyle: "italic", fontSize: 26, color: COLOR.textDim, marginTop: 6 }}>{n.sub}</div>
      </div>
    </div>
  );
};

// Scene 3 — A state under pressure. Map: India → Bombay Presidency → Baroda;
// the 1873 inquiry; letters between palace, Resident and government.
export const BarodaConflict: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf("barodaConflict");
  const flowFrom = c.at("deteriorated") - 10;
  const hostile = tween(frame, [c.at("hostile"), c.at("hostile") + 40], [0, 1]);
  const pr: [number, number] = [NODES.palace.x + 130, NODES.palace.y - 30];
  const rp: [number, number] = [NODES.resident.x - 130, NODES.resident.y + 30];
  const rg: [number, number] = [NODES.resident.x + 130, NODES.resident.y + 30];
  const gr: [number, number] = [NODES.government.x - 130, NODES.government.y - 30];
  const pg: [number, number] = [NODES.palace.x + 60, NODES.palace.y + 70];
  const gp: [number, number] = [NODES.government.x - 60, NODES.government.y + 70];
  const letter = (from: [number, number], to: [number, number], at: number, bend: number) => {
    const t = tween(frame, [at, at + 70], [0, 1], EASE.inOut);
    if (t <= 0 || t >= 1) {
      return null;
    }
    const [x, y] = alongCurve(from, to, t, bend);
    return <Envelope x={x} y={y} scale={0.7} rotate={Math.sin(frame / 8) * 6} />;
  };
  return (
    <SceneFrame sceneId="barodaConflict">
      <Shot from={0} to={flowFrom} fadeIn={0} tag="illustration">
        <MapAnimation
          keys={[
            { at: 0, center: PLACES.india, zoom: 1 },
            { at: c.at("concerns") + 40, center: { lon: 74.2, lat: 20.8 }, zoom: 2.4 },
            { at: c.at("inquiry"), center: PLACES.baroda, zoom: 4.2 },
          ]}
          labels={[
            { place: { lon: 79.5, lat: 21.5 }, text: "INDIA", at: 10, size: 78, hideAbove: 1.6 },
            { place: { lon: 75.6, lat: 20.1 }, text: "BOMBAY PRESIDENCY", at: c.at("concerns") + 50, size: 30, italic: true, hideBelow: 1.8, hideAbove: 3.6 },
            { place: { lon: 68.6, lat: 17.5 }, text: "ARABIAN SEA", at: 20, size: 26, italic: true, hideAbove: 3 },
          ]}
          markers={[
            { place: PLACES.bombay, label: "BOMBAY", sub: "British India", at: c.at("concerns") + 60 },
            { place: PLACES.baroda, label: "BARODA", sub: "princely state of the Gaekwads", at: c.at("concerns") + 90, big: true },
          ]}
        />
        <DateCard text="1873  ·  INQUIRY" sub="into allegations of maladministration" at={c.at("inquiry") + 10} hold={c.len("inquiry") + 20} position="lower" />
      </Shot>
      <Shot from={flowFrom} to={c.at("then") - 4} tag="illustration">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1d1610, #070504 75%)" }} />
        <Dust count={50} seed="flow" opacity={0.3} />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <Arrow from={pr} to={rp} at={flowFrom + 30} bend={-0.12} color={hostile ? COLOR.poisonGlow : COLOR.brass} />
          <Arrow from={rp} to={pr} at={flowFrom + 50} bend={-0.12} color={hostile ? COLOR.poisonGlow : COLOR.brass} opacity={0.6} />
          <Arrow from={rg} to={gr} at={c.at("phayreBelieved")} bend={-0.12} color={hostile ? COLOR.poisonGlow : COLOR.british} />
          <Arrow from={pg} to={gp} at={c.at("grievances")} bend={-0.18} color={hostile ? COLOR.poisonGlow : COLOR.indian} />
          {letter(pr, rp, flowFrom + 40, -0.12)}
          {letter(rg, gr, c.at("phayreBelieved") + 10, -0.12)}
          {letter(pg, gp, c.at("grievances") + 10, -0.18)}
        </svg>
        <Node n={NODES.palace} at={flowFrom} frame={frame} hostile={hostile} />
        <Node n={NODES.resident} at={flowFrom + 10} frame={frame} hostile={hostile} />
        <Node n={NODES.government} at={c.at("phayreBelieved") - 10} frame={frame} hostile={hostile} />
        {[
          { x: 1420, y: 300, text: "Resident's complaints\nabout the administration", at: c.at("phayreBelieved") + 30, color: COLOR.british },
          { x: 960, y: 770, text: "Maharaja's grievances · request for the Resident's removal", at: c.at("grievances") + 30, color: COLOR.indian },
        ].map((l) => (
          <div
            key={l.text}
            style={{
              position: "absolute",
              left: l.x,
              top: l.y,
              transform: "translate(-50%, -50%)",
              fontFamily: FONT.serif,
              fontStyle: "italic",
              fontSize: 30,
              color: l.color,
              opacity: tween(frame, [l.at, l.at + 24], [0, 1]),
              whiteSpace: "pre-line",
              textAlign: "center",
            }}
          >
            {l.text}
          </div>
        ))}
      </Shot>
      <Shot from={c.at("then") - 4} to={c.duration} fade={30} tag="ai">
        <Still src={IMAGES.handGlass} from={c.at("then") - 4} to={c.duration} zoom={[1.5, 1.7]} focus={[44, 62]} filter="brightness(0.8)" />
      </Shot>
    </SceneFrame>
  );
};
