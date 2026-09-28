/**
 * DEPOIMENTOS
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️  Os textos abaixo são ILUSTRATIVOS, apenas para compor o layout.
 *     Substitua por depoimentos reais (com autorização dos clientes) antes de publicar.
 */

export type Testimonial = {
  quote: string;
  author: string;
  /** Tipo de ensaio — aparece discretamente abaixo do nome. */
  context: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Foi a primeira vez que conseguimos nos reconhecer de verdade em fotografias. Parecia a nossa família num dia bom — porque era.",
    author: "[Nome da cliente]",
    context: "Ensaio de família",
  },
  {
    quote:
      "Eu estava nervosa por não saber posar. Em dez minutos, esqueci que existia uma câmera ali.",
    author: "[Nome da cliente]",
    context: "Ensaio gestante",
  },
  {
    quote:
      "Olhamos as fotos do noivado até hoje. Elas têm o nosso jeito, não o jeito de um catálogo.",
    author: "[Nome do casal]",
    context: "Ensaio de casal",
  },
  {
    quote: "Meu filho mudou tanto desde o ensaio. Ainda bem que aquela fase ficou guardada.",
    author: "[Nome da cliente]",
    context: "Ensaio infantil",
  },
];
