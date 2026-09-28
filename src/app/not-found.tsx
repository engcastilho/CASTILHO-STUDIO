import type { Metadata } from "next";

import { ButtonLink, TextLink } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" className="container-site flex min-h-svh flex-col justify-center pt-(--header-h) pb-24">
      <p className="eyebrow hero-fade-in text-ash">Erro 404</p>
      <RevealText
        as="h1"
        lines={[{ text: "Esta página se perdeu" }, { text: "no tempo.", emphasis: true }]}
        trigger="load"
        className="mt-8 max-w-[14ch] text-h1"
      />
      <p className="hero-fade-in mt-8 max-w-md text-lead text-ash">
        Algumas coisas só existem uma vez — outras, só mudaram de lugar.
      </p>
      <div className="hero-fade-in mt-12 flex flex-wrap items-center gap-8">
        <ButtonLink href="/">Voltar ao início</ButtonLink>
        <TextLink href="/portfolio">Ver o portfólio</TextLink>
      </div>
    </main>
  );
}
