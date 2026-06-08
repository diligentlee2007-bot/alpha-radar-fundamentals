"use client";

import { FilePdfIcon, type Icon, PlugIcon, VideoIcon } from "@phosphor-icons/react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { useDict } from "@/lib/i18n/context";

const ICONS: Icon[] = [PlugIcon, FilePdfIcon, VideoIcon];

export function Roadmap() {
  const d = useDict();
  return (
    <div id="roadmap" className="scroll-mt-20">
      <SectionShell eyebrow={d.future.eyebrow} title={d.future.title} subtitle={d.future.subtitle}>
        <Stagger className="grid gap-5 sm:grid-cols-3">
          {d.future.items.map((item, i) => {
            const Ico = ICONS[i] ?? PlugIcon;
            return (
              <StaggerItem key={item.title}>
                <div className="relative h-full rounded-[var(--radius)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] text-[var(--color-accent-700)]">
                      <Ico weight="bold" className="size-5" aria-hidden />
                    </span>
                    <span className="rounded-full border border-[var(--color-border-strong)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                      {d.future.badge}
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
