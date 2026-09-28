import { TextLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { aboutTeaser } from "@/config/content";
import { site } from "@/config/site";
import { resolveImage } from "@/lib/images";

/**
 * "Por trás da câmera" (home): retrato do fotógrafo em camadas com uma imagem de bastidor,
 * nome, filosofia em destaque e convite para a página Sobre.
 */
export function About() {
  const { photographer } = site;
  const portrait = resolveImage(photographer.portrait, photographer.portraitAlt);
  const behind = resolveImage(photographer.behindTheScenes[1], "Bastidores de um ensaio da Castilho Produções");

  return (
    <section aria-labelledby="about-title" className="overflow-hidden bg-linen py-section">
      <div className="container-site grid-editorial gap-y-14">
        <div className="relative col-span-4 md:col-span-6 lg:col-span-5">
          <Photo image={portrait} aspect="4 / 5" sizes="(min-width: 1024px) 40vw, (min-width: 768px) 70vw, 100vw" parallax />
          <div className="absolute -right-2 -bottom-14 w-[42%] ring-8 ring-linen sm:-right-10 lg:-right-20 lg:w-[38%]">
            <Photo image={behind} aspect="3 / 4" sizes="(min-width: 1024px) 16vw, 38vw" revealDelay={250} />
          </div>
        </div>

        <div className="col-span-4 pt-16 md:col-span-7 lg:col-span-5 lg:col-start-8 lg:pt-16">
          <Eyebrow className="text-ash">{aboutTeaser.eyebrow}</Eyebrow>
          <h2 id="about-title" className="heading mt-8 text-h2" data-reveal>
            {site.photographerName}
          </h2>
          <p className="eyebrow mt-4 text-ash" data-reveal>
            {photographer.role}
          </p>

          <blockquote className="mt-12 border-l border-ink/20 pl-6 sm:pl-8" data-reveal>
            <p className="font-serif text-h4 leading-snug italic">“{photographer.philosophy}”</p>
          </blockquote>

          <p className="mt-10 max-w-md text-ash" data-reveal>
            {photographer.story}
          </p>

          <div className="mt-12" data-reveal>
            <TextLink href="/sobre">{aboutTeaser.cta}</TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
