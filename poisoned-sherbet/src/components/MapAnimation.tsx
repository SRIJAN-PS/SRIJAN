import { geoGraticule10, geoMercator, geoPath } from "d3-geo";
import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import land50 from "../data/land-50m.json";
import { COLOR, EASE, FONT, tween } from "../data/theme";

// Engraved-style map drawn from Natural Earth coastlines (public domain).
// Coastlines only: no political borders are drawn. The camera flies between
// keyframes; markers, labels and routes appear at their frames.

export type Place = { lon: number; lat: number };
export const PLACES = {
  baroda: { lon: 73.18, lat: 22.31 },
  bombay: { lon: 72.85, lat: 18.94 },
  madras: { lon: 80.27, lat: 13.08 },
  calcutta: { lon: 88.36, lat: 22.57 },
  india: { lon: 79.5, lat: 22.5 },
} satisfies Record<string, Place>;

type Key = { at: number; center: Place; zoom: number };
type Marker = { place: Place; label: string; sub?: string; at: number; color?: string; big?: boolean; side?: "left" | "right" };
type Label = { place: Place; text: string; at: number; size?: number; italic?: boolean; hideAbove?: number; hideBelow?: number };
type Route = { from: Place; to: Place; at: number; len?: number; color?: string; label?: string };

const W = 1920;
const H = 1080;

export const MapAnimation: React.FC<{ keys: Key[]; markers?: Marker[]; labels?: Label[]; routes?: Route[] }> = ({ keys, markers = [], labels = [], routes = [] }) => {
  const frame = useCurrentFrame();
  const { landPath, grat, project } = useMemo(() => {
    const topo = land50 as unknown as Topology<{ land: GeometryCollection }>;
    const landGeo = feature(topo, topo.objects.land);
    const projection = geoMercator().fitExtent(
      [
        [0, 0],
        [W, H],
      ],
      { type: "MultiPoint", coordinates: [[64, 5], [96, 37]] },
    );
    const path = geoPath(projection);
    return {
      landPath: path(landGeo) ?? "",
      grat: path(geoGraticule10()) ?? "",
      project: (p: Place) => projection([p.lon, p.lat]) as [number, number],
    };
  }, []);

  // Camera: interpolate center (projected) and log-zoom between keyframes.
  let k0 = keys[0];
  let k1 = keys[0];
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].at <= frame) {
      k0 = keys[i];
      k1 = keys[i + 1] ?? keys[i];
    }
  }
  const nextAt = k1.at === k0.at ? k0.at + 1 : k1.at;
  const holdStart = k0.at + (nextAt - k0.at) * 0.15;
  const t = frame < keys[0].at ? 0 : tween(frame, [holdStart, nextAt], [0, 1], EASE.inOut);
  const c0 = project(k0.center);
  const c1 = project(k1.center);
  const cx = c0[0] + (c1[0] - c0[0]) * t;
  const cy = c0[1] + (c1[1] - c0[1]) * t;
  const zoom = Math.exp(Math.log(k0.zoom) + (Math.log(k1.zoom) - Math.log(k0.zoom)) * t);
  const toScreen = (p: Place): [number, number] => {
    const [x, y] = project(p);
    return [(x - cx) * zoom + W / 2, (y - cy) * zoom + H / 2];
  };
  const transform = `translate(${W / 2} ${H / 2}) scale(${zoom}) translate(${-cx} ${-cy})`;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0d12" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <pattern id="sea-lines" width="12" height="12" patternUnits="userSpaceOnUse">
            <line x1="0" y1="6" x2="12" y2="6" stroke="#1b2430" strokeWidth="1" />
          </pattern>
          <radialGradient id="map-light" cx="45%" cy="45%">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.75" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#sea-lines)" />
        <g transform={transform}>
          <path d={grat} fill="none" stroke="#2a3342" strokeWidth={1} vectorEffect="non-scaling-stroke" opacity={0.6} />
          <path d={landPath} fill="#3a2d20" stroke="#000" strokeWidth={9} strokeOpacity={0.35} vectorEffect="non-scaling-stroke" />
          <path d={landPath} fill="#2e2319" stroke={COLOR.brass} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
        </g>
        {routes.map((r) => {
          const a = toScreen(r.from);
          const b = toScreen(r.to);
          const p = tween(frame, [r.at, r.at + (r.len ?? 60)], [0, 1], EASE.inOut);
          if (p <= 0) {
            return null;
          }
          const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.25;
          const my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.25;
          const L = Math.hypot(mx - a[0], my - a[1]) + Math.hypot(b[0] - mx, b[1] - my);
          return (
            <path
              key={`${r.at}-${r.label}`}
              d={`M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`}
              fill="none"
              stroke={r.color ?? COLOR.poisonGlow}
              strokeWidth={3}
              strokeDasharray={`${L} ${L}`}
              strokeDashoffset={L * (1 - p)}
              strokeLinecap="round"
            />
          );
        })}
        {markers.map((m) => {
          const [x, y] = toScreen(m.place);
          const p = tween(frame, [m.at, m.at + 20], [0, 1], EASE.out);
          if (p <= 0) {
            return null;
          }
          const pulse = 1 + 0.35 * ((frame - m.at) % 60) / 60;
          const color = m.color ?? COLOR.candle;
          return (
            <g key={m.label} opacity={p}>
              <circle cx={x} cy={y} r={(m.big ? 26 : 16) * pulse} fill="none" stroke={color} strokeOpacity={0.6 * (1 - ((frame - m.at) % 60) / 60)} strokeWidth={2} />
              <circle cx={x} cy={y} r={m.big ? 9 : 6} fill={color} />
            </g>
          );
        })}
        <rect width={W} height={H} fill="url(#map-light)" />
      </svg>
      {labels.map((l) => {
        const [x, y] = toScreen(l.place);
        const vis = (l.hideAbove === undefined || zoom < l.hideAbove) && (l.hideBelow === undefined || zoom > l.hideBelow) ? 1 : 0;
        const p = tween(frame, [l.at, l.at + 24], [0, 1], EASE.out) * vis;
        return (
          <div
            key={l.text}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              fontFamily: FONT.serif,
              fontStyle: l.italic ? "italic" : "normal",
              fontSize: l.size ?? 40,
              letterSpacing: "0.3em",
              color: COLOR.parchmentDark,
              opacity: p * 0.85,
              whiteSpace: "nowrap",
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
            }}
          >
            {l.text}
          </div>
        );
      })}
      {markers.map((m) => {
        const [x, y] = toScreen(m.place);
        const p = tween(frame, [m.at + 8, m.at + 30], [0, 1], EASE.out);
        const left = m.side === "left";
        return (
          <div
            key={`lab-${m.label}`}
            style={{
              position: "absolute",
              left: left ? undefined : x + 34,
              right: left ? W - x + 34 : undefined,
              top: y,
              transform: "translateY(-50%)",
              opacity: p,
              textAlign: left ? "right" : "left",
              textShadow: "0 2px 12px rgba(0,0,0,0.95)",
            }}
          >
            <div style={{ fontFamily: FONT.mono, fontSize: m.big ? 34 : 26, letterSpacing: "0.22em", color: m.color ?? COLOR.candleSoft }}>{m.label}</div>
            {m.sub ? <div style={{ fontFamily: FONT.serif, fontStyle: "italic", fontSize: m.big ? 30 : 24, color: COLOR.textDim, marginTop: 2 }}>{m.sub}</div> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
