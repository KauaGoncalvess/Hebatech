import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductRender } from "@/components/product-render";
import { buscarPorSlug, listarDisponiveis, listarRelacionados } from "@/lib/catalogo";
import { parcela, preco } from "@/lib/format";
import { waParecido, waProduto } from "@/lib/whatsapp";
import { site } from "@/data/site";
import {
  GRAU_DESCRICAO,
  resumoTecnico,
  rotuloCategoria,
  type Produto,
} from "@/types/produto";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const itens = await listarDisponiveis();
  return itens.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await buscarPorSlug(slug);
  if (!p) return { title: "Produto não encontrado" };

  const resumo = resumoTecnico(p);
  const titulo = `${p.marca} ${p.modelo}${resumo.length ? ` — ${resumo.join(" / ")}` : ""}`;
  const descricao = p.disponivel
    ? `${titulo} por ${preco(p.preco)}. ${p.resumo} Garantia de ${p.garantiaDias} dias. Estoque em ${site.endereco.cidade}/${site.endereco.uf}.`
    : `${titulo} — já vendido. Veja o que temos parecido em estoque em ${site.endereco.cidade}/${site.endereco.uf}.`;

  // Sem foto o link cai na imagem genérica da loja; com foto, a capa do produto.
  const imagem = p.fotos[0];

  return {
    title: p.disponivel ? titulo : `${titulo} (vendido)`,
    description: descricao,
    alternates: { canonical: `/produtos/${p.slug}` },
    openGraph: {
      type: "website",
      title: titulo,
      description: descricao,
      url: `/produtos/${p.slug}`,
      images: imagem
        ? [{ url: imagem, alt: `${p.marca} ${p.modelo}` }]
        : [{ url: "/og.png", width: 1200, height: 630, alt: site.nomeCompleto }],
    },
    robots: p.disponivel ? undefined : { index: false, follow: true },
  };
}

/** O que a bancada confere antes de o produto entrar no estoque. */
function roteiroRevisao(p: Produto): string[] {
  if (p.condicao === "novo") {
    return [
      "Produto novo, lacrado, com nota fiscal em seu nome",
      "Conferência de compatibilidade antes de fechar",
      "Instalação feita na loja quando o item exige",
      "Teste de funcionamento na sua frente na entrega",
    ];
  }

  if (p.categoria === "notebook" || p.categoria === "desktop") {
    return [
      "Teste de disco (SMART) e de memória",
      ...(p.bateriaSaude ? ["Medição da saúde real da bateria"] : []),
      "Teste de tela: pixel morto, mancha e uniformidade",
      "Teste de portas, rede, som, câmera e teclado",
      "Limpeza interna e troca de pasta térmica",
      "Sistema instalado, ativado e atualizado",
    ];
  }

  if (p.categoria === "monitor") {
    return [
      "Tela conferida contra pixel morto e mancha",
      "Teste de todas as entradas de vídeo",
      "Base, trava de encaixe e ajustes testados",
      "Limpeza do painel e da carcaça",
    ];
  }

  return [
    "Teste de funcionamento em bancada",
    "Conferência dos acessórios que acompanham",
    "Limpeza e conferência estética",
    "Garantia da loja por escrito",
  ];
}

export default async function ProdutoPage({ params }: Params) {
  const { slug } = await params;
  const p = await buscarPorSlug(slug);
  if (!p) notFound();

  // Vendido não é erro: o link já circulou no Instagram e no WhatsApp. Mantém a
  // página de pé, avisa que saiu e joga a conversa para o que ainda tem.
  const vendido = !p.disponivel;
  const relacionados = await listarRelacionados(p);
  const voltarPara = p.categoria === "notebook" ? "/notebooks" : "/produtos";
  const rotuloVoltar = p.categoria === "notebook" ? "Notebooks" : "Produtos";

  const medidas: [string, string][] = [];
  if (p.pesoKg) medidas.push(["Peso", `${p.pesoKg.toFixed(2)} kg`]);
  if (p.telaPolegadas) medidas.push(["Tela", `${p.telaPolegadas}"`]);
  if (p.bateriaSaude) medidas.push(["Bateria", `${p.bateriaSaude}%`]);
  for (const extra of [
    ["Condição", p.condicao === "novo" ? "Novo" : "Seminovo"] as [string, string],
    ["Garantia", `${p.garantiaDias} dias`] as [string, string],
    ["Categoria", rotuloCategoria(p.categoria)] as [string, string],
  ]) {
    if (medidas.length >= 3) break;
    medidas.push(extra);
  }

  const revisao = roteiroRevisao(p);

  const produtoLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.marca} ${p.modelo}`,
    sku: p.codigo,
    brand: { "@type": "Brand", name: p.marca },
    description: `${resumoTecnico(p).join(", ")}. ${p.resumo}`.trim(),
    ...(p.fotos.length ? { image: p.fotos } : {}),
    itemCondition:
      p.condicao === "novo"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: p.preco,
      availability: vendido
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      itemCondition:
        p.condicao === "novo"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
      url: `${site.url}/produtos/${p.slug}`,
      seller: { "@id": `${site.url}#loja` },
    },
  };

  const trilhaLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: rotuloVoltar,
        item: `${site.url}${voltarPara}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${p.marca} ${p.modelo}`,
        item: `${site.url}/produtos/${p.slug}`,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-[1180px] px-5 pt-28 pb-20 md:pt-36">
      <nav aria-label="Trilha" className="mb-8">
        <Link
          href={voltarPara}
          className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[11.5px] text-white/60 transition-colors hover:bg-surface-3 hover:text-white"
        >
          <span aria-hidden>←</span> {rotuloVoltar}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        {/* Imagem */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="card overflow-hidden">
            <ProductGallery fotos={p.fotos} alt={`${p.marca} ${p.modelo}`}>
              <ProductRender
                codigo={p.codigo}
                marca={p.marca}
                categoria={p.categoria}
                polegadas={p.telaPolegadas}
                variante="detalhe"
                className="aspect-[16/10] w-full"
              />
            </ProductGallery>
          </div>

          <ul className="mt-4 grid grid-cols-3 gap-3">
            {medidas.map(([k, v]) => (
              <li key={k} className="rounded-2xl bg-surface-2 p-4">
                <p className="eyebrow text-white/50">{k}</p>
                <p className="mt-2 font-mono text-[14px]">{v}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Identificação e ação */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-surface-2 px-3.5 py-2 font-mono text-[10.5px] tracking-[0.12em] text-accent uppercase">
              {p.marca}
            </span>
            <span className="rounded-full bg-surface-2 px-3.5 py-2 font-mono text-[10.5px] tracking-[0.12em] text-white/50 uppercase">
              {rotuloCategoria(p.categoria)}
            </span>
            <span className="rounded-full bg-surface-2 px-3.5 py-2 font-mono text-[10.5px] tracking-[0.12em] text-white/55 uppercase">
              {p.codigo}
            </span>
            {vendido && (
              <span className="rounded-full bg-accent px-3.5 py-2 font-mono text-[10.5px] font-bold tracking-[0.12em] text-black uppercase">
                Vendido
              </span>
            )}
          </div>

          <h1 className="display mt-5 text-[clamp(2rem,5vw,3.2rem)] leading-[0.92]">
            {p.modelo}
          </h1>

          {resumoTecnico(p).length > 0 && (
            <p className="mt-4 font-mono text-[13px] text-white/55">
              {resumoTecnico(p).join(" · ")}
            </p>
          )}
          {p.resumo && (
            <p className="mt-4 text-[14.5px] leading-relaxed text-white/60">{p.resumo}</p>
          )}

          {vendido ? (
            <div className="card mt-7 p-6">
              <p className="eyebrow text-accent">Já saiu do estoque</p>
              <p className="display mt-4 max-w-[18ch] text-[clamp(1.6rem,4vw,2.2rem)] leading-[0.95]">
                Este aparelho foi vendido
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-white/60">
                A ficha continua no ar para você comparar. Chega máquina do mesmo
                porte toda semana — diga a configuração e avisamos assim que entrar.
              </p>

              <a
                href={waParecido(p)}
                data-origem="produto-vendido"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex h-14 items-center justify-center gap-3 rounded-full bg-accent font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
              >
                Quero um parecido
                <span aria-hidden>→</span>
              </a>
              <Link
                href={voltarPara}
                className="mt-3 flex h-14 items-center justify-center rounded-full bg-surface-2 font-mono text-[12px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
              >
                Ver o que tem em estoque
              </Link>
            </div>
          ) : (
            <div className="card mt-7 p-6">
              {p.precoReferencia && p.precoReferencia > p.preco && (
                <p className="font-mono text-[12px] text-white/50 line-through">
                  {preco(p.precoReferencia)}
                </p>
              )}
              <p className="display mt-1 text-[clamp(2.2rem,6vw,3rem)] leading-none">
                {preco(p.preco)}
              </p>
              <p className="mt-3 font-mono text-[12px] text-white/50">
                à vista no Pix · ou 10x de {parcela(p.preco)} sem juros
              </p>

              <a
                href={waProduto(p)}
                data-origem="produto"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex h-14 items-center justify-center gap-3 rounded-full bg-accent font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
              >
                Reservar no WhatsApp
                <span aria-hidden>→</span>
              </a>
              <p className="mt-4 text-center font-mono text-[11px] text-white/55">
                A mensagem já vai com modelo, código e preço.
              </p>
            </div>
          )}

          {/* Estado de conservação */}
          <div className="card mt-4 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[13px] font-bold text-black">
                {p.estadoGrau ?? "N"}
              </span>
              <div>
                <h2 className="font-mono text-[12px] tracking-[0.1em] uppercase">
                  {p.estadoGrau ? "Estado de conservação" : "Produto novo"}
                </h2>
                <p className="font-mono text-[11px] text-white/55">
                  {p.estadoGrau ? `Grau ${p.estadoGrau} de A a C` : "Lacrado, com nota fiscal"}
                </p>
              </div>
            </div>

            <p className="mt-5 text-[14px] leading-relaxed text-white/65">
              {p.estadoGrau
                ? GRAU_DESCRICAO[p.estadoGrau]
                : "Item novo, sem uso, com garantia do fabricante além da garantia da loja."}
            </p>

            {p.estadoObservacoes.length > 0 && (
              <ul className="mt-5 space-y-2.5">
                {p.estadoObservacoes.map((o) => (
                  <li key={o} className="flex gap-3 text-[13.5px] text-white/60">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {o}
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-5 text-[13px] text-white/55">
              Você pode conferir o produto na loja antes de fechar, sem compromisso.
            </p>
          </div>
        </div>
      </div>

      {/* Revisão executada */}
      <section className="mt-16">
        <h2 className="display text-sub">
          {p.condicao === "novo" ? "O que garantimos" : "Revisão executada na bancada"}
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {revisao.map((r) => (
            <li
              key={r}
              className="flex items-start gap-3 rounded-2xl bg-surface-2 p-4 text-[13.5px] text-white/70"
            >
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* Ficha técnica */}
      {p.ficha.length > 0 && (
        <section className="mt-16">
          <h2 className="display text-sub">Especificação completa</h2>
          <dl className="card mt-6 divide-y divide-line overflow-hidden">
            {[...p.ficha, { rotulo: "Código do produto", valor: p.codigo }].map((item) => (
              <div key={item.rotulo} className="grid gap-1 p-5 sm:grid-cols-[200px_1fr] sm:gap-6">
                <dt className="font-mono text-[11px] tracking-[0.1em] text-white/50 uppercase">
                  {item.rotulo}
                </dt>
                <dd className="font-mono text-[13px] text-white/80">{item.valor}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Garantia */}
      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          [
            "Garantia",
            `${p.garantiaDias} dias`,
            "Cobre peça e mão de obra do que foi revisado. Defeito coberto é resolvido na loja.",
          ],
          [
            "Nota fiscal",
            "Emitida sempre",
            "Vale para reembolso de empresa e para acionar a garantia.",
          ],
          [
            "Troca",
            "7 dias",
            "Direito de arrependimento em compra à distância, conforme o CDC.",
          ],
        ].map(([k, v, texto]) => (
          <div key={k} className="spot card p-6">
            <p className="eyebrow text-white/50">{k}</p>
            <p className="display mt-3 text-[1.8rem] leading-none text-accent">{v}</p>
            <p className="mt-3 text-[13px] leading-relaxed text-white/55">{texto}</p>
          </div>
        ))}
      </section>

      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="display text-sub">
            {vendido ? "Em estoque agora" : "Preço parecido"}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((o) => (
              <li key={o.id}>
                <ProductCard p={o} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <script
        type="application/ld+json"
        // Dados vêm do catálogo da loja, não de entrada do visitante.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(produtoLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trilhaLd) }}
      />
    </article>
  );
}
