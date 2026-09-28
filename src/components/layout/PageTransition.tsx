import { ViewTransition, type ReactNode } from "react";

/**
 * Transição entre páginas com a View Transitions API nativa (via React).
 * A página antiga se dissolve rapidamente; a nova sobe suave. Sem biblioteca extra.
 * Navegadores sem suporte trocam de página normalmente.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      {children}
    </ViewTransition>
  );
}
