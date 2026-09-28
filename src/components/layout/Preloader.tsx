import type { CSSProperties } from "react";

import { site } from "@/config/site";

/**
 * Abertura: CASTILHO surge letra a letra por um instante e a cortina sobe revelando o hero.
 * CSS puro (não bloqueia hidratação nem o carregamento da imagem principal).
 * Exibida só na primeira visita da sessão, e apenas quando a entrada é pela página inicial
 * — o script em <head> (layout.tsx) decide isso antes da primeira pintura.
 */
export function Preloader() {
  const letters = site.wordmark.primary.toUpperCase().split("");
  return (
    <div className="preloader" aria-hidden>
      <div className="flex flex-col items-center">
        <p className="preloader__word pl-[0.55em] font-sans text-[clamp(1.25rem,4.2vw,2.25rem)] font-medium tracking-[0.55em]">
          {letters.map((letter, index) => (
            <span key={index} style={{ "--i": index } as CSSProperties}>
              {letter}
            </span>
          ))}
        </p>
        <span className="preloader__rule mt-5 block h-px w-20 bg-paper/35" />
        <p className="preloader__sub mt-4 font-serif text-lg italic text-paper/70">{site.wordmark.secondary}</p>
      </div>
    </div>
  );
}
