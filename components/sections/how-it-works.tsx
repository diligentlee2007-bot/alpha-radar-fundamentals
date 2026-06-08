"use client";

import {
  BuildingsIcon,
  CalculatorIcon,
  DownloadSimpleIcon,
  type Icon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { useDict } from "@/lib/i18n/context";

const ICONS: Icon[] = [BuildingsIcon, DownloadSimpleIcon, CalculatorIcon, ShieldCheckIcon];

export function HowItWorks() {
  const d = useDict();
  return (
    <div id="how" className="scroll-mt-20">
      <SectionShell
        eyebrow={d.workflow.eyebrow}
        title={d.workflow.title}
        subtitle={d.workflow.subtitle}
      >
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {d.workflow.steps.map((step, i) => {
            const Ico = ICONS[i] ?? BuildingsIcon;
            return (
              <StaggerItem key={step.title}>
                <div className="relative h-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
                  <span className="tnum absolute right-4 top-4 text-sm font-bold text-[var(--color-border-strong)]">
                    0{i + 1}
                  </span>
                  <span className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent-50)] text-[var(--color-accent-700)]">
                    <Ico weight="bold" className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-[var(--color-fg-strong)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {step.text}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </SectionShell>
    </div>
  );
}
