import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { ArrowRight, ArrowUpRight, WhatsAppIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type Variant = "solid" | "light" | "outline" | "outline-light";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-graphite",
  light: "bg-paper text-ink hover:bg-white",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  "outline-light": "border border-white/35 text-white hover:border-white hover:bg-white hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.75rem] gap-3",
  lg: "h-14 px-7 text-[0.8125rem] gap-4",
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Ícone à direita: seta (padrão), seta diagonal (externo), WhatsApp à esquerda, ou nenhum. */
  icon?: "arrow" | "external" | "whatsapp" | "none";
  className?: string;
} & Omit<ComponentProps<"a">, "href" | "children" | "className">;

/** Botão-link: pílula discreta, caixa alta espaçada, seta que avança no hover. */
export function ButtonLink({
  href,
  children,
  variant = "solid",
  size = "lg",
  icon = "arrow",
  className,
  ...props
}: ButtonLinkProps) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const classes = cn(
    "group inline-flex shrink-0 items-center justify-center rounded-full font-medium uppercase tracking-[0.18em]",
    "transition-[background-color,color,border-color] duration-500 ease-(--ease-cinema)",
    variants[variant],
    sizes[size],
    className,
  );
  const content = (
    <>
      {icon === "whatsapp" && <WhatsAppIcon size={18} className="-ml-1" />}
      <span>{children}</span>
      {icon === "arrow" && <ArrowRight size={16} className="arrow-nudge" />}
      {icon === "external" && <ArrowUpRight size={16} className="arrow-nudge arrow-nudge-up" />}
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}

type TextLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  arrow?: boolean;
} & Omit<ComponentProps<"a">, "href" | "children" | "className">;

/** Link editorial sublinhado, com a linha redesenhada no hover. */
export function TextLink({ href, children, className, arrow = true, ...props }: TextLinkProps) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const classes = cn(
    "group inline-flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.2em]",
    className,
  );
  const content = (
    <>
      <span className="link-line">{children}</span>
      {arrow && <ArrowRight size={15} className="arrow-nudge" />}
    </>
  );
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}
