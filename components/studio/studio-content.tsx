"use client";

import { ClipboardIcon, DownloadSimpleIcon, FilePdfIcon, SparkleIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { QuoteStatus } from "@/components/fundamentals/quote-status";
import { Reveal } from "@/components/motion/reveal";
import { SEED_BY_CODE, STOCK_SEEDS } from "@/lib/data/stocks";
import { US_INDEX_FALLBACK } from "@/lib/data/us-markets";
import { num, pct } from "@/lib/format";
import { useLiveIndices } from "@/lib/hooks/use-live-indices";
import { useLiveQuotes } from "@/lib/hooks/use-live-quotes";
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
  footer?: boolean;
}

const toneOf = (p: number): Tone => (p > 0.1 ? "up" : p < -0.1 ? "down" : "flat");
const toneHex: Record<Tone, string> = { up: "#34d399", down: "#f87171", flat: "#9aa4b2" };
const toneClass: Record<Tone, string> = {
  up: "text-[var(--color-up)]",
  down: "text-[var(--color-down)]",
  flat: "text-[var(--color-flat)]",
};

const ALL_CODES = STOCK_SEEDS.map((s) => s.code);

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

export function StudioContent() {
  const { d, lang } = useI18n();
  const S = d.studio;
  const kr = useLiveIndices("kr");
  const us = useLiveIndices("us");
  const quotes = useLiveQuotes(ALL_CODES);
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

  const notable = useMemo(() => {
    return Object.values(quotes.quotes)
      .map((q) => ({
        code: q.code,
        name: SEED_BY_CODE.get(q.code)?.name ?? q.code,
        changePct: q.changePct,
      }))
      .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
      .slice(0, 3);
  }, [quotes.quotes]);

  const fmtIdx = (v: number) =>
    v.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const idxRow = (i: IndexQuote | undefined, label: string): Row =>
    i
      ? { l: label, r: `${fmtIdx(i.value)}  ${pct(i.changePct)}`, tone: toneOf(i.changePct) }
      : { l: label, r: "—" };

  const krTone = toneOf(kospi?.changePct ?? 0);
  const headline =
    krTone === "up" ? S.headlineUp : krTone === "down" ? S.headlineDown : S.headlineFlat;
  const volatile = Math.abs(kospi?.changePct ?? 0) >= 2 || Math.abs(nasdaq?.changePct ?? 0) >= 2;
  const riskLine = volatile ? S.riskVol : S.riskCalm;

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
              r: `${num(fx.value)}원  ${pct(fx.changePct)}`,
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
      rows: notable.length
        ? notable.map((n) => ({ l: n.name, r: pct(n.changePct), tone: toneOf(n.changePct) }))
        : [{ l: "—" }],
    },
    { kicker: S.sec.risk, title: S.sec.risk, rows: [{ l: riskLine }], footer: true },
  ];

  // Plain-text brief (for copy) — cheap, computed each render
  const briefText = [
    `${today} · ${S.brand} ${lang === "ko" ? "마켓 브리핑" : "Market Brief"}`,
    `[${S.sec.overview}] ${headline}`,
    `[${S.sec.korea}] KOSPI ${kospi ? `${fmtIdx(kospi.value)} (${pct(kospi.changePct)})` : "—"} · KOSDAQ ${kosdaq ? `${fmtIdx(kosdaq.value)} (${pct(kosdaq.changePct)})` : "—"} · USD/KRW ${fx ? `${num(fx.value)} (${pct(fx.changePct)})` : "—"}`,
    `[${S.sec.us}] NASDAQ ${nasdaq ? `${fmtIdx(nasdaq.value)} (${pct(nasdaq.changePct)})` : "—"} · S&P500 ${sp ? `${fmtIdx(sp.value)} (${pct(sp.changePct)})` : "—"} · Dow ${dow ? `${fmtIdx(dow.value)} (${pct(dow.changePct)})` : "—"}`,
    `[${S.sec.notable}] ${notable.map((n) => `${n.name} ${pct(n.changePct)}`).join(" / ") || "—"}`,
    `[${S.sec.risk}] ${riskLine}`,
    S.disclaimer,
  ].join("\n");

  const hashtags =
    lang === "ko"
      ? "#주식 #증시 #코스피 #코스닥 #나스닥 #환율 #투자 #재테크 #경제 #AlphaRadar"
      : "#stocks #investing #KOSPI #KOSDAQ #Nasdaq #markets #finance #AlphaRadar";
  const caption = `${today} ${lang === "ko" ? "한국·미국 시장 한 줄 요약" : "Korea & US market in one line"}\n${headline}\n\n${S.disclaimer}\n\n${hashtags}`;

  // Canvas PNG export (1080×1350, IG portrait) — no extra package
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
    // bg
    ctx.fillStyle = "#16181d";
    ctx.fillRect(0, 0, W, H);
    // accent bar
    ctx.fillStyle = "#34d399";
    ctx.fillRect(80, 110, 90, 10);
    // kicker
    ctx.fillStyle = "#34d399";
    ctx.font = '700 30px Inter, "Noto Sans KR", sans-serif';
    ctx.fillText(slide.kicker.toUpperCase(), 80, 180);
    // title
    ctx.fillStyle = "#f3f4f6";
    ctx.font = '800 64px Inter, "Noto Sans KR", sans-serif';
    wrap(ctx, slide.title, 80, 260, W - 160, 74);
    // rows
    let y = slide.big ? 470 : 420;
    for (const row of slide.rows) {
      if (row.r) {
        ctx.fillStyle = "#cbd5e1";
        ctx.font = '600 38px Inter, "Noto Sans KR", sans-serif';
        ctx.textAlign = "left";
        ctx.fillText(row.l, 80, y);
        ctx.fillStyle = toneHex[row.tone ?? "flat"];
        ctx.font = '700 40px Inter, "Noto Sans KR", sans-serif';
        ctx.textAlign = "right";
        ctx.fillText(row.r, W - 80, y);
        ctx.textAlign = "left";
        y += 90;
      } else {
        ctx.fillStyle = "#e5e7eb";
        ctx.font = `${slide.big ? "700 52px" : "600 40px"} Inter, "Noto Sans KR", sans-serif`;
        y = wrap(ctx, row.l, 80, y, W - 160, slide.big ? 66 : 56) + 30;
      }
    }
    // footer
    ctx.fillStyle = "#6b7280";
    ctx.font = '500 24px Inter, "Noto Sans KR", sans-serif';
    ctx.fillText(`${S.brand}  ·  ${i + 1}/5`, 80, H - 110);
    ctx.fillStyle = "#6b7280";
    ctx.font = '400 22px Inter, "Noto Sans KR", sans-serif';
    wrap(ctx, S.disclaimer, 80, H - 70, W - 160, 30);

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
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, yy);
    return yy;
  }

  const source =
    kr.source === "live" || us.source === "live" || quotes.source === "live" ? "live" : "sample";

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
          </div>
          <QuoteStatus source={source} fetchedAt={kr.fetchedAt ?? us.fetchedAt} />
        </div>
      </Reveal>

      <Reveal>
        <p className="mt-5 flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--color-accent-100)] bg-[var(--color-accent-50)] p-3 text-xs leading-relaxed text-[var(--color-accent-700)]">
          {S.humanInLoop}
        </p>
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(320px,420px)]">
        {/* Brief */}
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
                      {s.rows.map((r, i) => (
                        <div
                          key={`${s.kicker}-${i}`}
                          className="flex items-baseline justify-between gap-3 text-sm"
                        >
                          <span className="text-[var(--color-fg)]">{r.l}</span>
                          {r.r && (
                            <span className={cn("tnum font-semibold", toneClass[r.tone ?? "flat"])}>
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

        {/* Caption */}
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
          </div>
        </Reveal>
      </div>

      {/* Carousel */}
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
          <div className="print-carousel grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {slides.map((s, i) => (
              <div key={s.kicker} className="flex flex-col">
                <div className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
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
                            r.r ? "flex items-baseline justify-between gap-2" : "leading-relaxed",
                          )}
                        >
                          <span
                            className={cn(
                              r.r
                                ? "text-[var(--color-fg)]"
                                : "font-medium text-[var(--color-fg-strong)]",
                            )}
                          >
                            {r.l}
                          </span>
                          {r.r && (
                            <span className={cn("tnum font-semibold", toneClass[r.tone ?? "flat"])}>
                              {r.r}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[8px] leading-tight text-[var(--color-muted)]">
                    {s.footer ? S.disclaimer : `${S.brand} · ${i + 1}/5`}
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
