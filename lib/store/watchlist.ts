"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "krsd:watchlist";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();
let cache: string[] = [];
let initialized = false;

// Stable reference for SSR/first paint — must be cached, or useSyncExternalStore
// treats a fresh array each render as a change and can loop (React warns).
const SERVER_SNAPSHOT: string[] = [];
function getServerSnapshot(): string[] {
  return SERVER_SNAPSHOT;
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  if (!initialized) {
    cache = read();
    initialized = true;
  }
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = read();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): string[] {
  if (!initialized) {
    cache = read();
    initialized = true;
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore quota/availability errors
  }
  emit();
}

/** Reactive watchlist of stock codes backed by localStorage (cross-tab synced). */
export function useWatchlist() {
  const codes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((code: string) => {
    write(cache.includes(code) ? cache.filter((c) => c !== code) : [...cache, code]);
  }, []);

  const remove = useCallback((code: string) => {
    write(cache.filter((c) => c !== code));
  }, []);

  const has = useCallback((code: string) => codes.includes(code), [codes]);

  return { codes, toggle, remove, has };
}
