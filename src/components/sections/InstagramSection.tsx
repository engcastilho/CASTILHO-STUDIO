import { InstagramIcon } from "@/components/ui/Icons";
import { TextLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { instagramSection } from "@/config/content";
import { site } from "@/config/site";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";

/** Deslocamentos verticais que dão à faixa o ritmo de uma folha de contato espalhada na mesa. */
const offsets = ["lg:mt-0", "lg:mt-24", "lg:mt-8", "lg:mt-32", "lg:mt-4", "lg:mt-20"];
const aspects = ["4 / 5", "3 / 4", "1 / 1", "4 / 5", "3 / 4", "4 / 5"];

/**
 * Diário visual: uma faixa editorial de imagens recentes, não uma grade genérica de posts.
 * No celular vira uma fita que desliza com o polegar.
 * Para exibir o feed real, basta trocar as imagens em /public/images/instagram.
 */
export function InstagramSection() {
  const images = instagramSection.images.map((image) => resolveImage(image.src, image.alt));

  return (
    <section aria-labelledby="instagram-title" className="overflow-hidden py-section">
      <div className="container-site">
        <div className="grid-editorial items-end gap-y-8">
          <div className="col-span-4 md:col-span-5 lg:col-span-6">
            <p className="eyebrow flex items-center gap-3 text-ash" data-reveal="fade">
              <span aria-hidden className="h-px w-7 bg-current opacity-45" />
              {instagramSection.eyebrow}
            </p>
            <h2 id="instagram-title" className="heading mt-8 text-h3 max-w-[22ch]" data-reveal>
              {instagramSection.title}
            </h2>
          </div>
          <div className="col-span-4 md:col-span-3 lg:col-span-4 lg:col-start-9 md:text-right" data-reveal>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 font-serif text-h4 italic"
            >
              <InstagramIcon size={20} className="not-italic" />
              <span className="link-draw">@{site.instagram.handle}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="snap-row mt-14 flex gap-3 overflow-x-auto px-(--gutter) sm:gap-4 lg:container-site lg:mt-20 lg:grid lg:grid-cols-6 lg:items-start lg:gap-(--grid-gap) lg:overflow-visible">
        {images.map((image, index) => (
          <a
            key={image.src}
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("group relative block w-[62vw] shrink-0 sm:w-[38vw] lg:w-auto", offsets[index % offsets.length])}
            data-cursor="Instagram"
            aria-label={`${image.alt} — ver no Instagram`}
          >
            <Photo
              image={image}
              aspect={aspects[index % aspects.length]}
              sizes="(min-width: 1024px) 16vw, 62vw"
              zoom
              revealDelay={(index % 6) * 80}
            />
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-night/0 text-white opacity-0 transition-all duration-700 group-hover:bg-night/25 group-hover:opacity-100"
            >
              <InstagramIcon size={26} />
            </span>
          </a>
        ))}
      </div>

      <div className="container-site mt-14 lg:hidden">
        <TextLink href={site.instagram.url}>{instagramSection.cta}</TextLink>
      </div>
    </section>
  );
}
