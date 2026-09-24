import { random } from "remotion";
import { COLOR, FONT } from "../data/theme";

// Clean technical diagrams (educational, not to scale).

// Pitot probe in cross-section: ram air enters the tip; the pressure gives
// airspeed. `ice` 0..1 fills the inlet with ice crystals; `crystals` shows
// crystals streaming in the airflow.
export const PitotDiagram: React.FC<{ frame: number; ice: number; crystals: number; showGauge: boolean; gaugeWrong: number }> = ({ frame, ice, crystals, showGauge, gaugeWrong }) => {
  const flow = [];
  for (let i = 0; i < 9; i++) {
    const y = 380 + i * 24;
    const x = ((frame * 9 + i * 97) % 700) - 60;
    flow.push(<line key={i} x1={x} y1={y} x2={x + 70} y2={y} stroke={COLOR.cyan} strokeWidth={2} opacity={0.5} strokeLinecap="round" />);
  }
  const needle = 40 + 180 * (1 - gaugeWrong * (0.7 + 0.25 * Math.sin(frame / 3)));
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <rect width="1920" height="1080" fill="#040912" />
      {new Array(40).fill(0).map((_, i) => (
        <line key={`g${i}`} x1={i * 50} y1={0} x2={i * 50} y2={1080} stroke="#0c1a2a" strokeWidth={1} />
      ))}
      {flow}
      {/* fuselage skin and probe */}
      <rect x={1150} y={200} width={60} height={600} fill="#2a3444" />
      <path d="M1150,470 L720,470 Q690,470 680,480 L660,500 L680,520 Q690,530 720,530 L1150,530 Z" fill="#8795a8" stroke="#c7d2e0" strokeWidth={2} />
      <rect x={700} y={488} width={450} height={24} fill="#1a2230" />
      <rect x={700} y={488} width={450 * 0.12 + 20} height={24} fill="#9fd8ff" opacity={ice} />
      <rect x={1150} y={494} width={360} height={12} fill="#1a2230" />
      <text x={880} y={450} textAnchor="middle" fill={COLOR.textDim} fontFamily={FONT.mono} fontSize={24}>
        PITOT PROBE
      </text>
      <text x={560} y={372} textAnchor="middle" fill={COLOR.cyan} fontFamily={FONT.mono} fontSize={22}>
        AIRFLOW
      </text>
      {/* ice crystals */}
      {crystals > 0
        ? new Array(80).fill(0).map((_, i) => {
            const x = ((random(`ic-x${i}`) * 900 + frame * (6 + random(`ic-s${i}`) * 5)) % 900) - 220;
            const y = 380 + random(`ic-y${i}`) * 230;
            const stuck = i < 30 * ice;
            return (
              <g key={i} transform={`translate(${stuck ? 690 + random(`ic-sx${i}`) * 40 : x} ${stuck ? 492 + random(`ic-sy${i}`) * 16 : y}) rotate(${frame * 3 + i * 40})`} opacity={crystals}>
                <path d="M0,-6 L1.5,-1.5 L6,0 L1.5,1.5 L0,6 L-1.5,1.5 L-6,0 L-1.5,-1.5 Z" fill="#e6f6ff" />
              </g>
            );
          })
        : null}
      {/* pressure sensor and airspeed gauge */}
      <rect x={1510} y={470} width={90} height={60} rx={8} fill="#2a3444" stroke="#c7d2e0" strokeWidth={2} />
      <text x={1555} y={560} textAnchor="middle" fill={COLOR.textDim} fontFamily={FONT.mono} fontSize={18}>
        PRESSURE
      </text>
      {showGauge ? (
        <g transform="translate(1555 300)">
          <circle r={120} fill="#05070a" stroke="#c7d2e0" strokeWidth={4} />
          {new Array(9).fill(0).map((_, i) => {
            const a = ((-220 + i * 32.5) * Math.PI) / 180;
            return <line key={i} x1={Math.cos(a) * 95} y1={Math.sin(a) * 95} x2={Math.cos(a) * 112} y2={Math.sin(a) * 112} stroke="#fff" strokeWidth={3} />;
          })}
          <line x1={0} y1={0} x2={Math.cos(((-220 + needle) * Math.PI) / 180) * 90} y2={Math.sin(((-220 + needle) * Math.PI) / 180) * 90} stroke={gaugeWrong > 0.3 ? COLOR.red : COLOR.green} strokeWidth={6} strokeLinecap="round" />
          <circle r={10} fill="#c7d2e0" />
          <text y={70} textAnchor="middle" fill={gaugeWrong > 0.3 ? COLOR.red : COLOR.green} fontFamily={FONT.mono} fontSize={22}>
            AIRSPEED
          </text>
          <line x1={0} y1={120} x2={0} y2={170} stroke="#c7d2e0" strokeWidth={2} strokeDasharray="6 6" />
        </g>
      ) : null}
    </svg>
  );
};

// Wing section with streamlines. `aoa` in degrees; above ~15° the flow
// separates from the upper surface and the lift arrow shrinks.
export const WingDiagram: React.FC<{ frame: number; aoa: number }> = ({ frame, aoa }) => {
  const sep = Math.max(0, Math.min(1, (aoa - 12) / 10));
  const lift = aoa < 15 ? 60 + aoa * 12 : Math.max(60, 240 - (aoa - 15) * 18);
  const lines = [];
  for (let i = 0; i < 11; i++) {
    const y0 = 360 + i * 36;
    const above = y0 < 540;
    let d = `M200,${y0}`;
    for (let x = 200; x <= 1720; x += 40) {
      const nearWing = Math.exp(-Math.pow((x - 960) / 380, 2));
      let dy = above ? -nearWing * 40 * (1 - Math.abs(y0 - 540) / 200) : nearWing * 20 * (1 - Math.abs(y0 - 540) / 200);
      if (above && x > 900 && sep > 0 && y0 > 400) {
        dy += Math.sin((x + frame * 12 + i * 50) / 30) * 26 * sep * ((x - 900) / 800);
      }
      d += ` L${x},${y0 + dy}`;
    }
    lines.push(<path key={i} d={d} fill="none" stroke={above && sep > 0.3 && y0 > 400 ? COLOR.amber : COLOR.cyan} strokeWidth={2.5} opacity={0.7} strokeDasharray="30 14" strokeDashoffset={-frame * 6} />);
  }
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <rect width="1920" height="1080" fill="#040912" />
      {lines}
      <g transform={`rotate(${-aoa} 960 540)`}>
        <path d="M640,540 C680,480 820,470 1000,490 C1140,505 1260,530 1300,545 C1200,560 1000,570 800,565 C700,562 650,555 640,540 Z" fill="#cfd8e3" stroke="#fff" strokeWidth={2} />
      </g>
      <g transform="translate(960 470)">
        <line x1={0} y1={0} x2={0} y2={-lift} stroke={sep > 0.4 ? COLOR.red : COLOR.green} strokeWidth={10} />
        <path d={`M-22,${-lift} L0,${-lift - 34} L22,${-lift} Z`} fill={sep > 0.4 ? COLOR.red : COLOR.green} />
        <text x={40} y={-lift / 2} fill={sep > 0.4 ? COLOR.red : COLOR.green} fontFamily={FONT.mono} fontSize={28}>
          LIFT
        </text>
      </g>
      <g transform="translate(260 860)">
        <path d="M0,0 L220,0" stroke="#fff" strokeWidth={2} />
        <path d={`M0,0 L${220 * Math.cos((aoa * Math.PI) / 180)},${-220 * Math.sin((aoa * Math.PI) / 180)}`} stroke={COLOR.amber} strokeWidth={3} />
        <text x={240} y={10} fill={COLOR.amber} fontFamily={FONT.mono} fontSize={26}>{`ANGLE OF ATTACK ${Math.round(aoa)}°`}</text>
      </g>
    </svg>
  );
};

// Three indicators side by side: altitude, airspeed, angle of attack with trend arrows.
export const Trends: React.FC<{ alt: number; ias: number; aoa: number; frame: number }> = ({ alt, ias, aoa, frame }) => {
  const items = [
    { label: "ALTITUDE", value: `${Math.round(alt).toLocaleString("en-US")} ft`, dir: "up", color: COLOR.cyan },
    { label: "AIRSPEED", value: `${Math.round(ias)} kt`, dir: "down", color: COLOR.amber },
    { label: "ANGLE OF ATTACK", value: `${Math.round(aoa)}°`, dir: "up", color: COLOR.red },
  ];
  return (
    <div style={{ display: "flex", gap: 60, justifyContent: "center" }}>
      {items.map((it) => (
        <div key={it.label} style={{ width: 400, padding: "26px 20px", border: `2px solid ${it.color}`, backgroundColor: "rgba(4,9,18,0.85)", textAlign: "center" }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 24, letterSpacing: "0.16em", color: it.color }}>{it.label}</div>
          <div style={{ fontFamily: FONT.latin, fontSize: 60, fontWeight: 700, color: COLOR.text, marginTop: 10 }}>{it.value}</div>
          <div style={{ fontSize: 70, lineHeight: 1, color: it.color, transform: `translateY(${Math.sin(frame / 8) * 6 * (it.dir === "up" ? -1 : 1)}px)` }}>{it.dir === "up" ? "▲" : "▼"}</div>
        </div>
      ))}
    </div>
  );
};

// Flight recorder (the orange 'black box') close-up.
export const Recorder: React.FC<{ label: string; scale?: number }> = ({ label, scale = 1 }) => (
  <svg width={520 * scale} height={360 * scale} viewBox="0 0 520 360">
    <rect x={40} y={60} width={440} height={240} rx={18} fill="#ff7a1a" stroke="#b04e0a" strokeWidth={4} />
    <rect x={40} y={60} width={440} height={50} rx={16} fill="#e06110" />
    <rect x={70} y={140} width={380} height={80} rx={6} fill="#f6f1e7" />
    <text x={260} y={175} textAnchor="middle" fill="#1a1a1a" fontFamily={FONT.mono} fontSize={26} fontWeight={500}>
      {label}
    </text>
    <text x={260} y={206} textAnchor="middle" fill="#1a1a1a" fontFamily={FONT.mono} fontSize={18}>
      DO NOT OPEN
    </text>
    {[80, 440].map((x) => (
      <rect key={x} x={x - 14} y={250} width={28} height={40} rx={4} fill="#2a2a2a" />
    ))}
    <circle cx={120} cy={270} r={14} fill="#2a2a2a" />
  </svg>
);

// Investigation display: recorded parameters plotted against time.
export const DataPlot: React.FC<{ progress: number; width?: number; height?: number }> = ({ progress, width = 1100, height = 560 }) => {
  const series = [
    { name: "ALTITUDE", color: COLOR.cyan, f: (t: number) => (t < 0.25 ? 0.62 + t * 0.4 : 0.72 - (t - 0.25) * 0.96) },
    { name: "PITCH", color: COLOR.amber, f: (t: number) => 0.45 + (t < 0.1 ? t * 2 : 0.2 + 0.05 * Math.sin(t * 40)) },
    { name: "ANGLE OF ATTACK", color: COLOR.red, f: (t: number) => 0.2 + Math.min(0.6, t * 1.6) },
  ];
  return (
    <svg width={width} height={height} viewBox="0 0 1100 560">
      <rect width={1100} height={560} fill="#03070d" stroke="#1f2b3a" strokeWidth={3} />
      {new Array(10).fill(0).map((_, i) => (
        <line key={i} x1={80 + i * 100} y1={40} x2={80 + i * 100} y2={500} stroke="#12202e" strokeWidth={1} />
      ))}
      {series.map((s, si) => {
        let d = "";
        for (let i = 0; i <= 200 * progress; i++) {
          const t = i / 200;
          const x = 80 + t * 960;
          const y = 500 - s.f(t) * 440;
          d += `${i ? "L" : "M"}${x},${y}`;
        }
        return (
          <g key={s.name}>
            <path d={d} fill="none" stroke={s.color} strokeWidth={3} />
            <text x={90} y={70 + si * 30} fill={s.color} fontFamily={FONT.mono} fontSize={20}>
              {s.name}
            </text>
          </g>
        );
      })}
      <text x={1040} y={530} textAnchor="end" fill={COLOR.textFaint} fontFamily={FONT.mono} fontSize={16}>
        02:10 → 02:14 UTC · SHAPES ILLUSTRATIVE
      </text>
    </svg>
  );
};

// A tear-off wall calendar page.
export const CalendarPage: React.FC<{ year: string; day?: string; month?: string }> = ({ year, day, month }) => (
  <div style={{ width: 420, height: 480, backgroundColor: "#eef2f6", boxShadow: "0 30px 70px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column" }}>
    <div style={{ height: 110, backgroundColor: COLOR.red, color: "#fff", fontFamily: FONT.latin, fontSize: 44, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: "0.1em" }}>
      {month ?? "AF447"}
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#0a1628" }}>
      {day ? <div style={{ fontFamily: FONT.latin, fontSize: 170, fontWeight: 800, lineHeight: 1 }}>{day}</div> : null}
      <div style={{ fontFamily: FONT.latin, fontSize: day ? 60 : 130, fontWeight: 700 }}>{year}</div>
    </div>
  </div>
);
