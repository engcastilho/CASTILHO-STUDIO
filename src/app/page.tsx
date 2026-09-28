import type { Metadata } from "next";

import { PageTransition } from "@/components/layout/PageTransition";
import { About } from "@/components/sections/About";
import { Categories } from "@/components/sections/Categories";
import { CinematicBreak } from "@/components/sections/CinematicBreak";
import { CTA } from "@/components/sections/CTA";
import { Differentials } from "@/components/sections/Differentials";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { InstagramSection } from "@/components/sections/InstagramSection";
import { Manifesto } from "@/components/sections/Manifesto";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Testimonials } from "@/components/sections/Testimonials";
import { testimonials } from "@/config/testimonials";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Jornada da home:
 * IMPACTO (hero) → EMOÇÃO (manifesto, ensaios) → DESEJO (categorias, pausa) →
 * CONFIANÇA (experiência, cuidados, fotógrafo, depoimentos, diário) → AÇÃO (WhatsApp).
 */
export default function HomePage() {
  return (
    <PageTransition>
      <main id="main">
        <Hero />
        <Manifesto />
        <SelectedWork />
        <Categories />
        <CinematicBreak />
        <Experience />
        <Differentials tone="ink" />
        <About />
        <Testimonials items={testimonials} />
        <InstagramSection />
        <CTA />
      </main>
    </PageTransition>
  );
}
