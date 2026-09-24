import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, EASE, FONT, tween } from "../data/theme";

// Victorian cut-paper silhouette in a gilt oval: a period portrait form that
// shows a person's role without inventing a likeness. Always labelled as a
// silhouette on screen.

const PROFILES = {
  // British officer, 1870s: side whiskers, high military collar.
  resident: {
    head: "M150,470 C142,430 138,400 132,372 C112,350 100,320 104,284 C104,236 120,196 152,172 C184,150 226,148 252,170 C266,184 272,206 272,232 L270,246 C284,262 296,278 302,292 C294,298 284,300 278,304 C284,312 286,318 282,324 C286,330 284,338 278,344 C282,354 280,366 270,378 C258,394 244,402 232,408 C228,420 230,440 236,470 Z",
    extra: "M118,246 C112,280 118,326 150,366 C170,388 204,404 232,408 C216,392 196,362 188,322 C170,300 150,272 118,246 Z",
    body: "M-30,660 C0,560 70,488 146,466 L234,466 C318,484 392,548 430,660 Z",
    collar: "M136,448 L244,448 L250,476 L130,476 Z",
  },
  // Maratha ruler: pagdi turban with ornament, moustache, necklaces.
  ruler: {
    head: "M150,470 C142,430 138,404 132,378 C114,356 104,330 106,296 C92,286 88,262 96,236 C104,196 132,160 178,146 C220,134 262,142 288,166 C300,178 300,196 290,208 C278,214 272,220 272,234 L270,248 C284,264 296,280 302,294 C294,300 284,302 278,306 C290,310 296,318 290,326 C284,332 280,336 280,344 C282,356 278,368 268,380 C256,394 244,402 232,408 C228,420 230,440 236,470 Z",
    extra: "",
    body: "M-40,660 C-6,556 70,486 146,466 L234,466 C322,482 400,550 440,660 Z",
    collar: "",
  },
};

export const Portrait: React.FC<{
  kind: keyof typeof PROFILES;
  name: string;
  role: string;
  at: number;
  x?: number;
  size?: number;
}> = ({ kind, name, role, at, x = 50, size = 1 }) => {
  const frame = useCurrentFrame();
  const p = tween(frame, [at, at + 40], [0, 1], EASE.out);
  const cut = tween(frame, [at + 10, at + 70], [0, 1], EASE.out);
  const prof = PROFILES[kind];
  return (
    <AbsoluteFill style={{ opacity: p, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: `${x}%`, top: "46%", transform: `translate(-50%, -50%) scale(${size * 0.92 * (0.96 + 0.04 * p)})` }}>
        <svg width="520" height="640" viewBox="0 0 520 640">
          <defs>
            <radialGradient id={`pv-${kind}`} cx="50%" cy="42%">
              <stop offset="0" stopColor="#e8dcc0" />
              <stop offset="0.7" stopColor="#cbb88e" />
              <stop offset="1" stopColor="#8f7a55" />
            </radialGradient>
            <linearGradient id="gilt" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f1d18c" />
              <stop offset="0.35" stopColor="#8e6a2e" />
              <stop offset="0.6" stopColor="#e2b86a" />
              <stop offset="1" stopColor="#6d4f1f" />
            </linearGradient>
            <clipPath id={`pc-${kind}`}>
              <ellipse cx="260" cy="300" rx="206" ry="262" />
            </clipPath>
            <filter id="paper">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.18" />
              </feComponentTransfer>
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
          <ellipse cx="260" cy="300" rx="236" ry="292" fill="url(#gilt)" />
          <ellipse cx="260" cy="300" rx="222" ry="278" fill="#3a2a16" />
          <ellipse cx="260" cy="300" rx="212" ry="268" fill="url(#gilt)" opacity={0.6} />
          <ellipse cx="260" cy="300" rx="206" ry="262" fill={`url(#pv-${kind})`} />
          <g clipPath={`url(#pc-${kind})`} transform={`translate(${36 + (1 - cut) * -30} ${6}) scale(1.14)`} opacity={cut}>
            <path d={prof.body} fill="#0b0907" />
            {prof.extra ? <path d={prof.extra} fill="#0b0907" /> : null}
            <path d={prof.head} fill="#0b0907" />
            {prof.collar ? <path d={prof.collar} fill="#1c1812" stroke="#b8894a" strokeWidth={2} strokeOpacity={0.8} /> : null}
            {kind === "ruler" ? (
              <g>
                <path d="M130,196 C160,176 210,168 256,176" stroke="#2b2118" strokeWidth={3} fill="none" />
                <path d="M118,226 C150,204 204,196 262,204" stroke="#2b2118" strokeWidth={3} fill="none" />
                <circle cx="262" cy="170" r="9" fill="#d8b36a" />
                <path d="M262,162 l6,-30 l4,30 Z" fill="#d8b36a" />
                <circle cx="176" cy="332" r="6" fill="#e6dccb" />
                {new Array(12).fill(0).map((_, i) => (
                  <circle key={i} cx={166 + i * 9} cy={454 + Math.sin(i / 3.8) * 12} r={3.6} fill="#e6dccb" opacity={0.9} />
                ))}
                {new Array(14).fill(0).map((_, i) => (
                  <circle key={`b${i}`} cx={156 + i * 9} cy={474 + Math.sin(i / 4.4) * 16} r={3.6} fill="#e6dccb" opacity={0.8} />
                ))}
              </g>
            ) : (
              <g>
                <path d="M300,560 C330,548 360,552 380,572" stroke="#b8894a" strokeWidth={4} fill="none" opacity={0.7} />
                <circle cx="220" cy="540" r="5" fill="#b8894a" opacity={0.8} />
                <circle cx="222" cy="574" r="5" fill="#b8894a" opacity={0.8} />
              </g>
            )}
          </g>
          <ellipse cx="260" cy="300" rx="206" ry="262" filter="url(#paper)" fill="#fff" />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: `calc(${x}% + 270px)`,
          top: "46%",
          transform: "translateY(-50%)",
          textAlign: "left",
          opacity: tween(frame, [at + 30, at + 60], [0, 1]),
        }}
      >
        <div style={{ fontFamily: FONT.serif, fontSize: 58, fontWeight: 600, color: COLOR.text, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>{name}</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 20, color: COLOR.textDim, letterSpacing: "0.18em", marginTop: 10, whiteSpace: "nowrap" }}>{role}</div>
      </div>
    </AbsoluteFill>
  );
};
