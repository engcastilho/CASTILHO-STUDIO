import type { Metadata } from "next";

import { PageTransition } from "@/components/layout/PageTransition";
import { CinematicBreak } from "@/components/sections/CinematicBreak";
import { CTA } from "@/components/sections/CTA";
import { Differentials } from "@/components/sections/Differentials";
import { Experience } from "@/components/sections/Experience";
import { FAQ } from "@/components/sections/FAQ";
import { PageHeader } from "@/components/sections/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { experience } from "@/config/content";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Experiência",
  description:
    "Como é fazer um ensaio com a Castilho Produções: conversa, planejamento, ensaio com direção leve, curadoria cuidadosa e entrega elegante.",
  alternates: { canonical: "/experiencia" },
  openGraph: { url: "/experiencia" },
};

export default function ExperiencePage() {
  return (
    <PageTransition>
      <main id="main">
        <PageHeader eyebrow={experience.eyebrow} title={experience.title} intro={experience.intro} />
        <CinematicBreak quote="Nada fica para o improviso — exceto vocês." />
        <Experience variant="page" />
        <Differentials tone="ink" />
        <FAQ />
        <CTA />
        <JsonLd
          data={[
            faqJsonLd(),
            breadcrumbJsonLd([
              { name: "Início", path: "/" },
              { name: "Experiência", path: "/experiencia" },
            ]),
          ]}
        />
      </main>
    </PageTransition>
  );
}
