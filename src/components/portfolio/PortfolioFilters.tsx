import Link from "next/link";

import { cn } from "@/lib/utils";

export type FilterOption = { slug: string; label: string; count: number };

/**
 * Filtros do portfólio como links reais (funcionam sem JavaScript e são indexáveis).
 * Fixos logo abaixo da navegação; no celular, deslizam na horizontal.
 */
export function PortfolioFilters({ options, active }: { options: FilterOption[]; active: string }) {
  const total = options.reduce((sum, option) => sum + option.count, 0);
  const all: FilterOption[] = [{ slug: "todos", label: "Todos", count: total }, ...options];

  return (
    <nav
      aria-label="Filtrar ensaios por categoria"
      className="sticky-under-header sticky z-30 border-y border-ink/10 bg-paper/90 backdrop-blur-xl"
    >
      <ul className="snap-row container-site flex gap-7 overflow-x-auto py-4 sm:gap-10">
        {all.map((option) => {
          const selected = option.slug === active;
          return (
            <li key={option.slug} className="shrink-0">
              <Link
                href={option.slug === "todos" ? "/portfolio" : `/portfolio?categoria=${option.slug}`}
                scroll={false}
                replace
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "group flex items-start gap-1.5 py-1 text-[0.75rem] font-medium uppercase tracking-[0.18em] transition-colors duration-500",
                  selected ? "text-ink" : "text-ash hover:text-ink",
                )}
              >
                <span className={cn(selected ? "link-line" : "link-draw")}>{option.label}</span>
                <sup className="tabular text-[0.625rem] tracking-normal opacity-60">{option.count}</sup>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
