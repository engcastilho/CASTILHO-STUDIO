import { Photo } from "@/components/ui/Photo";
import { cinematicBreak } from "@/config/content";
import { resolveImage } from "@/lib/images";

/**
 * Pausa cinematográfica: fotografia em formato anamórfico (2.39:1) de ponta a ponta,
 * seguida de uma única frase. Respiro entre capítulos, como um plano geral no cinema.
 */
export function CinematicBreak({ quote = cinematicBreak.quote }: { quote?: string }) {
  const image = resolveImage(cinematicBreak.image, cinematicBreak.alt);
  return (
    <section aria-label="Pausa" className="bg-paper">
      <Photo
        image={image}
        aspect="none"
        sizes="100vw"
        parallax
        className="aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[2.39/1]"
        objectPosition="62% 50%"
      />
      <div className="container-site py-section-sm">
        <blockquote className="grid-editorial">
          <p
            className="heading col-span-4 text-h3 md:col-span-7 md:col-start-2 lg:col-span-8 lg:col-start-3"
            data-reveal
          >
            <span aria-hidden className="-ml-[0.42em] text-ash">“</span>
            {quote}
            <span aria-hidden className="text-ash">”</span>
          </p>
        </blockquote>
      </div>
    </section>
  );
}
