import { faq } from "@/config/content";
import { site } from "@/config/site";
import { locationLabel } from "@/lib/location";
import { filled } from "@/lib/utils";

export { locationLabel };

export const siteUrl = site.url.replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Título padrão com a cidade, quando configurada (SEO local). */
export function defaultTitle() {
  const location = filled(site.city);
  return location ? `${site.seo.title} em ${location}` : site.seo.title;
}

export function defaultDescription() {
  const location = locationLabel();
  return location ? `${site.seo.description} Em ${location} e região.` : site.seo.description;
}

/* ── Dados estruturados (JSON-LD) ──────────────────────────────────────── */

export function businessJsonLd() {
  const phone = filled(site.whatsapp.number);
  const email = filled(site.email);
  const city = filled(site.city);
  const state = filled(site.state);
  const area = filled(site.serviceArea);
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#business`,
    name: site.studioName,
    description: site.seo.description,
    url: siteUrl,
    image: absoluteUrl("/opengraph-image"),
    ...(phone ? { telephone: `+${phone.replace(/\D/g, "")}` } : {}),
    ...(email ? { email } : {}),
    ...(city || state
      ? {
          address: {
            "@type": "PostalAddress",
            ...(city ? { addressLocality: city } : {}),
            ...(state ? { addressRegion: state } : {}),
            addressCountry: "BR",
          },
        }
      : {}),
    ...(area ? { areaServed: area } : {}),
    sameAs: [site.instagram.url],
    knowsAbout: ["Fotografia de família", "Ensaio de casal", "Ensaio gestante", "Fotografia infantil", "Retrato profissional"],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: site.studioName,
    url: siteUrl,
    inLanguage: "pt-BR",
    publisher: { "@id": `${siteUrl}/#business` },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function essayJsonLd(essay: { title: string; excerpt: string; slug: string; categoryLabel: string; images: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `${essay.title} — ${essay.categoryLabel}`,
    description: essay.excerpt,
    url: absoluteUrl(`/portfolio/${essay.slug}`),
    inLanguage: "pt-BR",
    author: { "@id": `${siteUrl}/#business` },
    image: essay.images.map((src) => absoluteUrl(src)),
  };
}
