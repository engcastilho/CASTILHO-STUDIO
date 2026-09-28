import type { MetadataRoute } from "next";

import { essays } from "@/config/portfolio";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/portfolio"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/experiencia"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/sobre"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/contato"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];
  const essayPages: MetadataRoute.Sitemap = essays.map((essay) => ({
    url: absoluteUrl(`/portfolio/${essay.slug}`),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
    images: [absoluteUrl(essay.cover)],
  }));
  return [...pages, ...essayPages];
}
