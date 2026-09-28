import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { TextLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealText } from "@/components/ui/RevealText";
import { selectedWork } from "@/config/content";
import { getFeaturedEssays } from "@/lib/portfolio";

/**
 * Seleção de ensaios na home: composição assimétrica de revista.
 * Tamanhos, proporções e respiros variam de propósito — o olhar passeia, não escaneia.
 * No celular, a alternância de larguras mantém o ritmo (não é só uma coluna).
 */
export function SelectedWork() {
  const [first, second, third, fourth, fifth] = getFeaturedEssays(5);

  return (
    <section id="portfolio" aria-labelledby="selected-work-title" className="py-section">
      <div className="container-site">
        {/* Linha 1: destaque grande + texto e segundo ensaio */}
        <div className="grid-editorial gap-y-16">
          <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:pt-10">
            <Eyebrow>{selectedWork.eyebrow}</Eyebrow>
            <RevealText id="selected-work-title" lines={selectedWork.title} className="mt-8 text-h2" />
            <p className="mt-8 max-w-md text-ash" data-reveal>
              {selectedWork.intro}
            </p>
          </div>

          {first && (
            <PortfolioCard
              essay={first}
              size="lg"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="col-span-4 md:col-span-6 lg:col-span-6 lg:row-span-2 lg:row-start-1"
            />
          )}

          {second && (
            <PortfolioCard
              essay={second}
              aspect="3 / 4"
              sizes="(min-width: 1024px) 28vw, (min-width: 768px) 50vw, 75vw"
              className="col-span-3 col-start-2 md:col-span-4 md:col-start-5 lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:mt-8"
              revealDelay={120}
            />
          )}
        </div>

        {/* Linha 2: horizontal cinematográfico */}
        {third && (
          <div className="grid-editorial mt-20 sm:mt-28 lg:mt-40">
            <PortfolioCard
              essay={third}
              aspect="16 / 9"
              size="lg"
              showExcerpt
              sizes="(min-width: 1024px) 75vw, 100vw"
              className="col-span-4 md:col-span-8 lg:col-span-9 lg:col-start-3"
            />
          </div>
        )}

        {/* Linha 3: par deslocado */}
        <div className="grid-editorial mt-20 gap-y-16 sm:mt-28 lg:mt-40">
          {fourth && (
            <PortfolioCard
              essay={fourth}
              sizes="(min-width: 1024px) 36vw, (min-width: 768px) 50vw, 75vw"
              className="col-span-3 md:col-span-4 lg:col-span-4 lg:col-start-2"
            />
          )}
          {fifth && (
            <PortfolioCard
              essay={fifth}
              aspect="3 / 4"
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 85vw"
              className="col-span-4 md:col-span-4 lg:col-span-5 lg:col-start-7 lg:mt-48"
              revealDelay={120}
            />
          )}
        </div>

        <div className="mt-20 flex justify-center sm:mt-28" data-reveal>
          <TextLink href="/portfolio">{selectedWork.cta}</TextLink>
        </div>
      </div>
    </section>
  );
}
