"use client";

import { CrosshairIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { ButtonLink } from "@/components/ui/button";
import { useDict } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function Navbar() {
  const d = useDict();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NAV = [
    { href: "/#how", label: d.nav.overview },
    { href: "/fundamentals", label: d.nav.terminal },
    { href: "/global", label: d.nav.global },
    { href: "/studio", label: d.nav.studio },
    { href: "/#case-study", label: d.nav.caseStudy },
    { href: "/#roadmap", label: d.nav.future },
  ];

  const isRouteActive = (href: string) =>
    href.startsWith("/") && !href.includes("#") && pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[color-mix(in_oklch,var(--color-bg)_80%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent)] text-[oklch(0.16_0.02_168)]">
            <CrosshairIcon weight="bold" className="size-5" aria-hidden />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-bold tracking-tight text-[var(--color-fg-strong)]">
              Alpha Radar
            </span>
            <span className="text-[11px] font-medium tracking-wide text-[var(--color-accent-700)]">
              Fundamentals
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = isRouteActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--color-accent-50)] text-[var(--color-accent-700)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <ButtonLink href="/fundamentals" size="sm">
            {d.nav.cta}
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-fg)] hover:bg-[var(--color-surface-2)]"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <XIcon className="size-5" /> : <ListIcon className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-[var(--color-border)] px-4 py-3 md:hidden"
          aria-label="Mobile"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium text-[var(--color-fg)] hover:bg-[var(--color-surface-2)]"
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink
            href="/fundamentals"
            size="sm"
            className="mt-2 w-full"
            onClick={() => setOpen(false)}
          >
            {d.nav.cta}
          </ButtonLink>
        </nav>
      )}
    </header>
  );
}
