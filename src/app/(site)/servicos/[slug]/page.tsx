import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Faq } from "@/components/faq";
import { ServicoArt } from "@/components/servico-art";
import { site } from "@/data/site";
import { faqJsonLd } from "@/data/perguntas";
import { rotaServico, servicos } from "@/data/servicos";
import { waGenerico } from "@/lib/whatsapp";

type Params = { params: Promise<{ slug: string }> };

/** Serviço com página própria fora de /servicos fica de fora daqui. */
const comPaginaPropria = servicos.filter((s) => !s.href);

export function generateStaticParams() {
  return comPaginaPropria.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = comPaginaPropria.find((x) => x.slug === slug);
  if (!s) return { title: "Serviço não encontrado" };

  const cidade = `${site.endereco.cidade}/${site.endereco.uf}`;
  return {
    title: `${s.chamada} em ${cidade}`,
    description: `${s.descricao.slice(0, 150)}… Orçamento fechado antes do reparo. Loja física em ${cidade}.`,
    alternates: { canonical: `/servicos/${s.slug}` },
  };
}

export default async function ServicoPage({ params }: Params) {
  const { slug } = await params;
  const s = comPaginaPropria.find((x) => x.slug === slug);
  if (!s) notFound();

  const outros = servicos.filter((o) => o.slug !== s.slug).slice(0, 3);
  const cidade = `${site.endereco.cidade}/${site.endereco.uf}`;

  const trilhaLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: site.url },
      { "@type": "ListItem", position: 2, name: "Assistência", item: `${site.url}/assistencia` },
      {
        "@type": "ListItem",
        position: 3,
        name: s.titulo,
        item: `${site.url}/servicos/${s.slug}`,
      },
    ],
  };

  const servicoLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.chamada,
    serviceType: s.titulo,
    description: s.descricao,
    provider: { "@id": `${site.url}#loja` },
    areaServed: { "@type": "City", name: cidade },
    url: `${site.url}/servicos/${s.slug}`,
  };

  const faqLd = s.perguntas.length ? faqJsonLd(s.perguntas) : null;

  return (
    <article className="mx-auto max-w-[1180px] px-5 pt-28 pb-20 md:pt-36 md:pb-28">
      <nav aria-label="Trilha" className="mb-8">
        <Link
          href="/assistencia"
          className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[11.5px] text-white/60 transition-colors hover:bg-surface-3 hover:text-white"
        >
          <span aria-hidden>←</span> Assistência
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-12">
        <div>
          <p className="eyebrow text-accent">{s.etiqueta}</p>
          <h1 className="display mt-5 max-w-[18ch] text-title">{s.chamada}</h1>
          <p className="mt-6 max-w-[58ch] text-[15px] leading-relaxed text-white/65">
            {s.descricao}
          </p>

          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-surface-2 p-5">
              <dt className="eyebrow text-white/50">Preço</dt>
              <dd className="mt-2 text-[13.5px] leading-relaxed text-white/70">
                Fechado depois da medição, e por escrito. Nada é aberto ou trocado
                antes da sua aprovação.
              </dd>
            </div>
            <div className="rounded-2xl bg-surface-2 p-5">
              <dt className="eyebrow text-white/50">Prazo</dt>
              <dd className="mt-2 text-[13.5px] leading-relaxed text-white/70">
                Informado junto do orçamento, quando já se sabe o que o aparelho tem.
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={waGenerico(s.chamada.toLowerCase())}
              data-origem={`servico:${s.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center justify-center rounded-full bg-accent px-8 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
            >
              Pedir orçamento
            </a>
            <Link
              href="/assistencia"
              className="flex h-14 items-center justify-center rounded-full bg-surface-2 px-8 font-mono text-[12px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
            >
              Tabela completa
            </Link>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="relative aspect-[16/10] text-white">
            <ServicoArt area={s.area} className="h-full w-full" />
          </div>
          <div className="p-6">
            <p className="eyebrow text-white/50">O que está incluso</p>
            <ul className="mt-5 space-y-3">
              {s.itens.map((item) => (
                <li key={item} className="flex gap-3 text-[14px] text-white/70">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {s.perguntas.length > 0 && (
        <section className="mt-16 md:mt-20">
          <h2 className="display text-sub">Dúvidas sobre esse serviço</h2>
          <div className="mt-8">
            <Faq perguntas={s.perguntas} />
          </div>
        </section>
      )}

      <section className="mt-16 md:mt-20">
        <h2 className="display text-sub">A bancada também faz</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {outros.map((o) => (
            <li key={o.slug}>
              <Link
                href={rotaServico(o)}
                className="spot card group flex h-full flex-col p-6 transition-colors hover:bg-surface-2"
              >
                <span className="eyebrow text-accent">{o.etiqueta}</span>
                <span className="display mt-4 text-[1.4rem] leading-[0.95]">{o.titulo}</span>
                <span className="mt-3 flex-1 text-[13.5px] leading-relaxed text-white/55">
                  {o.resumo}
                </span>
                <span
                  aria-hidden
                  className="mt-5 font-mono text-sm text-white/50 transition-colors group-hover:text-accent"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <script
        type="application/ld+json"
        // Conteúdo do arquivo de serviços — nada vem do visitante.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicoLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trilhaLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
    </article>
  );
}
