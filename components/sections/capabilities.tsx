"use client";

import {
  CalculatorIcon,
  DatabaseIcon,
  type Icon,
  ScalesIcon,
  SealCheckIcon,
  TrendUpIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { useDict } from "@/lib/i18n/context";

const ICONS: Icon[] = [
  CalculatorIcon,
  TrendUpIcon,
  ScalesIcon,
  WarningIcon,
  DatabaseIcon,
  SealCheckIcon,
];

export function Capabilities() {
  const d = useDict();
  return (
    <SectionShell
      eyebrow={d.capabilities.eyebrow}
      title={d.capabilities.title}
      subtitle={d.capabilities.subtitle}
    >
      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {d.capabilities.items.map((item, i) => {
          const Ico = ICONS[i] ?? CalculatorIcon;
          return (
            <StaggerItem key={item.title}>
              <div className="h-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)] transition-colors hover:border-[var(--color-accent-200)]">
                <span className="flex size-11 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent-50)] text-[var(--color-accent-700)]">
                  <Ico weight="bold" className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--color-fg-strong)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                  {item.text}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </SectionShell>
  );
}
