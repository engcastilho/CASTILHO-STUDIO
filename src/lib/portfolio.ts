import "server-only";

import { categories, essays, type Category, type CategorySlug, type Essay } from "@/config/portfolio";
import { listImages, orientationOf, resolveImage, type ResolvedImage } from "@/lib/images";
import { pad } from "@/lib/utils";

export type ResolvedEssay = Omit<Essay, "cover" | "gallery"> & {
  number: string;
  categoryLabel: string;
  cover: ResolvedImage;
};

export type ResolvedCategory = Omit<Category, "image"> & {
  image: ResolvedImage;
  count: number;
};

function categoryLabel(slug: CategorySlug) {
  return categories.find((category) => category.slug === slug)?.label ?? slug;
}

function toResolved(essay: Essay, index: number): ResolvedEssay {
  const { cover, gallery: _gallery, ...rest } = essay;
  void _gallery;
  return {
    ...rest,
    number: pad(index + 1),
    categoryLabel: categoryLabel(essay.category),
    cover: resolveImage(cover, essay.coverAlt),
  };
}

export function getEssays(): ResolvedEssay[] {
  return essays.map(toResolved);
}

export function getFeaturedEssays(limit = 5) {
  const all = getEssays();
  const featured = all.filter((essay) => essay.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export function getEssay(slug: string) {
  const index = essays.findIndex((essay) => essay.slug === slug);
  if (index === -1) return undefined;
  return { essay: toResolved(essays[index], index), source: essays[index] };
}

export function getAdjacentEssays(slug: string) {
  const all = getEssays();
  const index = all.findIndex((essay) => essay.slug === slug);
  return {
    previous: all[(index - 1 + all.length) % all.length],
    next: all[(index + 1) % all.length],
  };
}

export function getCategories(): ResolvedCategory[] {
  return categories.map((category) => ({
    ...category,
    image: resolveImage(category.image, `Ensaio de ${category.label.toLowerCase()}`),
    count: essays.filter((essay) => essay.category === category.slug).length,
  }));
}

/** Fotos do ensaio: lista manual (`gallery`) ou, por padrão, a pasta /images/portfolio/<slug>. */
export function getEssayGallery(source: Essay): ResolvedImage[] {
  const paths = source.gallery?.length ? source.gallery : listImages(`/images/portfolio/${source.slug}`);
  return paths.map((src, i) =>
    resolveImage(src, `${source.title} — fotografia ${i + 1} do ensaio de ${categoryLabel(source.category).toLowerCase()}`),
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Composição editorial automática
 * ─────────────────────────────────────────────────────────────────────────────
 * Transforma uma lista simples de fotos em uma sequência com ritmo de revista:
 *   - horizontais alternam entre tela cheia e blocos deslocados;
 *   - verticais consecutivas formam pares assimétricos (ou trípticos);
 *   - frases do ensaio entram como interlúdios entre os blocos.
 * Funciona com qualquer quantidade/orientação de fotos enviadas.
 */
export type StoryBlock =
  | { kind: "full"; image: ResolvedImage }
  | { kind: "wide"; image: ResolvedImage; align: "left" | "right" }
  | { kind: "pair"; images: [ResolvedImage, ResolvedImage]; flip: boolean }
  | { kind: "triptych"; images: [ResolvedImage, ResolvedImage, ResolvedImage] }
  | { kind: "portrait"; image: ResolvedImage; text?: string; align: "left" | "right" }
  | { kind: "interlude"; text: string };

export function composeStory(images: ResolvedImage[], interludes: string[] = []): StoryBlock[] {
  const blocks: StoryBlock[] = [];
  const texts = [...interludes];
  const landscapeCycle = ["full", "wide-left", "wide-right"] as const;
  let landscapeTurn = 0;
  let pairTurn = 0;
  let portraitTurn = 0;
  let sinceInterlude = 0;

  for (let i = 0; i < images.length; ) {
    const current = images[i];
    const next = images[i + 1];
    const third = images[i + 2];
    const isPortrait = (img?: ResolvedImage) => !!img && orientationOf(img) !== "landscape";

    if (!isPortrait(current)) {
      const style = landscapeCycle[landscapeTurn++ % landscapeCycle.length];
      blocks.push(
        style === "full"
          ? { kind: "full", image: current }
          : { kind: "wide", image: current, align: style === "wide-left" ? "left" : "right" },
      );
      i += 1;
    } else if (isPortrait(next) && isPortrait(third) && pairTurn % 3 === 2) {
      blocks.push({ kind: "triptych", images: [current, next!, third!] });
      pairTurn++;
      i += 3;
    } else if (isPortrait(next)) {
      blocks.push({ kind: "pair", images: [current, next!], flip: pairTurn++ % 2 === 1 });
      i += 2;
    } else {
      blocks.push({
        kind: "portrait",
        image: current,
        text: texts.shift(),
        align: portraitTurn++ % 2 === 0 ? "left" : "right",
      });
      sinceInterlude = 0;
      i += 1;
      continue;
    }

    sinceInterlude++;
    if (sinceInterlude >= 2 && texts.length && i < images.length) {
      blocks.push({ kind: "interlude", text: texts.shift()! });
      sinceInterlude = 0;
    }
  }

  // Frases que sobraram fecham a narrativa.
  for (const text of texts) blocks.push({ kind: "interlude", text });
  return blocks;
}
