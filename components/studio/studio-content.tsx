"use client";

import {
  ArrowSquareOutIcon,
  ClipboardIcon,
  DownloadSimpleIcon,
  FilePdfIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { QuoteStatus } from "@/components/fundamentals/quote-status";
import { Reveal } from "@/components/motion/reveal";
import { Joosik, joosikSvg, type Mood } from "@/components/studio/joosik";
import { SEED_BY_CODE, STOCK_SEEDS } from "@/lib/data/stocks";
import { US_INDEX_FALLBACK, US_INSTRUMENTS, US_TICKERS } from "@/lib/data/us-markets";
import { num, pct } from "@/lib/format";
import { useLiveIndices } from "@/lib/hooks/use-live-indices";
import { useLiveQuotes } from "@/lib/hooks/use-live-quotes";
import { useNews } from "@/lib/hooks/use-news";
import { useUsQuotes } from "@/lib/hooks/use-us-quotes";
import { useI18n } from "@/lib/i18n/context";
import type { IndexQuote } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tone = "up" | "down" | "flat";
interface Row {
  l: string;
  r?: string;
  tone?: Tone;
}
interface Slide {
  kicker: string;
  title: string;
  rows: Row[];
  big?: boolean;
}

const toneOf = (p: number): Tone => (p > 0.1 ? "up" : p < -0.1 ? "down" : "flat");
const toneHex: Record<Tone, string> = { up: "#34d399", down: "#fb7185", flat: "#9aa4b2" };
const toneSoft: Record<Tone, string> = {
  up: "rgba(52,211,153,0.16)",
  down: "rgba(251,113,133,0.16)",
  flat: "rgba(148,163,184,0.14)",
};
const toneClass: Record<Tone, string> = {
  up: "bg-[var(--color-up-soft)] text-[var(--color-up)]",
  down: "bg-[var(--color-down-soft)] text-[var(--color-down)]",
  flat: "bg-[var(--color-surface-2)] text-[var(--color-flat)]",
};

const ALL_CODES = STOCK_SEEDS.map((s) => s.code);
const US_NAME = new Map(US_INSTRUMENTS.map((i) => [i.ticker, i.name]));
const trunc = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

function CopyButton({ text, label, done }: { text: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-fg)] hover:bg-[var(--color-surface-2)]"
    >
      <ClipboardIcon className="size-3.5" aria-hidden />
      {copied ? done : label}
    </button>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, h, r);
  else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lh: number,
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lh;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, yy);
  return yy;
}

export function StudioContent() {
  const { d, lang } = useI18n();
  const S = d.studio;
  const kr = useLiveIndices("kr");
  const us = useLiveIndices("us");
  const krQuotes = useLiveQuotes(ALL_CODES);
  const usQuotes = useUsQuotes(US_TICKERS);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, [lang]);

  const idx = (list: IndexQuote[], id: string) => list.find((i) => i.id === id);
  const usList = us.indices.length ? us.indices : US_INDEX_FALLBACK;
  const kospi = idx(kr.indices, "kospi");
  const kosdaq = idx(kr.indices, "kosdaq");
  const fx = idx(kr.indices, "usdkrw");
  const nasdaq = idx(usList, "nasdaq");
  const sp = idx(usList, "sp500");
  const dow = idx(usList, "dow");

  const krNotable = useMemo(
    () =>
      Object.values(krQuotes.quotes)
        .map((q) => ({ name: SEED_BY_CODE.get(q.code)?.name ?? q.code, changePct: q.changePct }))
        .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
        .slice(0, 3),
    [krQuotes.quotes],
  );
  const usMovers = useMemo(
    () =>
      Object.values(usQuotes.quotes)
        .map((q) => ({
          ticker: q.code,
          name: US_NAME.get(q.code) ?? q.code,
          changePct: q.changePct,
        }))
        .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
        .slice(0, 3),
    [usQuotes.quotes],
  );
  const newsSymbols = useMemo(() => usMovers.map((m) => m.ticker), [usMovers]);
  const { news } = useNews(newsSymbols);

  const fmtIdx = (v: number) =>
    v.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const idxRow = (i: IndexQuote | undefined, label: string): Row =>
    i
      ? { l: label, r: `${fmtIdx(i.value)} ${pct(i.changePct)}`, tone: toneOf(i.changePct) }
      : { l: label, r: "—" };

  const krTone: Mood = toneOf(kospi?.changePct ?? 0);
  const headline =
    krTone === "up" ? S.headlineUp : krTone === "down" ? S.headlineDown : S.headlineFlat;
  const volatile = Math.abs(kospi?.changePct ?? 0) >= 2 || Math.abs(nasdaq?.changePct ?? 0) >= 2;
  const riskLine = volatile ? S.riskVol : S.riskCalm;

  const newsRows: Row[] = news.length
    ? news
        .slice(0, 3)
        .map((n) => ({ l: `[${US_NAME.get(n.symbol) ?? n.symbol}] ${trunc(n.title, 56)}` }))
    : [{ l: S.overnightEmpty }];

  const slides: Slide[] = [
    { kicker: S.sec.overview, title: today || "—", rows: [{ l: headline }], big: true },
    {
      kicker: S.sec.korea,
      title: S.sec.korea,
      rows: [
        idxRow(kospi, "KOSPI"),
        idxRow(kosdaq, "KOSDAQ"),
        fx
          ? {
              l: "USD/KRW",
              r: `${num(fx.value)}원 ${pct(fx.changePct)}`,
              tone: toneOf(fx.changePct),
            }
          : { l: "USD/KRW", r: "—" },
      ],
    },
    {
      kicker: S.sec.us,
      title: S.sec.us,
      rows: [idxRow(nasdaq, "NASDAQ"), idxRow(sp, "S&P 500"), idxRow(dow, "Dow Jones")],
    },
    {
      kicker: S.sec.notable,
      title: S.sec.notable,
      rows: [
        ...krNotable.map((n) => ({ l: n.name, r: pct(n.changePct), tone: toneOf(n.changePct) })),
        ...usMovers
          .slice(0, 1)
          .map((n) => ({ l: n.name, r: pct(n.changePct), tone: toneOf(n.changePct) })),
      ].slice(0, 4),
    },
    { kicker: S.sec.overnight, title: S.overnightTitle, rows: newsRows },
    { kicker: S.sec.risk, title: S.sec.risk, rows: [{ l: riskLine }] },
  ];

  const briefText = [
    `${today} · ${S.brand} ${lang === "ko" ? "마켓 브리핑" : "Market Brief"}`,
    `[${S.sec.overview}] ${headline}`,
    `[${S.sec.korea}] KOSPI ${kospi ? `${fmtIdx(kospi.value)} (${pct(kospi.changePct)})` : "—"} · KOSDAQ ${kosdaq ? `${fmtIdx(kosdaq.value)} (${pct(kosdaq.changePct)})` : "—"} · USD/KRW ${fx ? `${num(fx.value)} (${pct(fx.changePct)})` : "—"}`,
    `[${S.sec.us}] NASDAQ ${nasdaq ? `${fmtIdx(nasdaq.value)} (${pct(nasdaq.changePct)})` : "—"} · S&P500 ${sp ? `${fmtIdx(sp.value)} (${pct(sp.changePct)})` : "—"} · Dow ${dow ? `${fmtIdx(dow.value)} (${pct(dow.changePct)})` : "—"}`,
    `[${S.sec.notable}] ${krNotable.map((n) => `${n.name} ${pct(n.changePct)}`).join(" / ") || "—"}`,
    `[${S.sec.overnight}] ${
      news
        .slice(0, 3)
        .map((n) => `${trunc(n.title, 70)} (${n.publisher})`)
        .join(" / ") || S.overnightEmpty
    }`,
    `[${S.sec.risk}] ${riskLine}`,
    S.disclaimer,
  ].join("\n");

  const hashtags =
    lang === "ko"
      ? "#주식 #증시 #코스피 #코스닥 #나스닥 #환율 #투자 #재테크 #경제 #주식이"
      : "#stocks #investing #KOSPI #Nasdaq #markets #finance #AlphaRadar";
  const caption = `${today} ${lang === "ko" ? "한국·미국 시장 한 줄 요약" : "Korea & US market in one line"}\n${headline}\n\n${news[0] ? `📰 ${trunc(news[0].title, 80)}\n\n` : ""}${S.disclaimer}\n\n${hashtags}`;

  async function downloadPng(slide: Slide, i: number) {
    const W = 1080;
    const H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    try {
      await document.fonts.ready;
    } catch {}

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#19241f");
    bg.addColorStop(0.5, "#15171c");
    bg.addColorStop(1, "#101216");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(560, 40, 0, 560, 40, 720);
    glow.addColorStop(0, "rgba(52,211,153,0.20)");
    glow.addColorStop(1, "rgba(52,211,153,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, 560);

    ctx.textAlign = "left";
    ctx.fillStyle = "#9aa4b2";
    ctx.font = '700 28px Inter, "Noto Sans KR", sans-serif';
    ctx.fillText("ALPHA RADAR · 주식이", 80, 92);
    ctx.textAlign = "right";
    ctx.fillStyle = "#6b7280";
    ctx.font = '500 26px Inter, "Noto Sans KR", sans-serif';
    ctx.fillText(today, W - 80, 92);
    ctx.textAlign = "left";

    ctx.fillStyle = "#34d399";
    roundRect(ctx, 80, 132, 72, 9, 4);
    ctx.fill();
    ctx.fillStyle = "#34d399";
    ctx.font = '800 30px Inter, "Noto Sans KR", sans-serif';
    ctx.fillText(slide.kicker.toUpperCase(), 80, 200);

    ctx.fillStyle = "#f3f4f6";
    ctx.font = `${slide.big ? "800 84px" : "800 60px"} Inter, "Noto Sans KR", sans-serif`;
    wrap(ctx, slide.title, 80, slide.big ? 300 : 270, W - 380, slide.big ? 92 : 70);

    let y = slide.big ? 560 : 440;
    for (const row of slide.rows) {
      if (row.r) {
        ctx.fillStyle = "#cbd5e1";
        ctx.font = '600 42px Inter, "Noto Sans KR", sans-serif';
        ctx.textAlign = "left";
        ctx.fillText(row.l, 80, y);
        ctx.font = '800 44px Inter, "Noto Sans KR", sans-serif';
        const tw = ctx.measureText(row.r).width;
        const pad = 28;
        const pw = tw + pad * 2;
        const px = W - 80 - pw;
        ctx.fillStyle = toneSoft[row.tone ?? "flat"];
        roundRect(ctx, px, y - 48, pw, 66, 18);
        ctx.fill();
        ctx.fillStyle = toneHex[row.tone ?? "flat"];
        ctx.fillText(row.r, px + pad, y);
        y += 104;
      } else {
        ctx.fillStyle = "#e5e7eb";
        ctx.font = `${slide.big ? "700 54px" : "500 38px"} Inter, "Noto Sans KR", sans-serif`;
        y = wrap(ctx, row.l, 80, y, W - 200, slide.big ? 70 : 52) + (slide.big ? 40 : 30);
      }
    }

    try {
      const bs = slide.big ? 360 : 168;
      const bird = new Image();
      bird.src = `data:image/svg+xml;utf8,${encodeURIComponent(joosikSvg(bs, krTone))}`;
      await bird.decode();
      ctx.drawImage(bird, W - bs - 56, H - bs - 132, bs, bs);
    } catch {}

    ctx.textAlign = "left";
    ctx.fillStyle = "#8b95a3";
    ctx.font = '600 26px Inter, "Noto Sans KR", sans-serif';
    ctx.fillText(`@alpha.radar  ·  ${i + 1}/${slides.length}`, 80, H - 116);
    ctx.fillStyle = "#6b7280";
    ctx.font = '400 22px Inter, "Noto Sans KR", sans-serif';
    wrap(ctx, S.disclaimer, 80, H - 74, W - 420, 30);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `alpha-radar-card-${i + 1}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  const source =
    kr.source === "live" || us.source === "live" || krQuotes.source === "live" ? "live" : "sample";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-700)]">
              <SparkleIcon weight="fill" className="size-4" aria-hidden />
              {S.eyebrow}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-balance text-[var(--color-fg-strong)]">
              {S.title}
            </h1>
            <p className="mt-2 max-w-2xl text-[var(--color-muted)]">{S.subtitle}</p>
            <div className="mt-3 flex items-center gap-2">
              <Joosik size={48} mood={krTone} />
              <div>
                <p className="text-sm font-semibold text-[var(--color-fg-strong)]">{S.bird.name}</p>
                <p className="text-xs text-[var(--color-muted)]">{S.bird.tagline}</p>
              </div>
            </div>
          </div>
          <QuoteStatus source={source} fetchedAt={kr.fetchedAt ?? us.fetchedAt} />
        </div>
      </Reveal>

      <Reveal>
        <p className="mt-5 rounded-[var(--radius-sm)] border border-[var(--color-accent-100)] bg-[var(--color-accent-50)] p-3 text-xs leading-relaxed text-[var(--color-accent-700)]">
          {S.humanInLoop}
        </p>
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(320px,400px)]">
        <Reveal>
          <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-[var(--color-fg-strong)]">
                {S.briefTitle}
              </h2>
              <CopyButton text={briefText} label={S.copyBrief} done={S.copied} />
            </div>
            <dl className="space-y-3">
              {slides
                .filter((s) => !s.big)
                .map((s) => (
                  <div
                    key={s.kicker}
                    className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] p-3"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-700)]">
                      {s.kicker}
                    </dt>
                    <dd className="mt-1.5 space-y-1">
                      {s.rows.map((r, ri) => (
                        <div
                          key={`${s.kicker}-${ri}`}
                          className={cn(
                            "text-sm",
                            r.r
                              ? "flex items-baseline justify-between gap-3"
                              : "leading-relaxed text-[var(--color-fg)]",
                          )}
                        >
                          <span className="text-[var(--color-fg)]">{r.l}</span>
                          {r.r && (
                            <span
                              className={cn(
                                "tnum shrink-0 rounded-full px-2 py-0.5 text-xs font-bold",
                                toneClass[r.tone ?? "flat"],
                              )}
                            >
                              {r.r}
                            </span>
                          )}
                        </div>
                      ))}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-[var(--color-fg-strong)]">
                {S.captionTitle}
              </h2>
              <CopyButton text={caption} label={S.copyCaption} done={S.copied} />
            </div>
            <pre className="whitespace-pre-wrap break-words rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] p-3 font-sans text-sm leading-relaxed text-[var(--color-muted)]">
              {caption}
            </pre>
            {news.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {news.slice(0, 3).map((n) => (
                  <li key={n.link} className="text-xs leading-relaxed">
                    <a
                      href={n.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1 text-[var(--color-muted)] hover:text-[var(--color-fg)]"
                    >
                      <ArrowSquareOutIcon
                        className="mt-0.5 size-3 shrink-0 text-[var(--color-accent-700)]"
                        aria-hidden
                      />
                      <span>
                        <span className="font-semibold text-[var(--color-fg)]">
                          [{US_NAME.get(n.symbol) ?? n.symbol}]
                        </span>{" "}
                        {trunc(n.title, 56)}{" "}
                        <span className="text-[var(--color-accent-700)]">· {n.publisher}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="mt-10">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-[var(--color-fg-strong)]">
              {S.carouselTitle}
            </h2>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-fg)] hover:bg-[var(--color-surface-2)]"
            >
              <FilePdfIcon className="size-3.5" aria-hidden />
              {S.savePdf}
            </button>
          </div>
          <div className="print-carousel grid grid-cols-2 gap-4 sm:grid-cols-3">
            {slides.map((s, i) => (
              <div key={s.kicker} className="flex flex-col">
                <div className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface-2)] to-[var(--color-bg)] p-4">
                  <div
                    className="pointer-events-none absolute opacity-95"
                    style={s.big ? { bottom: 6, right: 6 } : { top: 8, right: 8 }}
                  >
                    <Joosik size={s.big ? 56 : 24} mood={krTone} />
                  </div>
                  <div>
                    <div className="h-1 w-8 rounded bg-[var(--color-accent)]" aria-hidden />
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent-700)]">
                      {s.kicker}
                    </p>
                    <p
                      className={cn(
                        "mt-1 font-bold text-[var(--color-fg-strong)]",
                        s.big ? "text-base" : "text-sm",
                      )}
                    >
                      {s.title}
                    </p>
                    <div className="mt-3 space-y-1.5">
                      {s.rows.map((r, ri) => (
                        <div
                          key={`${s.kicker}-c-${ri}`}
                          className={cn(
                            "text-xs",
                            r.r
                              ? "flex items-baseline justify-between gap-2"
                              : "leading-snug text-[var(--color-fg)]",
                          )}
                        >
                          <span>{r.l}</span>
                          {r.r && (
                            <span
                              className={cn(
                                "tnum shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                                toneClass[r.tone ?? "flat"],
                              )}
                            >
                              {r.r}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[8px] leading-tight text-[var(--color-muted)]">
                    @alpha.radar · {i + 1}/{slides.length} · {S.disclaimer}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadPng(s, i)}
                  className="mt-2 inline-flex items-center justify-center gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 text-[11px] font-medium text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
                >
                  <DownloadSimpleIcon className="size-3" aria-hidden />
                  {S.downloadPng}
                </button>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
