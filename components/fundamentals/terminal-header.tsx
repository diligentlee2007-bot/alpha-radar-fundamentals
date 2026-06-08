"use client";

import { ClockIcon } from "@phosphor-icons/react";
import { DataSourceBadge } from "@/components/fundamentals/data-source-badge";
import { Reveal } from "@/components/motion/reveal";
import type { DataMode } from "@/lib/data/opendart";
import { useDict } from "@/lib/i18n/context";

export function TerminalHeader({ mode, asOf }: { mode: DataMode; asOf: string }) {
  const d = useDict();
  return (
    <Reveal>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[var(--color-accent-700)]">
              Alpha Radar Fundamentals
            </p>
            <DataSourceBadge mode={mode} />
          </div>
          <h1 className="mt-1 text-3xl font-bold text-balance text-[var(--color-fg-strong)]">
            {d.terminal.title}
          </h1>
          <p className="mt-2 max-w-2xl text-[var(--color-muted)]">{d.terminal.subtitle}</p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-muted)]">
          <ClockIcon className="size-3.5" aria-hidden />
          {d.terminal.asOf} {asOf}
        </span>
      </div>
    </Reveal>
  );
}
