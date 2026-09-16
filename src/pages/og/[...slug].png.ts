import type { APIRoute } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getPublishedPosts } from "../../utils/content";

// Read from an absolute, cwd-rooted path rather than one relative to
// import.meta.url: this module gets bundled into a chunk under
// dist/.prerender/, so a relative URL would resolve against that chunk's
// location instead of the original source tree.
const dmSansBold = readFileSync(join(process.cwd(), "src/assets/og-fonts/DMSans-Bold.ttf"));
const jetBrainsMonoBold = readFileSync(
  join(process.cwd(), "src/assets/og-fonts/JetBrainsMono-Bold.ttf"),
);

// SPEC.md §4.1 tokens, duplicated here because this endpoint renders outside
// the CSS cascade (satori builds its own tree, it can't read tokens.css).
const COLORS = {
  bg: "#070E0B",
  text: "#F2F7F4",
  textMuted: "#93A79C",
  accent: "#23C486",
  border: "#1A2721",
};

interface Props {
  eyebrow: string;
  title: string;
}

function buildTree({ eyebrow, title }: Props) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "1200px",
        height: "630px",
        padding: "72px",
        background: COLORS.bg,
        fontFamily: "DM Sans",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontFamily: "JetBrains Mono",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "0.02em",
              color: COLORS.accent,
              textTransform: "uppercase",
            },
            children: eyebrow,
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              fontSize: "64px",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: COLORS.text,
              maxWidth: "980px",
            },
            children: title,
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "16px",
              paddingTop: "32px",
              borderTop: `1px solid ${COLORS.border}`,
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    width: "34px",
                    height: "34px",
                    borderRadius: "9px",
                    background: COLORS.accent,
                    color: "#06120C",
                    fontFamily: "DM Sans",
                    fontSize: "16px",
                    fontWeight: 700,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  children: "bv",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontFamily: "DM Sans",
                    fontSize: "20px",
                    fontWeight: 500,
                    color: COLORS.textMuted,
                  },
                  children: "bruno-vieira.com",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function renderOgImage(props: Props): Promise<Buffer> {
  const svg = await satori(buildTree(props), {
    width: 1200,
    height: 630,
    fonts: [
      { name: "DM Sans", data: dmSansBold, weight: 700, style: "normal" },
      { name: "JetBrains Mono", data: jetBrainsMonoBold, weight: 700, style: "normal" },
    ],
  });
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  return resvg.render().asPng();
}

export async function getStaticPaths() {
  const posts = await getPublishedPosts();

  const paths = [
    { params: { slug: "home" }, props: { eyebrow: "bruno-vieira.com", title: "Senior Solutions Architect · MongoDB" } },
    { params: { slug: "sobre" }, props: { eyebrow: "Sobre", title: "Bruno Vieira" } },
  ];

  for (const post of posts) {
    paths.push({
      params: { slug: `blog/${post.id}` },
      props: { eyebrow: post.data.categoria, title: post.data.titulo },
    });
  }

  return paths;
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props as Props);
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
