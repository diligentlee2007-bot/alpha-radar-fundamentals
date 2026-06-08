"use client";

import { useEffect, useState } from "react";
import type { LiveQuote, LiveResult } from "@/lib/data/live-quotes";

const REFRESH_MS = 60_000;

export interface UsQuoteState {
  quotes: Record<string, LiveQuote>;
  source: "live" | "sample";
  fetchedAt: number | null;
  loading: boolean;
}

/** Polls /api/quotes?symbols=… (raw US tickers) on mount and every 60s. */
export function useUsQuotes(symbols: string[]): UsQuoteState {
  const key = [...symbols].sort().join(",");
  const [state, setState] = useState<UsQuoteState>({
    quotes: {},
    source: "sample",
    fetchedAt: null,
    loading: symbols.length > 0,
  });

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/quotes?symbols=${encodeURIComponent(key)}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as LiveResult;
        if (!cancelled) {
          setState({
            quotes: data.quotes ?? {},
            source: data.source ?? "sample",
            fetchedAt: data.fetchedAt ?? null,
            loading: false,
          });
        }
      } catch {
        if (!cancelled) setState((s) => ({ ...s, source: "sample", loading: false }));
      }
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [key]);

  return state;
}
