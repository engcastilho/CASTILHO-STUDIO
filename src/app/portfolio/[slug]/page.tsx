import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { PageTransition } from "@/components/layout/PageTransition";
import { EssayStory } from "@/components/portfolio/EssayStory";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { RevealText } from "@/components/ui/RevealText";
import { JsonLd } from "@/components/seo/JsonLd";
import { essays } from "@/config/portfolio";
import { site } from "@/config/site";
import { breadcrumbJsonLd, essayJsonLd } from "@/lib/seo";
import { composeStory, getAdjacentEssays, getEssay, getEssayGallery } from "@/lib/portfolio";
import { whatsappUrlForEssay } from "@/lib/whatsapp";

export const dynamicParams = false;

export function generateStaticParams() {
  return essays.map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = getEssay(slug);
  if (!found) return {};
  const { essay } = found;
  const title = `${essay.title} — ${essay.categoryLabel}`;
  return {
    title,
    description: essay.excerpt,
    alternates: { canonical: `/portfolio/${essay.slug}` },
    openGraph: { type: "article", title, description: essay.excerpt, url: `/portfolio/${essay.slug}` },
    twitter: { title, description: essay.excerpt },
  };
}

export default async function EssayPage({ params }: PageProps<"/portfolio/[slug]">) {
  const { slug } = await params;
  const found = getEssay(slug);
  if (!found) notFound();

  const { essay, source } = found;
  const gallery = getEssayGallery(source);
  const blocks = composeStory(gallery, essay.interludes);
  const { next } = getAdjacentEssays(essay.slug);
  const [lead, ...rest] = essay.story;

  return (
    <PageTransition>
      <main id="main">
        {/* Abertura: a capa vinda do portfólio se transforma nesta imagem */}
        <section aria-labelledby="essay-title" className="relative isolate flex h-svh min-h-[34rem] items-end overflow-hidden bg-night text-white">
          <div className="absolute inset-0 -z-10">
            <ViewTransition name={`essay-${essay.slug}`} share="morph" default="none">
              <Photo
                image={essay.cover}
                aspect="none"
                sizes="100vw"
                priority
                reveal={false}
                objectPosition={source.coverPosition}
                className="h-full w-full"
              />
            </ViewTransition>
          </div>
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-night/85 via-night/25 to-night/35" />

          <div className="container-site w-full pb-14 sm:pb-20">
            <p className="eyebrow hero-fade-in flex items-center gap-3 text-white/75">
              <span className="tabular">N.º {essay.number}</span>
              <span aria-hidden className="h-px w-7 bg-current opacity-50" />
              {essay.categoryLabel}
            </p>
            <RevealText
              as="h1"
              id="essay-title"
              lines={[{ text: essay.title }]}
              trigger="load"
              delay={120}
              className="mt-6 text-display"
            />
            <p className="hero-fade-in mt-6 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-white/70">
              {essay.setting}
            </p>
          </div>
        </section>

        {/* Introdução editorial */}
        <section className="container-site py-section">
          <div className="grid-editorial gap-y-12">
            <aside className="col-span-4 md:col-span-3 lg:col-span-3" data-reveal="fade">
              <Link
                href="/portfolio"
                className="group mb-10 inline-flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ash hover:text-ink"
              >
                <ArrowLeft size={14} className="transition-transform duration-500 group-hover:-translate-x-1" />
                <span className="link-draw">Portfólio</span>
              </Link>
              <dl className="grid grid-cols-2 gap-6 text-[0.875rem] md:grid-cols-1">
                <div>
                  <dt className="eyebrow text-ash">Categoria</dt>
                  <dd className="mt-2">{essay.categoryLabel}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-ash">Ensaio</dt>
                  <dd className="mt-2">{essay.setting}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-ash">Fotografias</dt>
                  <dd className="tabular mt-2">{gallery.length + 1} imagens</dd>
                </div>
                <div>
                  <dt className="eyebrow text-ash">Direção</dt>
                  <dd className="mt-2">{site.studioName}</dd>
                </div>
              </dl>
            </aside>
            <div className="col-span-4 md:col-span-5 lg:col-span-7 lg:col-start-5">
              <p className="heading text-h3" data-reveal>
                {essay.excerpt}
              </p>
              <div className="mt-10 max-w-xl space-y-6 text-lead text-ink/75">
                {lead && (
                  <p data-reveal className="first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-[4.2em] first-letter:leading-[0.8] first-letter:text-ink">
                    {lead}
                  </p>
                )}
                {rest.map((paragraph) => (
                  <p key={paragraph} data-reveal>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Narrativa visual */}
        <section aria-label={`Fotografias do ensaio ${essay.title}`} className="pb-section">
          <EssayStory blocks={blocks} />
        </section>

        {/* Fim + convite */}
        <section className="container-site pb-section text-center">
          <p className="eyebrow text-ash" data-reveal="fade">
            Fim
          </p>
          <span aria-hidden data-reveal="line" className="mx-auto mt-6 block h-px w-16 bg-ink/30" />
          <RevealText
            lines={[{ text: "Quer guardar uma fase" }, { text: "assim?", emphasis: true }]}
            className="mx-auto mt-12 max-w-[16ch] text-h2"
          />
          <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10" data-reveal>
            <ButtonLink href={whatsappUrlForEssay(essay.title, essay.categoryLabel)} icon="whatsapp">
              Conversar sobre um ensaio
            </ButtonLink>
            <TextLink href="/portfolio">Ver outros ensaios</TextLink>
          </div>
        </section>

        {/* Próximo ensaio */}
        {next && next.slug !== essay.slug && (
          <Link
            href={`/portfolio/${next.slug}`}
            className="group relative isolate flex min-h-[70svh] items-end overflow-hidden bg-night text-white"
            data-cursor="Próximo ensaio"
            data-hide-fab
          >
            <div className="absolute inset-0 -z-10">
              <ViewTransition name={`essay-${next.slug}`} share="morph" default="none">
                <Photo image={next.cover} aspect="none" sizes="100vw" zoom parallax reveal={false} className="h-full w-full" />
              </ViewTransition>
            </div>
            <div aria-hidden className="absolute inset-0 -z-10 bg-night/50 transition-colors duration-700 group-hover:bg-night/35" />
            <div className="container-site flex w-full items-end justify-between gap-8 pb-12 sm:pb-16">
              <div>
                <p className="eyebrow text-white/70">Próximo ensaio · {next.categoryLabel}</p>
                <p className="heading mt-5 text-h1">{next.title}</p>
              </div>
              <span className="mb-3 hidden h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/40 transition-colors duration-500 group-hover:bg-white group-hover:text-ink sm:flex">
                <ArrowRight size={20} className="arrow-nudge" />
              </span>
            </div>
          </Link>
        )}

        <JsonLd
          data={[
            essayJsonLd({
              title: essay.title,
              excerpt: essay.excerpt,
              slug: essay.slug,
              categoryLabel: essay.categoryLabel,
              images: [essay.cover.src, ...gallery.map((image) => image.src)],
            }),
            breadcrumbJsonLd([
              { name: "Início", path: "/" },
              { name: "Portfólio", path: "/portfolio" },
              { name: essay.title, path: `/portfolio/${essay.slug}` },
            ]),
          ]}
        />
      </main>
    </PageTransition>
  );
}
