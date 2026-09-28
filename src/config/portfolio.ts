/**
 * PORTFÓLIO
 * ─────────────────────────────────────────────────────────────────────────────
 * Cada ensaio vira uma página em /portfolio/[slug].
 *
 * Imagens: coloque as fotos em /public/images/portfolio/<slug>/
 *   cover.jpg          → capa (usada nos cards e no topo da página do ensaio)
 *   01.jpg, 02.jpg...  → galeria, na ordem dos nomes
 *
 * A galeria é montada automaticamente a partir da pasta (fotos verticais são
 * agrupadas lado a lado, horizontais ganham destaque). Para controlar a ordem
 * manualmente, preencha `gallery` com a lista de caminhos.
 *
 * ⚠️  As imagens atuais são placeholders gerados. Substitua pelos ensaios reais
 *     antes de publicar o site.
 */

export type CategorySlug = "familias" | "casais" | "gestantes" | "infantil" | "retratos";

export type Category = {
  slug: CategorySlug;
  label: string;
  /** Frase curta e humana usada na vitrine de categorias. */
  line: string;
  image: string;
};

export type Essay = {
  slug: string;
  title: string;
  category: CategorySlug;
  /** Contexto curto exibido como legenda. Ex.: "Ensaio externo · Fim de tarde". */
  setting: string;
  /** Uma frase — aparece nos cards e na busca/compartilhamento. */
  excerpt: string;
  /** Parágrafos da introdução da página do ensaio. */
  story: string[];
  /** Frases que aparecem entre os blocos de fotos, como interlúdios editoriais. */
  interludes?: string[];
  cover: string;
  coverAlt: string;
  /** Enquadramento da capa em telas largas (CSS object-position). Ex.: "50% 30%". */
  coverPosition?: string;
  /** Opcional: lista manual de fotos. Se vazio, lê a pasta do ensaio. */
  gallery?: string[];
  /** Aparece na seleção da página inicial. */
  featured?: boolean;
};

export const categories: Category[] = [
  {
    slug: "familias",
    label: "Famílias",
    line: "A família como ela é agora — com a bagunça, o abraço apertado e o jeito de cada um.",
    image: "/images/categories/familias.jpg",
  },
  {
    slug: "casais",
    label: "Casais",
    line: "Namoro, noivado ou dez anos juntos. O que existe entre vocês, sem pose ensaiada.",
    image: "/images/categories/casais.jpg",
  },
  {
    slug: "gestantes",
    label: "Gestantes",
    line: "Os meses em que alguém já é amado antes mesmo de chegar.",
    image: "/images/categories/gestantes.jpg",
  },
  {
    slug: "infantil",
    label: "Infantil",
    line: "A fase que passa mais rápido do que todas as outras.",
    image: "/images/categories/infantil.jpg",
  },
  {
    slug: "retratos",
    label: "Retratos",
    line: "Individuais e profissionais. Presença, não pose.",
    image: "/images/categories/retratos.jpg",
  },
];

export const essays: Essay[] = [
  {
    slug: "tarde-de-domingo",
    title: "Tarde de domingo",
    category: "familias",
    setting: "Ensaio externo · Fim de tarde",
    excerpt:
      "Um campo aberto, a luz baixa do fim do dia e uma família que não consegue ficar parada — ainda bem.",
    story: [
      "Marcamos para a última hora de sol, quando a luz fica dourada e tudo parece acontecer mais devagar. A ideia nunca foi enfileirar ninguém para a foto: foi deixar as crianças correrem, os pais irem atrás, e estar no lugar certo quando o riso escapasse.",
      "Daqui a alguns anos, as crianças não vão caber mais no colo. Esta tarde vai continuar cabendo em uma fotografia.",
    ],
    interludes: [
      "Ninguém precisou posar. Bastou deixar a tarde acontecer.",
      "O colo ainda serve. Por enquanto.",
    ],
    cover: "/images/portfolio/tarde-de-domingo/cover.jpg",
    coverAlt: "Família caminhando por um campo na luz dourada do fim da tarde",
    featured: true,
  },
  {
    slug: "antes-do-sim",
    title: "Antes do sim",
    category: "casais",
    setting: "Noivado · Anoitecer na cidade",
    excerpt: "O noivado registrado na hora em que a cidade começa a acender as luzes.",
    story: [
      "Antes do casamento, com toda a sua produção, existe um casal que decidiu atravessar a vida junto. Este ensaio é sobre eles — não sobre a festa.",
      "Escolhemos as ruas por onde os dois costumam caminhar e o horário em que o céu fica azul e as primeiras luzes se acendem.",
    ],
    interludes: ["O que vem depois será grande. Este é o momento antes."],
    cover: "/images/portfolio/antes-do-sim/cover.jpg",
    coverAlt: "Casal abraçado ao anoitecer, com luzes da cidade desfocadas ao fundo",
    featured: true,
  },
  {
    slug: "quarenta-semanas",
    title: "Quarenta semanas",
    category: "gestantes",
    setting: "Em casa e ao ar livre · Manhã",
    excerpt: "Os últimos dias de espera, entre a luz da janela e uma caminhada lenta ao entardecer.",
    story: [
      "A gestação passa rápido demais para quem está vivendo — e, anos depois, todo mundo quer lembrar dela em detalhes.",
      "Fotografamos com calma, respeitando o ritmo do corpo, entre a luz suave da manhã e uma caminhada lenta no fim do dia.",
    ],
    interludes: ["Alguém que ainda não chegou já tinha um lugar guardado."],
    cover: "/images/portfolio/quarenta-semanas/cover.jpg",
    coverAlt: "Gestante em perfil iluminada pela luz suave de uma janela",
    featured: true,
  },
  {
    slug: "casa-cheia",
    title: "Casa cheia",
    category: "familias",
    setting: "Em casa · Sábado de manhã",
    excerpt: "A casa como ela é num sábado de manhã: café na mesa, pijama, bagunça e muito colo.",
    story: [
      "Fotografar em casa é registrar o que ninguém mais vê: o corredor onde as crianças correm, a janela da luz boa, o sofá que já viu de tudo. Não arrumamos nada além do necessário.",
      "É o tipo de ensaio que ganha valor com o tempo — porque a casa muda, os móveis mudam e, um dia, essa rotina vira saudade.",
    ],
    interludes: ["A casa muda. As pessoas também. Por isso a gente fotografa."],
    cover: "/images/portfolio/casa-cheia/cover.jpg",
    coverAlt: "Família reunida na sala de casa, iluminada pela luz da janela",
    featured: true,
  },
  {
    slug: "primeiro-verao",
    title: "Primeiro verão",
    category: "infantil",
    setting: "Ensaio externo · Verão",
    excerpt: "Uma criança, um gramado e todo o tempo do mundo.",
    story: [
      "Com crianças, quem dirige o ensaio são elas. A gente cria espaço, observa e espera. As melhores imagens aparecem quando elas esquecem que estamos ali.",
      "A infância é a fase que muda mais rápido. Em um ano, os gestos, o rosto e o jeito de brincar já serão outros.",
    ],
    interludes: ["Tudo nessa idade dura pouco. Principalmente o tamanho das mãos."],
    cover: "/images/portfolio/primeiro-verao/cover.jpg",
    coverAlt: "Criança brincando em um gramado sob a sombra das árvores",
    featured: true,
  },
  {
    slug: "dez-anos-depois",
    title: "Dez anos depois",
    category: "casais",
    setting: "Ensaio externo · Litoral",
    excerpt: "Dez anos juntos, uma praia em dia nublado e o jeito de se olhar que só o tempo ensina.",
    story: [
      "Casais que estão juntos há muito tempo têm um repertório próprio: piadas internas, silêncios confortáveis, um jeito de encostar sem perceber. O ensaio foi sobre isso — sobre o que já existe entre os dois.",
      "Sem roteiro de poses. Só uma caminhada longa, conversa, vento e a luz difusa de um céu cinza.",
    ],
    interludes: ["O amor de dez anos não tem pressa. E isso também é bonito."],
    cover: "/images/portfolio/dez-anos-depois/cover.jpg",
    coverAlt: "Casal caminhando junto à beira-mar em um dia nublado",
  },
  {
    slug: "presenca",
    title: "Presença",
    category: "retratos",
    setting: "Retrato profissional · Estúdio",
    excerpt: "Retratos profissionais com presença — sem a rigidez das fotos corporativas.",
    story: [
      "Um bom retrato profissional não precisa ser frio. Ele precisa transmitir confiança — e confiança nasce de conforto, não de pose.",
      "Conversamos antes sobre onde a imagem será usada — site, redes, imprensa — e construímos luz e enquadramento a partir disso.",
    ],
    interludes: ["Parecer confiante é mais fácil quando você está à vontade."],
    cover: "/images/portfolio/presenca/cover.jpg",
    coverAlt: "Retrato profissional em estúdio com fundo neutro e luz suave",
  },
  {
    slug: "luz-de-janela",
    title: "Luz de janela",
    category: "retratos",
    setting: "Retrato individual · Luz natural",
    excerpt: "Um retrato íntimo feito só com a luz que entrava pela janela.",
    story: [
      "Às vezes, a melhor luz de estúdio é uma janela voltada para o lado certo. Este ensaio foi feito assim: uma sala quase vazia, luz lateral e tempo.",
      "Retratos individuais são, muitas vezes, um presente que a pessoa dá a si mesma. Um registro de quem se é agora.",
    ],
    interludes: ["Quem você é agora também merece ser lembrado."],
    cover: "/images/portfolio/luz-de-janela/cover.jpg",
    coverAlt: "Retrato individual em uma sala iluminada apenas pela luz lateral da janela",
  },
];
