"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { ArrowRight } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import type { ResolvedImage } from "@/lib/images";
import { useMediaQuery, useReducedMotion } from "@/lib/hooks";
import { cn, pad } from "@/lib/utils";

type Item = { slug: string; label: string; line: string; image: ResolvedImage; count: number };

type Props = { eyebrow: string; title: string; hint: string; items: Item[] };

/**
 * Galeria horizontal controlada pela rolagem vertical.
 * Desktop: a seção fica fixa e os painéis deslizam — como um travelling de câmera.
 * Celular/tablet (ou movimento reduzido): carrossel nativo com snap, feito para o polegar.
 */
export function HorizontalGallery({ eyebrow, title, hint, items }: Props) {
  const desktop = useMediaQuery("(min-width: 64rem)");
  const reduced = useReducedMotion();
  const pinned = desktop && !reduced;

  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // Mede quanto o trilho precisa andar.
  useEffect(() => {
    if (!pinned || !track.current) return;
    const element = track.current;
    const measure = () => setDistance(Math.max(0, element.scrollWidth - window.innerWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  // Converte rolagem vertical em deslocamento horizontal (sem re-render por frame).
  useEffect(() => {
    if (!pinned) {
      if (track.current) track.current.style.transform = "";
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = section.current;
      if (!el || !track.current) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      track.current.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pinned, distance]);

  return (
    <section
      ref={section}
      aria-labelledby="categories-title"
      className="relative bg-linen"
      style={pinned ? ({ height: `calc(100svh + ${distance}px)` } as CSSProperties) : undefined}
    >
      <div className={cn(pinned && "sticky top-0 flex h-svh flex-col justify-center overflow-hidden")}>
        <div className={cn("container-site", pinned ? "mb-10" : "pt-section mb-10")}>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow flex items-center gap-3 text-ash">
                <span aria-hidden className="h-px w-7 bg-current opacity-45" />
                {eyebrow}
              </p>
              <h2 id="categories-title" className="heading mt-6 text-h2">
                {title}
              </h2>
            </div>
            <p className="eyebrow hidden text-ash max-lg:block">{hint} →</p>
            {pinned && (
              <div aria-hidden className="mb-3 hidden h-px w-48 bg-ink/15 lg:block">
                <div ref={bar} className="h-px origin-left scale-x-0 bg-ink" />
              </div>
            )}
          </div>
        </div>

        <div
          ref={track}
          className={cn(
            "flex gap-(--grid-gap) px-(--gutter)",
            pinned ? "w-max will-change-transform" : "snap-row overflow-x-auto pb-section scroll-px-(--gutter)",
          )}
        >
          {items.map((item, index) => (
            <Link
              key={item.slug}
              href={`/portfolio?categoria=${item.slug}`}
              className={cn(
                "group relative block shrink-0",
                pinned ? "w-[min(30vw,30rem)]" : "w-[78vw] sm:w-[46vw] md:w-[38vw]",
                pinned && index % 2 === 1 && "mt-12",
              )}
              data-cursor="Ver ensaios"
            >
              <Photo
                image={item.image}
                aspect="3 / 4"
                sizes="(min-width: 1024px) 30vw, 78vw"
                zoom
                className={cn(pinned && "max-h-[50svh]")}
              />
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="heading text-h3">
                  <span className="tabular mr-3 align-top font-sans text-[0.6875rem] tracking-[0.16em] text-ash">
                    {pad(index + 1)}
                  </span>
                  {item.label}
                </h3>
                <ArrowRight size={18} className="arrow-nudge shrink-0 text-ash" />
              </div>
              <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ash">{item.line}</p>
            </Link>
          ))}
          {/* respiro final para o último painel não colar na borda */}
          <div aria-hidden className="w-px shrink-0" />
        </div>
      </div>
    </section>
  );
}
