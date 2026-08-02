import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { ProductRender } from "@/components/product-render";
import { ProductCard } from "@/components/product-card";
import {
  buscarPorSlug,
  notebooks,
  notebooksDisponiveis,
  type Notebook,
} from "@/data/notebooks";
import { site } from "@/data/site";
import { armazenamento, parcela, preco } from "@/lib/format";
import { waNotebook } from "@/lib/whatsapp";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return notebooks.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const n = buscarPorSlug(slug);
  if (!n) return { title: "Aparelho não encontrado" };

  const titulo = `${n.marca} ${n.modelo} — ${n.cpu.familia.toUpperCase()} / ${n.ramGb} GB / ${armazenamento(n.armazenamentoGb)}`;
  return {
    title: titulo,
    description: `${titulo} seminovo por ${preco(n.preco)}. ${n.estado.resumo} Garantia de ${n.garantiaDias} dias. Estoque em ${site.endereco.cidade}/${site.endereco.uf}.`,
    alternates: { canonical: `/notebooks/${n.slug}` },
  };
}

/** Roteiro de bancada aplicado em todo aparelho antes de entrar no estoque. */
const REVISAO = [
  "Teste de disco (SMART) e de memória",
  "Medição da saúde real da bateria",
  "Teste de tela: pixel morto, mancha e uniformidade",
  "Teste de portas, Wi-Fi, som, câmera e teclado",
  "Limpeza interna e troca de pasta térmica",
  "Windows 11 Pro instalado e ativado",
];

const GRAU_DESCRICAO: Record<Notebook["estado"]["grau"], string> = {
  A: "Mínimo sinal de uso. Sem trinca, sem amassado e sem defeito estético relevante.",
  B: "Funcionamento pleno com desgaste estético visível, descrito na lista abaixo.",
  C: "Marcas acentuadas de uso. Preço reflete o estado; funcionamento testado e garantido.",
};

export default async function NotebookPage({ params }: Params) {
  const { slug } = await params;
  const n = buscarPorSlug(slug);
  if (!n) notFound();

  const ficha: [string, string][] = [
    ["Processador", `${n.cpu.nome} · ${n.cpu.nucleos} núcleos / ${n.cpu.threads} threads`],
    ["Clock", `${n.cpu.clockBase} base · ${n.cpu.clockTurbo} turbo`],
    ["Memória", `${n.ramGb} GB ${n.ramTipo}`],
    ["Expansão de memória", n.ramSlots],
    ["Armazenamento", `${armazenamento(n.armazenamentoGb)} ${n.armazenamentoTipo}`],
    ["Expansão de disco", n.armazenamentoLivre],
    [
      "Tela",
      `${n.tela.polegadas}" ${n.tela.resolucao} ${n.tela.painel} · ${n.tela.acabamento}`,
    ],
    ["Vídeo", n.video],
    ["Bateria", `${n.bateria.tipo} · ${n.bateria.saudePct}% de saúde · ${n.bateria.autonomia}`],
    ["Teclado", n.teclado],
    ["Rede", n.rede],
    ["Conexões", n.portas.join(" · ")],
    ["Sistema", n.sistema],
    ["Peso", `${n.pesoKg.toFixed(2)} kg`],
    ["Garantia", `${n.garantiaDias} dias na loja, cobrindo peça e mão de obra`],
    ["Código do produto", n.codigo],
  ];

  const relacionados = notebooksDisponiveis
    .filter((o) => o.codigo !== n.codigo)
    .sort((a, b) => Math.abs(a.preco - n.preco) - Math.abs(b.preco - n.preco))
    .slice(0, 3);

  const produtoLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${n.marca} ${n.modelo}`,
    sku: n.codigo,
    brand: { "@type": "Brand", name: n.marca },
    description: `${n.cpu.nome}, ${n.ramGb} GB de RAM, ${armazenamento(n.armazenamentoGb)} ${n.armazenamentoTipo}, tela ${n.tela.polegadas}" ${n.tela.resolucao}. ${n.estado.resumo}`,
    itemCondition: "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: n.preco,
      availability: n.disponivel
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${site.url}/notebooks/${n.slug}`,
    },
  };

  return (
    <>
      <nav
        aria-label="Trilha"
        className="mx-auto flex max-w-[1600px] items-center gap-2 border-b border-line px-4 py-3 font-mono text-[10px] tracking-[0.14em] text-white/35 uppercase md:px-6"
      >
        <Link href="/notebooks" className="transition-colors hover:text-accent">
          Notebooks
        </Link>
        <span aria-hidden>/</span>
        <span className="text-white/70">{n.codigo}</span>
      </nav>

      <article className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Imagem */}
          <div className="border-b border-line lg:col-span-7 lg:border-r lg:border-b-0">
            <div className="lg:sticky lg:top-[65px]">
              <ProductGallery fotos={n.fotos} alt={`${n.marca} ${n.modelo}`}>
                <ProductRender
                  codigo={n.codigo}
                  marca={n.marca}
                  polegadas={n.tela.polegadas}
                  variante="detalhe"
                  className="aspect-[16/10] w-full"
                />
              </ProductGallery>

              <ul className="grid grid-cols-3 border-t border-line">
                {[
                  ["Peso", `${n.pesoKg.toFixed(2)} kg`],
                  ["Tela", `${n.tela.polegadas}"`],
                  ["Bateria", `${n.bateria.saudePct}%`],
                ].map(([k, v], i) => (
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
                <p className="eyebrow text-accent">{n.marca}</p>
                <span className="font-mono text-[10px] tracking-[0.16em] text-white/35">
                  COD {n.codigo}
                </span>
              </div>

              <h1 className="display mt-4 text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[0.9]">
                {n.modelo}
              </h1>

              <p className="mt-4 font-mono text-[12.5px] text-white/60">
                {n.cpu.nome} · {n.ramGb} GB · {armazenamento(n.armazenamentoGb)}{" "}
                {n.armazenamentoTipo.split(" ")[1]} · {n.tela.polegadas}&quot;{" "}
                {n.tela.resolucao}
              </p>
            </div>

            <div className="border-y border-line px-4 py-5 md:px-6">
              {n.precoReferencia && (
                <p className="font-mono text-[11px] text-white/35 line-through">
                  {preco(n.precoReferencia)}
                </p>
              )}
              <p className="display mt-1 text-[clamp(2.4rem,7vw,3.4rem)] leading-none">
                {preco(n.preco)}
              </p>
              <p className="mt-3 font-mono text-[11px] text-white/50">
                à vista no Pix · ou 10x de {parcela(n.preco)} sem juros no cartão
              </p>
            </div>

            <a
              href={waNotebook(n)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center justify-between gap-4 bg-accent px-4 py-5 text-black transition-colors hover:bg-white md:flex md:px-6"
            >
              <span>
                <span className="block font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
                  WhatsApp
                </span>
                <span className="display mt-1 block text-[1.7rem] leading-none">
                  Reservar {n.codigo}
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
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent font-mono text-[13px] font-bold text-accent">
                  {n.estado.grau}
                </span>
                <div>
                  <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase">
                    Estado de conservação
                  </h2>
                  <p className="font-mono text-[10px] text-white/40">
                    Grau {n.estado.grau} de A a C
                  </p>
                </div>
              </div>

              <p className="mt-4 text-[13.5px] text-white/70">{GRAU_DESCRICAO[n.estado.grau]}</p>
              <p className="mt-2 text-[13.5px] text-white/70">{n.estado.resumo}</p>

              <ul className="mt-5 border-t border-line">
                {n.estado.observacoes.map((o) => (
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

              <p className="mt-5 text-[12.5px] text-white/45">
                Você pode conferir o aparelho pessoalmente na loja antes de fechar. Sem
                compromisso e sem taxa.
              </p>
            </section>
          </div>
        </div>

        {/* Revisão executada */}
        <section className="border-t border-line">
          <div className="flex items-baseline gap-3 border-b border-line px-4 py-4 md:px-6">
            <span className="font-mono text-[11px] text-accent">04</span>
            <h2 className="eyebrow text-white/45">Revisão executada na bancada</h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {REVISAO.map((r, i) => (
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
        <section className="border-t border-line">
          <div className="flex items-baseline gap-3 border-b border-line px-4 py-4 md:px-6">
            <span className="font-mono text-[11px] text-accent">05</span>
            <h2 className="eyebrow text-white/45">Especificação completa</h2>
          </div>

          <dl className="grid grid-cols-1 lg:grid-cols-2">
            {ficha.map(([k, v], i) => (
              <div
                key={k}
                className={`grid grid-cols-[minmax(96px,150px)_1fr] border-b border-line ${
                  i % 2 === 0 ? "lg:border-r lg:border-line" : ""
                }`}
              >
                <dt className="border-r border-line px-4 py-3 font-mono text-[9.5px] tracking-[0.14em] text-white/35 uppercase md:px-6">
                  {k}
                </dt>
                <dd className="px-4 py-3 font-mono text-[11.5px] text-white/80 md:px-6">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Garantia */}
        <section className="grid grid-cols-1 border-b border-line md:grid-cols-3">
          {[
            [
              "Garantia",
              `${n.garantiaDias} dias`,
              "Cobre peça e mão de obra do que foi revisado. Defeito coberto é resolvido na loja, sem custo.",
            ],
            [
              "Nota fiscal",
              "Emitida sempre",
              "O aparelho sai com nota, o que vale para reembolso de empresa e para a garantia.",
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

        {/* Aparelhos de preço próximo */}
        <section>
          <div className="flex items-baseline gap-3 border-b border-line px-4 py-4 md:px-6">
            <span className="font-mono text-[11px] text-accent">06</span>
            <h2 className="eyebrow text-white/45">Preço parecido</h2>
          </div>
          <ul className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((o, i) => (
              <li key={o.codigo}>
                <ProductCard n={o} indice={i + 1} />
              </li>
            ))}
          </ul>
        </section>
      </article>

      {/* Ação fixa no celular, com o preço sempre à vista */}
      <div className="h-16 md:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-line bg-ink md:hidden">
        <div className="flex flex-col justify-center border-r border-line px-4 py-2">
          <span className="font-mono text-[9px] tracking-[0.14em] text-white/35 uppercase">
            {n.codigo}
          </span>
          <span className="font-mono text-[15px] leading-tight font-bold">
            {preco(n.preco)}
          </span>
        </div>
        <a
          href={waNotebook(n)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center bg-accent font-mono text-[11px] font-bold tracking-[0.16em] text-black uppercase"
        >
          Reservar no WhatsApp
        </a>
      </div>

      <script
        type="application/ld+json"
        // Dados vêm do catálogo local, não de entrada do usuário.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(produtoLd) }}
      />
    </>
  );
}
