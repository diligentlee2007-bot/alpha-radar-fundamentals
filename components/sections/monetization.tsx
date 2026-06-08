"use client";

import {
  BriefcaseIcon,
  EnvelopeSimpleIcon,
  FilePdfIcon,
  GiftIcon,
  type Icon,
  InstagramLogoIcon,
  NotebookIcon,
  SparkleIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { useDict } from "@/lib/i18n/context";

const ICONS: Icon[] = [
  GiftIcon,
  FilePdfIcon,
  NotebookIcon,
  EnvelopeSimpleIcon,
  SparkleIcon,
  InstagramLogoIcon,
  YoutubeLogoIcon,
  BriefcaseIcon,
];

export function Monetization() {
  const d = useDict();
  return (
    <SectionShell
      eyebrow={d.monetization.eyebrow}
      title={d.monetization.title}
      subtitle={d.monetization.subtitle}
    >
      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {d.monetization.items.map((item, i) => {
          const Ico = ICONS[i] ?? GiftIcon;
          return (
            <StaggerItem key={item.title}>
              <div className="flex h-full gap-4 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent-50)] text-[var(--color-accent-700)]">
                  <Ico weight="bold" className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-fg-strong)]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
                    {item.text}
                  </p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
      <p className="mt-8 text-center text-xs text-[var(--color-muted)]">{d.monetization.note}</p>
    </SectionShell>
  );
}
