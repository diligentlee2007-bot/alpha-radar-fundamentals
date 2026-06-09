/**
 * Server-side card image renderer for the daily auto-email.
 * Uses next/og (Satori + resvg) to turn a CardSpec into a 1080×1350 PNG — no
 * browser, no paid image AI — so a Vercel Cron can generate the day's market
 * cards headlessly and email them. Korean text is rendered with Pretendard
 * (fetched + cached). Cards reflect the market mood via the shared THEMES.
 */

import { ImageResponse } from "next/og";
import { type Scene, THEMES } from "@/lib/studio/scene";

export const CARD_W = 1080;
export const CARD_H = 1350;

export type Tone = "up" | "down" | "flat";

export interface StatRow {
  label: string;
  value: string;
  sub?: string;
  tone?: Tone;
}

export interface CardSpec {
  scene: Scene;
  /** Small pill above the title, e.g. "오늘의 한국 증시 · 6/9". */
  kicker: string;
  /** Big headline. */
  title: string;
  /** Optional large stat shown under the title (e.g. "코스피 -8.3%"). */
  bigStat?: { text: string; tone: Tone };
  rows?: StatRow[];
  /** A line of body text (news headline, risk note…). */
  body?: string;
  /** Footer note (left side); brand + page added automatically. */
  footer?: string;
  /** 1-based page number for the "n/5" indicator. */
  page?: number;
  pageCount?: number;
  /** Absolute origin to load the mascot PNG from (e.g. http://localhost:3000). */
  origin: string;
  /** Optional AI-generated scene as a full-bleed background (data: URL). When
   *  set, the card composites text over the illustration (no flat gradient /
   *  no mascot sticker — the bull is already in the illustration). */
  bgImageUrl?: string;
}

const UP = "#34d399";
const DOWN = "#f87171";
const FLAT = "#cbd5e1";
function toneColor(t?: Tone): string {
  return t === "up" ? UP : t === "down" ? DOWN : FLAT;
}

// ---- Fonts (Pretendard, fetched once and cached) -------------------------
const FONT_BASE =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static";
const FONT_FILES: { file: string; weight: 400 | 700 | 800 }[] = [
  { file: "Pretendard-Regular.otf", weight: 400 },
  { file: "Pretendard-Bold.otf", weight: 700 },
  { file: "Pretendard-ExtraBold.otf", weight: 800 },
];

let fontCache:
  | { name: string; data: ArrayBuffer; weight: 400 | 700 | 800; style: "normal" }[]
  | null = null;

async function loadFonts() {
  if (fontCache) return fontCache;
  const loaded = await Promise.all(
    FONT_FILES.map(async ({ file, weight }) => {
      const res = await fetch(`${FONT_BASE}/${file}`);
      if (!res.ok) throw new Error(`font fetch failed: ${file} (${res.status})`);
      return {
        name: "Pretendard",
        data: await res.arrayBuffer(),
        weight,
        style: "normal" as const,
      };
    }),
  );
  fontCache = loaded;
  return loaded;
}

// ---- Decor: a few lightweight shapes per scene ---------------------------
function decor(scene: Scene): React.ReactNode[] {
  const t = THEMES[scene];
  const nodes: React.ReactNode[] = [];
  if (t.decor === "rain") {
    for (let i = 0; i < 14; i++) {
      nodes.push(
        <div
          key={`r${i}`}
          style={{
            position: "absolute",
            top: (i * 97) % 900,
            left: (i * 137) % 1040,
            width: 3,
            height: 46,
            background: "rgba(148,163,184,0.35)",
            transform: "rotate(18deg)",
            borderRadius: 3,
          }}
        />,
      );
    }
  } else if (t.decor === "stars" || t.decor === "rocket") {
    for (let i = 0; i < 18; i++) {
      const s = (i % 3) + 3;
      nodes.push(
        <div
          key={`s${i}`}
          style={{
            position: "absolute",
            top: (i * 71) % 760,
            left: (i * 151) % 1030,
            width: s,
            height: s,
            background: "rgba(226,232,240,0.7)",
            borderRadius: s,
          }}
        />,
      );
    }
  }
  return nodes;
}

/** Build the JSX element for one card. */
function CardEl(c: CardSpec): React.ReactElement {
  const t = THEMES[c.scene];
  const accent = t.accent;
  const illustrated = !!c.bgImageUrl;
  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        padding: 72,
        backgroundColor: t.css[2],
        backgroundImage: `linear-gradient(155deg, ${t.css[0]}, ${t.css[1]} 52%, ${t.css[2]})`,
        color: "#f8fafc",
        fontFamily: "Pretendard",
        overflow: "hidden",
      }}
    >
      {illustrated ? (
        <>
          {/* biome-ignore lint/performance/noImgElement: og renderer requires raw img */}
          <img
            src={c.bgImageUrl}
            width={CARD_W}
            height={CARD_H}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: CARD_W,
              height: CARD_H,
              objectFit: "cover",
            }}
          />
          {/* scrim for headline/footer legibility */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: CARD_W,
              height: CARD_H,
              backgroundImage:
                "linear-gradient(180deg, rgba(8,11,20,0.74) 0%, rgba(8,11,20,0.30) 30%, rgba(8,11,20,0.05) 50%, rgba(8,11,20,0.55) 100%)",
            }}
          />
        </>
      ) : (
        decor(c.scene)
      )}
      {/* accent rail */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 14,
          height: CARD_H,
          background: accent,
        }}
      />

      {/* kicker pill */}
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            background: accent,
            color: "#06251c",
            fontWeight: 800,
            fontSize: 30,
            padding: "12px 26px",
            borderRadius: 999,
            letterSpacing: -0.5,
          }}
        >
          {c.kicker}
        </div>
      </div>

      {/* title */}
      <div
        style={{
          marginTop: 34,
          fontSize: c.title.length > 16 ? 86 : 104,
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: -2,
          maxWidth: 880,
          display: "flex",
          textShadow: illustrated ? "0 3px 22px rgba(0,0,0,0.62)" : "none",
        }}
      >
        {c.title}
      </div>

      {/* big stat */}
      {c.bigStat ? (
        <div
          style={{
            marginTop: 26,
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: -2,
            color: toneColor(c.bigStat.tone),
            display: "flex",
            textShadow: illustrated ? "0 3px 22px rgba(0,0,0,0.62)" : "none",
          }}
        >
          {c.bigStat.text}
        </div>
      ) : null}

      {/* body text */}
      {c.body ? (
        <div
          style={{
            marginTop: 28,
            fontSize: 40,
            fontWeight: 400,
            lineHeight: 1.34,
            color: "#e2e8f0",
            maxWidth: 760,
            display: "flex",
          }}
        >
          {c.body}
        </div>
      ) : null}

      {/* stat rows */}
      {c.rows && c.rows.length > 0 ? (
        <div
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxWidth: 720,
          }}
        >
          {c.rows.map((r) => (
            <div
              key={r.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(15,23,42,0.45)",
                border: "1px solid rgba(148,163,184,0.18)",
                borderRadius: 22,
                padding: "22px 30px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 38, fontWeight: 700 }}>{r.label}</div>
                {r.sub ? <div style={{ fontSize: 26, color: "#94a3b8" }}>{r.sub}</div> : null}
              </div>
              <div style={{ fontSize: 44, fontWeight: 800, color: toneColor(r.tone) }}>
                {r.value}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* footer */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: accent }}>Alpha Radar · 주식이</div>
          <div style={{ fontSize: 22, color: "#94a3b8" }}>
            {c.footer ?? "교육용 · 투자 자문 아님"}
          </div>
        </div>
        {c.page && c.pageCount ? (
          <div style={{ fontSize: 26, fontWeight: 700, color: "#cbd5e1", display: "flex" }}>
            {c.page} / {c.pageCount}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Render a single card to a PNG Buffer. */
export async function renderCardPng(spec: CardSpec): Promise<Buffer> {
  const fonts = await loadFonts();
  const img = new ImageResponse(CardEl(spec), { width: CARD_W, height: CARD_H, fonts });
  return Buffer.from(await img.arrayBuffer());
}
