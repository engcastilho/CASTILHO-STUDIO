# Castilho Produções — site

Site institucional e portfólio da **Castilho Produções**: fotografia autoral de famílias, casais, gestantes, crianças e retratos.

> **Memória + arte + cinema + família + legado.**
> O cliente não contrata fotografias; ele guarda uma fase da vida que não volta a acontecer do mesmo jeito.
> Cada decisão de design, texto e interação parte dessa ideia.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · pronto para a Vercel.

---

## Sumário

1. [Direção de arte](#1-direção-de-arte)
2. [Começando](#2-começando)
3. [Arquitetura e pastas](#3-arquitetura-e-pastas)
4. [Onde editar o conteúdo](#4-onde-editar-o-conteúdo)
5. [Como trocar as fotografias](#5-como-trocar-as-fotografias)
6. [Design system](#6-design-system)
7. [Movimento e microinterações](#7-movimento-e-microinterações)
8. [Jornada de conversão e WhatsApp](#8-jornada-de-conversão-e-whatsapp)
9. [SEO](#9-seo)
10. [Performance e acessibilidade](#10-performance-e-acessibilidade)
11. [Deploy na Vercel](#11-deploy-na-vercel)
12. [Checklist antes de publicar](#12-checklist-antes-de-publicar)
13. [Licenças e créditos](#13-licenças-e-créditos)

---

## 1. Direção de arte

**Conceito: "cinema de memória".** O site se comporta como um filme autoral silencioso — aberturas em tela cheia, créditos que sobem linha a linha, cortes secos entre capítulos claros e escuros. A interface é quase invisível: papel quente, tinta profunda, muito respiro. A cor vem da fotografia.

| Princípio | Como aparece no site |
| --- | --- |
| Fotografia como protagonista | Imagens em tela cheia, formato anamórfico 2.39:1, galerias que respeitam a proporção original das fotos |
| Tipografia forte | Serifa editorial em corpo gigante (títulos, citações) + sans limpa em caixa alta espaçada (rótulos, navegação) |
| Grid editorial | 12 colunas com composições assimétricas, deslocamentos verticais e ritmos que mudam a cada breakpoint |
| Minimalismo quente | Paleta off-white/areia/preto quente; um único acento terracota usado como "luz de gravação" |
| Cinema | Legendas "N.º 01", "Fotograma 03", "Fim"; abertura com a assinatura CASTILHO; transições entre páginas |
| Sem clichês | Nenhum ícone de câmera, nenhuma fonte manuscrita, nenhum dourado, nenhuma estrela de avaliação |

**Identidade inicial.** `CASTILHO` em sans de caixa alta com espaçamento largo (presença, precisão — um aceno à tradição das câmeras e dos créditos de cinema) seguido de *Produções* em itálico editorial, como a assinatura de um diretor ao pé de um cartaz. O monograma do ícone é um *C* itálico com um ponto terracota.

**Copy.** Frases curtas e observações concretas da vida ("Um dia, o colo fica pequeno.", "A barriga vira nome.") no lugar de promessas genéricas.

---

## 2. Começando

```bash
npm install
npm run dev          # http://localhost:3000
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Indexa as imagens e sobe o ambiente de desenvolvimento |
| `npm run build` | Indexa as imagens e gera o build de produção (é o que a Vercel executa) |
| `npm run start` | Serve o build de produção localmente |
| `npm run images` | Regera o manifesto de imagens (dimensões + blur) |
| `npm run images:optimize` | Redimensiona e recomprime as fotos de `/public/images` |
| `npm run lint` / `npm run typecheck` | Qualidade de código |

Requer Node.js 20.9 ou superior.

---

## 3. Arquitetura e pastas

```
├── public/images/                 ← TODAS as fotografias (substitua mantendo os nomes)
│   ├── hero/                      hero.jpg (horizontal) · hero-mobile.jpg (vertical)
│   ├── manifesto/                 01–05.jpg (uma por frase do manifesto)
│   ├── portfolio/<slug>/          cover.jpg + 01.jpg, 02.jpg… (um diretório por ensaio)
│   ├── categories/                familias, casais, gestantes, infantil, retratos
│   ├── cinematic/break.jpg        faixa panorâmica (2.39:1)
│   ├── experience/                01.jpg, 02.jpg
│   ├── about/                     photographer.jpg, behind-01.jpg, behind-02.jpg
│   ├── instagram/                 01–06.jpg (Diário visual)
│   └── cta/cta.jpg                fundo da chamada final
├── scripts/
│   ├── generate-image-manifest.mjs   dimensões reais + blurDataURL de cada foto (roda no dev/build)
│   ├── optimize-images.mjs           prepara fotos pesadas para a web
│   └── placeholders/                 gerador dos placeholders atuais (opcional, Python)
└── src/
    ├── app/                       rotas (App Router)
    │   ├── page.tsx               /
    │   ├── portfolio/page.tsx     /portfolio  (filtro por ?categoria=)
    │   ├── portfolio/[slug]/      /portfolio/<ensaio> + imagem de compartilhamento própria
    │   ├── experiencia/ sobre/ contato/
    │   ├── layout.tsx             fontes, metadados, navegação, rodapé, JSON-LD
    │   ├── globals.css            DESIGN SYSTEM (tokens, utilitários, animações)
    │   ├── opengraph-image.tsx    imagem de compartilhamento gerada
    │   ├── sitemap.ts robots.ts manifest.ts icon.svg apple-icon.tsx not-found.tsx
    ├── config/                    ← CONTEÚDO EDITÁVEL (ver seção 4)
    ├── components/
    │   ├── layout/                Navbar, MobileMenu, Footer, WhatsAppButton, Preloader, PageTransition, SkipLink
    │   ├── sections/              Hero, Manifesto, SelectedWork, Categories/HorizontalGallery, CinematicBreak,
    │   │                          Experience, Differentials, About, Testimonials, InstagramSection, CTA, FAQ, PageHeader
    │   ├── portfolio/             PortfolioCard, PortfolioGrid, PortfolioExplorer, PortfolioFilters, EssayStory
    │   ├── contact/ContactForm    formulário que monta a mensagem e abre o WhatsApp
    │   ├── effects/               RevealObserver (revelações), CursorLabel (cursor contextual)
    │   ├── seo/JsonLd
    │   └── ui/                    Photo, Button/TextLink, RevealText, Eyebrow, Logo, Icons
    └── lib/                       images, portfolio (inclui o compositor de galerias), seo, whatsapp, hooks, og
```

**Server Components por padrão.** Só são client components as peças que precisam do navegador: navegação/menu, manifesto (frase ativa), galeria horizontal, depoimentos, filtro do portfólio, formulário, botão flutuante e efeitos. Todas as páginas são **pré-renderizadas como HTML estático** no build.

---

## 4. Onde editar o conteúdo

Tudo o que é específico do estúdio fica em **`src/config/`**:

| Arquivo | Conteúdo |
| --- | --- |
| `site.ts` | `studioName`, `photographerName`, `city`, `state`, `serviceArea`, `whatsapp`, `instagram`, `email`, horário, SEO e textos de "Por trás da câmera" |
| `portfolio.ts` | Categorias e ensaios (título, categoria, contexto, texto, frases-interlúdio, capa, destaque na home) |
| `testimonials.ts` | Depoimentos |
| `content.ts` | Hero, manifesto, experiência (5 etapas), diferenciais, Diário visual, CTA final, FAQ |
| `navigation.ts` | Menu principal |

Valores entre colchetes — `"[CIDADE]"`, `"[EMAIL]"`, `"[WHATSAPP_NUMBER]"` — são placeholders. Enquanto não forem preenchidos, o site os **omite** de títulos, descrições e dados estruturados (o SEO nunca publica "[CIDADE]").

**Novo ensaio:** crie `public/images/portfolio/meu-ensaio/` com `cover.jpg` + `01.jpg…`, e adicione um item em `essays` (`src/config/portfolio.ts`) com `slug: "meu-ensaio"`. A página, a imagem de compartilhamento, o sitemap e o filtro são gerados automaticamente.

---

## 5. Como trocar as fotografias

1. **Substitua os arquivos** em `public/images/` mantendo os mesmos nomes (ou aponte novos caminhos em `src/config/`).
2. Se as fotos vierem pesadas da câmera/Lightroom, rode `npm run images:optimize` (limita a 2560 px, aplica a orientação EXIF, remove metadados e recomprime). **Guarde seus originais fora do projeto.**
3. Pronto. O manifesto (`src/lib/generated/image-manifest.json`) é regenerado automaticamente no `dev` e no `build` da Vercel, lendo as dimensões reais e criando o placeholder desfocado de cada foto.

**Galerias que se montam sozinhas.** Na página de cada ensaio, `composeStory()` (`src/lib/portfolio.ts`) lê a orientação de cada foto: horizontais alternam entre tela cheia e blocos deslocados; verticais consecutivas formam pares assimétricos ou trípticos; as frases de `interludes` entram entre os blocos. As fotos **nunca são cortadas** nas galerias.

**Recomendações de formato**

| Uso | Proporção ideal | Observação |
| --- | --- | --- |
| Hero (desktop) | horizontal 16:10 / 3:2 | `hero.jpg` — assunto fora do canto inferior esquerdo (onde fica o título) |
| Hero (celular) | vertical 9:16 | `hero-mobile.jpg` — opcional, mas faz muita diferença no Instagram/WhatsApp |
| Capas de ensaio | vertical 4:5 | aparecem em 4:5, 3:4, 16:9 e tela cheia; ajuste o enquadramento com `coverPosition` |
| Categorias | vertical 2:3 | |
| Faixa cinematográfica | panorâmica 2.39:1 | |
| Galerias | qualquer | proporção original preservada |

> ⚠️ **As imagens atuais são placeholders gerados por código** (`scripts/placeholders/`), silhuetas desfocadas que ocupam o lugar do portfólio real. Troque-as pelo trabalho do estúdio antes de divulgar o site.

---

## 6. Design system

Definido em `src/app/globals.css` (`@theme` do Tailwind 4) e aplicado de forma consistente em todos os componentes.

### Paleta

| Token | Hex | Uso |
| --- | --- | --- |
| `paper` | `#F4F1EC` | fundo principal (off-white quente) |
| `linen` | `#EBE6DE` | superfícies alternadas |
| `sand` / `sand-deep` | `#DCD3C6` / `#C2B6A5` | fundo de imagens carregando, detalhes |
| `taupe` | `#8A8074` | numerais editoriais (contraste ≥ 3:1) |
| `stone` | `#A0978B` | texto secundário sobre escuro |
| `ash` | `#6B645C` | texto secundário sobre claro (5,2:1 — AA) |
| `graphite` | `#34302C` | hover de botões escuros |
| `ink` | `#161412` | texto, seções escuras (16,3:1 sobre `paper`) |
| `night` | `#0E0D0C` | rodapé, véus sobre fotos |
| `white` | `#FDFCFA` | |
| `terra` | `#8E4B37` | **acento raríssimo**: foco de teclado, seleção de texto, item ativo do menu, "luz de gravação" |

### Tipografia

- **Instrument Serif** (regular + itálico) — títulos, citações, frases do manifesto. Itálico para ênfase emocional.
- **Instrument Sans** (variável) — interface, textos corridos, rótulos em caixa alta espaçada.
- Família desenhada em conjunto, carregada via `next/font` (auto-hospedada, sem requisição ao Google no navegador, sem layout shift).

Escala fluida (`clamp`), do celular ao desktop largo:

| Classe | Tamanho | Uso |
| --- | --- | --- |
| `text-display` | 56 → 200 px | títulos de abertura |
| `text-h1` | 48 → 120 px | títulos de página, CTA |
| `text-h2` | 38 → 80 px | títulos de seção |
| `text-h3` | 28 → 44 px | citações, destaques |
| `text-h4` | 22 → 30 px | títulos de cards e itens |
| `text-lead` | 18 → 23 px | parágrafos de abertura |
| `text-body` | 16 px / 1.7 | texto corrido |
| `eyebrow` | 11 px, caixa alta, +0.22em | rótulos, navegação |

### Espaço, largura e grid

- Base de 4 px (Tailwind). Tokens: `--gutter` (20 → 56 px), `--grid-gap` (14 → 32 px), `--section` (96 → 192 px), `--section-sm`.
- Largura máxima: **1680 px** (`container-site`); medida de leitura ~38rem.
- Grid `grid-editorial`: **4 colunas** (celular) · **8** (tablet) · **12** (desktop).
- Breakpoints Tailwind: `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536` (+ `xs 400`, `3xl 1792`).

### Forma, imagens, botões e links

- **Raio**: 0 em fotografias (como impressões) · pílula (`rounded-full`) em botões e controles.
- **Imagens** (`<Photo>`): quadro com proporção fixa (zero CLS), cor média + blur enquanto carrega, AVIF/WebP responsivo, revelação em cortina, parallax opcional, zoom lento no hover.
- **Botões** (`<ButtonLink>`): `solid` (tinta), `light` (sobre foto), `outline`, `outline-light`; caixa alta espaçada; seta que avança no hover.
- **Links** (`<TextLink>`, `.link-draw`, `.link-line`): sublinhado que se desenha da esquerda para a direita.
- **Foco**: contorno terracota de 1,5 px com afastamento — visível e elegante.

---

## 7. Movimento e microinterações

Sem bibliotecas de animação: **CSS + IntersectionObserver + View Transitions nativas do React**. Framer Motion e GSAP foram avaliados e descartados — adicionariam 30–60 KB de JavaScript para efeitos que a plataforma já faz, e a maior parte do tráfego virá do navegador interno do Instagram, em celulares.

| Efeito | Técnica |
| --- | --- |
| Abertura "CASTILHO" (1ª visita da sessão, entrando pela home) | CSS puro; decidida por um script mínimo antes da primeira pintura |
| Hero: imagem "acende", título sobe linha a linha | Keyframes CSS |
| Hero: imagem desce e texto se dissolve ao rolar | CSS scroll-driven (`animation-timeline`) — zero JS |
| Parallax discreto nas fotos | CSS scroll-driven; navegadores sem suporte mostram a foto parada |
| Imagens reveladas em cortina, títulos por linha | Um único IntersectionObserver para o site todo |
| Manifesto: frase ativa + imagem sincronizada (sticky) | IntersectionObserver no centro da tela |
| Galeria horizontal controlada pela rolagem | `requestAnimationFrame` + `transform` (desktop); snap nativo no celular |
| Capa do ensaio se transforma na abertura da página | `<ViewTransition>` do React (View Transitions API) |
| Transição suave entre páginas | `<ViewTransition>` + CSS |
| Cursor contextual ("Ver ensaio") | Só com mouse; o cursor nativo continua visível |
| Navegação que se recolhe ao descer e volta ao subir | Scroll passivo + rAF |

Tudo respeita **`prefers-reduced-motion`**: animações, parallax, galeria fixada e abertura são desligados.

---

## 8. Jornada de conversão e WhatsApp

Ordem da home: **Impacto** (hero) → **Emoção** (manifesto, ensaios) → **Desejo** (categorias, pausa cinematográfica) → **Confiança** (experiência, cuidados, fotógrafo, depoimentos, Diário visual) → **Ação** (CTA final).

O WhatsApp está presente sem gritar:

- **Hero e navegação**: "Agendar ensaio".
- **Botão flutuante**: pílula grafite translúcida com ícone monocromático e um ponto terracota "gravando" — aparece depois da primeira dobra e se recolhe onde já existe um CTA (`data-hide-fab`).
- **Menu mobile**, **CTA final**, **páginas de ensaio** (mensagem já cita o ensaio visto: *"Vi o ensaio 'Antes do sim' (Casais)…"*).
- **Contato**: formulário "monte sua mensagem" — o visitante escolhe o tipo de ensaio, quem participa e o período; o WhatsApp abre com tudo escrito (com prévia ao vivo). Sem servidor, sem banco de dados.

Mensagem padrão: *"Olá! Conheci a Castilho Produções pelo site e gostaria de saber mais sobre os ensaios."* (`site.whatsapp.message`). Sem número configurado, o link abre o WhatsApp pedindo o contato — nunca quebra.

---

## 9. SEO

- Metadados por página (título com modelo `%s | Castilho Produções`, descrição, canonical, Open Graph, Twitter).
- Título padrão: *Castilho Produções | Fotografia de Famílias e Retratos* — com **"em [Cidade]"** automaticamente quando `city` é preenchida (SEO local).
- **Imagens de compartilhamento geradas** (1200×630) para o site e para **cada ensaio** — prévias elegantes no WhatsApp e no Instagram.
- `sitemap.xml` (com imagens), `robots.txt`, `manifest.webmanifest`, ícones.
- Dados estruturados: `ProfessionalService` (endereço/telefone/área quando preenchidos), `WebSite`, `FAQPage` (Experiência), `ImageGallery` (ensaios) e `BreadcrumbList`.
- HTML semântico, `lang="pt-BR"`, textos alternativos descritivos em todas as fotos.

---

## 10. Performance e acessibilidade

- 100% das páginas pré-renderizadas (SSG) — servidas pela CDN da Vercel.
- `next/image`: AVIF/WebP, `srcset` por breakpoint, lazy loading, blur placeholder, hero com prioridade e **direção de arte separada para celular**.
- Fontes auto-hospedadas com `next/font` (`display: swap`, sem CLS).
- CSS ~12 KB gzip. JS do site ~30 KB gzip além do framework; nenhuma biblioteca de animação.
- Manifesto de imagens nunca vai para o navegador (`server-only`).
- Acessibilidade: link "Pular para o conteúdo", foco visível, menu mobile com foco gerenciado + `Esc` + resto da página inerte, carrossel de depoimentos com botões, teclado e gesto (sem troca automática), FAQ com `<details>` nativo, contraste AA nos textos, filtros do portfólio como links reais (funcionam sem JavaScript).
- Cabeçalhos de segurança básicos em `next.config.ts`.

---

## 11. Deploy na Vercel

1. Suba o repositório no GitHub e importe em **vercel.com → Add New → Project** (o framework Next.js é detectado sozinho; não é preciso `vercel.json`).
2. Em **Settings → Environment Variables** (opcional, recomendado):
   - `NEXT_PUBLIC_SITE_URL` — domínio definitivo, ex.: `https://www.seudominio.com.br` (sem isso, usa o domínio de produção da Vercel).
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — ex.: `5519999999999` (alternativa a editar `site.ts`).
3. Em **Settings → Domains**, conecte o domínio próprio.
4. Cada `git push` gera um novo deploy; o build já regenera o manifesto de imagens.

Veja `.env.example`.

---

## 12. Checklist antes de publicar

- [ ] Substituir **todas** as imagens de `public/images/` pelo portfólio real (e rodar `npm run images:optimize`).
- [ ] Preencher `photographerName`, `city`, `state`, `serviceArea`, `whatsapp.number`/`display`, `email` em `src/config/site.ts`.
- [ ] Escrever os textos pessoais de "Por trás da câmera" (`story`, `beginning`, `searchFor`) e revisar os marcados como **SUGESTÃO** (`philosophy`, `vision`).
- [ ] Trocar os **depoimentos ilustrativos** por depoimentos reais, com autorização (`src/config/testimonials.ts`).
- [ ] Revisar ensaios, títulos e textos em `src/config/portfolio.ts` (hoje descrevem os placeholders).
- [ ] Revisar o FAQ (`src/config/content.ts`) com prazos e formatos reais do estúdio.
- [ ] Confirmar o @ do Instagram.
- [ ] Definir `NEXT_PUBLIC_SITE_URL` na Vercel e conectar o domínio.
- [ ] Testar o link do WhatsApp em um celular.

---

## 13. Licenças e créditos

- **Instrument Sans** e **Instrument Serif** — SIL Open Font License 1.1 (Google Fonts). Cópias em `src/assets/fonts/` são usadas apenas para gerar as imagens de compartilhamento.
- **Placeholders fotográficos** — gerados por código neste projeto (`scripts/placeholders/generate_placeholders.py`); não são fotos de banco de imagens nem de pessoas reais.
