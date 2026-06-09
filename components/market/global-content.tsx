"use client";

import { GlobeHemisphereWestIcon, InfoIcon } from "@phosphor-icons/react";
import { LiveIndexBar } from "@/components/market/live-index-bar";
import { NewsStrip } from "@/components/market/news-strip";
import { UsMarketTable } from "@/components/market/us-market-table";
import { Reveal } from "@/components/motion/reveal";
import { US_INDEX_FALLBACK } from "@/lib/data/us-markets";
import { useDict } from "@/lib/i18n/context";

export function GlobalContent() {
  const d = useDict();
  const G = d.global;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-700)]">
            <GlobeHemisphereWestIcon weight="bold" className="size-4" aria-hidden />
            {G.eyebrow}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-balance text-[var(--color-fg-strong)]">
            {G.title}
          </h1>
          <p className="mt-2 max-w-2xl text-[var(--color-muted)]">{G.subtitle}</p>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-5 flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-xs leading-relaxed text-[var(--color-muted)]">
          <InfoIcon className="mt-0.5 size-4 shrink-0 text-[var(--color-info)]" aria-hidden />
          <span>{G.note}</span>
        </div>
      </Reveal>

      <div className="mt-6">
        <LiveIndexBar region="us" label={G.indices} fallback={US_INDEX_FALLBACK} />
      </div>

      <Reveal>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-3 text-sm font-semibold text-[var(--color-fg-strong)]">
              {G.watchlist}
            </h2>
            <UsMarketTable />
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold text-[var(--color-fg-strong)]">
              미국 마켓 뉴스
            </h2>
            <NewsStrip
              symbols={["^IXIC", "AAPL", "NVDA", "TSLA", "MSFT", "AMZN"]}
              title="오버나잇 헤드라인"
              limit={7}
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
