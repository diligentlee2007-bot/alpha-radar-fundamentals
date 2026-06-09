"use client";

import { ArrowSquareOutIcon, NewspaperIcon } from "@phosphor-icons/react";
import { useNews } from "@/lib/hooks/use-news";

function ago(ms: number): string {
  const diff = Date.now() - ms;
  const m = Math.round(diff / 60000);
  if (m < 1) return "방금";
  if (m < 60) return `${m}분 전`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.round(h / 24)}일 전`;
}

/** Live (auto-refreshing) news headlines for a set of symbols. */
export function NewsStrip({
  symbols,
  title,
  limit = 6,
}: {
  symbols: string[];
  title: string;
  limit?: number;
}) {
  const { news, loading } = useNews(symbols);
  const items = news.slice(0, limit);

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
        <NewspaperIcon
          weight="bold"
          className="size-4 text-[var(--color-accent-700)]"
          aria-hidden
        />
        <span className="text-sm font-semibold text-[var(--color-fg-strong)]">{title}</span>
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-[var(--color-muted)]">
          <span className="size-1.5 animate-pulse rounded-full bg-[var(--color-up)]" aria-hidden />
          실시간
        </span>
      </div>

      {loading && items.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-[var(--color-muted)]">
          뉴스를 불러오는 중…
        </div>
      ) : items.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-[var(--color-muted)]">
          표시할 뉴스가 없어요.
        </div>
      ) : (
        <ul>
          {items.map((n) => (
            <li
              key={n.link}
              className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-2)]"
            >
              <a
                href={n.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 px-4 py-3"
              >
                <span className="mt-0.5 inline-flex shrink-0 rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-muted)]">
                  {n.symbol}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm font-medium text-[var(--color-fg-strong)]">
                    {n.title}
                  </span>
                  <span className="mt-1 block text-xs text-[var(--color-muted)]">
                    {n.publisher} · {ago(n.time)}
                  </span>
                </span>
                <ArrowSquareOutIcon
                  className="mt-0.5 size-4 shrink-0 text-[var(--color-muted)]"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
