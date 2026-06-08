"use client";

import { ArrowRightIcon, WarningIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DataSourceBadge } from "@/components/fundamentals/data-source-badge";
import { QuoteStatus } from "@/components/fundamentals/quote-status";
import { Badge } from "@/components/ui/badge";
import { type CompanyFundamentals, withLivePrice } from "@/lib/data/fundamentals";
import { moneyKR, num, pct, ratio } from "@/lib/format";
import { useLiveQuotes } from "@/lib/hooks/use-live-quotes";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function FundamentalsDemo({ companies }: { companies: CompanyFundamentals[] }) {
  const { d, lang } = useI18n();
  const codes = useMemo(() => companies.map((c) => c.code), [companies]);
  const live = useLiveQuotes(codes);
  const [active, setActive] = useState(companies[0]?.code ?? "");
  const base = companies.find((c) => c.code === active) ?? companies[0];
  if (!base) return null;
  const lq = live.quotes[base.code];
  const data = lq ? withLivePrice(base, lq.price) : base;

  const L = d.fundamentals.labels;
  const x = (v: number) => (lang === "ko" ? `${ratio(v)}배` : `${ratio(v)}x`);
  const F = d.fundamentals;

  const metrics = [
    { label: L.roe, value: pct(data.ratios.roe) },
    { label: L.per, value: x(data.ratios.per) },
    { label: L.pbr, value: x(data.ratios.pbr) },
    { label: L.netMargin, value: pct(data.ratios.netMargin) },
    { label: L.debtRatio, value: `${ratio(data.ratios.debtRatio, 0)}%` },
    { label: L.revenueGrowth, value: pct(data.ratios.revenueGrowth) },
  ];

  const valuationLine = F.valuationLine
    .replace("{per}", ratio(data.valuation.per))
    .replace("{perStance}", F.valuationStance[data.valuation.perStance])
    .replace("{sectorPer}", ratio(data.valuation.sectorPer))
    .replace("{pbr}", ratio(data.valuation.pbr))
    .replace("{pbrStance}", F.valuationStance[data.valuation.pbrStance])
    .replace("{sectorPbr}", ratio(data.valuation.sectorPbr));

  const topRisk = data.risks[0];

  return (
    <div className="glass rounded-[var(--radius-lg)] p-1.5 shadow-[var(--shadow-lift)]">
      <div className="rounded-[calc(var(--radius-lg)-6px)] bg-[var(--color-bg)] p-5">
        {/* Switcher */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            {d.hero.demoTitle}
          </span>
          <DataSourceBadge mode="sample" />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {companies.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setActive(c.code)}
              aria-pressed={active === c.code}
              className={cn(
                "rounded-[var(--radius-sm)] px-2.5 py-1.5 text-xs font-medium transition-colors",
                active === c.code
                  ? "bg-[var(--color-accent-50)] text-[var(--color-accent-700)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="mt-4 flex items-end justify-between border-t border-[var(--color-border)] pt-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[var(--color-fg-strong)]">{data.name}</h3>
              <Badge variant={data.market === "KOSPI" ? "kospi" : "kosdaq"}>{data.market}</Badge>
            </div>
            <p className="tnum mt-0.5 text-xs text-[var(--color-muted)]">
              {data.code} · {data.sector}
            </p>
          </div>
          <div className="flex flex-col items-end text-right">
            <p className="tnum text-xl font-bold text-[var(--color-fg-strong)]">
              {lang === "ko" ? `${num(data.price)}원` : `₩${num(data.price)}`}
            </p>
            <p className="tnum text-xs text-[var(--color-muted)]">
              {L.marketCap} {moneyKR(data.marketCap, lang)}
            </p>
            <QuoteStatus source={live.source} fetchedAt={live.fetchedAt} className="mt-1.5" />
          </div>
        </div>

        {/* Metric strip */}
        <dl className="mt-4 grid grid-cols-3 gap-2">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5"
            >
              <dt className="text-[11px] text-[var(--color-muted)]">{m.label}</dt>
              <dd className="tnum mt-0.5 text-sm font-semibold text-[var(--color-fg-strong)]">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Valuation + risk */}
        <p className="mt-4 text-xs leading-relaxed text-[var(--color-muted)]">{valuationLine}</p>
        {topRisk && topRisk !== "limited" && (
          <p className="mt-2 flex items-start gap-1.5 text-xs text-[var(--color-fg)]">
            <WarningIcon
              weight="fill"
              className="mt-0.5 size-3.5 shrink-0 text-[var(--color-warning)]"
              aria-hidden
            />
            <span>
              {F.risk[topRisk]}
              {data.risks.length > 1 && (
                <span className="text-[var(--color-muted)]">
                  {lang === "ko"
                    ? ` 외 ${data.risks.length - 1}건`
                    : ` +${data.risks.length - 1} more`}
                </span>
              )}
            </span>
          </p>
        )}

        <Link
          href={`/fundamentals/${data.code}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent-700)] hover:text-[var(--color-accent)]"
        >
          {lang === "ko" ? "전체 분석 보기" : "Open full analysis"}
          <ArrowRightIcon weight="bold" className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
