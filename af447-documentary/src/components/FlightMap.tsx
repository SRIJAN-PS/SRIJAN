import { geoDistance, geoGraticule10, geoInterpolate, geoMercator, geoPath } from "d3-geo";
import { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import land50 from "../data/land-50m.json";
import { COLOR, EASE, FONT, tween } from "../data/theme";
import { A330Top } from "./Aircraft";

// Satellite-style map of the Atlantic from Natural Earth coastlines (public
// domain; no political borders drawn). The camera flies between keyframes;
// the route draws itself and an aircraft icon follows it.

export type LonLat = [number, number];
export const PLACES = {
  rio: [-43.25, -22.81] as LonLat, // Rio de Janeiro–Galeão
  paris: [2.55, 49.01] as LonLat, // Paris–Charles de Gaulle
  lastPosition: [-30.59, 2.98] as LonLat, // last position transmitted, 02:10 UTC (BEA)
  wreck: [-30.56, 3.07] as LonLat, // wreckage site, about 3°04′N 30°34′W (BEA)
  noronha: [-32.42, -3.85] as LonLat,
  recife: [-34.88, -8.05] as LonLat,
  dakar: [-17.45, 14.69] as LonLat,
};

type Key = { at: number; center: LonLat; zoom: number };
type Marker = { place: LonLat; label: string; sub?: string; at: number; until?: number; color?: string; side?: "left" | "right" };

const W = 1920;
const H = 1080;

export const FlightMap: React.FC<{
  keys: Key[];
  route?: { from: number; to: number; progress?: [number, number]; show?: boolean };
  weather?: { at: number; until?: number };
  searchCircle?: { at: number; radiusNm: number };
  grid?: { at: number };
  markers?: Marker[];
  lostAt?: number;
}> = ({ keys, route, weather, searchCircle, grid, markers = [], lostAt }) => {
  const frame = useCurrentFrame();
  const { landPath, grat, project } = useMemo(() => {
    const topo = land50 as unknown as Topology<{ land: GeometryCollection }>;
    const landGeo = feature(topo, topo.objects.land);
    const projection = geoMercator().fitExtent(
      [
        [0, 0],
        [W, H],
      ],
      { type: "MultiPoint", coordinates: [[-62, -32], [18, 54]] },
    );
    const path = geoPath(projection);
    return { landPath: path(landGeo) ?? "", grat: path(geoGraticule10()) ?? "", project: (p: LonLat) => projection(p) as [number, number] };
  }, []);

  let k0 = keys[0];
  let k1 = keys[0];
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].at <= frame) {
      k0 = keys[i];
      k1 = keys[i + 1] ?? keys[i];
    }
  }
  const nextAt = k1.at === k0.at ? k0.at + 1 : k1.at;
  const t = frame < keys[0].at ? 0 : tween(frame, [k0.at + (nextAt - k0.at) * 0.1, nextAt], [0, 1], EASE.inOut);
  const c0 = project(k0.center);
  const c1 = project(k1.center);
  const cx = c0[0] + (c1[0] - c0[0]) * t;
  const cy = c0[1] + (c1[1] - c0[1]) * t;
  const zoom = Math.exp(Math.log(k0.zoom) + (Math.log(k1.zoom) - Math.log(k0.zoom)) * t);
  const toScreen = (p: LonLat): [number, number] => {
    const [x, y] = project(p);
    return [(x - cx) * zoom + W / 2, (y - cy) * zoom + H / 2];
  };

  // Great-circle route Rio → Paris, sampled.
  const interp = geoInterpolate(PLACES.rio, PLACES.paris);
  const total = geoDistance(PLACES.rio, PLACES.paris);
  const lostFrac = geoDistance(PLACES.rio, PLACES.lastPosition) / total;
  const pts = new Array(121).fill(0).map((_, i) => interp(i / 120) as LonLat);
  const [p0, p1] = route?.progress ?? [0, 1];
  const prog = route ? tween(frame, [route.from, route.to], [p0, p1], (x) => x) : 0;
  const routeD = (upto: number) =>
    pts
      .filter((_, i) => i / 120 <= upto)
      .map((p, i) => `${i ? "L" : "M"}${toScreen(p).join(",")}`)
      .join(" ");
  const planeFrac = lostAt !== undefined && frame >= lostAt ? Math.min(prog, lostFrac) : prog;
  const plane = toScreen(interp(planeFrac) as LonLat);
  const ahead = toScreen(interp(Math.min(1, planeFrac + 0.01)) as LonLat);
  const heading = (Math.atan2(ahead[0] - plane[0], -(ahead[1] - plane[1])) * 180) / Math.PI;
  const planeVisible = lostAt === undefined || frame < lostAt ? 1 : Math.max(0, 1 - (frame - lostAt) / 20);

  const pxPerDeg = Math.abs(toScreen([0, 0])[0] - toScreen([1, 0])[0]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#03101c" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="ocean" cx="50%" cy="45%">
            <stop offset="0" stopColor="#0b2a44" />
            <stop offset="1" stopColor="#020a14" />
          </radialGradient>
          <filter id="wx-blur">
            <feGaussianBlur stdDeviation={14} />
          </filter>
        </defs>
        <rect width={W} height={H} fill="url(#ocean)" />
        <g transform={`translate(${W / 2} ${H / 2}) scale(${zoom}) translate(${-cx} ${-cy})`}>
          <path d={grat} fill="none" stroke="#1d3a55" strokeWidth={1} vectorEffect="non-scaling-stroke" opacity={0.7} />
          <path d={landPath} fill="#1c2a24" stroke="#5f7d74" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
        </g>
        {weather && frame >= weather.at ? (
          <g filter="url(#wx-blur)" opacity={tween(frame, [weather.at, weather.at + 30], [0, 0.85]) * (weather.until ? tween(frame, [weather.until, weather.until + 30], [1, 0]) : 1)}>
            {new Array(14).fill(0).map((_, i) => {
              const lon = -36 + random(`wx-lon-${i}`) * 12;
              const lat = 0.5 + random(`wx-lat-${i}`) * 6;
              const [x, y] = toScreen([lon, lat]);
              const r = (0.5 + random(`wx-r-${i}`) * 1.1) * pxPerDeg;
              return <ellipse key={i} cx={x} cy={y} rx={r * 1.3} ry={r} fill={i % 4 === 0 ? "#e8d43a" : i % 7 === 0 ? "#e5484d" : "#2fbf5a"} opacity={0.5} />;
            })}
          </g>
        ) : null}
        {grid && frame >= grid.at
          ? new Array(13).fill(0).map((_, i) => {
              const o = tween(frame, [grid.at + i * 3, grid.at + i * 3 + 20], [0, 0.5]);
              const a = toScreen([-33 + i * 0.5, 0]);
              const b = toScreen([-33, -1 + i * 0.5 + 1]);
              return (
                <g key={i} opacity={o}>
                  <line x1={a[0]} y1={toScreen([0, 6])[1]} x2={a[0]} y2={toScreen([0, 0])[1]} stroke={COLOR.cyan} strokeWidth={1} />
                  <line x1={toScreen([-33, 0])[0]} y1={b[1]} x2={toScreen([-27, 0])[0]} y2={b[1]} stroke={COLOR.cyan} strokeWidth={1} />
                </g>
              );
            })
          : null}
        {searchCircle && frame >= searchCircle.at
          ? (() => {
              const [x, y] = toScreen(PLACES.lastPosition);
              const r = (searchCircle.radiusNm / 60) * pxPerDeg * tween(frame, [searchCircle.at, searchCircle.at + 40], [0, 1], EASE.out);
              return (
                <g>
                  <circle cx={x} cy={y} r={r} fill={COLOR.amber} fillOpacity={0.07} stroke={COLOR.amber} strokeWidth={2} strokeDasharray="10 8" />
                </g>
              );
            })()
          : null}
        {route && route.show !== false ? (
          <g>
            <path d={routeD(1)} fill="none" stroke="#ffffff" strokeOpacity={0.15} strokeWidth={2} strokeDasharray="4 10" />
            <path d={routeD(planeFrac)} fill="none" stroke={COLOR.amber} strokeWidth={3.5} strokeLinecap="round" />
            <g opacity={planeVisible}>
              <A330Top x={plane[0]} y={plane[1]} heading={heading} size={0.9} />
            </g>
          </g>
        ) : null}
        {markers.map((m) => {
          const [x, y] = toScreen(m.place);
          const p = Math.min(tween(frame, [m.at, m.at + 20], [0, 1], EASE.out), m.until ? tween(frame, [m.until, m.until + 20], [1, 0]) : 1);
          if (p <= 0) {
            return null;
          }
          const pulse = ((frame - m.at) % 50) / 50;
          return (
            <g key={m.label} opacity={p}>
              <circle cx={x} cy={y} r={10 + 26 * pulse} fill="none" stroke={m.color ?? COLOR.amber} strokeOpacity={1 - pulse} strokeWidth={2} />
              <circle cx={x} cy={y} r={7} fill={m.color ?? COLOR.amber} />
            </g>
          );
        })}
      </svg>
      {markers.map((m) => {
        const [x, y] = toScreen(m.place);
        const p = Math.min(tween(frame, [m.at + 8, m.at + 30], [0, 1], EASE.out), m.until ? tween(frame, [m.until, m.until + 20], [1, 0]) : 1);
        const left = m.side === "left";
        return p > 0 ? (
          <div
            key={`l-${m.label}`}
            style={{
              position: "absolute",
              left: left ? undefined : x + 26,
              right: left ? W - x + 26 : undefined,
              top: y,
              transform: "translateY(-50%)",
              textAlign: left ? "right" : "left",
              opacity: p,
              textShadow: "0 2px 10px #000",
            }}
          >
            <div style={{ fontFamily: FONT.mono, fontSize: 26, letterSpacing: "0.16em", color: m.color ?? COLOR.amber }}>{m.label}</div>
            {m.sub ? <div style={{ fontFamily: FONT.sans, fontSize: 24, color: COLOR.textDim }}>{m.sub}</div> : null}
          </div>
        ) : null;
      })}
    </AbsoluteFill>
  );
};
