"use client";

import type { YearFinancials } from "@/lib/data/fundamentals";
import { moneyKR, pct } from "@/lib/format";
import { useI18n } from "@/lib/i18n/context";

function MiniBars({ values }: { values: number[] }) {
  const max = Math.max(...values.map((v) => Math.abs(v)), 1);
  return (
    <div className="flex h-8 items-end gap-1" aria-hidden>
      {values.map((v, i) => (
        <div
          key={i}
          className="w-2 rounded-sm bg-[var(--color-accent-400)]"
          style={{
            height: `${Math.max((Math.abs(v) / max) * 100, 8)}%`,
            opacity: 0.5 + (i / values.length) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

export function FinancialSummary({ financials }: { financials: YearFinancials[] }) {
  const { d, lang } = useI18n();
  const L = d.fundamentals.labels;

  const rows = [
    { key: "revenue", label: L.revenue, values: financials.map((f) => f.revenue) },
    {
      key: "operatingProfit",
      label: L.operatingProfit,
      values: financials.map((f) => f.operatingProfit),
    },
    { key: "netIncome", label: L.netIncome, values: financials.map((f) => f.netIncome) },
  ];

  const growth = (vals: number[]) => {
    const a = vals[vals.length - 2];
    const b = vals[vals.length - 1];
    if (!a || !b) return 0;
    return (b / a - 1) * 100;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-muted)]">
            <th className="py-2 pr-3 text-left font-medium">{d.fundamentals.threeYear}</th>
            {financials.map((f) => (
              <th key={f.year} className="px-3 py-2 text-right font-medium tnum">
                {f.year}
              </th>
            ))}
            <th className="px-3 py-2 text-right font-medium">YoY</th>
            <th
              className="hidden px-3 py-2 text-right font-medium sm:table-cell"
              aria-label="trend"
            />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const g = growth(r.values);
            const gColor =
              g > 0
                ? "text-[var(--color-up)]"
                : g < 0
                  ? "text-[var(--color-down)]"
                  : "text-[var(--color-flat)]";
            return (
              <tr key={r.key} className="border-b border-[var(--color-border)] last:border-0">
                <td className="py-2.5 pr-3 font-medium text-[var(--color-fg)]">{r.label}</td>
                {r.values.map((v, i) => (
                  <td key={i} className="tnum px-3 py-2.5 text-right text-[var(--color-fg-strong)]">
                    {moneyKR(v, lang)}
                  </td>
                ))}
                <td className={`tnum px-3 py-2.5 text-right font-semibold ${gColor}`}>{pct(g)}</td>
                <td className="hidden px-3 py-2.5 sm:table-cell">
                  <div className="flex justify-end">
                    <MiniBars values={r.values} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
