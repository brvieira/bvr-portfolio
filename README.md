# bruno-vieira.com

Bruno Vieira's portfolio and blog — an [Astro](https://astro.build) static site deployed to
[bruno-vieira.com](https://bruno-vieira.com) via GitHub Pages. `project/SPEC.md` is the
authoritative spec for design and content-model decisions; `CLAUDE.md` has deeper architecture
notes for anyone (human or agent) editing this codebase.

## Getting started

Node is managed via [nvm](https://github.com/nvm-sh/nvm):

```bash
source ~/.nvm/nvm.sh && nvm use v26.7.0   # or whatever version .nvmrc / engines expects
corepack enable && corepack prepare pnpm@latest --activate   # first time only, if pnpm is missing
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321`.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with hot reload |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Serve the built `dist/` locally |
| `pnpm check` | TypeScript check via `astro check` (strict) |
| `pnpm check:links` | Builds, then crawls `dist/` for broken internal links |
| `pnpm check:placeholders` | Fails if any literal `PLACEHOLDER` string remains in `src`/`public` |

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which type-checks, builds, link-checks,
and deploys to GitHub Pages. No manual deploy step — merging is deploying. DNS for
`bruno-vieira.com` points at GitHub Pages and HTTPS is enforced.

## Adding a blog post

Add a Markdown file under `src/content/blog/`, filename becomes the slug (e.g.
`src/content/blog/minha-nova-postagem.md` → `/blog/minha-nova-postagem/`):

```md
---
titulo: "Título do post"
categoria: "conceitos"   # one of: conceitos, features, tutoriais, novidades
data: 2026-09-16
resumo: "Um ou dois períodos resumindo o artigo — aparece nos cards de listagem e no RSS."
tempoLeitura: 7          # optional — auto-estimated from word count if omitted
rascunho: false          # true hides it from prod listings/RSS/sitemap until you flip this
---

Corpo do artigo em Markdown normal a partir daqui. `## Heading`s viram entradas no índice
lateral (ArticleToc). Blocos de código com um nome de arquivo no meta da fence,
por exemplo ```python vector_search.py, ganham o "chrome" com botão de copiar automaticamente.
```

Set `rascunho: true` while drafting — the post still renders in `pnpm dev` (dev mode ignores the
flag) but is excluded from the production blog index, RSS feed, and sitemap until you flip it to
`false`.

## Adding a project

Add a Markdown file under `src/content/projetos/`. The body isn't rendered in the current design —
only frontmatter is used:

```md
---
titulo: "Nome do projeto"
tipo: "Demo · Varejo"       # short type/category label shown on the card
ano: 2026
resumo: "Descrição curta do que o projeto resolve e como."
tags: ["Atlas Vector Search", "Atlas Search"]   # 1–5 tags
repo: "https://github.com/owner/repo"            # must be a real URL
imagem: "./captura.png"     # optional, relative to this file
destaque: true               # true = featured/highlighted card
ordem: 1                     # sort order among project cards
---
```

## Editing bio / contact / experience

Everything on `/` and `/sobre/` that isn't a blog post or project — bio copy, work history,
contact links, the home page hero and code snippet — lives in `src/data/site.ts`, not a content
collection. Edit it directly; both pages read from the same source so they can't drift apart.

## Updating the profile photo

Replace `src/assets/profile.jpg` with a new image (any common raster format works; Astro's image
pipeline re-optimizes it at build time via `sharp`) and keep the same import path in
`src/components/Hero.astro`, `src/pages/sobre/index.astro`, and
`src/components/AuthorSignature.astro` — or update the `profilePhoto` import in all three if you
rename the file. Minimum recommended source size: 800×960, vertical framing.

## Project structure

```
src/
  content/
    blog/          # blog posts (Markdown + frontmatter)
    projetos/       # project cards (frontmatter only, body unused)
  content.config.ts # collection schemas — start here to see every frontmatter field
  data/site.ts       # non-collection site data: bio, experience, contacts, hero copy
  components/        # Hero, ArticleCard, ProjectCard, CodeBlock, etc.
  layouts/            # BaseLayout (shared shell), ArticleLayout (blog posts)
  pages/               # file-based routes, including og/[...slug].png.ts (OG image generation)
  styles/               # tokens.css (design tokens), global.css, reset.css
```

## Known-pending items

Tracked in `project/SPEC.md` §10.1 and §11: real repo URLs for the two seeded projects are
blocked on asset handoff and a MongoDB compliance sign-off, and two of the three planned blog
topics don't have drafted bodies yet. Neither is a bug — see `CLAUDE.md` for details.
