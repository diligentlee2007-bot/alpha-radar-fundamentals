"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { useDict } from "@/lib/i18n/context";

export function FinalCta() {
  const d = useDict();
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14 text-center shadow-[var(--shadow-lift)] sm:px-12">
          <div className="pointer-events-none absolute inset-0 radial-glow" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-balance text-[var(--color-fg-strong)] sm:text-4xl">
              {d.finalCta.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-[var(--color-muted)]">
              {d.finalCta.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/fundamentals" size="lg">
                {d.finalCta.ctaPrimary}
                <ArrowRightIcon weight="bold" className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="#case-study" size="lg" variant="secondary">
                {d.finalCta.ctaSecondary}
              </ButtonLink>
            </div>
            <p className="mt-6 text-xs text-[var(--color-muted)]">{d.finalCta.note}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
