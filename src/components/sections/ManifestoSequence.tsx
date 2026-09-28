"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { ResolvedImage } from "@/lib/images";
import { cn, pad } from "@/lib/utils";

type Line = { text: string; image: ResolvedImage };

/**
 * Frases que acendem uma a uma enquanto a imagem correspondente assume o quadro.
 * - Desktop: imagem fixa (sticky) à esquerda, frases rolando à direita.
 * - Celular: a imagem ocupa a tela inteira ao fundo e cada frase é um "quadro" — como stories.
 * A frase ativa é a que cruza o centro da tela (IntersectionObserver, sem cálculo por frame).
 */
export function ManifestoSequence({ lines }: { lines: Line[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );
    refs.current.forEach((element) => element && io.observe(element));
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative lg:container-site lg:grid lg:grid-cols-12 lg:gap-x-(--grid-gap)">
      {/* Quadro de imagens */}
      <div className="sticky top-0 -mb-[100svh] flex h-svh items-center lg:col-span-5 lg:mb-0 lg:self-start">
        <div className="relative h-full w-full overflow-hidden lg:h-auto lg:max-h-[78svh] lg:aspect-[4/5]">
          {lines.map((line, index) => (
            <div
              key={line.image.src}
              aria-hidden={index !== active}
              className={cn(
                "absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-(--ease-cinema)",
                index === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
              )}
              style={{ backgroundColor: line.image.color }}
            >
              <Image
                src={line.image.src}
                alt={line.image.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                placeholder={line.image.blurDataURL ? "blur" : "empty"}
                blurDataURL={line.image.blurDataURL}
                className="object-cover"
              />
            </div>
          ))}
          {/* véu no celular para leitura do texto por cima */}
          <div aria-hidden className="absolute inset-0 bg-night/55 lg:hidden" />
          <div
            aria-hidden
            className="tabular absolute bottom-6 left-(--gutter) text-[0.6875rem] tracking-[0.2em] text-paper/70 lg:left-5"
          >
            {pad(active + 1)} <span className="mx-1.5 opacity-50">/</span> {pad(lines.length)}
          </div>
          {/* barra de progresso vertical */}
          <div aria-hidden className="absolute top-6 right-(--gutter) bottom-6 w-px bg-paper/15 lg:right-5">
            <div
              className="w-px bg-paper transition-[height] duration-700 ease-(--ease-cinema)"
              style={{ height: `${((active + 1) / lines.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Frases */}
      <ol className="relative z-10 lg:col-span-6 lg:col-start-7">
        {lines.map((line, index) => (
          <li
            key={line.text}
            ref={(element) => {
              refs.current[index] = element;
            }}
            data-index={index}
            className="flex min-h-svh items-center px-(--gutter) lg:min-h-[78svh] lg:px-0"
          >
            <p
              className={cn(
                "heading text-h2 transition-[opacity,filter,transform] duration-1000 ease-(--ease-cinema) max-lg:text-center max-lg:mx-auto max-lg:max-w-[14ch]",
                index === active ? "opacity-100 blur-[0px]" : "opacity-20 lg:opacity-[0.16] max-lg:blur-[2px]",
              )}
            >
              {line.text}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
