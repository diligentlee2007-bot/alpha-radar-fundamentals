"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { DataSourceBadge } from "@/components/fundamentals/data-source-badge";
import { QuoteStatus } from "@/components/fundamentals/quote-status";
import { WatchButton } from "@/components/stocks/watch-button";
import { Badge } from "@/components/ui/badge";
import { Change } from "@/components/ui/change";
import type { DataMode } from "@/lib/data/opendart";
import { num } from "@/lib/format";
import { useI18n } from "@/lib/i18n/context";
import type { Market } from "@/lib/types";

export function CompanyHeader({
  name,
  code,
  market,
  sector,
  price,
  change,
  changePct,
  mode,
  quoteSource,
  quoteFetchedAt,
}: {
  name: string;
  code: string;
  market: Market;
  sector: string;
  price: number;
  change: number;
  changePct: number;
  mode: DataMode;
  quoteSource?: "live" | "sample";
  quoteFetchedAt?: number | null;
}) {
  const { d, lang } = useI18n();

  return (
    <div>
      <Link
        href="/fundamentals"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        {d.terminal.backToTerminal}
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[var(--color-fg-strong)]">{name}</h1>
            <Badge variant={market === "KOSPI" ? "kospi" : "kosdaq"}>{market}</Badge>
            <DataSourceBadge mode={mode} />
          </div>
          <p className="tnum mt-1 text-sm text-[var(--color-muted)]">
            {code} · {sector}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="tnum text-3xl font-bold text-[var(--color-fg-strong)]">
              {lang === "ko" ? `${num(price)}원` : `₩${num(price)}`}
            </p>
            <Change change={change} changePct={changePct} className="mt-1 justify-end" />
            {quoteSource && (
              <QuoteStatus
                source={quoteSource}
                fetchedAt={quoteFetchedAt ?? null}
                className="mt-2"
              />
            )}
          </div>
          <WatchButton code={code} size="md" withLabel />
        </div>
      </div>
    </div>
  );
}
