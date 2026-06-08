"use client";

import { ChartBarIcon } from "@phosphor-icons/react";
import { FinancialSummary } from "@/components/fundamentals/financial-summary";
import { RatioGrid } from "@/components/fundamentals/ratio-grid";
import { RiskSummary } from "@/components/fundamentals/risk-summary";
import { ValuationCard } from "@/components/fundamentals/valuation-card";
import type { CompanyFundamentals } from "@/lib/data/fundamentals";
import { useDict } from "@/lib/i18n/context";

export function FundamentalsView({ data }: { data: CompanyFundamentals }) {
  const d = useDict();

  return (
    <div className="space-y-5">
      <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
        <div className="mb-3 flex items-center gap-2">
          <ChartBarIcon
            weight="bold"
            className="size-4 text-[var(--color-accent-700)]"
            aria-hidden
          />
          <h3 className="text-sm font-semibold text-[var(--color-fg-strong)]">
            {d.fundamentals.financialSummary}
          </h3>
        </div>
        <FinancialSummary financials={data.financials} />
      </div>

      <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
        <h3 className="mb-4 text-sm font-semibold text-[var(--color-fg-strong)]">
          {d.fundamentals.ratios}
        </h3>
        <RatioGrid ratios={data.ratios} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ValuationCard valuation={data.valuation} />
        <RiskSummary risks={data.risks} />
      </div>
    </div>
  );
}
