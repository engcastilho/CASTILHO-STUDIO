import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
  /** Numeração editorial opcional, ex.: "02". */
  index?: string;
  reveal?: boolean;
  as?: "p" | "span" | "h2";
  style?: CSSProperties;
};

/** Rótulo de seção: pequena régua + caixa alta espaçada. */
export function Eyebrow({ children, className, index, reveal = true, as: Tag = "p", style }: EyebrowProps) {
  return (
    <Tag
      className={cn("eyebrow flex items-center gap-3", className)}
      data-reveal={reveal ? "fade" : undefined}
      style={style}
    >
      <span aria-hidden className="h-px w-7 bg-current opacity-45" />
      {index && <span className="tabular opacity-60">{index}</span>}
      <span>{children}</span>
    </Tag>
  );
}
