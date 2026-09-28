import { getImageProps } from "next/image";
import type { CSSProperties } from "react";

import { ButtonLink, TextLink } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { hero } from "@/config/content";
import { site } from "@/config/site";
import { resolveImage } from "@/lib/images";
import { locationLabel } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Abertura cinematográfica.
 * - Fotografia em tela cheia com direção de arte: horizontal no desktop, vertical no celular.
 * - A imagem "acende" (escala + brilho) enquanto a assinatura CASTILHO sai de cena.
 * - Título em créditos de abertura; ao rolar, o texto se dissolve e a imagem desce (CSS scroll-driven).
 */
export function Hero() {
  const desktop = resolveImage(hero.image, hero.imageAlt);
  const mobile = resolveImage(hero.imageMobile ?? hero.image, hero.imageAlt);
  const common = { alt: hero.imageAlt, sizes: "100vw", quality: 85 };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: desktop.src, width: desktop.width, height: desktop.height });
  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({
    ...common,
    src: mobile.src,
    width: mobile.width,
    height: mobile.height,
    loading: "eager",
    fetchPriority: "high",
  });

  const location = locationLabel();

  return (
    <section
      aria-label="Abertura"
      className="relative isolate flex h-svh min-h-[34rem] flex-col overflow-hidden bg-ink text-white"
    >
      {/* Fotografia */}
      <div className="hero-parallax absolute inset-0 -z-10">
        <div
          className="hero-image-in absolute inset-0"
          style={{
            backgroundColor: desktop.color,
            backgroundImage: desktop.blurDataURL ? `url(${desktop.blurDataURL})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <picture>
            <source media="(min-width: 48rem)" srcSet={desktopSrcSet} sizes="100vw" />
            <source media="(max-width: 47.99rem)" srcSet={mobileSrcSet} sizes="100vw" />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- props vêm de getImageProps */}
            <img {...imgProps} className="h-full w-full object-cover" />
          </picture>
        </div>
        {/* Véus para leitura do texto, como a gradação de um filme */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-night/45 via-transparent to-transparent" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/20 to-transparent" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-night/35 via-transparent to-transparent" />
      </div>

      {/* Texto */}
      <div className="hero-fade container-site flex flex-1 flex-col justify-end pt-(--header-h) pb-24 sm:pb-28 lg:pb-32">
        <p className="eyebrow hero-fade-in mb-6 text-white/75 sm:mb-8" style={{ "--delay": "100ms" } as CSSProperties}>
          {hero.eyebrow}
          {location ? ` — ${location}` : ""}
        </p>

        <RevealText
          as="h1"
          lines={hero.title}
          trigger="load"
          delay={150}
          className="text-display max-w-[14ch]"
        />
        <span className="sr-only">
          {site.studioName} — fotografia de famílias, casais, gestantes e retratos.
        </span>

        <div className="mt-8 grid items-end gap-8 sm:mt-10 lg:grid-cols-12 lg:gap-(--grid-gap)">
          <p
            className="hero-fade-in max-w-md text-[1.0625rem] leading-relaxed text-white/80 sm:text-lead lg:col-span-5"
            style={{ "--delay": "600ms" } as CSSProperties}
          >
            {hero.subtitle}
          </p>
          <div
            className="hero-fade-in flex flex-wrap items-center gap-x-8 gap-y-5 lg:col-span-6 lg:col-start-7 lg:justify-end"
            style={{ "--delay": "800ms" } as CSSProperties}
          >
            <ButtonLink href={whatsappUrl()} variant="light" icon="arrow">
              {hero.primaryCta}
            </ButtonLink>
            <TextLink href="/portfolio" className="text-white">
              {hero.secondaryCta}
            </TextLink>
          </div>
        </div>
      </div>

      {/* Rodapé do quadro: legenda, indicação de rolagem */}
      <div
        className="hero-fade-in pointer-events-none absolute inset-x-0 bottom-0"
        style={{ "--delay": "1100ms" } as CSSProperties}
      >
        <div className="container-site flex items-end justify-between pb-6 text-[0.6875rem] tracking-[0.18em] text-white/60 uppercase">
          <span className="hidden sm:block">{hero.caption}</span>
          <a
            href="#manifesto"
            className="pointer-events-auto hidden flex-col items-center gap-3 sm:flex"
            aria-label="Rolar para o manifesto"
          >
            <span>Role</span>
            <span aria-hidden className="scroll-cue block h-10 w-px bg-white/25 text-white" />
          </a>
          <span className="hidden sm:block">Fotografia autoral</span>
        </div>
      </div>
    </section>
  );
}
