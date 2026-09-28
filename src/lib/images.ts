import "server-only";

import manifest from "@/lib/generated/image-manifest.json";

type ManifestEntry = {
  width: number;
  height: number;
  blurDataURL: string;
  color: string;
};

const entries = manifest as Record<string, ManifestEntry>;

/** Imagem pronta para o componente <Photo>: dimensões reais + placeholder desfocado. */
export type ResolvedImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  color?: string;
};

export type Orientation = "portrait" | "landscape" | "square";

/**
 * Resolve uma imagem de /public com seus metadados (gerados por scripts/generate-image-manifest.mjs).
 * Se a imagem ainda não estiver no manifesto, usa proporção 4:5 como padrão.
 */
export function resolveImage(src: string, alt: string): ResolvedImage {
  const entry = entries[src];
  return {
    src,
    alt,
    width: entry?.width ?? 1200,
    height: entry?.height ?? 1500,
    blurDataURL: entry?.blurDataURL,
    color: entry?.color,
  };
}

export function orientationOf(image: Pick<ResolvedImage, "width" | "height">): Orientation {
  const ratio = image.width / image.height;
  if (ratio > 1.1) return "landscape";
  if (ratio < 0.9) return "portrait";
  return "square";
}

/**
 * Lista as imagens de uma pasta de /public (ex.: "/images/portfolio/casa-cheia"),
 * em ordem alfabética, ignorando a capa.
 */
export function listImages(folder: string, { exclude = ["cover"] }: { exclude?: string[] } = {}) {
  const prefix = folder.endsWith("/") ? folder : `${folder}/`;
  return Object.keys(entries)
    .filter((key) => key.startsWith(prefix) && !key.slice(prefix.length).includes("/"))
    .filter((key) => {
      const name = key.slice(prefix.length).replace(/\.[a-z]+$/i, "");
      return !exclude.includes(name);
    })
    .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));
}
