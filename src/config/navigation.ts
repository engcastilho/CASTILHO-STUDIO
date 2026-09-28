export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Portfólio", href: "/portfolio" },
  { label: "Experiência", href: "/experiencia" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

/**
 * Rotas que começam com uma fotografia em tela cheia:
 * nelas a navegação fica clara (sobre a imagem) até o visitante rolar a página.
 */
export const overlayRoutes = [/^\/$/, /^\/portfolio\/[^/]+$/, /^\/sobre$/];
