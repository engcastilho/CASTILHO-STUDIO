import type { MetadataRoute } from "next";

import { site } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.studioName,
    short_name: "Castilho",
    description: site.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1ec",
    theme_color: "#161412",
    lang: "pt-BR",
    icons: [{ src: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
  };
}
