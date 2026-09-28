/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CASTILHO PRODUÇÕES — CONFIGURAÇÃO CENTRAL
 * ─────────────────────────────────────────────────────────────────────────────
 *  Tudo o que é específico do estúdio mora aqui (e nos demais arquivos desta
 *  pasta). Valores entre colchetes — ex.: "[CIDADE]" — são placeholders:
 *  enquanto não forem preenchidos, o site os omite de títulos e metadados de SEO.
 *
 *  Arquivos desta pasta:
 *    site.ts          → dados do estúdio, contato, SEO, textos do fotógrafo
 *    portfolio.ts     → categorias e ensaios (páginas /portfolio/[slug])
 *    testimonials.ts  → depoimentos
 *    content.ts       → manifesto, etapas da experiência, diferenciais, FAQ
 *    navigation.ts    → menu principal
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const site = {
  studioName: "Castilho Produções",
  /** Assinatura da marca: CASTILHO em destaque, PRODUÇÕES como assinatura secundária. */
  wordmark: { primary: "Castilho", secondary: "Produções" },
  tagline: "Fotografia • Retratos • Histórias",

  photographerName: "[Nome do fotógrafo]",

  /** Localização — usada no rodapé, na página de contato e no SEO local. */
  city: "[CIDADE]",
  state: "[UF]",
  /** Ex.: "Campinas e região", "Atendemos todo o estado de São Paulo". */
  serviceArea: "[Região atendida]",

  whatsapp: {
    /**
     * Número no formato internacional, somente dígitos. Ex.: "5519999999999".
     * Também pode ser definido pela variável de ambiente NEXT_PUBLIC_WHATSAPP_NUMBER.
     */
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "[WHATSAPP_NUMBER]",
    /** Número exibido para leitura humana. Ex.: "(19) 99999-9999". */
    display: "[WHATSAPP_NUMBER]",
    message:
      "Olá! Conheci a Castilho Produções pelo site e gostaria de saber mais sobre os ensaios.",
  },

  instagram: {
    handle: "castilhoproducoes",
    url: "https://www.instagram.com/castilhoproducoes/",
  },

  email: "[EMAIL]",

  /** Horário de atendimento exibido na página de contato. */
  hours: "Segunda a sábado, com hora marcada",

  /**
   * URL pública do site. Na Vercel, é detectada automaticamente
   * (VERCEL_PROJECT_PRODUCTION_URL). Para domínio próprio, defina NEXT_PUBLIC_SITE_URL.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),

  seo: {
    title: "Castilho Produções | Fotografia de Famílias e Retratos",
    description:
      "Fotografia autoral para famílias, casais, gestantes e retratos. Imagens criadas para preservar histórias, pessoas e fases da vida.",
    keywords: [
      "fotografia de família",
      "ensaio de família",
      "ensaio de casal",
      "ensaio de noivado",
      "ensaio gestante",
      "ensaio infantil",
      "retrato profissional",
      "retrato individual",
      "fotógrafo de família",
      "ensaio externo",
    ],
    /** Imagem padrão de compartilhamento é gerada em src/app/opengraph-image.tsx */
  },

  /**
   * "Por trás da câmera" — textos pessoais ficam como placeholders.
   * Os textos marcados como SUGESTÃO podem ser mantidos ou reescritos com suas palavras.
   */
  photographer: {
    role: "Fotógrafo e diretor de imagem",
    portrait: "/images/about/photographer.jpg",
    portraitAlt: "Retrato do fotógrafo da Castilho Produções",
    story: "[Breve história — quem é você, de onde vem e como a fotografia entrou na sua vida.]",
    beginning:
      "[Como começou — o primeiro contato com a câmera, a primeira família fotografada, o momento em que virou profissão.]",
    searchFor:
      "[O que você procura em cada ensaio — um gesto, uma luz, o instante em que as pessoas esquecem a câmera.]",
    // SUGESTÃO
    philosophy:
      "Procuro o instante entre uma pose e outra — quando as pessoas param de tentar parecer e simplesmente são.",
    // SUGESTÃO
    vision:
      "Fotografia como documento afetivo: luz natural, cor honesta e composição de cinema. Imagens feitas para serem vistas daqui a trinta anos sem parecerem datadas.",
    behindTheScenes: ["/images/about/behind-01.jpg", "/images/about/behind-02.jpg"],
  },
} as const;

export type Site = typeof site;
