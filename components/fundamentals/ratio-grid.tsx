"use client";

import type { Ratios } from "@/lib/data/fundamentals";
import { num, pct, ratio } from "@/lib/format";
import { useI18n } from "@/lib/i18n/context";

export function RatioGrid({ ratios }: { ratios: Ratios }) {
  const { d, lang } = useI18n();
  const L = d.fundamentals.labels;
  const money = (v: number) => (lang === "ko" ? `${num(v)}원` : `₩${num(v)}`);
  const x = (v: number) => (lang === "ko" ? `${ratio(v)}배` : `${ratio(v)}x`);

  const groups: {
    title: string;
    items: { label: string; value: string; emphasize?: boolean }[];
  }[] = [
    {
      title: d.fundamentals.profitability,
      items: [
        { label: L.roe, value: pct(ratios.roe), emphasize: true },
        { label: L.roa, value: pct(ratios.roa) },
        { label: L.operatingMargin, value: pct(ratios.operatingMargin) },
        { label: L.netMargin, value: pct(ratios.netMargin) },
      ],
    },
    {
      title: d.fundamentals.stability,
      items: [
        { label: L.debtRatio, value: `${ratio(ratios.debtRatio, 0)}%` },
        { label: L.currentRatio, value: `${ratio(ratios.currentRatio, 0)}%` },
        { label: L.revenueGrowth, value: pct(ratios.revenueGrowth) },
        { label: L.dividendYield, value: `${ratio(ratios.dividendYield, 2)}%` },
      ],
    },
    {
      title: d.fundamentals.perShare,
      items: [
        { label: L.per, value: x(ratios.per), emphasize: true },
        { label: L.pbr, value: x(ratios.pbr), emphasize: true },
        { label: L.eps, value: money(ratios.eps) },
        { label: L.bps, value: money(ratios.bps) },
      ],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {groups.map((g) => (
        <div key={g.title}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-700)]">
            {g.title}
          </p>
          <dl className="grid grid-cols-2 gap-2">
            {g.items.map((it) => (
              <div
                key={it.label}
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] p-3"
              >
                <dt className="text-xs text-[var(--color-muted)]">{it.label}</dt>
                <dd
                  className={`tnum mt-1 font-semibold ${
                    it.emphasize ? "text-[var(--color-fg-strong)]" : "text-[var(--color-fg)]"
                  }`}
                >
                  {it.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
