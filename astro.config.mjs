// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { rehypeCodeChrome } from "./src/plugins/rehype-code-chrome.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://bruno-vieira.com",
  trailingSlash: "always",
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [rehypeCodeChrome],
    shikiConfig: {
      themes: { light: "github-dark", dark: "github-dark" },
      transformers: [
        {
          name: "filename-meta",
          pre(node) {
            const raw = this.options.meta?.__raw;
            if (raw) {
              node.properties["data-filename"] = raw.trim();
            }
          },
        },
      ],
    },
  },
});
