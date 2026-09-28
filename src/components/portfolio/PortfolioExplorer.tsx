"use client";

import { useSearchParams } from "next/navigation";

import type { CardEssay } from "@/components/portfolio/PortfolioCard";
import { PortfolioFilters, type FilterOption } from "@/components/portfolio/PortfolioFilters";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";

export type ExplorerEssay = CardEssay & { category: string };

/**
 * Portfólio filtrável. O filtro vive na URL (?categoria=casais):
 * compartilhável, funciona com o botão voltar e com links vindos da home.
 */
export function PortfolioExplorer({ essays, options }: { essays: ExplorerEssay[]; options: FilterOption[] }) {
  const params = useSearchParams();
  const requested = params.get("categoria");
  const active = options.some((option) => option.slug === requested) ? requested! : "todos";
  const visible = active === "todos" ? essays : essays.filter((essay) => essay.category === active);

  return (
    <>
      <PortfolioFilters options={options} active={active} />
      <div key={active} className="container-site pt-16 sm:pt-24">
        <PortfolioGrid essays={visible} eagerFirst />
      </div>
    </>
  );
}
