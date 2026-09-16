# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An Astro static site implementing `project/SPEC.md` — Bruno Vieira's portfolio/blog, deployed to `bruno-vieira.com` via GitHub Pages. `project/SPEC.md` remains the authoritative spec; read it before making design/content-model changes, and log any new decision or deviation in its `## 11. Registro de decisões`. `project/*.dc.html` are the original Claude Design prototypes/handoff bundle — reference only, not part of the build.

## Commands

```
pnpm install          # first-time setup (also: corepack enable && corepack prepare pnpm@latest --activate if pnpm is missing)
pnpm dev              # dev server
pnpm build            # production build to dist/
pnpm preview          # serve the built dist/
pnpm check            # astro check (TypeScript, strict) — needs typescript ^6.x; TS 7's native compiler doesn't expose the API @astrojs/check relies on yet
pnpm check:links      # build first, then crawl dist/ for broken internal links (external hosts + the canonical domain are excluded/rewritten — see package.json)
pnpm check:placeholders  # git-grep style sweep for literal "PLACEHOLDER" strings; expected to fail until T6.6 (final pre-production cleanup)
```

Node is managed via nvm (`~/.nvm`); if `node`/`pnpm` aren't on PATH, `source ~/.nvm/nvm.sh && nvm use v26.7.0`.

## Architecture

- **Content collections** (`src/content.config.ts`, Content Layer API with `glob()` loaders): `projetos` and `blog`, schemas per SPEC §3. Blog drafts (`rascunho: true`) are excluded from prod listings/RSS/sitemap via `src/utils/content.ts`'s `isPublished()` (`!rascunho || import.meta.env.DEV`) — this must gate every `getStaticPaths`/`getCollection` call that feeds a listing, not just the article route.
- **Non-collection site data** (bio, experience, contacts, hero copy, the home snippet) lives in `src/data/site.ts`, not a collection — shared by `Hero`, `ExperienceList`, `AuthorSignature`, header/footer so `/` and `/sobre/` don't duplicate it. Placeholder entries there keep the literal string `PLACEHOLDER` on purpose, so `check:placeholders` catches them.
- **In-article code blocks are not rendered by the `CodeBlock.astro` component.** Markdown code fences (` ```python vector_search.py `) get their filename via a Shiki transformer in `astro.config.mjs` (reads the fence's raw meta string into `pre`'s `data-filename`), then `src/plugins/rehype-code-chrome.mjs` wraps the highlighted `<pre>` in the same chrome markup `CodeBlock.astro` renders directly (for the home page's standalone snippet). Because of this, **the code-block chrome CSS lives in `src/styles/global.css`, not scoped inside `CodeBlock.astro`** — a page that never renders `<CodeBlock>` (i.e. every article) still needs that CSS for the rehype-generated markup. Don't move it back into the component's scoped `<style>`.
- **The copy-to-clipboard script** (`src/scripts/copy-code.ts`, SPEC §6.1's exact reference implementation) is loaded from both `CodeBlock.astro` and `ArticleLayout.astro` independently (component vs. markdown-sourced code blocks), but Astro dedupes it into one shared chunk — don't be surprised the two `<script src>` tags resolve to the same bundle.
- **`ArticleToc`** reads `headings` from `render(entry)` (`astro:content`), filters to `depth === 2`, and highlights the active one via `IntersectionObserver` (`src/scripts/article-toc.ts`). It's hidden below 1024px with pure CSS (`display:none`), not JS.
- **OG images** (`src/pages/og/[...slug].png.ts`) are generated at build time with `satori` + `@resvg/resvg-js` from a hand-built element tree (not JSX/React) using the SPEC §4.1 palette hardcoded as constants (satori can't read `tokens.css`). It reads two build-only bold TTFs from `src/assets/og-fonts/` via an absolute `process.cwd()`-rooted path — **do not switch that to an `import.meta.url`-relative path**, it breaks because this module gets bundled into a chunk under `dist/.prerender/` whose location isn't the source tree. Those TTFs are static instances produced by `fonttools varLib.instancer` from Google's variable-font sources (gwfh's per-weight TTF endpoint returned mislabeled Thin instances for both families — verify weight with fontTools if you ever regenerate these, not just by filename).
- **Runtime fonts** (`public/fonts/`): only 4 woff2 files total (`dm-sans-latin(-ext).woff2`, `jetbrains-mono-latin(-ext).woff2`). Both families ship as Google variable fonts, so the 400/500/700 (DM Sans) and 400/500 (JetBrains Mono) `@font-face` rules in `global.css` intentionally point multiple weights at the *same* file — that's correct, not a dedup bug. Preloading the weight-400 URL in `BaseLayout.astro` therefore warms every weight for free.
- **`max-width: <N>ch` never appears unqualified** — always `min(<N>ch, 100%)`. A bare `ch` value doesn't shrink on narrow viewports and blows out horizontal scroll (this bit the article layout once: a grid item also needs explicit `min-width: 0`, since grid/flex items default to `min-width: auto` and won't shrink below a child's min-content size — e.g. an unbroken code line — no matter what the track width says).
- **Sitemap**: `@astrojs/sitemap` emits `sitemap-index.xml`, not the `sitemap.xml` REQ-8.13 literally names; `robots.txt.ts` points at the real filename. Logged in SPEC §11.
- Two real projects are seeded in `src/content/projetos/` with real copy from SPEC §10.2 but placeholder repo URLs (`PLACEHOLDER-*`, intentionally 404ing) — real URLs are blocked on SPEC §10.1 (asset handoff) and §11.1 (MongoDB compliance sign-off before production), not on implementation.
- Only one blog post exists with a real body (`vector-search-o-que-e.md`, ported from the prototype). The other two SPEC §10.2 article topics have no drafted body anywhere (spec, prototype, or this repo) — writing them was explicitly deferred by the user, not forgotten.

## Known-pending, not implementable from inside a coding session

- GitHub repo creation/push, enabling "Pages → Source: GitHub Actions", DNS records, and HTTPS enforcement (SPEC §2.1) — repo auth and DNS/registrar access aren't available here.
- `gh` CLI is installed via Homebrew but not authenticated in this environment; `gh auth login` needs a human to complete the browser flow.
