"use client";

import { useEffect, useState } from "react";
import type { NewsItem } from "@/lib/data/live-quotes";

/** Fetch overnight US headlines for the given tickers (refreshes every 5 min). */
export function useNews(symbols: string[]): { news: NewsItem[]; loading: boolean } {
  const key = [...symbols].sort().join(",");
  const [state, setState] = useState<{ news: NewsItem[]; loading: boolean }>({
    news: [],
    loading: symbols.length > 0,
  });

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/news?symbols=${encodeURIComponent(key)}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { news: NewsItem[] };
        if (!cancelled) setState({ news: data.news ?? [], loading: false });
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      }
    };
    load();
    const id = setInterval(load, 300_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [key]);

  return state;
}
