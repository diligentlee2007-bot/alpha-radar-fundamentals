"use client";

import { CheckCircleIcon, PlugIcon } from "@phosphor-icons/react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { useDict } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function Roadmap() {
  const d = useDict();
  return (
    <div id="roadmap" className="scroll-mt-20">
      <SectionShell eyebrow={d.future.eyebrow} title={d.future.title} subtitle={d.future.subtitle}>
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {d.future.items.map((item) => {
            const shipped = item.status === "shipped";
            const Ico = shipped ? CheckCircleIcon : PlugIcon;
            return (
              <StaggerItem key={item.title}>
                <div
                  className={cn(
                    "relative h-full rounded-[var(--radius)] border bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]",
                    shipped
                      ? "border-[var(--color-accent-100)]"
                      : "border-dashed border-[var(--color-border-strong)]",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-[var(--radius-sm)]",
                        shipped
                          ? "bg-[var(--color-accent-50)] text-[var(--color-accent-700)]"
                          : "bg-[var(--color-surface-2)] text-[var(--color-muted)]",
                      )}
                    >
                      <Ico weight={shipped ? "fill" : "bold"} className="size-5" aria-hidden />
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
                        shipped
                          ? "bg-[var(--color-accent-50)] text-[var(--color-accent-700)]"
                          : "border border-[var(--color-border-strong)] text-[var(--color-muted)]",
                      )}
                    >
                      {shipped ? d.future.shippedBadge : d.future.plannedBadge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[var(--color-fg-strong)]">
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
    </div>
  );
}
