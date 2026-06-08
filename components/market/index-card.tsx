"use client";

import { Sparkline } from "@/components/stocks/sparkline";
import { Change } from "@/components/ui/change";
import { num } from "@/lib/format";
import { useDict } from "@/lib/i18n/context";
import type { IndexQuote } from "@/lib/types";

export function IndexCard({ index }: { index: IndexQuote }) {
  const d = useDict();
  const valueText =
    index.unit === "원"
      ? num(index.value)
      : index.value.toLocaleString("ko-KR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-[var(--color-muted)]">{index.label}</p>
        <div className="flex items-center gap-1.5">
          {index.source === "sample" && (
            <span className="rounded-full bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-muted)]">
              {d.common.sampleTag}
            </span>
          )}
          <Sparkline data={index.spark} width={72} height={24} />
        </div>
      </div>
      <p className="tnum mt-2 text-2xl font-bold text-[var(--color-fg-strong)]">
        {valueText}
        {index.unit && (
          <span className="ml-1 text-base font-medium text-[var(--color-muted)]">{index.unit}</span>
        )}
      </p>
      <Change change={index.change} changePct={index.changePct} size="sm" className="mt-1" />
    </div>
  );
}
