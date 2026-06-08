"use client";

import { CrosshairIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useDict } from "@/lib/i18n/context";

export function Footer() {
  const d = useDict();

  const groups = [
    {
      heading: d.footer.productHeading,
      items: [
        { href: "/fundamentals", label: d.footer.links.terminal },
        { href: "/#how", label: d.footer.links.howItWorks },
        { href: "/#roadmap", label: d.footer.links.roadmap },
      ],
    },
    {
      heading: d.footer.portfolioHeading,
      items: [
        { href: "/#case-study", label: d.footer.links.caseStudy },
        { href: "/fundamentals", label: d.footer.links.terminal },
      ],
    },
  ];

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent)] text-[oklch(0.16_0.02_168)]">
                <CrosshairIcon weight="bold" className="size-4" aria-hidden />
              </span>
              <span className="font-bold text-[var(--color-fg-strong)]">
                Alpha Radar Fundamentals
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
              {d.footer.tagline}
            </p>
          </div>

          <nav className="flex gap-12 text-sm" aria-label="Footer">
            {groups.map((group) => (
              <div key={group.heading}>
                <p className="mb-3 font-semibold text-[var(--color-fg-strong)]">{group.heading}</p>
                <ul className="space-y-2.5 text-[var(--color-muted)]">
                  {group.items.map((item) => (
                    <li key={`${group.heading}-${item.label}`}>
                      <Link href={item.href} className="hover:text-[var(--color-fg)]">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-10 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-xs leading-relaxed text-[var(--color-muted)]">
          <strong className="font-semibold text-[var(--color-fg)]">
            {d.footer.disclaimerTitle}
          </strong>{" "}
          {d.footer.disclaimerBody}
        </div>

        <p className="mt-6 text-xs text-[var(--color-muted)]">{d.footer.copyright}</p>
      </div>
    </footer>
  );
}
