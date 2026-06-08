"use client";

import { useEffect, useState } from "react";
import type { LiveIndexResult } from "@/lib/data/live-quotes";
import type { IndexQuote } from "@/lib/types";

const REFRESH_MS = 60_000;

export interface LiveIndexState {
  indices: IndexQuote[];
  source: "live" | "sample";
  fetchedAt: number | null;
  loading: boolean;
}

/** Polls /api/indices on mount and every 60s for live (delayed) index + FX cards. */
export function useLiveIndices(region: "kr" | "us" = "kr"): LiveIndexState {
  const [state, setState] = useState<LiveIndexState>({
    indices: [],
    source: "sample",
    fetchedAt: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/indices?region=${region}`, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as LiveIndexResult;
        if (!cancelled) {
          setState({
            indices: data.indices ?? [],
            source: data.source ?? "sample",
            fetchedAt: data.fetchedAt ?? null,
            loading: false,
          });
        }
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      }
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [region]);

  return state;
}
