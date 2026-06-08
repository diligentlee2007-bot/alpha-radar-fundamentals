"use client";

import { BellRingingIcon, ChartBarIcon, CheckIcon } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion/reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { useDict } from "@/lib/i18n/context";

export function Ecosystem() {
  const d = useDict();
  const E = d.ecosystem;

  const columns = [
    { title: E.originalTitle, items: E.originalItems, Icon: BellRingingIcon, accent: false },
    { title: E.fundamentalsTitle, items: E.fundamentalsItems, Icon: ChartBarIcon, accent: true },
  ];

  return (
    <div id="ecosystem" className="scroll-mt-20">
      <SectionShell eyebrow={E.eyebrow} title={E.title} subtitle={E.subtitle}>
        <div className="grid gap-5 md:grid-cols-2">
          {columns.map((col) => (
            <Reveal key={col.title}>
              <div
                className={`h-full rounded-[var(--radius)] border bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)] ${
                  col.accent ? "border-[var(--color-accent-200)]" : "border-[var(--color-border)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-10 items-center justify-center rounded-[var(--radius-sm)] ${
                      col.accent
                        ? "bg-[var(--color-accent-50)] text-[var(--color-accent-700)]"
                        : "bg-[var(--color-surface-2)] text-[var(--color-muted)]"
                    }`}
                  >
                    <col.Icon weight="bold" className="size-5" aria-hidden />
                  </span>
                  <h3 className="text-lg font-semibold text-[var(--color-fg-strong)]">
                    {col.title}
                  </h3>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-2.5 text-sm text-[var(--color-fg)]"
                    >
                      <CheckIcon
                        weight="bold"
                        className={`mt-0.5 size-4 shrink-0 ${
                          col.accent
                            ? "text-[var(--color-accent-700)]"
                            : "text-[var(--color-muted)]"
                        }`}
                        aria-hidden
                      />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-6 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-center text-sm leading-relaxed text-[var(--color-muted)]">
            {E.note}
          </p>
        </Reveal>
      </SectionShell>
    </div>
  );
}
