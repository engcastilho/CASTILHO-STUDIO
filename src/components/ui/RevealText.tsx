import type { CSSProperties, ElementType } from "react";

import { cn } from "@/lib/utils";

export type TitleLine = { text: string; emphasis?: boolean };

type RevealTextProps = {
  lines: TitleLine[];
  as?: ElementType;
  className?: string;
  /** "scroll": revela ao entrar na tela · "load": anima na abertura da página (primeira dobra). */
  trigger?: "scroll" | "load";
  delay?: number;
  id?: string;
};

/**
 * Títulos que surgem linha a linha, de baixo para cima, como créditos de abertura.
 * Trechos com `emphasis` recebem o itálico editorial da serifa.
 */
export function RevealText({ lines, as: Tag = "h2", className, trigger = "scroll", delay = 0, id }: RevealTextProps) {
  return (
    <Tag
      id={id}
      className={cn("heading", className)}
      data-reveal={trigger === "scroll" ? "lines" : undefined}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {lines.map((line, index) => (
        <span key={index} className="reveal-line">
          <span
            className={cn(trigger === "load" && "hero-in")}
            style={
              {
                "--line-index": index,
                "--delay": trigger === "load" ? `${delay + index * 110}ms` : undefined,
              } as CSSProperties
            }
          >
            {line.emphasis ? <em className="italic">{line.text}</em> : line.text}
          </span>
        </span>
      ))}
    </Tag>
  );
}
