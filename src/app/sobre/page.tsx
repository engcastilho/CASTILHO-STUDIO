import type { Metadata } from "next";
import type { CSSProperties } from "react";

import { PageTransition } from "@/components/layout/PageTransition";
import { CTA } from "@/components/sections/CTA";
import { Differentials } from "@/components/sections/Differentials";
import { Testimonials } from "@/components/sections/Testimonials";
import { JsonLd } from "@/components/seo/JsonLd";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { RevealText } from "@/components/ui/RevealText";
import { site } from "@/config/site";
import { testimonials } from "@/config/testimonials";
import { resolveImage } from "@/lib/images";
import { breadcrumbJsonLd } from "@/lib/seo";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Por trás da câmera da Castilho Produções: a história, a filosofia e o olhar que guiam cada ensaio de família, casal, gestante e retrato.",
  alternates: { canonical: "/sobre" },
  openGraph: { url: "/sobre" },
};

export default function AboutPage() {
  const { photographer } = site;
  const cover = resolveImage(photographer.behindTheScenes[0], "Bastidores de um ensaio ao ar livre, no fim da tarde");
  const portrait = resolveImage(photographer.portrait, photographer.portraitAlt);
  const behind = resolveImage(photographer.behindTheScenes[1], "Bastidores de um ensaio em casa, com luz de janela");

  const chapters = [
    { title: "Quem sou", text: photographer.story },
    { title: "Como começou", text: photographer.beginning },
    { title: "O que procuro", text: photographer.searchFor },
  ];

  return (
    <PageTransition>
      <main id="main">
        {/* Abertura */}
        <section aria-labelledby="about-hero" className="relative isolate flex h-[88svh] min-h-[32rem] items-end overflow-hidden bg-night text-white">
          <div className="absolute inset-0 -z-10">
            <Photo image={cover} aspect="none" sizes="100vw" priority reveal={false} className="hero-image-in h-full w-full" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/20 to-night/40" />
          </div>
          <div className="container-site pb-14 sm:pb-20">
            <p className="eyebrow hero-fade-in flex items-center gap-3 text-white/75">
              <span aria-hidden className="h-px w-7 bg-current opacity-50" />
              Sobre
            </p>
            <RevealText
              as="h1"
              id="about-hero"
              lines={[{ text: "Por trás" }, { text: "da câmera.", emphasis: true }]}
              trigger="load"
              delay={100}
              className="mt-6 text-display"
            />
          </div>
        </section>

        {/* Retrato + capítulos */}
        <section className="container-site py-section">
          <div className="grid-editorial gap-y-16">
            <div className="col-span-4 md:col-span-5 lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <Photo image={portrait} aspect="4 / 5" sizes="(min-width: 1024px) 40vw, (min-width: 768px) 60vw, 100vw" />
                <p className="mt-4 text-caption text-ash">{photographer.portraitAlt}</p>
              </div>
            </div>
            <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
              <Eyebrow className="text-ash">{photographer.role}</Eyebrow>
              <h2 className="heading mt-8 text-h1" data-reveal>
                {site.photographerName}
              </h2>

              <ol className="mt-16 sm:mt-24">
                {chapters.map((chapter, index) => (
                  <li key={chapter.title} className="relative grid grid-cols-[3.5rem_1fr] gap-x-4 pt-8 pb-14 sm:grid-cols-[6rem_1fr]">
                    <span aria-hidden data-reveal="line" className="absolute top-0 left-0 h-px w-full bg-ink/20" />
                    <span className="heading tabular text-h3 text-taupe" data-reveal>
                      {pad(index + 1)}
                    </span>
                    <div data-reveal style={{ "--reveal-delay": "100ms" } as CSSProperties}>
                      <h3 className="eyebrow pt-2 sm:pt-3">{chapter.title}</h3>
                      <p className="mt-5 text-lead text-ink/80">{chapter.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Filosofia */}
        <section aria-label="Filosofia" className="bg-ink py-section text-paper">
          <div className="container-site grid-editorial gap-y-10">
            <Eyebrow className="col-span-4 text-stone md:col-span-8 lg:col-span-2">Filosofia</Eyebrow>
            <figure className="col-span-4 md:col-span-8 lg:col-span-9 lg:col-start-4">
              <blockquote>
                <p className="heading text-h2" data-reveal>
                  <span className="-ml-[0.42em] text-stone">“</span>
                  {photographer.philosophy}
                  <span className="text-stone">”</span>
                </p>
              </blockquote>
              <figcaption className="eyebrow mt-10 text-stone" data-reveal>
                — {site.photographerName}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Visão artística */}
        <section aria-labelledby="vision-title" className="container-site py-section">
          <div className="grid-editorial items-center gap-y-14">
            <div className="col-span-4 md:col-span-8 lg:col-span-5">
              <Eyebrow className="text-ash">Visão artística</Eyebrow>
              <h2 id="vision-title" className="heading mt-8 text-h2" data-reveal>
                Luz natural, cor honesta, <em className="italic">tempo.</em>
              </h2>
              <p className="mt-8 max-w-md text-lead text-ash" data-reveal>
                {photographer.vision}
              </p>
            </div>
            <div className="col-span-4 md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-8">
              <Photo image={behind} aspect="4 / 5" sizes="(min-width: 1024px) 40vw, 100vw" parallax />
            </div>
          </div>
        </section>

        <Differentials />
        <Testimonials items={testimonials} />
        <CTA />
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Sobre", path: "/sobre" },
          ])}
        />
      </main>
    </PageTransition>
  );
}
