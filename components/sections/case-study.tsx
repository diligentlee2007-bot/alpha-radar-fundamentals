"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button";
import { useDict } from "@/lib/i18n/context";

export function CaseStudy() {
  const d = useDict();
  return (
    <div id="case-study" className="scroll-mt-20">
      <SectionShell eyebrow={d.caseStudy.eyebrow} title={d.caseStudy.title} align="left">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                {d.caseStudy.intro}
              </p>
              <div className="mt-6">
                <ButtonLink href="/fundamentals" variant="secondary">
                  {d.nav.cta}
                  <ArrowRightIcon weight="bold" className="size-4" aria-hidden />
                </ButtonLink>
              </div>
            </div>
          </Reveal>

          <Stagger className="space-y-4">
            {d.caseStudy.phases.map((p) => (
              <StaggerItem key={p.tag}>
                <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
                  <span className="inline-flex rounded-full bg-[var(--color-accent-50)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-700)]">
                    {p.tag}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-[var(--color-fg-strong)]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{p.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </SectionShell>
    </div>
  );
}
