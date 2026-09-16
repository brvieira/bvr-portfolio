import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projetos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projetos" }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      tipo: z.string(),
      ano: z.number().int(),
      resumo: z.string(),
      tags: z.array(z.string()).min(1).max(5),
      repo: z.string().url(),
      imagem: image().optional(),
      destaque: z.boolean().default(false),
      ordem: z.number(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    titulo: z.string(),
    categoria: z.enum(["conceitos", "features", "tutoriais", "novidades"]),
    data: z.coerce.date(),
    resumo: z.string(),
    tempoLeitura: z.number().optional(),
    rascunho: z.boolean().default(false),
  }),
});

export const collections = { projetos, blog };
