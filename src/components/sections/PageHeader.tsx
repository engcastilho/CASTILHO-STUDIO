import type { CSSProperties, ReactNode } from "react";

import { RevealText, type TitleLine } from "@/components/ui/RevealText";

type PageHeaderProps = {
  eyebrow: string;
  title: TitleLine[];
  intro?: string;
  aside?: ReactNode;
};

/**
 * Abertura das páginas internas: tipografia como protagonista.
 * Anima no carregamento (não depende da rolagem), então nunca "pisca" vazia.
 */
export function PageHeader({ eyebrow, title, intro, aside }: PageHeaderProps) {
  return (
    <header className="container-site pt-[calc(var(--header-h)+clamp(3.5rem,10vw,9rem))] pb-section-sm">
      <p className="eyebrow hero-fade-in flex items-center gap-3 text-ash">
        <span aria-hidden className="h-px w-7 bg-current opacity-45" />
        {eyebrow}
      </p>
      <div className="mt-8 grid-editorial items-end gap-y-10 sm:mt-10">
        <RevealText
          as="h1"
          lines={title}
          trigger="load"
          delay={80}
          className="col-span-4 text-h1 md:col-span-8 lg:col-span-8"
        />
        {(intro || aside) && (
          <div
            className="hero-fade-in col-span-4 md:col-span-6 lg:col-span-4 lg:col-start-9"
            style={{ "--delay": "450ms" } as CSSProperties}
          >
            {intro && <p className="text-lead text-ash">{intro}</p>}
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
