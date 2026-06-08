"use client";

import { CaretDownIcon, CaretUpIcon, MagnifyingGlassIcon, StarIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { QuoteStatus } from "@/components/fundamentals/quote-status";
import { WatchButton } from "@/components/stocks/watch-button";
import { Badge } from "@/components/ui/badge";
import { Change } from "@/components/ui/change";
import { moneyKR, num, pct, ratio } from "@/lib/format";
import { useLiveQuotes } from "@/lib/hooks/use-live-quotes";
import { useI18n } from "@/lib/i18n/context";
import { useWatchlist } from "@/lib/store/watchlist";
import type { Market } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface TerminalRow {
  code: string;
  name: string;
  market: Market;
  sector: string;
  price: number;
  change: number;
  changePct: number;
  per: number;
  pbr: number;
  roe: number;
  marketCap: number;
  eps: number;
  bps: number;
  shares: number;
}

type SortKey = "marketCap" | "changePct" | "per" | "pbr" | "roe" | "price" | "name";

export function FundamentalsTable({ rows }: { rows: TerminalRow[] }) {
  const { d, lang } = useI18n();
  const { codes } = useWatchlist();
  const C = d.terminal.columns;
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [watchOnly, setWatchOnly] = useState(false);

  const allCodes = useMemo(() => rows.map((r) => r.code), [rows]);
  const live = useLiveQuotes(allCodes);

  // Merge live (delayed) prices in and re-derive price-dependent figures so each
  // row stays internally consistent (PER = live price ÷ trailing EPS, etc.).
  const liveRows = useMemo(() => {
    return rows.map((r) => {
      const lq = live.quotes[r.code];
      if (!lq) return r;
      return {
        ...r,
        price: lq.price,
        change: lq.change,
        changePct: lq.changePct,
        per: r.eps ? lq.price / r.eps : r.per,
        pbr: r.bps ? lq.price / r.bps : r.pbr,
        marketCap: Math.round(lq.price * r.shares),
      };
    });
  }, [rows, live.quotes]);

  const x = (v: number) => (lang === "ko" ? `${ratio(v)}배` : `${ratio(v)}x`);

  const columns: { key: SortKey; label: string; align: "left" | "right" }[] = [
    { key: "name", label: C.company, align: "left" },
    { key: "price", label: C.price, align: "right" },
    { key: "changePct", label: C.change, align: "right" },
    { key: "per", label: C.per, align: "right" },
    { key: "pbr", label: C.pbr, align: "right" },
    { key: "roe", label: C.roe, align: "right" },
    { key: "marketCap", label: C.marketCap, align: "right" },
  ];

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = liveRows;
    if (watchOnly) {
      const set = new Set(codes);
      list = list.filter((r) => set.has(r.code));
    }
    if (term)
      list = list.filter((r) => r.name.toLowerCase().includes(term) || r.code.includes(term));
    return [...list].sort((a, b) => {
      const av = sortKey === "name" ? a.name : a[sortKey];
      const bv = sortKey === "name" ? b.name : b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return dir === "asc" ? av.localeCompare(bv, "ko") : bv.localeCompare(av, "ko");
      }
      return dir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [liveRows, q, sortKey, dir, watchOnly, codes]);

  const onSort = (key: SortKey) => {
    if (key === sortKey) setDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setDir(key === "name" ? "asc" : "desc");
    }
  };

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
        <MagnifyingGlassIcon className="size-4 text-[var(--color-muted)]" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={d.terminal.search}
          aria-label={d.terminal.search}
          className="w-full bg-transparent text-sm text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setWatchOnly((v) => !v)}
          aria-pressed={watchOnly}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] border px-2.5 py-1.5 text-xs font-medium transition-colors",
            watchOnly
              ? "border-[var(--color-accent-100)] bg-[var(--color-accent-50)] text-[var(--color-accent-700)]"
              : "border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)]",
          )}
        >
          <StarIcon weight={watchOnly ? "fill" : "regular"} className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">
            {watchOnly ? d.terminal.showAll : d.terminal.watchlistOnly}
          </span>
        </button>
        <QuoteStatus
          source={live.source}
          fetchedAt={live.fetchedAt}
          className="hidden shrink-0 sm:inline-flex"
        />
        <span className="tnum hidden shrink-0 text-xs text-[var(--color-muted)] sm:block">
          {filtered.length} {d.terminal.count}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-muted)]">
              <th className="w-8 px-2 py-2.5" aria-label={d.terminal.watchColumn} />
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-3 py-2.5 font-medium",
                    col.align === "right" ? "text-right" : "text-left",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSort(col.key)}
                    className={cn(
                      "inline-flex items-center gap-1 hover:text-[var(--color-fg)]",
                      col.align === "right" && "flex-row-reverse",
                      sortKey === col.key && "text-[var(--color-fg-strong)]",
                    )}
                  >
                    {col.label}
                    {sortKey === col.key &&
                      (dir === "asc" ? (
                        <CaretUpIcon weight="bold" className="size-3" />
                      ) : (
                        <CaretDownIcon weight="bold" className="size-3" />
                      ))}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.code}
                className="group border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-2)]"
              >
                <td className="px-2 py-2.5">
                  <WatchButton code={r.code} />
                </td>
                <td className="px-3 py-2.5">
                  <Link href={`/fundamentals/${r.code}`} className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--color-fg-strong)] group-hover:text-[var(--color-accent-700)]">
                      {r.name}
                    </span>
                    <Badge variant={r.market === "KOSPI" ? "kospi" : "kosdaq"}>{r.market}</Badge>
                    <span className="tnum text-xs text-[var(--color-muted)]">{r.code}</span>
                  </Link>
                </td>
                <td className="tnum px-3 py-2.5 text-right font-semibold text-[var(--color-fg-strong)]">
                  {num(r.price)}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <Change change={r.change} changePct={r.changePct} size="sm" showValue={false} />
                </td>
                <td className="tnum px-3 py-2.5 text-right text-[var(--color-fg)]">{x(r.per)}</td>
                <td className="tnum px-3 py-2.5 text-right text-[var(--color-fg)]">{x(r.pbr)}</td>
                <td className="tnum px-3 py-2.5 text-right text-[var(--color-fg)]">{pct(r.roe)}</td>
                <td className="tnum px-3 py-2.5 text-right text-[var(--color-muted)]">
                  {moneyKR(r.marketCap, lang)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-12 text-center text-sm text-[var(--color-muted)]"
                >
                  {watchOnly && codes.length === 0 ? d.terminal.watchEmpty : d.terminal.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
