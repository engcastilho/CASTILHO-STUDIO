import Image from "next/image";
import type { CSSProperties } from "react";

import type { ResolvedImage } from "@/lib/images";
import { cn } from "@/lib/utils";

export type PhotoProps = {
  image: ResolvedImage;
  /** Proporção do quadro, ex.: "4 / 5". Padrão: a proporção real da foto. "none" = o pai define. */
  aspect?: string;
  sizes: string;
  /** Imagem principal da página (LCP): pré-carregada. */
  priority?: boolean;
  /** Dentro da primeira dobra, mas não é o LCP. */
  eager?: boolean;
  /** Revela com "cortina" ao entrar na tela. */
  reveal?: boolean;
  revealDelay?: number;
  /** Parallax discreto (CSS scroll-driven). */
  parallax?: boolean;
  /** Zoom lento no hover do elemento pai com a classe `group`. */
  zoom?: boolean;
  objectPosition?: string;
  quality?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Toda fotografia do site passa por aqui:
 * next/image (AVIF/WebP, srcset, lazy) + placeholder desfocado + quadro com proporção fixa (sem CLS).
 * Estrutura em camadas: quadro (revelação) → escala (revelação) → parallax → imagem (hover).
 */
export function Photo({
  image,
  aspect,
  sizes,
  priority,
  eager,
  reveal = true,
  revealDelay,
  parallax,
  zoom,
  objectPosition,
  quality,
  className,
  style,
}: PhotoProps) {
  const ratio = aspect === "none" ? undefined : (aspect ?? `${image.width} / ${image.height}`);
  return (
    <div
      className={cn("relative overflow-hidden", zoom && "photo-zoom", className)}
      data-reveal={reveal ? "image" : undefined}
      style={
        {
          aspectRatio: ratio,
          backgroundColor: image.color ?? "var(--color-sand)",
          "--reveal-delay": revealDelay ? `${revealDelay}ms` : undefined,
          ...style,
        } as CSSProperties
      }
    >
      <div className="reveal-scale absolute inset-0">
        <div className={cn("absolute inset-x-0", parallax ? "parallax -inset-y-[7%]" : "inset-y-0")}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            quality={quality ?? (priority ? 85 : 75)}
            preload={priority || undefined}
            loading={eager ? "eager" : undefined}
            placeholder={image.blurDataURL ? "blur" : "empty"}
            blurDataURL={image.blurDataURL}
            className="object-cover"
            style={objectPosition ? { objectPosition } : undefined}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
