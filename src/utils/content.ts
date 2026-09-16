import { getCollection, type CollectionEntry } from "astro:content";
import { estimateReadingTime } from "./reading-time";

// REQ-3.4: drafts never appear in listings/RSS/sitemap in production, but
// stay reachable by direct URL in dev.
export function isPublished(entry: CollectionEntry<"blog">): boolean {
  return !entry.data.rascunho || import.meta.env.DEV;
}

export async function getPublishedPosts(): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection("blog", isPublished);
  return posts.sort((a, b) => b.data.data.valueOf() - a.data.data.valueOf());
}

export async function getReadingTime(entry: CollectionEntry<"blog">): Promise<number> {
  if (entry.data.tempoLeitura) return entry.data.tempoLeitura;
  const { body } = entry;
  return estimateReadingTime(body ?? "");
}

export async function getSortedProjects(): Promise<CollectionEntry<"projetos">[]> {
  const projects = await getCollection("projetos");
  return projects.sort((a, b) => a.data.ordem - b.data.ordem);
}
