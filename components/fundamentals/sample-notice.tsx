"use client";

import { InfoIcon } from "@phosphor-icons/react";
import type { DataMode } from "@/lib/data/opendart";
import { useDict } from "@/lib/i18n/context";

export function SampleNotice({ mode }: { mode: DataMode }) {
  const d = useDict();
  if (mode === "live") return null;
  return (
    <div className="flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-xs leading-relaxed text-[var(--color-muted)]">
      <InfoIcon className="mt-0.5 size-4 shrink-0 text-[var(--color-info)]" aria-hidden />
      <span>{d.common.sampleNotice}</span>
    </div>
  );
}
