import { Apple, Bandage, Cylinder, Milk, Newspaper, Smartphone, Wine, type LucideIcon } from "lucide-react";
import { useCurrentFrame } from "remotion";
import { SceneShell } from "../components/SceneShell";
import type { SceneId } from "../config/narration";
import { COLOR, EASE, FONT, tween } from "../config/theme";
import { cuesOf } from "../config/timing";

const ID: SceneId = "whatIsGarbage";

type Item = { icon: LucideIcon; label: string; color: string; tag: string; inBag: [number, number] };

const ITEMS: Item[] = [
  { icon: Apple, label: "Food waste", color: COLOR.wet, tag: "WET", inBag: [360, 640] },
  { icon: Milk, label: "Plastic", color: COLOR.dry, tag: "DRY", inBag: [470, 600] },
  { icon: Newspaper, label: "Paper", color: COLOR.dry, tag: "DRY", inBag: [400, 520] },
  { icon: Wine, label: "Glass", color: COLOR.dry, tag: "DRY", inBag: [490, 700] },
  { icon: Cylinder, label: "Metal", color: COLOR.dry, tag: "DRY", inBag: [330, 560] },
  { icon: Bandage, label: "Sanitary waste", color: COLOR.sanitary, tag: "SANITARY", inBag: [420, 690] },
  { icon: Smartphone, label: "Electronic waste", color: COLOR.ewaste, tag: "E-WASTE", inBag: [500, 480] },
];

const CARD_W = 224;
const CARD_H = 212;
const cardPos = (i: number): [number, number] => (i < 4 ? [760 + i * 252, 280] : [886 + (i - 4) * 252, 530]);

// Items called out by each explanatory line.
const FOCUS: Record<string, number[]> = { behave: [0, 3, 4], care: [5, 6] };

export const Scene02WhatIsGarbage: React.FC = () => {
  const frame = useCurrentFrame();
  const c = cuesOf(ID);
  const bagIn = tween(frame, [10, 40], [0, 1]);
  const lastOut = c.beat("items", 6, 7) + 16;
  const bagFade = tween(frame, [lastOut, lastOut + 20], [1, 0.45]);
  const notOne = tween(frame, [c.beat("notOne", 1, 2), c.beat("notOne", 1, 2) + 16], [0, 1]);

  const focusFor = (i: number) => {
    for (const [cueId, list] of Object.entries(FOCUS)) {
      if (list.includes(i)) {
        return tween(frame, [c.at(cueId), c.at(cueId) + 10, c.end(cueId), c.end(cueId) + 10], [0, 1, 1, 0]);
      }
    }
    return 0;
  };

  return (
    <SceneShell sceneId={ID}>
      {/* Transparent garbage bag */}
      <div style={{ position: "absolute", inset: 0, opacity: bagIn * bagFade }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path
            d="M420 330 C 380 330 360 360 330 380 C 250 420 230 560 250 660 C 268 750 330 780 420 780 C 510 780 572 750 590 660 C 610 560 590 420 510 380 C 480 360 460 330 420 330 Z"
            fill="#9FC3DD"
            fillOpacity={0.1}
            stroke="#B9D6EA"
            strokeOpacity={0.55}
            strokeWidth={3}
          />
          <path d="M392 330 Q 420 300 448 330 M404 322 L 392 296 M436 322 L 450 294" stroke="#B9D6EA" strokeOpacity={0.6} strokeWidth={4} fill="none" strokeLinecap="round" />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 170,
            top: 800,
            width: 500,
            textAlign: "center",
            fontFamily: FONT.mono,
            fontSize: 24,
            letterSpacing: 3,
            color: COLOR.accent,
            opacity: notOne,
          }}
        >
          NOT ONE MATERIAL
        </div>
      </div>

      {ITEMS.map((item, i) => {
        const Icon = item.icon;
        const leave = c.beat("items", i, 7);
        const t = tween(frame, [leave, leave + 18], [0, 1], EASE.inOut);
        const [cx, cy] = cardPos(i);
        const target: [number, number] = [cx + CARD_W / 2, cy + 78];
        const x = item.inBag[0] + (target[0] - item.inBag[0]) * t;
        const y = item.inBag[1] + (target[1] - item.inBag[1]) * t - Math.sin(t * Math.PI) * 120;
        const cardIn = tween(frame, [leave + 10, leave + 24], [0, 1]);
        const tagIn = tween(frame, [c.beat("streams", i, 9), c.beat("streams", i, 9) + 12], [0, 1]);
        const focus = focusFor(i);
        const stroke = tagIn > 0 ? item.color : COLOR.line;
        return (
          <div key={item.label}>
            <div
              style={{
                position: "absolute",
                left: cx,
                top: cy,
                width: CARD_W,
                height: CARD_H,
                borderRadius: 18,
                backgroundColor: "rgba(17, 26, 35, 0.9)",
                border: `2px solid ${stroke}`,
                boxShadow: focus > 0 ? `0 0 ${30 * focus}px ${item.color}88` : "none",
                scale: String(1 + focus * 0.05),
                opacity: cardIn,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 124,
                  textAlign: "center",
                  fontSize: 28,
                  fontWeight: 600,
                  color: COLOR.text,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 168,
                  translate: "-50% 0px",
                  padding: "3px 12px",
                  borderRadius: 6,
                  backgroundColor: `${item.color}26`,
                  color: item.color,
                  fontFamily: FONT.mono,
                  fontSize: 18,
                  letterSpacing: 2,
                  whiteSpace: "nowrap",
                  opacity: tagIn,
                }}
              >
                {item.tag}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: x - 34,
                top: y - 34,
                width: 68,
                height: 68,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: bagIn,
                scale: String(1 + t * 0.2 + focus * 0.1),
              }}
            >
              <Icon size={56} color={item.color} strokeWidth={1.7} />
            </div>
          </div>
        );
      })}
    </SceneShell>
  );
};
