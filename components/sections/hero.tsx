"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { FundamentalsDemo } from "@/components/fundamentals/fundamentals-demo";
import { ButtonLink } from "@/components/ui/button";
import type { CompanyFundamentals } from "@/lib/data/fundamentals";
import { useDict } from "@/lib/i18n/context";

export function Hero({ companies }: { companies: CompanyFundamentals[] }) {
  const d = useDict();
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)]">
      <div className="pointer-events-none absolute inset-0 radial-glow" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]"
          >
            <span className="size-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
            {d.hero.badge}
          </motion.span>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-balance text-[var(--color-fg-strong)] sm:text-5xl"
          >
            {d.hero.title} <span className="text-gradient">{d.hero.titleAccent}</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 text-lg leading-relaxed text-pretty text-[var(--color-muted)]"
          >
            {d.hero.subtitle}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <ButtonLink href="/fundamentals" size="lg">
              {d.hero.ctaPrimary}
              <ArrowRightIcon weight="bold" className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="#how" size="lg" variant="secondary">
              {d.hero.ctaSecondary}
            </ButtonLink>
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-[var(--color-border)] pt-6"
          >
            {d.hero.stats.map((s) => (
              <div key={s.l}>
                <dt className="tnum text-2xl font-bold text-[var(--color-fg-strong)]">{s.v}</dt>
                <dd className="mt-1 text-xs text-[var(--color-muted)]">{s.l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* soft glow behind the mascot */}
          <div
            className="pointer-events-none absolute left-1/2 top-4 -z-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-70 lg:left-auto lg:right-0 lg:translate-x-0"
            style={{
              background: "radial-gradient(closest-side, var(--color-accent-50), transparent 72%)",
            }}
            aria-hidden
          />

          {/* mascot — 주식이 */}
          <Image
            src="/joosik-bull.png"
            alt="Alpha Radar 마스코트 주식이"
            width={349}
            height={590}
            priority
            className="relative z-0 mx-auto h-[360px] w-auto drop-shadow-2xl sm:h-[440px] lg:ml-auto lg:mr-0 lg:h-[560px]"
          />

          {/* floating live data card (overlaps the mascot like the concept) */}
          <div className="relative z-10 -mt-16 sm:-mt-24 lg:absolute lg:bottom-2 lg:left-0 lg:mt-0 lg:w-[380px] xl:w-[420px]">
            <FundamentalsDemo companies={companies} />
            <p className="mt-3 text-center text-xs text-[var(--color-muted)]">{d.hero.demoHint}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
