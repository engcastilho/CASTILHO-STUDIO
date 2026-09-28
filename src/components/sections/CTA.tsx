import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { RevealText, type TitleLine } from "@/components/ui/RevealText";
import { finalCta } from "@/config/content";
import { resolveImage } from "@/lib/images";
import { whatsappUrl } from "@/lib/whatsapp";

type CTAProps = {
  title?: TitleLine[];
  text?: string;
  /** Mensagem pré-preenchida específica (ex.: vinda de um ensaio). */
  message?: string;
};

/**
 * Chamada final: fotografia escura em tela cheia, frase curta e um único caminho — o WhatsApp.
 * Marca [data-hide-fab] para o botão flutuante não duplicar a ação.
 */
export function CTA({ title = finalCta.title, text = finalCta.text, message }: CTAProps) {
  const image = resolveImage(finalCta.image, finalCta.imageAlt);
  return (
    <section
      aria-labelledby="cta-title"
      className="relative isolate flex min-h-[88svh] items-center overflow-hidden bg-night text-white"
      data-hide-fab
    >
      <div className="absolute inset-0 -z-10">
        <Photo image={image} aspect="none" sizes="100vw" parallax reveal={false} className="h-full w-full" />
        <div aria-hidden className="absolute inset-0 bg-night/55" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-night/40" />
      </div>

      <div className="container-site py-section text-center">
        <p className="eyebrow flex items-center justify-center gap-3 text-white/70" data-reveal="fade">
          <span aria-hidden className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-[rec_2.6s_ease-in-out_infinite] rounded-full bg-terra" />
          </span>
          {finalCta.eyebrow}
        </p>
        <RevealText id="cta-title" lines={title} className="mx-auto mt-8 max-w-[16ch] text-h1" />
        <p className="mx-auto mt-8 max-w-md text-lead text-white/80" data-reveal>
          {text}
        </p>
        <div className="mt-12 flex flex-col items-center gap-6" data-reveal>
          <ButtonLink href={whatsappUrl(message)} variant="light" icon="whatsapp">
            {finalCta.cta}
          </ButtonLink>
          <Link
            href="/contato"
            className="text-[0.75rem] font-medium uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
          >
            <span className="link-draw">{finalCta.secondary}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
