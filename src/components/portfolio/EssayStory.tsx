import type { CSSProperties } from "react";

import { Photo } from "@/components/ui/Photo";
import type { StoryBlock } from "@/lib/portfolio";
import { cn, pad } from "@/lib/utils";

/**
 * Narrativa visual do ensaio: sequência de blocos com ritmo de revista
 * (tela cheia, pares assimétricos, trípticos, retratos com texto e interlúdios).
 * Fotos sempre na proporção original — nada de cortar o trabalho do fotógrafo.
 */
export function EssayStory({ blocks }: { blocks: StoryBlock[] }) {
  let frame = 0;
  const next = () => pad(++frame);

  return (
    <div className="flex flex-col gap-[clamp(4.5rem,11vw,11rem)]">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "full":
            return (
              <figure key={index}>
                <Photo image={block.image} sizes="100vw" parallax className="w-full" />
                <FrameNumber value={next()} className="container-site" />
              </figure>
            );

          case "wide":
            return (
              <figure key={index} className="container-site grid-editorial">
                <div
                  className={cn(
                    "col-span-4 md:col-span-7 lg:col-span-9",
                    block.align === "right" && "md:col-start-2 lg:col-start-4",
                  )}
                >
                  <Photo image={block.image} sizes="(min-width: 1024px) 75vw, 100vw" />
                  <FrameNumber value={next()} />
                </div>
              </figure>
            );

          case "pair": {
            const [a, b] = block.images;
            return (
              <div key={index} className="container-site grid-editorial gap-y-10">
                <figure
                  className={cn(
                    "col-span-4 md:col-span-4 lg:col-span-5",
                    block.flip ? "md:col-start-5 md:row-start-1 lg:col-start-8" : "md:col-start-1",
                  )}
                >
                  <Photo image={a} sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw" />
                  <FrameNumber value={next()} />
                </figure>
                <figure
                  className={cn(
                    "col-span-3 col-start-2 md:col-span-4 md:mt-32 lg:col-span-4 lg:mt-48",
                    block.flip ? "md:col-start-1 md:row-start-1 lg:col-start-2" : "md:col-start-5 lg:col-start-8",
                  )}
                >
                  <Photo image={b} sizes="(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 75vw" revealDelay={150} />
                  <FrameNumber value={next()} />
                </figure>
              </div>
            );
          }

          case "triptych":
            return (
              <div key={index} className="container-site">
                <div className="snap-row -mx-(--gutter) flex gap-(--grid-gap) overflow-x-auto px-(--gutter) md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
                  {block.images.map((image, i) => (
                    <figure key={image.src} className={cn("w-[72vw] shrink-0 md:w-auto", i === 1 && "md:mt-24")}>
                      <Photo image={image} sizes="(min-width: 768px) 32vw, 72vw" revealDelay={i * 120} />
                      <FrameNumber value={next()} />
                    </figure>
                  ))}
                </div>
              </div>
            );

          case "portrait":
            return (
              <div key={index} className="container-site grid-editorial items-center gap-y-12">
                <figure
                  className={cn(
                    "col-span-4 md:col-span-5 lg:col-span-5",
                    block.align === "right" && "md:col-start-4 lg:col-start-8 md:row-start-1",
                  )}
                >
                  <Photo image={block.image} sizes="(min-width: 1024px) 40vw, (min-width: 768px) 62vw, 100vw" />
                  <FrameNumber value={next()} />
                </figure>
                {block.text && (
                  <p
                    className={cn(
                      "heading col-span-4 text-h3 italic md:col-span-6 lg:col-span-4",
                      block.align === "right" ? "md:row-start-2 lg:col-start-2 lg:row-start-1" : "lg:col-start-8",
                    )}
                    data-reveal
                  >
                    {block.text}
                  </p>
                )}
              </div>
            );

          case "interlude":
            return (
              <blockquote key={index} className="container-site grid-editorial">
                <p
                  className="heading col-span-4 text-center text-h2 italic md:col-span-6 md:col-start-2 lg:col-span-8 lg:col-start-3"
                  data-reveal
                  style={{ "--reveal-delay": "80ms" } as CSSProperties}
                >
                  {block.text}
                </p>
              </blockquote>
            );
        }
      })}
    </div>
  );
}

function FrameNumber({ value, className }: { value: string; className?: string }) {
  return (
    <figcaption className={cn("tabular mt-3 text-[0.625rem] tracking-[0.2em] text-ash uppercase", className)}>
      Fotograma {value}
    </figcaption>
  );
}

