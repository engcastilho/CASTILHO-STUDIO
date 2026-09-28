/**
 * TEXTOS DO SITE
 * ─────────────────────────────────────────────────────────────────────────────
 * Copy editorial centralizada. Ajuste livremente — os componentes apenas leem daqui.
 * Tom: frases curtas, observações humanas e concretas, sem clichês de fotografia.
 */

export const hero = {
  eyebrow: "Fotografia de famílias, casais e retratos",
  /** Cada item é uma linha do título. O trecho em `emphasis` aparece em itálico. */
  title: [{ text: "Antes que vire" }, { text: "lembrança.", emphasis: true }],
  subtitle:
    "Retratos de pessoas e das fases que elas atravessam — feitos com olhar de cinema e o cuidado de quem sabe que nada disso volta a ser igual.",
  image: "/images/hero/hero.jpg",
  /** Versão vertical exibida em celulares (opcional). */
  imageMobile: "/images/hero/hero-mobile.jpg",
  imageAlt: "Família caminhando de mãos dadas em um campo, contra a luz do fim da tarde",
  caption: "N.º 01 — Tarde de domingo",
  primaryCta: "Agende seu ensaio",
  secondaryCta: "Conheça nosso trabalho",
};

export const manifesto = {
  eyebrow: "Manifesto",
  /** Frases que surgem uma a uma durante a rolagem, cada uma com sua imagem. */
  lines: [
    { text: "Um dia, o colo fica pequeno.", image: "/images/manifesto/01.jpg", alt: "Criança no colo, em luz suave de manhã" },
    { text: "O namoro vira família.", image: "/images/manifesto/02.jpg", alt: "Casal abraçado ao anoitecer" },
    { text: "A barriga vira nome.", image: "/images/manifesto/03.jpg", alt: "Gestante perto da janela" },
    { text: "Os pais ganham cabelos brancos.", image: "/images/manifesto/04.jpg", alt: "Casal mais velho lado a lado no campo" },
    { text: "A casa muda de endereço.", image: "/images/manifesto/05.jpg", alt: "Sala vazia iluminada pela janela" },
  ],
  closing: [
    "Nada disso se repete do mesmo jeito.",
    "A fotografia não segura o tempo. Ela guarda a prova de que aquilo existiu — com a luz, os gestos e as pessoas daquela fase.",
  ],
  signature: "É para isso que fotografamos.",
};

export const selectedWork = {
  eyebrow: "Portfólio",
  title: [{ text: "Pessoas reais," }, { text: "em fases que não voltam.", emphasis: true }],
  intro:
    "Cada ensaio é tratado como um pequeno filme: tem lugar, luz, ritmo e personagens. Nenhum é igual ao outro, porque nenhuma família é.",
  cta: "Ver todos os ensaios",
};

export const categoriesSection = {
  eyebrow: "O que registramos",
  title: "Cada fase pede um olhar.",
  hint: "Deslize para ver",
};

export const cinematicBreak = {
  image: "/images/cinematic/break.jpg",
  alt: "Família caminhando à beira-mar em um dia nublado, em enquadramento panorâmico",
  quote: "Daqui a vinte anos, ninguém vai lembrar da roupa. Vão lembrar de como vocês se olhavam.",
};

export type Step = { number: string; title: string; text: string };

export const experience = {
  eyebrow: "A experiência",
  title: [{ text: "Do primeiro “oi”" }, { text: "à última imagem.", emphasis: true }],
  intro:
    "Fazer um ensaio conosco é simples, mas nada é deixado ao acaso. Cuidamos de cada etapa para que, no dia, vocês só precisem estar presentes.",
  steps: [
    {
      number: "01",
      title: "Conversa",
      text: "Antes da câmera, a escuta. Queremos saber quem são vocês, o que estão vivendo agora e o que não pode ficar de fora.",
    },
    {
      number: "02",
      title: "Planejamento",
      text: "Escolhemos juntos o lugar, o horário da melhor luz, as roupas e o clima do ensaio. Nada fica para o improviso — exceto vocês.",
    },
    {
      number: "03",
      title: "Ensaio",
      text: "Direção leve, sem poses forçadas. Criamos situações para que vocês esqueçam a câmera e voltem a ser vocês.",
    },
    {
      number: "04",
      title: "Curadoria",
      text: "Selecionamos com calma e tratamos imagem por imagem, com a mesma linguagem de cor e luz do começo ao fim.",
    },
    {
      number: "05",
      title: "Entrega",
      text: "Uma galeria privada, elegante e fácil de compartilhar — e, se quiserem, álbuns e impressões feitos para atravessar gerações.",
    },
  ] satisfies Step[],
  image: "/images/experience/01.jpg",
  imageAlt: "Casal conversando perto da janela durante um ensaio em casa",
};

export type Differential = { title: string; text: string };

export const differentials = {
  eyebrow: "Os cuidados",
  title: [{ text: "O que não aparece na foto" }, { text: "— mas está em cada uma.", emphasis: true }],
  items: [
    { title: "Direção do início ao fim", text: "Você não precisa saber posar. Nós conduzimos — com leveza e naturalidade." },
    { title: "Tratamento artesanal", text: "Cor, pele e luz ajustadas imagem por imagem. Sem filtros prontos, sem exageros." },
    { title: "Ensaio sob medida", text: "Cada ensaio é planejado a partir da história de quem vai ser fotografado." },
    { title: "Curadoria individual", text: "Entregamos as imagens que importam — não um volume sem critério." },
    { title: "Equipamento profissional", text: "Câmeras e lentes de alto padrão, para que a técnica nunca seja o limite." },
    { title: "Arquivos em segurança", text: "Cópias de segurança desde o dia do ensaio até a entrega final." },
    { title: "Entrega digital elegante", text: "Uma galeria online privada, simples de ver, baixar e compartilhar com a família." },
    { title: "Álbuns e impressões", text: "Para que as imagens saiam da tela e voltem para a sala de casa." },
  ] satisfies Differential[],
};

export const aboutTeaser = {
  eyebrow: "Por trás da câmera",
  cta: "Conheça a história",
};

export const testimonialsSection = {
  eyebrow: "Quem já viveu a experiência",
};

export const instagramSection = {
  eyebrow: "Diário visual",
  title: "Bastidores, ensaios recentes e pequenas observações do caminho.",
  cta: "Seguir no Instagram",
  images: [
    { src: "/images/instagram/01.jpg", alt: "Criança brincando na luz dourada" },
    { src: "/images/instagram/02.jpg", alt: "Janela iluminando uma sala vazia" },
    { src: "/images/instagram/03.jpg", alt: "Casal ao anoitecer" },
    { src: "/images/instagram/04.jpg", alt: "Gestante perto da janela" },
    { src: "/images/instagram/05.jpg", alt: "Família sob as árvores" },
    { src: "/images/instagram/06.jpg", alt: "Retrato em estúdio" },
  ],
};

export const finalCta = {
  eyebrow: "Agenda aberta",
  title: [{ text: "Esta fase tem prazo." }, { text: "As imagens, não.", emphasis: true }],
  text: "Conte para nós o que vocês estão vivendo agora. A gente cuida do resto.",
  cta: "Conversar pelo WhatsApp",
  secondary: "Ou escreva para nós",
  image: "/images/cta/cta.jpg",
  imageAlt: "Família abraçada ao anoitecer com luzes desfocadas ao fundo",
};

export type Faq = { question: string; answer: string };

export const faq: Faq[] = [
  {
    question: "Não sabemos posar. Isso é um problema?",
    answer:
      "Não — e a maioria das pessoas não sabe. A direção é parte do nosso trabalho: sugerimos movimentos, criamos pequenas situações e deixamos o resto acontecer. Ninguém precisa fingir.",
  },
  {
    question: "Onde os ensaios acontecem?",
    answer:
      "Onde fizer sentido para a história de vocês: em casa, em um parque, na praia, em um lugar afetivo ou em estúdio. Definimos isso juntos na etapa de planejamento.",
  },
  {
    question: "Quanto tempo dura um ensaio?",
    answer:
      "Depende do tipo de ensaio e do ritmo de cada família. Crianças pequenas, por exemplo, pedem pausas. Sempre reservamos tempo com folga para que nada seja apressado.",
  },
  {
    question: "Como escolher as roupas?",
    answer:
      "Enviamos orientações de figurino depois da primeira conversa: cores, texturas e combinações que funcionam bem com o local e a luz escolhidos.",
  },
  {
    question: "Quando recebemos as fotografias?",
    answer:
      "O prazo de entrega é combinado antes do ensaio e informado por escrito. As imagens chegam em uma galeria online privada, prontas para baixar e compartilhar.",
  },
  {
    question: "Vocês fazem álbuns e impressões?",
    answer:
      "Sim. Depois da entrega digital, apresentamos opções de álbuns e impressões para que as imagens também existam fora da tela.",
  },
  {
    question: "Como faço para agendar?",
    answer:
      "Basta chamar no WhatsApp. Conversamos sobre o que vocês imaginam, apresentamos os formatos disponíveis e reservamos a data.",
  },
];
