import type { Metadata } from "next";
import { Suspense } from "react";

import { PageTransition } from "@/components/layout/PageTransition";
import { PortfolioExplorer, type ExplorerEssay } from "@/components/portfolio/PortfolioExplorer";
import { PortfolioFilters } from "@/components/portfolio/PortfolioFilters";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { CTA } from "@/components/sections/CTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getCategories, getEssays } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Portfólio",
  description:
    "Ensaios de famílias, casais, gestantes, crianças e retratos. Fotografia autoral com luz natural, direção leve e olhar de cinema.",
  alternates: { canonical: "/portfolio" },
  openGraph: { url: "/portfolio" },
};

export default function PortfolioPage() {
  const essays: ExplorerEssay[] = getEssays().map((essay) => ({
    slug: essay.slug,
    title: essay.title,
    number: essay.number,
    categoryLabel: essay.categoryLabel,
    setting: essay.setting,
    cover: essay.cover,
    excerpt: essay.excerpt,
    category: essay.category,
  }));
  const options = getCategories()
    .filter((category) => category.count > 0)
    .map((category) => ({ slug: category.slug, label: category.label, count: category.count }));

  return (
    <PageTransition>
      <main id="main">
        <PageHeader
          eyebrow="Portfólio"
          title={[{ text: "Fases da vida," }, { text: "contadas em imagens.", emphasis: true }]}
          intro="Famílias, casais, gestantes, crianças e retratos. Cada ensaio é uma história com lugar, luz e ritmo próprios."
        />

        <div className="pb-section">
          {/* O filtro lê a URL no navegador; o HTML estático já traz todos os ensaios. */}
          <Suspense
            fallback={
              <>
                <PortfolioFilters options={options} active="todos" />
                <div className="container-site pt-16 sm:pt-24">
                  <PortfolioGrid essays={essays} eagerFirst />
                </div>
              </>
            }
          >
            <PortfolioExplorer essays={essays} options={options} />
          </Suspense>
        </div>

        <CTA
          title={[{ text: "A próxima história" }, { text: "pode ser a de vocês.", emphasis: true }]}
          text="Conte o que vocês estão vivendo agora. Planejamos juntos um ensaio com a cara dessa fase."
        />
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Portfólio", path: "/portfolio" },
          ])}
        />
      </main>
    </PageTransition>
  );
}
