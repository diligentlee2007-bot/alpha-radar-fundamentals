"use client";

import { ScalesIcon } from "@phosphor-icons/react";
import type { Stance, Valuation } from "@/lib/data/fundamentals";
import { ratio } from "@/lib/format";
import { useI18n } from "@/lib/i18n/context";

function stanceColor(s: Stance): string {
  if (s === "discount") return "text-[var(--color-up)]";
  if (s === "premium") return "text-[var(--color-down)]";
  return "text-[var(--color-flat)]";
}

export function ValuationCard({ valuation }: { valuation: Valuation }) {
  const { d, lang } = useI18n();
  const F = d.fundamentals;
  const x = (v: number) => (lang === "ko" ? `${ratio(v)}배` : `${ratio(v)}x`);

  const line = F.valuationLine
    .replace("{per}", ratio(valuation.per))
    .replace("{perStance}", F.valuationStance[valuation.perStance])
    .replace("{sectorPer}", ratio(valuation.sectorPer))
    .replace("{pbr}", ratio(valuation.pbr))
    .replace("{pbrStance}", F.valuationStance[valuation.pbrStance])
    .replace("{sectorPbr}", ratio(valuation.sectorPbr));

  const rows = [
    {
      label: "PER",
      value: x(valuation.per),
      sector: x(valuation.sectorPer),
      stance: valuation.perStance,
    },
    {
      label: "PBR",
      value: x(valuation.pbr),
      sector: x(valuation.sectorPbr),
      stance: valuation.pbrStance,
    },
  ];

  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2">
        <ScalesIcon weight="bold" className="size-4 text-[var(--color-accent-700)]" aria-hidden />
        <h3 className="text-sm font-semibold text-[var(--color-fg-strong)]">{F.valuation}</h3>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5"
          >
            <span className="text-sm font-medium text-[var(--color-fg)]">{r.label}</span>
            <span className="flex items-center gap-3 text-sm">
              <span className={`tnum font-semibold ${stanceColor(r.stance)}`}>{r.value}</span>
              <span className="tnum text-xs text-[var(--color-muted)]">
                {lang === "ko" ? "업종 평균" : "sector"} {r.sector}
              </span>
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{line}</p>
    </div>
  );
}
