"use client";

import {
  FilmSlateIcon,
  type Icon,
  InstagramLogoIcon,
  PlugsConnectedIcon,
  UsersThreeIcon,
  VideoCameraIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { useDict } from "@/lib/i18n/context";

const CARD_ICONS: Icon[] = [InstagramLogoIcon, VideoCameraIcon, FilmSlateIcon, YoutubeLogoIcon];

export function ContentPipeline() {
  const d = useDict();
  const P = d.pipeline;

  return (
    <div id="pipeline" className="scroll-mt-20">
      <SectionShell eyebrow={P.eyebrow} title={P.title} subtitle={P.subtitle}>
        <Reveal>
          <div className="mb-6 flex items-center gap-3 rounded-[var(--radius)] border border-[var(--color-accent-100)] bg-[var(--color-accent-50)] p-4">
            <UsersThreeIcon
              weight="bold"
              className="size-5 shrink-0 text-[var(--color-accent-700)]"
              aria-hidden
            />
            <p className="text-sm font-medium text-[var(--color-accent-700)]">{P.humanInLoop}</p>
          </div>
        </Reveal>

        <Stagger className="grid gap-5 sm:grid-cols-2">
          {P.cards.map((card, i) => {
            const Ico = CARD_ICONS[i] ?? InstagramLogoIcon;
            return (
              <StaggerItem key={card.tag}>
                <div className="h-full rounded-[var(--radius)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5">
                      <span className="flex size-9 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] text-[var(--color-accent-700)]">
                        <Ico weight="bold" className="size-5" aria-hidden />
                      </span>
                      <span className="tnum text-sm font-bold text-[var(--color-border-strong)]">
                        {card.tag}
                      </span>
                    </span>
                    <span className="rounded-full border border-[var(--color-border-strong)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                      {P.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[var(--color-fg-strong)]">
                    {card.title}
                  </h3>
                  <ul className="mt-3 space-y-1.5">
                    {card.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-start gap-2 text-sm leading-relaxed text-[var(--color-muted)]"
                      >
                        <span
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                          aria-hidden
                        />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal>
          <div className="mt-6 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5">
            <div className="flex items-center gap-2">
              <PlugsConnectedIcon
                weight="bold"
                className="size-4 text-[var(--color-muted)]"
                aria-hidden
              />
              <h3 className="text-sm font-semibold text-[var(--color-fg-strong)]">
                {P.publisherTitle}
              </h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
              {P.publisherNote}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {P.publisherItems.map((it) => (
                <li
                  key={it}
                  className="rounded-full bg-[var(--color-surface-2)] px-3 py-1 text-xs text-[var(--color-muted)]"
                >
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </SectionShell>
    </div>
  );
}
