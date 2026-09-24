import { Img, random, staticFile, useCurrentFrame } from "remotion";
import { ASSETS } from "../config/assets";
import { COLOR, FONT, tween } from "../config/theme";

// "India at night": major urban centres plotted by latitude/longitude as
// points of light. No boundary line is drawn, so the graphic makes no claim
// about borders. To show an outline, supply an official (Survey of
// India-compliant) SVG/PNG in ASSETS.images.indiaOutline, exported in an
// equirectangular projection covering the BOUNDS below.

export const BOUNDS = { west: 68, east: 97.5, north: 37.5, south: 6 };

// [name, latitude, longitude, prominence 1–3]
const CITIES: [string, number, number, number][] = [
  ["Delhi", 28.61, 77.21, 3], ["Mumbai", 19.08, 72.88, 3], ["Kolkata", 22.57, 88.36, 3],
  ["Chennai", 13.08, 80.27, 3], ["Bengaluru", 12.97, 77.59, 3], ["Hyderabad", 17.39, 78.49, 3],
  ["Ahmedabad", 23.02, 72.57, 2], ["Pune", 18.52, 73.86, 2], ["Jaipur", 26.91, 75.79, 2],
  ["Lucknow", 26.85, 80.95, 2], ["Kanpur", 26.45, 80.33, 2], ["Nagpur", 21.15, 79.09, 2],
  ["Indore", 22.72, 75.86, 2], ["Bhopal", 23.26, 77.41, 2], ["Patna", 25.59, 85.14, 2],
  ["Surat", 21.17, 72.83, 2], ["Visakhapatnam", 17.69, 83.22, 2], ["Kochi", 9.93, 76.27, 2],
  ["Thiruvananthapuram", 8.52, 76.94, 1], ["Coimbatore", 11.02, 76.96, 2], ["Madurai", 9.93, 78.12, 1],
  ["Guwahati", 26.14, 91.74, 2], ["Bhubaneswar", 20.3, 85.82, 2], ["Raipur", 21.25, 81.63, 1],
  ["Ranchi", 23.34, 85.31, 1], ["Chandigarh", 30.73, 76.78, 2], ["Amritsar", 31.63, 74.87, 1],
  ["Srinagar", 34.08, 74.8, 1], ["Jammu", 32.73, 74.86, 1], ["Dehradun", 30.32, 78.03, 1],
  ["Varanasi", 25.32, 82.97, 1], ["Agra", 27.18, 78.01, 1], ["Vadodara", 22.31, 73.18, 1],
  ["Rajkot", 22.3, 70.8, 1], ["Jodhpur", 26.24, 73.02, 1], ["Udaipur", 24.59, 73.71, 1],
  ["Nashik", 20.0, 73.79, 1], ["Aurangabad", 19.88, 75.34, 1], ["Panaji", 15.49, 73.83, 1],
  ["Mangaluru", 12.91, 74.86, 1], ["Mysuru", 12.3, 76.64, 1], ["Vijayawada", 16.51, 80.65, 1],
  ["Tiruchirappalli", 10.79, 78.7, 1], ["Puducherry", 11.94, 79.81, 1], ["Shillong", 25.58, 91.89, 1],
  ["Imphal", 24.82, 93.94, 1], ["Agartala", 23.83, 91.28, 1], ["Siliguri", 26.73, 88.4, 1],
  ["Gorakhpur", 26.76, 83.37, 1], ["Prayagraj", 25.44, 81.85, 1], ["Jabalpur", 23.18, 79.99, 1],
  ["Gwalior", 26.22, 78.18, 1], ["Ludhiana", 30.9, 75.86, 1], ["Meerut", 28.98, 77.71, 1],
  ["Dhanbad", 23.8, 86.43, 1], ["Jamshedpur", 22.8, 86.2, 1], ["Cuttack", 20.46, 85.88, 1],
  ["Hubballi", 15.36, 75.12, 1], ["Belagavi", 15.85, 74.5, 1], ["Kozhikode", 11.25, 75.78, 1],
  ["Tirunelveli", 8.71, 77.76, 1], ["Salem", 11.66, 78.15, 1], ["Warangal", 17.97, 79.59, 1],
  ["Guntur", 16.31, 80.44, 1], ["Nellore", 14.44, 79.99, 1], ["Kurnool", 15.83, 78.04, 1],
  ["Bikaner", 28.02, 73.31, 1], ["Kota", 25.21, 75.86, 1], ["Ajmer", 26.45, 74.64, 1],
  ["Itanagar", 27.08, 93.61, 1], ["Kohima", 25.67, 94.11, 1], ["Aizawl", 23.73, 92.72, 1],
  ["Gangtok", 27.33, 88.61, 1], ["Shimla", 31.1, 77.17, 1], ["Leh", 34.15, 77.58, 1],
  ["Port Blair", 11.62, 92.73, 1], ["Kavaratti", 10.57, 72.64, 1], ["Silchar", 24.83, 92.78, 1],
  ["Dibrugarh", 27.47, 94.91, 1], ["Jalandhar", 31.33, 75.58, 1], ["Bareilly", 28.37, 79.43, 1],
  ["Aligarh", 27.88, 78.08, 1], ["Jhansi", 25.45, 78.57, 1], ["Sambalpur", 21.47, 83.97, 1],
  ["Bilaspur", 22.08, 82.15, 1], ["Solapur", 17.66, 75.91, 1], ["Kolhapur", 16.7, 74.24, 1],
  ["Thrissur", 10.53, 76.21, 1], ["Tirupati", 13.63, 79.42, 1], ["Bhavnagar", 21.76, 72.15, 1],
];

const COS_LAT = Math.cos((22 * Math.PI) / 180);

export const IndiaCityMap: React.FC<{
  cx: number;
  cy: number;
  height: number;
  appear: number;
  opacity?: number;
  caption?: boolean;
}> = ({ cx, cy, height, appear, opacity = 1, caption = true }) => {
  const frame = useCurrentFrame();
  const k = height / (BOUNDS.north - BOUNDS.south);
  const width = (BOUNDS.east - BOUNDS.west) * k * COS_LAT;
  const left = cx - width / 2;
  const top = cy - height / 2;
  const project = (lat: number, lon: number) => [left + (lon - BOUNDS.west) * k * COS_LAT, top + (BOUNDS.north - lat) * k];
  const outline = ASSETS.images.indiaOutline;
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {outline ? (
        <Img
          src={staticFile(outline)}
          style={{ position: "absolute", left, top, width, height, opacity: 0.35 * tween(frame, [appear, appear + 30], [0, 1]) }}
        />
      ) : null}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="city-glow">
            <stop offset="0" stopColor={COLOR.accent} stopOpacity={0.9} />
            <stop offset="1" stopColor={COLOR.accent} stopOpacity={0} />
          </radialGradient>
        </defs>
        {CITIES.map(([name, lat, lon, tier]) => {
          const [x, y] = project(lat, lon);
          const delay = appear + random(`city-${name}`) * 40;
          const on = tween(frame, [delay, delay + 14], [0, 1]);
          const twinkle = 0.75 + Math.sin(frame * 0.08 + random(`tw-${name}`) * 6) * 0.25;
          const r = tier === 3 ? 7 : tier === 2 ? 5 : 3.5;
          return (
            <g key={name} opacity={on}>
              <circle cx={x} cy={y} r={r * 4.5} fill="url(#city-glow)" opacity={0.45 * twinkle} />
              <circle cx={x} cy={y} r={r} fill="#FFE3B3" />
            </g>
          );
        })}
      </svg>
      {caption ? (
        <div
          style={{
            position: "absolute",
            left,
            top: top + height + 10,
            width,
            textAlign: "center",
            fontFamily: FONT.mono,
            fontSize: 18,
            letterSpacing: 2,
            color: COLOR.faint,
            opacity: tween(frame, [appear + 20, appear + 40], [0, 1]),
          }}
        >
          ILLUSTRATIVE · MAJOR URBAN CENTRES
        </div>
      ) : null}
    </div>
  );
};
