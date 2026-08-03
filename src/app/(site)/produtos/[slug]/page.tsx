import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductRender } from "@/components/product-render";
import { buscarPorSlug, listarDisponiveis, listarRelacionados } from "@/lib/catalogo";
import { parcela, preco } from "@/lib/format";
import { waProduto } from "@/lib/whatsapp";
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

  return {
    title: titulo,
    description: `${titulo} por ${preco(p.preco)}. ${p.resumo} Garantia de ${p.garantiaDias} dias. Estoque em ${site.endereco.cidade}/${site.endereco.uf}.`,
    alternates: { canonical: `/produtos/${p.slug}` },
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
  if (!p || !p.disponivel) notFound();

  const relacionados = await listarRelacionados(p);
  const voltarPara = p.categoria === "notebook" ? "/notebooks" : "/produtos";
  const rotuloVoltar = p.categoria === "notebook" ? "Notebooks" : "Produtos";

  /** Régua lateral: entra o que o produto tem e completa até três células. */
  const medidas: [string, string][] = [];
  if (p.pesoKg) medidas.push(["Peso", `${p.pesoKg.toFixed(2)} kg`]);
  if (p.telaPolegadas) medidas.push(["Tela", `${p.telaPolegadas}"`]);
  if (p.bateriaSaude) medidas.push(["Bateria", `${p.bateriaSaude}%`]);

  const extras: [string, string][] = [
    ["Condição", p.condicao === "novo" ? "Novo, lacrado" : "Seminovo"],
    ["Garantia", `${p.garantiaDias} dias`],
    ["Categoria", rotuloCategoria(p.categoria)],
  ];
  for (const extra of extras) {
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
      availability: "https://schema.org/InStock",
      url: `${site.url}/produtos/${p.slug}`,
    },
  };

  return (
    <>
      <nav
        aria-label="Trilha"
        className="mx-auto flex max-w-[1600px] items-center gap-2 border-b border-line px-4 pt-28 pb-3 md:pt-36 font-mono text-[10px] tracking-[0.14em] text-white/35 uppercase md:px-6"
      >
        <Link href={voltarPara} className="transition-colors hover:text-accent">
          {rotuloVoltar}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-white/70">{p.codigo}</span>
      </nav>

      <article className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Imagem */}
          <div className="border-b border-line lg:col-span-7 lg:border-r lg:border-b-0">
            <div className="lg:sticky lg:top-[65px]">
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

              <ul className="grid grid-cols-3 border-t border-line">
                {medidas.map(([k, v], i) => (
                  <li
                    key={k}
                    className={`px-4 py-3 md:px-6 ${i < 2 ? "border-r border-line" : ""}`}
                  >
                    <p className="eyebrow text-white/35">{k}</p>
                    <p className="mt-1.5 font-mono text-[13px]">{v}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Identificação e ação */}
          <div className="lg:col-span-5">
            <div className="px-4 pt-8 pb-6 md:px-6">
              <div className="flex items-start justify-between gap-4">
                <p className="eyebrow text-accent">
                  {p.marca} <span className="text-white/30">/ {rotuloCategoria(p.categoria)}</span>
                </p>
                <span className="shrink-0 font-mono text-[10px] tracking-[0.16em] text-white/35">
                  COD {p.codigo}
                </span>
              </div>

              <h1 className="display mt-4 text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[0.9]">
                {p.modelo}
              </h1>

              {resumoTecnico(p).length > 0 && (
                <p className="mt-4 font-mono text-[12.5px] text-white/60">
                  {resumoTecnico(p).join(" · ")}
                </p>
              )}
              {p.resumo && (
                <p className="mt-4 text-[13.5px] leading-relaxed text-white/60">{p.resumo}</p>
              )}
            </div>

            <div className="border-y border-line px-4 py-5 md:px-6">
              {p.precoReferencia && p.precoReferencia > p.preco && (
                <p className="font-mono text-[11px] text-white/35 line-through">
                  {preco(p.precoReferencia)}
                </p>
              )}
              <p className="display mt-1 text-[clamp(2.4rem,7vw,3.4rem)] leading-none">
                {preco(p.preco)}
              </p>
              <p className="mt-3 font-mono text-[11px] text-white/50">
                à vista no Pix · ou 10x de {parcela(p.preco)} sem juros no cartão
              </p>
            </div>

            <a
              href={waProduto(p)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center justify-between gap-4 bg-accent px-4 py-5 text-black transition-colors hover:bg-white md:flex md:px-6"
            >
              <span>
                <span className="block font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
                  WhatsApp
                </span>
                <span className="display mt-1 block text-[1.7rem] leading-none">
                  Reservar {p.codigo}
                </span>
              </span>
              <span aria-hidden className="font-mono text-xl">
                →
              </span>
            </a>
            <p className="border-y border-line px-4 py-3 font-mono text-[10px] tracking-[0.1em] text-white/40 md:border-t-0 md:px-6">
              A mensagem do WhatsApp já vai preenchida com o modelo, o código e o preço.
            </p>

            {/* Estado de conservação */}
            <section className="px-4 py-6 md:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent font-mono text-[13px] font-bold text-accent">
                  {p.estadoGrau ?? "N"}
                </span>
                <div>
                  <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase">
                    {p.estadoGrau ? "Estado de conservação" : "Produto novo"}
                  </h2>
                  <p className="font-mono text-[10px] text-white/40">
                    {p.estadoGrau ? `Grau ${p.estadoGrau} de A a C` : "Lacrado, com nota fiscal"}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-[13.5px] text-white/70">
                {p.estadoGrau
                  ? GRAU_DESCRICAO[p.estadoGrau]
                  : "Item novo, sem uso, com garantia do fabricante além da garantia da loja."}
              </p>

              {p.estadoObservacoes.length > 0 && (
                <ul className="mt-5 border-t border-line">
                  {p.estadoObservacoes.map((o) => (
                    <li
                      key={o}
                      className="flex gap-3 border-b border-line py-2.5 text-[12.5px] text-white/60"
                    >
                      <span aria-hidden className="font-mono text-accent">
                        ·
                      </span>
                      {o}
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-5 text-[12.5px] text-white/45">
                Você pode conferir o produto pessoalmente na loja antes de fechar. Sem
                compromisso e sem taxa.
              </p>
            </section>
          </div>
        </div>

        {/* Revisão executada */}
        <section className="border-t border-line">
          <div className="flex items-baseline gap-3 border-b border-line px-4 py-4 md:px-6">
            <span className="font-mono text-[11px] text-accent">04</span>
            <h2 className="eyebrow text-white/45">
              {p.condicao === "novo" ? "O que garantimos" : "Revisão executada na bancada"}
            </h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {revisao.map((r, i) => (
              <li
                key={r}
                className={`flex items-start gap-3 border-b border-line px-4 py-3.5 text-[12.5px] text-white/65 md:px-6 ${
                  i % 2 === 0 ? "sm:border-r sm:border-line" : ""
                } ${i % 3 !== 2 ? "lg:border-r lg:border-line" : "lg:border-r-0"}`}
              >
                <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 bg-accent" />
                {r}
              </li>
            ))}
          </ul>
        </section>

        {/* Ficha técnica completa */}
        {p.ficha.length > 0 && (
          <section className="border-t border-line">
            <div className="flex items-baseline gap-3 border-b border-line px-4 py-4 md:px-6">
              <span className="font-mono text-[11px] text-accent">05</span>
              <h2 className="eyebrow text-white/45">Especificação completa</h2>
            </div>

            <dl className="grid grid-cols-1 lg:grid-cols-2">
              {[...p.ficha, { rotulo: "Código do produto", valor: p.codigo }].map(
                (item, i, todos) => (
                  <div
                    key={item.rotulo}
                    className={`grid grid-cols-[minmax(96px,150px)_1fr] border-b border-line ${
                      i % 2 === 0 && i < todos.length - 1 ? "lg:border-r lg:border-line" : ""
                    }`}
                  >
                    <dt className="border-r border-line px-4 py-3 font-mono text-[9.5px] tracking-[0.14em] text-white/35 uppercase md:px-6">
                      {item.rotulo}
                    </dt>
                    <dd className="px-4 py-3 font-mono text-[11.5px] text-white/80 md:px-6">
                      {item.valor}
                    </dd>
                  </div>
                ),
              )}
            </dl>
          </section>
        )}

        {/* Garantia */}
        <section className="grid grid-cols-1 border-b border-line md:grid-cols-3">
          {[
            [
              "Garantia",
              `${p.garantiaDias} dias`,
              "Cobre peça e mão de obra do que foi revisado. Defeito coberto é resolvido na loja, sem custo.",
            ],
            [
              "Nota fiscal",
              "Emitida sempre",
              "O produto sai com nota, o que vale para reembolso de empresa e para a garantia.",
            ],
            [
              "Troca",
              "7 dias",
              "Direito de arrependimento em compra à distância, conforme o Código de Defesa do Consumidor.",
            ],
          ].map(([k, v, texto], i) => (
            <div
              key={k}
              className={`border-line p-4 md:p-6 ${i < 2 ? "border-b md:border-r md:border-b-0" : ""}`}
            >
              <p className="eyebrow text-white/35">{k}</p>
              <p className="display mt-3 text-[1.8rem] leading-none text-accent">{v}</p>
              <p className="mt-3 max-w-[34ch] text-[12.5px] text-white/55">{texto}</p>
            </div>
          ))}
        </section>

        {relacionados.length > 0 && (
          <section>
            <div className="flex items-baseline gap-3 border-b border-line px-4 py-4 md:px-6">
              <span className="font-mono text-[11px] text-accent">06</span>
              <h2 className="eyebrow text-white/45">Preço parecido</h2>
            </div>
            <ul className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((o) => (
                <li key={o.id}>
                  <ProductCard p={o} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {/* Ação fixa no celular, com o preço sempre à vista */}
      <div className="h-16 md:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-line bg-ink md:hidden">
        <div className="flex flex-col justify-center border-r border-line px-4 py-2">
          <span className="font-mono text-[9px] tracking-[0.14em] text-white/35 uppercase">
            {p.codigo}
          </span>
          <span className="font-mono text-[15px] leading-tight font-bold">{preco(p.preco)}</span>
        </div>
        <a
          href={waProduto(p)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center bg-accent font-mono text-[11px] font-bold tracking-[0.16em] text-black uppercase"
        >
          Reservar no WhatsApp
        </a>
      </div>

      <script
        type="application/ld+json"
        // Dados vêm do catálogo da loja, não de entrada do visitante.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(produtoLd) }}
      />
    </>
  );
}
