"use client";

import { QuoteStatus } from "@/components/fundamentals/quote-status";
import { IndexCard } from "@/components/market/index-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { useLiveIndices } from "@/lib/hooks/use-live-indices";
import { useDict } from "@/lib/i18n/context";
import type { IndexQuote } from "@/lib/types";

/**
 * Index + FX strip backed by the live (delayed) source, with the server-rendered
 * sample cards as the initial fallback until the first poll resolves.
 */
export function LiveIndexBar({
  fallback = [],
  region = "kr",
  label,
}: {
  fallback?: IndexQuote[];
  region?: "kr" | "us";
  label?: string;
}) {
  const d = useDict();
  const live = useLiveIndices(region);
  const indices = live.indices.length ? live.indices : fallback;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--color-fg-strong)]">
          {label ?? d.terminal.indices}
        </p>
        <QuoteStatus source={live.source} fetchedAt={live.fetchedAt} />
      </div>
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indices.map((index) => (
          <StaggerItem key={index.id}>
            <IndexCard index={index} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
