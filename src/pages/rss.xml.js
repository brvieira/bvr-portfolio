import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = (await getCollection("blog", (entry) => !entry.data.rascunho)).sort(
    (a, b) => b.data.data.valueOf() - a.data.data.valueOf(),
  );

  return rss({
    title: "Bruno Vieira",
    description: "Artigos curtos sobre conceitos, features e novidades do MongoDB.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.titulo,
      pubDate: post.data.data,
      description: post.data.resumo,
      link: `/blog/${post.id}/`,
    })),
  });
}
