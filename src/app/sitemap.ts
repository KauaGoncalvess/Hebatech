import type { MetadataRoute } from "next";
import { notebooksDisponiveis } from "@/data/notebooks";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  const fixas: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/notebooks`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/assistencia`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/contato`, changeFrequency: "yearly", priority: 0.6 },
  ];

  return [
    ...fixas,
    ...notebooksDisponiveis.map((n) => ({
      url: `${site.url}/notebooks/${n.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ].map((e) => ({ ...e, lastModified: agora }));
}
