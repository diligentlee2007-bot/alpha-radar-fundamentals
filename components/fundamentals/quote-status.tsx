"use client";

import { useDict } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function QuoteStatus({
  source,
  fetchedAt,
  className,
}: {
  source: "live" | "sample";
  fetchedAt: number | null;
  className?: string;
}) {
  const d = useDict();
  const isLive = source === "live";
  const time =
    isLive && fetchedAt ? new Date(fetchedAt).toLocaleTimeString("ko-KR", { hour12: false }) : null;

  return (
    <span
      title={d.common.quoteNote}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        isLive
          ? "bg-[var(--color-accent-50)] text-[var(--color-accent-700)]"
          : "bg-[var(--color-surface-2)] text-[var(--color-muted)]",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isLive ? "animate-pulse bg-[var(--color-up)]" : "bg-[var(--color-flat)]",
        )}
        aria-hidden
      />
      {isLive ? d.common.quoteDelayed : d.common.quoteSample}
      {time && (
        <span className="tnum font-normal text-[var(--color-muted)]">
          · {d.common.quoteUpdated} {time}
        </span>
      )}
    </span>
  );
}
