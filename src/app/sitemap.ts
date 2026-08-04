import type { MetadataRoute } from "next";
import { servicos } from "@/data/servicos";
import { site } from "@/data/site";
import { listarDisponiveis } from "@/lib/catalogo";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agora = new Date();
  const produtos = await listarDisponiveis();

  const fixas: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/notebooks`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/produtos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/assistencia`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/manutencao`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/contato`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Uma página por serviço é onde mora a busca local do tipo
  // "troca de tela notebook sete lagoas".
  const paginasDeServico: MetadataRoute.Sitemap = servicos
    .filter((s) => !s.href)
    .map((s) => ({
      url: `${site.url}/servicos/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [
    ...fixas,
    ...paginasDeServico,
    ...produtos.map((p) => ({
      url: `${site.url}/produtos/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ].map((e) => ({ ...e, lastModified: agora }));
}
