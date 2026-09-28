import Link from "next/link";
import { ViewTransition } from "react";

import { Photo } from "@/components/ui/Photo";
import type { ResolvedEssay } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export type CardEssay = Pick<
  ResolvedEssay,
  "slug" | "title" | "number" | "categoryLabel" | "setting" | "cover" | "excerpt"
>;

type PortfolioCardProps = {
  essay: CardEssay;
  /** Proporção do quadro. Padrão: 4 / 5 (retrato editorial). */
  aspect?: string;
  sizes: string;
  eager?: boolean;
  revealDelay?: number;
  showExcerpt?: boolean;
  className?: string;
  /** Tamanho do título: "lg" para destaques. */
  size?: "md" | "lg";
};

/**
 * Card de ensaio no estilo "ficha de revista": fotografia, número, título em serifa e contexto.
 * A imagem carrega um nome de View Transition: ao abrir o ensaio, ela se transforma na abertura da página.
 */
export function PortfolioCard({
  essay,
  aspect = "4 / 5",
  sizes,
  eager,
  revealDelay,
  showExcerpt,
  className,
  size = "md",
}: PortfolioCardProps) {
  return (
    <Link
      href={`/portfolio/${essay.slug}`}
      className={cn("group block", className)}
      data-cursor="Ver ensaio"
      aria-label={`${essay.title} — ${essay.categoryLabel}`}
    >
      <ViewTransition name={`essay-${essay.slug}`} share="morph" default="none">
        <Photo image={essay.cover} aspect={aspect} sizes={sizes} eager={eager} revealDelay={revealDelay} zoom />
      </ViewTransition>
      <div className="mt-5 flex items-start justify-between gap-6" data-reveal="fade">
        <div className="min-w-0">
          <h3 className={cn("heading", size === "lg" ? "text-h3" : "text-h4")}>
            <span className="link-draw">{essay.title}</span>
          </h3>
          <p className="mt-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ash">
            {essay.categoryLabel}
            <span className="mx-2 opacity-50">·</span>
            {essay.setting}
          </p>
          {showExcerpt && <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ash">{essay.excerpt}</p>}
        </div>
        <span className="tabular shrink-0 pt-1.5 text-[0.6875rem] tracking-[0.16em] text-ash">N.º {essay.number}</span>
      </div>
    </Link>
  );
}
