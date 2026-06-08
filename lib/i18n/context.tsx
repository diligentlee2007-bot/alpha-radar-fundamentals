"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { DICT, type Dictionary, type Lang } from "@/lib/i18n/dict";

const STORAGE_KEY = "arf:lang";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  d: Dictionary;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to Korean on both server and first client render to avoid hydration
  // mismatch; restore the stored preference after mount.
  const [lang, setLangState] = useState<Lang>("ko");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "ko" || stored === "en") setLangState(stored);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "ko" ? "en" : "ko";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, d: DICT[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useI18n(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

/** Convenience: just the dictionary for the current language. */
export function useDict(): Dictionary {
  return useI18n().d;
}
