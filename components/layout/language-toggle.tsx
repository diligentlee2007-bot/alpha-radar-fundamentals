"use client";

import { TranslateIcon } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, d } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5",
        className,
      )}
    >
      <TranslateIcon className="mx-1 size-4 text-[var(--color-muted)]" aria-label={d.lang.toggle} />
      {(["ko", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "rounded-[calc(var(--radius-sm)-2px)] px-2 py-1 text-xs font-semibold transition-colors",
            lang === l
              ? "bg-[var(--color-accent-50)] text-[var(--color-accent-700)]"
              : "text-[var(--color-muted)] hover:text-[var(--color-fg)]",
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
