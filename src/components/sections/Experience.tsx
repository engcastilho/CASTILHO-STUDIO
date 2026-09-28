import type { CSSProperties } from "react";

import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { RevealText } from "@/components/ui/RevealText";
import { experience } from "@/config/content";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

type ExperienceProps = {
  /** "home": resumo com link para a página · "page": versão completa, com CTA direto. */
  variant?: "home" | "page";
};

/**
 * Como funciona: coluna de título fixa (sticky) enquanto as cinco etapas rolam ao lado,
 * cada uma com sua régua que se desenha ao entrar na tela.
 */
export function Experience({ variant = "home" }: ExperienceProps) {
  const image = resolveImage(experience.image, experience.imageAlt);

  return (
    <section id="experiencia" aria-labelledby="experience-title" className="py-section">
      <div className="container-site grid-editorial gap-y-16">
        <div className="col-span-4 md:col-span-8 lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            {variant === "home" && <Eyebrow>{experience.eyebrow}</Eyebrow>}
            {variant === "home" && (
              <RevealText id="experience-title" lines={experience.title} className="mt-8 text-h2" />
            )}
            {variant === "page" && (
              <h2 id="experience-title" className="heading text-h3" data-reveal>
                Cinco etapas, nenhuma pressa.
              </h2>
            )}
            <p className="mt-8 max-w-md text-ash" data-reveal>
              {experience.intro}
            </p>
            <Photo
              image={image}
              aspect="4 / 5"
              sizes="(min-width: 1024px) 34vw, 100vw"
              parallax
              className="mt-12 hidden max-w-md lg:block"
            />
            <div className="mt-10 hidden lg:block" data-reveal>
              {variant === "home" ? (
                <TextLink href="/experiencia">Como funciona, em detalhes</TextLink>
              ) : (
                <ButtonLink href={whatsappUrl()} icon="whatsapp">
                  Começar pela conversa
                </ButtonLink>
              )}
            </div>
          </div>
        </div>

        <ol className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
          {experience.steps.map((step, index) => (
            <li
              key={step.number}
              className={cn("relative pt-8 pb-14 sm:pb-20", index === experience.steps.length - 1 && "pb-0 sm:pb-0")}
            >
              <span
                aria-hidden
                data-reveal="line"
                className="absolute top-0 left-0 h-px w-full bg-ink/20"
                style={{ "--reveal-delay": "80ms" } as CSSProperties}
              />
              <div className="grid grid-cols-[4.5rem_1fr] gap-x-4 sm:grid-cols-[7rem_1fr]" data-reveal>
                <span className="heading tabular text-h3 text-taupe">{step.number}</span>
                <div>
                  <h3 className="eyebrow pt-2 text-ink sm:pt-3">{step.title}</h3>
                  <p className="mt-4 max-w-md text-lead text-ink/80">{step.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="col-span-4 md:col-span-8 lg:hidden" data-reveal>
          {variant === "home" ? (
            <TextLink href="/experiencia">Como funciona, em detalhes</TextLink>
          ) : (
            <ButtonLink href={whatsappUrl()} icon="whatsapp" className="w-full sm:w-auto">
              Começar pela conversa
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
