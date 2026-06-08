"use client";

import { CheckCircleIcon, WarningIcon } from "@phosphor-icons/react";
import type { RiskFlag } from "@/lib/data/fundamentals";
import { useDict } from "@/lib/i18n/context";

export function RiskSummary({ risks }: { risks: RiskFlag[] }) {
  const d = useDict();
  const R = d.fundamentals.risk;

  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2">
        <WarningIcon weight="bold" className="size-4 text-[var(--color-warning)]" aria-hidden />
        <h3 className="text-sm font-semibold text-[var(--color-fg-strong)]">
          {d.fundamentals.riskSummary}
        </h3>
      </div>
      <ul className="mt-4 space-y-2">
        {risks.map((flag) => (
          <li
            key={flag}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--color-fg)]"
          >
            {flag === "limited" ? (
              <CheckCircleIcon
                weight="fill"
                className="mt-0.5 size-4 shrink-0 text-[var(--color-up)]"
                aria-hidden
              />
            ) : (
              <WarningIcon
                weight="fill"
                className="mt-0.5 size-4 shrink-0 text-[var(--color-warning)]"
                aria-hidden
              />
            )}
            <span>{R[flag]}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-[var(--color-border)] pt-3 text-xs leading-relaxed text-[var(--color-muted)]">
        {R.note}
      </p>
    </div>
  );
}
