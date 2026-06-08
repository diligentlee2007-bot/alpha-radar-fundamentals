"use client";

import { StarIcon } from "@phosphor-icons/react";
import { useDict } from "@/lib/i18n/context";
import { useWatchlist } from "@/lib/store/watchlist";
import { cn } from "@/lib/utils";

export function WatchButton({
  code,
  size = "sm",
  withLabel = false,
}: {
  code: string;
  size?: "sm" | "md";
  withLabel?: boolean;
}) {
  const { has, toggle } = useWatchlist();
  const d = useDict();
  const watched = has(code);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(code);
      }}
      aria-pressed={watched}
      aria-label={watched ? d.common.watchRemove : d.common.watchAdd}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] transition-colors",
        size === "sm" ? "size-8 justify-center" : "px-3 py-2",
        watched
          ? "text-[var(--color-warning)] hover:bg-[var(--color-surface-2)]"
          : "text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]",
      )}
    >
      <StarIcon weight={watched ? "fill" : "regular"} className="size-4 shrink-0" />
      {withLabel && (
        <span className="text-sm font-medium">{watched ? d.common.watching : d.common.watch}</span>
      )}
    </button>
  );
}
