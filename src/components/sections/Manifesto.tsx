import type { CSSProperties } from "react";

import { ManifestoSequence } from "@/components/sections/ManifestoSequence";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { manifesto } from "@/config/content";
import { resolveImage } from "@/lib/images";

/**
 * Manifesto: a vida muda — a fotografia guarda um fragmento de cada fase.
 * A sequência (client) cuida do scroll; o fechamento é conteúdo estático.
 */
export function Manifesto() {
  const lines = manifesto.lines.map((line) => ({
    text: line.text,
    image: resolveImage(line.image, line.alt),
  }));

  return (
    <section id="manifesto" aria-labelledby="manifesto-title" className="relative bg-ink text-paper">
      <div className="container-site pt-section pb-10 lg:pb-0">
        <Eyebrow className="text-stone">{manifesto.eyebrow}</Eyebrow>
        <h2 id="manifesto-title" className="sr-only">
          {manifesto.closing[0]}
        </h2>
      </div>

      <ManifestoSequence lines={lines} />

      <div className="container-site py-section">
        <div className="grid-editorial gap-y-10">
          <p
            className="heading col-span-4 text-h2 md:col-span-7 lg:col-span-7 lg:col-start-2"
            data-reveal
          >
            {manifesto.closing[0]}
          </p>
          <div className="col-span-4 md:col-span-6 md:col-start-3 lg:col-span-4 lg:col-start-8 lg:pt-4">
            <p className="text-lead text-paper/75" data-reveal style={{ "--reveal-delay": "120ms" } as CSSProperties}>
              {manifesto.closing[1]}
            </p>
            <p
              className="mt-10 font-serif text-h4 italic text-paper"
              data-reveal
              style={{ "--reveal-delay": "240ms" } as CSSProperties}
            >
              {manifesto.signature}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
