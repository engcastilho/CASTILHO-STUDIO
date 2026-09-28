"use client";

import { useRef, useState } from "react";

import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import { testimonialsSection } from "@/config/content";
import type { Testimonial } from "@/config/testimonials";
import { cn, pad } from "@/lib/utils";

/**
 * Depoimentos: uma voz de cada vez, em serifa grande, sem estrelas nem caixas.
 * O slider se justifica aqui — cada frase merece o palco sozinha.
 * Todas as citações ocupam a mesma célula do grid, então a altura nunca "pula".
 * Navegação por botões, setas do teclado e gesto de deslizar. Sem troca automática.
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = items.length;
  const go = (next: number) => setIndex((next + count) % count);

  if (!count) return null;

  return (
    <section aria-roledescription="carrossel" aria-label="Depoimentos de clientes" className="bg-paper py-section">
      <div
        className="container-site"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") go(index + 1);
          if (event.key === "ArrowLeft") go(index - 1);
        }}
        onTouchStart={(event) => {
          touchX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchX.current === null) return;
          const delta = event.changedTouches[0].clientX - touchX.current;
          if (Math.abs(delta) > 48) go(index + (delta < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        <div className="flex items-center justify-between border-b border-ink/15 pb-6" data-reveal="fade">
          <p className="eyebrow flex items-center gap-3 text-ash">
            <span aria-hidden className="h-px w-7 bg-current opacity-45" />
            {testimonialsSection.eyebrow}
          </p>
          <p className="tabular text-[0.6875rem] tracking-[0.2em] text-ash" aria-hidden>
            {pad(index + 1)} <span className="mx-1 opacity-50">/</span> {pad(count)}
          </p>
        </div>

        <div className="grid pt-14 sm:pt-20" aria-live="polite" data-reveal>
          {items.map((item, i) => (
            <figure
              key={i}
              aria-hidden={i !== index}
              className={cn(
                "col-start-1 row-start-1 lg:pl-[16.66%] transition-[opacity,transform,filter] duration-1000 ease-(--ease-cinema)",
                i === index ? "opacity-100 blur-[0px]" : "pointer-events-none translate-y-3 opacity-0 blur-[2px]",
              )}
            >
              <blockquote>
                <p className="heading max-w-[26ch] text-h2">
                  <span className="-ml-[0.42em] text-taupe">“</span>
                  {item.quote}
                  <span className="text-taupe">”</span>
                </p>
              </blockquote>
              <figcaption className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="text-[1.0625rem]">— {item.author}</span>
                <span className="eyebrow text-ash">{item.context}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-14 flex items-center justify-between gap-8 sm:mt-20">
          <div className="flex flex-1 gap-2" aria-hidden>
            {items.map((_, i) => (
              <span key={i} className="h-px flex-1 max-w-16 bg-ink/15">
                <span
                  className={cn(
                    "block h-px bg-ink transition-transform duration-700 ease-(--ease-cinema) origin-left",
                    i === index ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Depoimento anterior"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-paper"
            >
              <ArrowLeft size={16} className="transition-transform duration-500 group-hover:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Próximo depoimento"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-paper"
            >
              <ArrowRight size={16} className="arrow-nudge" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
