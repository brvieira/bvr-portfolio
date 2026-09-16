# SPEC — Portfolio e blog de Bruno Vieira

- **Artefato:** site estático em `bruno-vieira.com` (GitHub Pages)
- **Referência visual:** `Portfolio Bruno Vieira.dc.html` (protótipo aprovado, tema escuro)
- **Versão:** 1.0 · setembro de 2026
- **Status:** pronto para implementação
- **Idioma do produto:** português (pt-BR)

> **Como usar este documento (agente de código):** implemente na ordem de `## 9. Plano de tarefas`.
> Cada tarefa referencia os requisitos que satisfaz (`REQ-x.y`). Não marque uma tarefa como
> concluída sem que todos os critérios de aceitação dos requisitos citados estejam verificáveis.
> Requisitos usam `DEVE` (obrigatório), `NÃO DEVE` (proibido) e `PODE` (opcional).
> Quando este documento e o protótipo divergirem, **este documento prevalece** — e registre a
> divergência em `## 11. Registro de decisões`.

---

## 1. Contexto e objetivo

Bruno Vieira é Senior Solutions Architect na MongoDB. O site é o portfolio pessoal dele,
usado em conversas com clientes: um visitante técnico chega por indicação, por um repositório
ou por um link compartilhado em reunião.

**Objetivo primário:** provar credibilidade técnica em segundos.
Toda decisão de produto e de design se subordina a esse objetivo.

**Objetivos secundários:**

1. Distribuir demos técnicas com repositórios públicos que o time do cliente possa clonar e adaptar.
2. Publicar artigos curtos sobre conceitos, features e novidades do MongoDB.
3. Tornar a publicação de um artigo uma operação de um commit.

**Público:** clientes e prospects técnicos (arquitetos, desenvolvedores) e comunidade dev.

### 1.1 Não-objetivos (fora de escopo na v1)

Não implemente nada desta lista, mesmo que pareça uma melhoria óbvia:

- comentários, newsletter, busca no site, área autenticada
- formulário de contato com backend (o contato é `mailto:`)
- versão em inglês ou qualquer i18n
- tema claro / alternador de tema
- analytics de terceiros
- CMS externo (o conteúdo vive em Markdown no repositório)

### 1.2 Restrições

- `REQ-1.1` O site **DEVE** ser 100% estático, sem execução no servidor.
- `REQ-1.2` O site **NÃO DEVE** usar logotipo, símbolo da folha ou qualquer ativo de marca da
  MongoDB. A menção à empresa é exclusivamente textual, no cargo.
- `REQ-1.3` O JavaScript entregue ao navegador **DEVE** somar menos de 40 KB (comprimido) no
  conjunto de todas as páginas.
- `REQ-1.4` Nenhum conteúdo marcado como `PLACEHOLDER` no protótipo **DEVE** chegar à produção
  (ver `## 10. Ativos pendentes`).

---

## 2. Stack e decisões técnicas

| Decisão | Escolha | Justificativa |
| --- | --- | --- |
| Gerador | **Astro** (últ. versão estável) + integração Markdown/MDX | Zero JS por padrão, conteúdo em arquivos, ilhas de interatividade pontuais |
| Linguagem | TypeScript em modo `strict` | |
| Estilo | CSS puro com custom properties em `src/styles/tokens.css` | Sem framework de CSS; a paleta é fechada (§4.1) |
| Destaque de sintaxe | Shiki, no build | Nenhum JS de highlight no cliente |
| Hospedagem | GitHub Pages, deploy por GitHub Actions no push para `main` | |
| Domínio | `bruno-vieira.com` via `public/CNAME` | `base` permanece `/` |
| Gerenciador de pacotes | `pnpm` | |

Alternativas aceitáveis, caso Astro não seja viável: Eleventy ou Hugo — desde que o modelo de
conteúdo de §3 e todos os requisitos deste documento sejam preservados.

### 2.1 Requisitos de publicação

- `REQ-2.1` `public/CNAME` **DEVE** conter exatamente `bruno-vieira.com`.
- `REQ-2.2` O workflow de Actions **DEVE** rodar `build` e publicar em Pages a cada push em `main`,
  e **DEVE** falhar o build em erro de TypeScript ou link interno quebrado.
- `REQ-2.3` HTTPS obrigatório **DEVE** estar ativo; `www.bruno-vieira.com` **DEVE** redirecionar
  para o ápice.
- `REQ-2.4` O DNS **DEVE** ter os quatro registros A dos IPs do GitHub Pages mais um CNAME em `www`.

**Critério de aceitação:** `https://bruno-vieira.com` responde 200 com certificado válido;
`http://` e `www.` redirecionam; um push em `main` publica em menos de 5 minutos.

---

## 3. Modelo de conteúdo

Duas coleções de conteúdo, ambas versionadas. Os schemas **DEVEM** ser validados no build
(`defineCollection` + Zod no Astro); um front matter inválido **DEVE** quebrar o build.

### 3.1 Coleção `projetos`

`src/content/projetos/<slug>.md`

```yaml
---
titulo: "E-commerce com busca semântica"     # string, obrigatório
tipo: "Demo · Varejo"                        # string, obrigatório — "Demo · <setor>"
ano: 2026                                    # number, obrigatório
resumo: "Catálogo onde a busca entende intenção em vez de palavra-chave."  # string, 2–3 linhas
tags: ["Atlas Vector Search", "Atlas Search", "Flexible Schema"]           # string[], 1–5 itens
repo: "https://github.com/bruno-vieira/..."  # url, obrigatório
imagem: "./capa.png"                         # image, opcional
destaque: true                               # boolean, default false — aparece na home
ordem: 1                                     # number, obrigatório — ordenação ascendente
---
```

- `REQ-3.1` O corpo Markdown do projeto **PODE** existir, mas **NÃO DEVE** ser renderizado na v1.
- `REQ-3.2` As `tags` são rótulos informativos; **NÃO DEVEM** ser clicáveis nem gerar páginas.

### 3.2 Coleção `blog`

`src/content/blog/<slug>.md`

```yaml
---
titulo: "O que é Vector Search e como utilizar em seus projetos"
categoria: "conceitos"        # enum: conceitos | features | tutoriais | novidades
data: 2026-08-12              # date, obrigatório
resumo: "Do embedding à pipeline de agregação, com um exemplo pronto."  # string, 1–2 linhas
tempoLeitura: 7               # number, opcional — se ausente, calcular no build (200 palavras/min)
rascunho: false               # boolean, default false
---
```

- `REQ-3.3` O slug **DEVE** vir do nome do arquivo.
- `REQ-3.4` Artigos com `rascunho: true` **NÃO DEVEM** aparecer em nenhuma listagem, no RSS ou no
  sitemap em builds de produção; **DEVEM** ser acessíveis por URL direta em `dev`.
- `REQ-3.5` O sumário lateral **DEVE** ser gerado dos títulos `##` do corpo, sem índice manual.
- `REQ-3.6` A ordenação padrão de artigos **DEVE** ser `data` descendente.

---

## 4. Design guidelines

Identidade escura por padrão, verde como única cor de acento, separação por bordas de 1 px.
Sem sombras, sem gradientes decorativos (duas exceções em `REQ-4.6`), sem ilustração.

### 4.1 Paleta

Onze tokens. `REQ-4.1` Nenhuma cor fora desta tabela **DEVE** aparecer no CSS.

| Token | Hex | Uso |
| --- | --- | --- |
| `--bg` | `#070E0B` | Fundo da página |
| `--surface` | `#0B1410` | Cards, painéis |
| `--surface-code` | `#050B08` | Fundo de bloco de código |
| `--border` | `#1A2721` | Bordas e divisores |
| `--border-hover` | `#24503D` | Borda de card sob o cursor |
| `--accent` | `#23C486` | Acento, links, botão primário |
| `--accent-soft` | `#6FE0AC` | Texto de badge, código inline |
| `--text` | `#F2F7F4` | Títulos |
| `--text-body` | `#DCE7E0` | Corpo de artigo |
| `--text-muted` | `#93A79C` | Resumos, navegação inativa |
| `--text-meta` | `#6D8378` | Rótulos, datas, legendas |

Superfícies auxiliares derivadas, permitidas apenas nos usos citados:
`#101C16` (fundo de item de navegação sob o cursor), `#111E18` (fundo de tag e de código inline),
`#0F2419` / `#143122` (botão copiar, repouso e hover), `#0E211A` + borda `#1F4034` (badge de cargo),
`#0C1B14` (fundo de callout), `#0A120E` (fundo do rodapé), `#0D1712` (espaço reservado de imagem).

- `REQ-4.2` O verde **NÃO DEVE** ser fundo de blocos grandes — apenas botão primário, ícone ativo,
  badge, texto de link e barra de callout.
- `REQ-4.3` **DEVE** haver no máximo um botão primário por tela.

### 4.2 Tipografia

Duas famílias, servidas do próprio domínio (`woff2` em `public/fonts/`), subsets `latin` e
`latin-ext`, `font-display: swap`:

- **DM Sans** — interface e texto corrente (400, 500, 700)
- **JetBrains Mono** — código, rótulos, metadados (400, 500)

| Papel | Tamanho / peso | Entrelinha · tracking |
| --- | --- | --- |
| Título da home (h1) | 52 px / 700 | 1.06 · −0.032em |
| Título de artigo (h1) | 42 px / 700 | 1.10 · −0.030em |
| Título de página interna (h1) | 40 px / 700 | 1.15 · −0.028em |
| Subtítulo de artigo (h2) | 25 px / 700 | 1.25 · −0.020em |
| Título de card | 21 px / 700 | 1.25 · −0.018em |
| Lide / intro | 19–20 px / 400 | 1.55–1.65 |
| Corpo de artigo | 17 px / 400 | 1.72 · máx. 68ch |
| Texto de interface | 14–15 px / 400–500 | 1.6 |
| Rótulo de seção (mono) | 12.5 px / 700 | caixa alta · +0.12em |
| Código | 13 px / 400 | 1.75 |

- `REQ-4.4` Abaixo de 768 px, os três primeiros papéis **DEVEM** ser reduzidos em 25%; os demais
  permanecem.
- `REQ-4.5` Títulos **DEVEM** usar `text-wrap: balance`; texto corrente, `text-wrap: pretty`.

### 4.3 Espaçamento, grade e forma

- Escala de espaçamento em múltiplos de 4 px. Valores em uso: 6, 8, 10, 12, 14, 20, 24, 26, 32, 56, 64, 88.
- Largura máxima do conteúdo: **1080 px**, recuo lateral de 32 px.
- Coluna de leitura do artigo limitada por `max-width: 68ch` (não por px).
- Raios: 14 px (cards, blocos de código), 10 px (botões), 8 px (tags, botões de ícone), 999 px (badges, filtros).
- `REQ-4.6` **NÃO DEVE** haver `box-shadow` em nenhum elemento. Gradientes são permitidos apenas
  em dois lugares: o degradê vertical sutil do bloco de abertura da home
  (`#0B1512` → `#070E0B`) e o padrão diagonal `repeating-linear-gradient` dos espaços reservados de imagem.
- `REQ-4.7` Grupos de irmãos (cards, tags, ícones, navegação) **DEVEM** ser dispostos com
  `display: flex`/`grid` + `gap`, nunca com margens entre irmãos.
- Grades: 2 projetos por linha na home · 3 artigos por linha na home · 2 artigos por linha no blog ·
  1 linha larga por projeto na listagem.
- Cabeçalho de seção: rótulo mono em caixa alta à esquerda, link "ver todos" à direita, sobre um divisor.

### 4.4 Ícones

- `REQ-4.8` **DEVEM** existir exatamente três ícones: GitHub, LinkedIn e e-mail. SVG inline,
  traço de 1.7 px, extremidades arredondadas, grade de 24 px, renderizados a 15–17 px,
  `stroke="currentColor"`.
- `REQ-4.9` Todo link com ícone **DEVE** ter `aria-label` e `title`. No cabeçalho e no rodapé os
  ícones aparecem sozinhos; na abertura da home, acompanhados de texto.
- `REQ-4.10` **NÃO DEVE** ser usada biblioteca de ícones nem fonte de ícones.

### 4.5 Estados e movimento

- Card sob o cursor: **apenas** a borda muda para `--border-hover`. Sem elevação, escala ou deslocamento.
- Navegação sob o cursor: fundo `#101C16`, texto `--text`. A página atual fica em `--text` permanentemente
  e recebe `aria-current="page"`.
- `REQ-4.11` Foco de teclado **DEVE** ser visível em todo elemento interativo: contorno de 2 px em
  `--accent` com 2 px de afastamento. Remover o contorno padrão sem substituto é proibido.
- `REQ-4.12` Transições **DEVEM** durar 150 ms com `ease-out` e afetar somente `color`,
  `background-color` e `border-color`.
- `REQ-4.13` **NÃO DEVE** haver animação de entrada, revelação por rolagem ou parallax.
  `prefers-reduced-motion: reduce` **DEVE** zerar toda transição.

---

## 5. Arquitetura de informação

| Rota | Página | Conteúdo |
| --- | --- | --- |
| `/` | Início | Hero com bio e cargo, trajetória resumida, 2 projetos em destaque, snippet, 3 artigos recentes |
| `/projetos/` | Projetos & demos | Lista completa em linhas largas |
| `/blog/` | Blog | Cards com resumo em 2 colunas + filtro de categoria |
| `/blog/<slug>/` | Artigo | Coluna de leitura + sumário lateral |
| `/blog/categoria/<categoria>/` | Categoria | Mesma grade do blog, filtrada |
| `/sobre/` | Sobre | Bio longa, trajetória completa, áreas de foco, contatos |
| `/rss.xml` | Feed | Todos os artigos publicados |
| `/404.html` | Erro | Mesmo cabeçalho e rodapé |

- `REQ-5.1` Todas as URLs **DEVEM** terminar em barra (exceto arquivos) e ser estáticas.
- `REQ-5.2` A navegação global **DEVE** ser: Início · Projetos · Blog · Sobre, seguidos por um
  divisor vertical e os três ícones sociais. **NÃO DEVE** haver menu de segundo nível.
- `REQ-5.3` O cabeçalho **DEVE** ser fixo no topo, com fundo translúcido de `--bg` (opacidade 0.86)
  e `backdrop-filter: blur(12px)`.

---

## 6. Componentes

Onze componentes. `REQ-6.1` Qualquer padrão novo **DEVE** primeiro ser tentado com um destes.

| Componente | Conteúdo e comportamento |
| --- | --- |
| `SiteHeader` | Monograma "bv" (quadrado verde 26 px, raio 7 px, texto `#06120C`), nome, 4 links, 3 ícones sociais após divisor. Fixo, translúcido. |
| `Hero` | Badge de cargo (ponto verde + "Senior Solutions Architect · MongoDB"), h1, 2 parágrafos de bio, 2 botões, 3 links de contato com ícone. À direita: foto (268×316) e cartão "Cargo atual". |
| `ExperienceList` | Linhas de 2 colunas: período em mono (132 px) à esquerda; cargo, empresa em verde e descrição curta à direita. Divisor de 1 px entre linhas. |
| `ProjectCard` | Tipo e ano em mono, título, resumo, tags, link para o repositório com ícone. Usado na home. |
| `ProjectRow` | Versão larga do card (grid `1fr 300px`) com imagem 300×176 à direita e botão de repositório. Usado em `/projetos/`. |
| `ArticleCard` | Categoria em mono, data e tempo de leitura, título, resumo, chamada "Ler artigo →". |
| `CodeBlock` | Barra superior com nome do arquivo e botão copiar; corpo com destaque de sintaxe. |
| `Callout` | Barra `--accent` de 2 px à esquerda, fundo `#0C1B14`, raio `0 10px 10px 0`. Máximo um por seção. |
| `ArticleToc` | Coluna de 200 px, `position: sticky; top: 104px`, gerada dos `h2`. Seção visível em `--accent`. |
| `AuthorSignature` | Foto redonda de 52 px, nome, "Senior Solutions Architect na MongoDB". Ao fim de todo artigo. |
| `SiteFooter` | "bruno-vieira.com · publicado no GitHub Pages" à esquerda; 3 ícones em botões quadrados de 34 px à direita. |

### 6.1 Requisitos de comportamento

- `REQ-6.2` `CodeBlock`: o botão copiar **DEVE** escrever o conteúdo do `<code>` na área de
  transferência e trocar o rótulo para `copiado` por 1600 ms. Se `navigator.clipboard` não existir,
  o botão **DEVE** ser ocultado no carregamento.
- `REQ-6.3` `ArticleCard` e `ProjectCard`: o card inteiro amplia a área de clique, mas o alvo
  acessível **DEVE** ser um `<a>` real no título. **NÃO DEVE** haver `onclick` em `div`.
- `REQ-6.4` `ArticleToc` **DEVE** destacar a seção visível via `IntersectionObserver` e **DEVE**
  desaparecer abaixo de 1024 px.
- `REQ-6.5` O filtro de categoria do blog **DEVE** funcionar como links para
  `/blog/categoria/<x>/` — sem filtragem em JavaScript no cliente.
- `REQ-6.6` A trajetória em `/` **DEVE** mostrar no máximo 3 posições; `/sobre/` mostra todas.

Referência do botão copiar (única ilha de JS do artigo):

```ts
// src/scripts/copy-code.ts
document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((btn) => {
  if (!navigator.clipboard) { btn.hidden = true; return; }
  btn.addEventListener("click", async () => {
    const code = btn.closest("[data-code-block]")?.querySelector("code");
    if (!code) return;
    await navigator.clipboard.writeText(code.textContent ?? "");
    btn.textContent = "copiado";
    setTimeout(() => (btn.textContent = "copiar"), 1600);
  });
});
```

---

## 7. Responsividade

Três faixas, sem breakpoints intermediários.

- `REQ-7.1` **≥ 1024 px** — layout completo conforme o protótipo.
- `REQ-7.2` **768–1023 px** — grades de 3 colunas passam a 2; `ArticleToc` desaparece; a foto do
  hero vai para cima do texto; `ProjectRow` vira coluna única com a imagem abaixo.
- `REQ-7.3` **< 768 px** — coluna única; os links de navegação viram uma linha rolável
  horizontalmente com os ícones sociais fixos à direita; o cabeçalho segue fixo.
- `REQ-7.4` Todo alvo de toque **DEVE** ter no mínimo 44×44 px abaixo de 768 px.
- `REQ-7.5` **NÃO DEVE** haver rolagem horizontal em nenhuma largura entre 320 px e 2560 px.

---

## 8. Acessibilidade, desempenho e SEO

### 8.1 Acessibilidade

- `REQ-8.1` Contraste mínimo de 4,5:1 para texto corrente e 3:1 para texto ≥ 24 px.
- `REQ-8.2` `--text-meta` e `--text-muted` **DEVEM** ser restritos a rótulos e metadados acima de
  12 px; **NÃO DEVEM** ser usados em texto longo.
- `REQ-8.3` Um único `h1` por página e hierarquia de títulos sem saltos.
- `REQ-8.4` O primeiro elemento focável **DEVE** ser um link "pular para o conteúdo".
- `REQ-8.5` Imagens de projeto **DEVEM** ter `alt` descritivo; padrões decorativos, `aria-hidden="true"`.
- `REQ-8.6` `<html lang="pt-BR">`.

**Critério de aceitação:** axe-core sem violações críticas ou sérias em todas as rotas;
navegação completa por teclado com foco sempre visível.

### 8.2 Desempenho

- `REQ-8.7` LCP < 1,5 s em 4G simulado; CLS < 0,05.
- `REQ-8.8` Fontes locais com `preload` **apenas** no peso 400 de cada família.
- `REQ-8.9` Imagens em AVIF com fallback WebP, `width`/`height` declarados e `loading="lazy"`
  fora da primeira tela.

**Critério de aceitação:** Lighthouse ≥ 95 nas quatro categorias, em `/`, `/blog/` e um artigo.

### 8.3 SEO

- `REQ-8.10` Cada página **DEVE** ter `title` único, `meta description` (do `resumo` quando houver),
  `link rel="canonical"` absoluto, Open Graph e Twitter card.
- `REQ-8.11` A imagem OG **DEVE** ser gerada no build a partir do título, usando a paleta e a
  tipografia deste documento.
- `REQ-8.12` JSON-LD: `Person` em `/` e `/sobre/`; `BlogPosting` em cada artigo.
- `REQ-8.13` `sitemap.xml`, `robots.txt` e `/rss.xml` **DEVEM** ser gerados no build.

---

## 9. Plano de tarefas

Ordem de dependência. Cada etapa termina com um deploy em produção.

### Etapa 1 — Fundação
- [ ] `T1.1` Projeto Astro + TypeScript `strict` + `pnpm`; estrutura `src/{components,content,layouts,pages,styles,scripts}`. → `REQ-1.1`
- [ ] `T1.2` `src/styles/tokens.css` com os 11 tokens e as superfícies derivadas; reset global; `a` e `a:hover` definidos. → `REQ-4.1`, `REQ-4.2`
- [ ] `T1.3` Fontes locais em `public/fonts/` com `@font-face`, subsets e `preload` do peso 400. → `REQ-4.4`, `REQ-8.8`
- [ ] `T1.4` `public/CNAME`, DNS, HTTPS obrigatório, workflow de GitHub Actions. → `REQ-2.1`…`REQ-2.4`

**Pronto quando:** `bruno-vieira.com` serve por HTTPS uma página em branco já estilizada e um push em `main` publica automaticamente.

### Etapa 2 — Casca e conteúdo
- [ ] `T2.1` `SiteHeader` e `SiteFooter` com os três ícones SVG inline. → `REQ-4.8`…`REQ-4.10`, `REQ-5.2`, `REQ-5.3`
- [ ] `T2.2` Layout base com skip link, `<html lang="pt-BR">` e slot de meta. → `REQ-8.4`, `REQ-8.6`
- [ ] `T2.3` Coleções `projetos` e `blog` com schemas Zod. → `REQ-3.1`…`REQ-3.6`
- [ ] `T2.4` Um projeto e um artigo reais em Markdown, renderizados em listagens de teste.

**Pronto quando:** um front matter inválido quebra o build e o conteúdo de teste aparece nas listagens.

### Etapa 3 — Home
- [ ] `T3.1` `Hero` com badge, bio, botões, contatos, foto e cartão de cargo. → `REQ-4.3`, `REQ-4.6`
- [ ] `T3.2` `ExperienceList` limitado a 3 posições. → `REQ-6.6`
- [ ] `T3.3` `ProjectCard` em grade de 2 colunas, alimentada por `destaque: true`.
- [ ] `T3.4` Seção de snippet com `CodeBlock` e botão copiar. → `REQ-6.2`
- [ ] `T3.5` `ArticleCard` em grade de 3 colunas com os artigos mais recentes.
- [ ] `T3.6` Responsividade das três faixas. → `REQ-7.1`…`REQ-7.5`

**Pronto quando:** a home corresponde ao protótipo em desktop e mobile, sem rolagem horizontal.

### Etapa 4 — Páginas de listagem e Sobre
- [ ] `T4.1` `/projetos/` com `ProjectRow`.
- [ ] `T4.2` `/blog/` com grade de 2 colunas e filtro por links. → `REQ-6.5`
- [ ] `T4.3` `/blog/categoria/<x>/` para as quatro categorias.
- [ ] `T4.4` `/sobre/` com bio longa, trajetória completa, áreas de foco e cartão de contatos.

**Pronto quando:** toda a navegação funciona e o build não reporta link interno quebrado. → `REQ-2.2`

### Etapa 5 — Artigo
- [ ] `T5.1` Layout de artigo: coluna de 68ch, escala tipográfica, callout, código inline. → `REQ-4.5`
- [ ] `T5.2` `CodeBlock` com Shiki no build e a ilha de cópia. → `REQ-6.2`
- [ ] `T5.3` `ArticleToc` gerado dos `h2` com `IntersectionObserver`. → `REQ-3.5`, `REQ-6.4`
- [ ] `T5.4` `AuthorSignature`.
- [ ] `T5.5` Publicar os três primeiros artigos (títulos em `## 10.2`).

**Pronto quando:** os três artigos estão legíveis, com sumário e cópia de código funcionando.

### Etapa 6 — Qualidade e distribuição
- [ ] `T6.1` Meta tags, canonical, OG/Twitter e JSON-LD. → `REQ-8.10`, `REQ-8.12`
- [ ] `T6.2` Geração de imagem OG no build. → `REQ-8.11`
- [ ] `T6.3` `sitemap.xml`, `robots.txt`, `/rss.xml`. → `REQ-8.13`
- [ ] `T6.4` `404.html` com cabeçalho e rodapé do site.
- [ ] `T6.5` Auditoria axe-core e Lighthouse; correções. → `REQ-8.1`…`REQ-8.9`
- [ ] `T6.6` Remover todo `PLACEHOLDER` remanescente. → `REQ-1.4`

**Pronto quando:** Lighthouse ≥ 95 nas quatro categorias e axe-core sem violações críticas ou sérias.

---

## 10. Ativos e conteúdo pendentes

A implementação pode começar com os espaços reservados do protótipo, mas `REQ-1.4` proíbe
qualquer um deles em produção.

### 10.1 Ativos necessários

- Foto de perfil, mínimo 800×960, enquadramento vertical
- Captura ou GIF de cada demo, proporção 300×176
- URLs reais dos repositórios das duas demos
- Usuário do GitHub, URL do LinkedIn e e-mail definitivo (o protótipo usa `ola@bruno-vieira.com`)
- Cargos anteriores: período, cargo, empresa e uma frase de escopo para cada
- Confirmação da cidade exibida no cartão "Cargo atual"

### 10.2 Conteúdo já definido

**Projetos**

1. **E-commerce com busca semântica** — Demo · Varejo. Catálogo onde a busca entende intenção em
   vez de palavra-chave: Vector Search para similaridade semântica, Atlas Search para relevância
   textual, schema flexível para variações de produto sem migração.
   Tags: Atlas Vector Search, Atlas Search, Flexible Schema, Aggregation Pipeline.
2. **Agente de seguradora com memória** — Demo · Seguros. Assistente que atende sinistros mantendo
   contexto da conversa e histórico do cliente: memória de curto prazo na sessão, longo prazo
   indexada por vetores, ferramentas expostas ao modelo via MCP.
   Tags: Short/Long-term Memory, Atlas Vector Search, MCP Server, Time Series.

**Artigos**

1. Auto-embeddings com Voyage AI — *features*
2. O que é Vector Search e como utilizar em seus projetos — *conceitos*
3. Como trazer uma experiência omni-channel para seus clientes utilizando MongoDB — *tutoriais*

---

## 11. Registro de decisões

Registre aqui toda decisão tomada durante a implementação que não esteja coberta acima, e toda
divergência entre este documento e o código.

| Data | Decisão | Motivo |
| --- | --- | --- |
| 2026-09-03 | Tema escuro único, sem alternador | Identidade definida; alternador dobra a superfície de teste sem ganho para o objetivo primário |
| 2026-09-03 | Sem ativos de marca da MongoDB | O site é portfolio pessoal, não material institucional |
| 2026-09-16 | Cores de destaque de sintaxe (Shiki, tema `github-dark`) podem usar tons fora dos 11 tokens de `§4.1` | REQ-4.1 fecha a paleta de UI, mas highlighting de código legível exige mais matizes do que um tema de bg/texto; a UI ao redor do bloco de código (barra, botão, fundo) continua restrita aos tokens |
| 2026-09-16 | `Callout` usa `--text-body` para o texto (protótipo usa `#C8DBD1`, fora da tabela `§4.1`) | Cor mais próxima entre os 11 tokens; corrige divergência do protótipo com este documento |
| 2026-09-16 | `sitemap.xml` de `REQ-8.13` é servido via `@astrojs/sitemap`, que gera `sitemap-index.xml` | Integração oficial evita reimplementar geração/validação de sitemap; `robots.txt` referencia o nome real do arquivo |
| 2026-09-16 | Corpo dos artigos "Auto-embeddings com Voyage AI" e "Experiência omni-channel" adiado (`T5.5` parcial) | Nenhum rascunho existe no SPEC/protótipo para esses dois; escrevê-los é trabalho editorial que o usuário optou por adiar. Apenas "O que é Vector Search…" foi portado do protótipo como conteúdo real |
| — | | |

### 11.1 Pendência de conformidade

Antes de publicar demos derivadas de engajamentos com clientes, verificar com a MongoDB se há
restrição contratual ou de confidencialidade. Bloqueia `T3.3` e `T4.1` em produção, não em `dev`.
