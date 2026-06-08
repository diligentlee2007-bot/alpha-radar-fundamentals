"use client";

import { QuoteStatus } from "@/components/fundamentals/quote-status";
import { WatchButton } from "@/components/stocks/watch-button";
import { Badge } from "@/components/ui/badge";
import { Change } from "@/components/ui/change";
import { US_INSTRUMENTS, US_TICKERS } from "@/lib/data/us-markets";
import { useUsQuotes } from "@/lib/hooks/use-us-quotes";
import { useDict } from "@/lib/i18n/context";

function usd(n: number): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function UsMarketTable() {
  const d = useDict();
  const G = d.global;
  const live = useUsQuotes(US_TICKERS);

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] px-4 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-2)] px-2.5 py-1 text-xs font-semibold text-[var(--color-muted)]">
          {G.priceOnly}
        </span>
        <QuoteStatus source={live.source} fetchedAt={live.fetchedAt} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-muted)]">
              <th className="w-8 px-2 py-2.5" aria-label={d.terminal.watchColumn} />
              <th className="px-3 py-2.5 text-left font-medium">{G.columns.company}</th>
              <th className="px-3 py-2.5 text-right font-medium">{G.columns.price}</th>
              <th className="px-3 py-2.5 text-right font-medium">{G.columns.change}</th>
            </tr>
          </thead>
          <tbody>
            {US_INSTRUMENTS.map((inst) => {
              const q = live.quotes[inst.ticker];
              return (
                <tr
                  key={inst.ticker}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-2)]"
                >
                  <td className="px-2 py-2.5">
                    <WatchButton code={inst.ticker} />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--color-fg-strong)]">
                        {inst.name}
                      </span>
                      <Badge variant={inst.kind === "etf" ? "kosdaq" : "accent"}>
                        {inst.ticker}
                      </Badge>
                    </div>
                    <span className="text-xs text-[var(--color-muted)]">{inst.sector}</span>
                  </td>
                  <td className="tnum px-3 py-2.5 text-right font-semibold text-[var(--color-fg-strong)]">
                    {q ? usd(q.price) : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {q ? (
                      <Change
                        change={q.change}
                        changePct={q.changePct}
                        size="sm"
                        showValue={false}
                      />
                    ) : (
                      <span className="text-xs text-[var(--color-muted)]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
