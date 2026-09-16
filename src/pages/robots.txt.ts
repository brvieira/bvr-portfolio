import type { APIRoute } from "astro";

// REQ-8.13 says "sitemap.xml"; the actual file is `sitemap-index.xml`,
// produced by @astrojs/sitemap — see SPEC.md §11 for the logged divergence.
export const GET: APIRoute = ({ site }) => {
  const body = `User-agent: *\nAllow: /\nSitemap: ${new URL("sitemap-index.xml", site)}\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
};
