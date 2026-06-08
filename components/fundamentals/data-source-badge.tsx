"use client";

import { DatabaseIcon, SealCheckIcon } from "@phosphor-icons/react";
import type { DataMode } from "@/lib/data/opendart";
import { useDict } from "@/lib/i18n/context";

export function DataSourceBadge({ mode }: { mode: DataMode }) {
  const d = useDict();
  const isLive = mode === "live";
  const Icon = isLive ? SealCheckIcon : DatabaseIcon;

  return (
    <span
      title={isLive ? d.common.liveTooltip : d.common.sampleTooltip}
      className={
        isLive
          ? "inline-flex items-center gap-1.5 rounded-full bg-[var(--color-up-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--color-up)]"
          : "inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-2)] px-2.5 py-1 text-xs font-semibold text-[var(--color-muted)]"
      }
    >
      <Icon weight="fill" className="size-3.5" aria-hidden />
      {isLive ? d.common.live : d.common.sample}
    </span>
  );
}
