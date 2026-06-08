"use client";

import { useEffect, useRef, useState } from "react";
import type { LiveQuote, LiveResult } from "@/lib/data/live-quotes";

const REFRESH_MS = 60_000;

export interface LiveState {
  quotes: Record<string, LiveQuote>;
  source: "live" | "sample";
  fetchedAt: number | null;
  loading: boolean;
}

/**
 * Polls /api/quotes for the given codes on mount and every 60s. Returns live
 * (delayed) quotes; on any failure it returns source:"sample" with no quotes so
 * callers keep showing the labeled sample price. The codes list is keyed by a
 * sorted string so the effect doesn't re-run on array identity changes.
 */
export function useLiveQuotes(codes: string[]): LiveState {
  const key = [...codes].sort().join(",");
  const [state, setState] = useState<LiveState>({
    quotes: {},
    source: "sample",
    fetchedAt: null,
    loading: codes.length > 0,
  });
  const keyRef = useRef(key);
  keyRef.current = key;

  useEffect(() => {
    if (!key) {
      setState({ quotes: {}, source: "sample", fetchedAt: null, loading: false });
      return;
    }
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`/api/quotes?codes=${encodeURIComponent(key)}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as LiveResult;
        if (!cancelled && keyRef.current === key) {
          setState({
            quotes: data.quotes ?? {},
            source: data.source ?? "sample",
            fetchedAt: data.fetchedAt ?? null,
            loading: false,
          });
        }
      } catch {
        if (!cancelled && keyRef.current === key) {
          setState((s) => ({ ...s, source: "sample", loading: false }));
        }
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
