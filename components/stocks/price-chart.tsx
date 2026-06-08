"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { num } from "@/lib/format";
import type { Bar, Period } from "@/lib/types";
import { cn } from "@/lib/utils";

const CHART_HEIGHT = 288; // matches the h-72 container

const PERIODS: Period[] = ["1D", "1W", "1M", "3M", "1Y"];

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: Bar }[] }) {
  if (!active || !payload?.length) return null;
  const bar = payload[0]?.payload;
  if (!bar) return null;
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-2 shadow-[var(--shadow-soft)]">
      <p className="text-xs text-[var(--color-muted)]">{bar.t}</p>
      <p className="tnum text-sm font-semibold text-[var(--color-fg-strong)]">{num(bar.c)}원</p>
    </div>
  );
}

export function PriceChart({
  code,
  initialPeriod,
  initialSeries,
}: {
  code: string;
  initialPeriod: Period;
  initialSeries: Bar[];
}) {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [series, setSeries] = useState<Bar[]>(initialSeries);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const gradId = useId();

  // Measure the container ourselves and render a fixed-size chart only once we
  // have a real width. This avoids Recharts' ResponsiveContainer logging a
  // "width(-1)" warning on its first (unmeasured) paint, and avoids SSR mismatch.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Always fetch on mount and on period change so the chart shows real (delayed)
  // history; fall back to the server-provided sample series on any failure.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/stocks/${code}?period=${period}`)
      .then((r) => r.json())
      .then((d: { series: Bar[] }) => {
        if (!cancelled) setSeries(d.series?.length ? d.series : initialSeries);
      })
      .catch(() => {
        if (!cancelled) setSeries(initialSeries);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period, code, initialSeries]);

  const first = series[0]?.c ?? 0;
  const last = series[series.length - 1]?.c ?? 0;
  const up = last >= first;
  const color = up ? "var(--color-up)" : "var(--color-down)";

  return (
    <div>
      <div className="mb-4 flex justify-end gap-1">
        {PERIODS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            aria-pressed={period === p}
            className={cn(
              "tnum rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-semibold transition-colors",
              period === p
                ? "bg-[var(--color-accent-50)] text-[var(--color-accent-700)]"
                : "text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]",
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        className={cn("h-72 w-full transition-opacity", loading && "opacity-50")}
      >
        {width === 0 ? (
          <div className="size-full animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-surface-2)]" />
        ) : (
          <AreaChart
            width={width}
            height={CHART_HEIGHT}
            data={series}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="t"
              tick={{ fill: "var(--color-muted)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border)" }}
              minTickGap={40}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "var(--color-muted)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={52}
              tickFormatter={(v: number) => num(v)}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="c"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        )}
      </div>
    </div>
  );
}
