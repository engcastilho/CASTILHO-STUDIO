import { site } from "@/config/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** inline: navegação · stacked: rodapé e assinaturas */
  variant?: "inline" | "stacked";
};

/**
 * Assinatura tipográfica da marca.
 * CASTILHO em caixa alta espaçada (sans) + "Produções" em itálico editorial (serif),
 * como a assinatura de um diretor ao pé de um cartaz.
 */
export function Logo({ className, variant = "inline" }: LogoProps) {
  const { primary, secondary } = site.wordmark;
  return (
    <span
      className={cn(
        "inline-flex select-none leading-none",
        variant === "inline" ? "items-baseline gap-2.5" : "flex-col items-start gap-1.5",
        className,
      )}
    >
      <span className="font-sans text-[0.8125rem] font-medium uppercase tracking-[0.34em] sm:text-[0.875rem]">
        {primary}
      </span>
      <span
        className={cn(
          "font-serif italic tracking-normal opacity-75",
          variant === "inline" ? "text-[1.0625rem] sm:text-[1.125rem]" : "text-[1.25rem]",
        )}
      >
        {secondary}
      </span>
    </span>
  );
}
