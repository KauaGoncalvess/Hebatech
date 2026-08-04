import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CatalogoBrowser } from "@/components/catalogo-browser";
import { ProdutoGrade } from "@/components/produto-grade";
import { CtaPanel } from "@/components/cta-panel";
import { listarDisponiveis } from "@/lib/catalogo";
import { waGenerico } from "@/lib/whatsapp";
import { CATEGORIAS } from "@/types/produto";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Produtos à venda — notebooks, PCs, monitores e peças",
  description:
    "Notebook corporativo revisado, PC montado, monitor, SSD, memória e periférico com nota fiscal e garantia. Loja física em Sete Lagoas/MG, retirada no balcão.",
  alternates: { canonical: "/produtos" },
};

export default async function ProdutosPage() {
  // Vitrine única: notebook também entra aqui. Antes esta página excluía
  // notebook, e quem clicava em "Produtos" atrás de um concluía que não tinha.
  const itens = await listarDisponiveis();
  const presentes = CATEGORIAS.filter((c) => itens.some((p) => p.categoria === c.id));

  return (
    <>
      <section className="mx-auto max-w-[1180px] px-5 pt-32 pb-12 md:pt-40 md:pb-16">
        <p className="eyebrow text-accent">Produtos à venda</p>
        <h1 className="display mt-5 max-w-[16ch] text-title">Tudo que sai do nosso balcão</h1>
        <p className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-white/60">
          Notebook revisado, PC montado, monitor, peça e periférico no mesmo lugar. Item novo vem com nota fiscal e garantia de fábrica; seminovo passa pela revisão completa antes de entrar na lista. Upgrade de SSD e memória já sai com instalação inclusa.
        </p>

        {presentes.length > 1 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {presentes.map((c) => (
              <li
                key={c.id}
                className="rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[11.5px] text-white/60"
              >
                {c.plural}
                <span className="ml-2 text-accent">
                  {itens.filter((p) => p.categoria === c.id).length}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mx-auto max-w-[1180px] px-5 pb-20">
        {/* O filtro lê a barra de endereço, então só existe no cliente. A
            grade do servidor é o que sai no HTML — sem ela a listagem
            chegaria vazia para o buscador. */}
        <Suspense fallback={<ProdutoGrade itens={itens} />}>
          <CatalogoBrowser itens={itens} filtrarCategoria />
        </Suspense>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 pb-20 md:pb-28">
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="card p-6 md:p-8">
            <p className="eyebrow text-white/50">Montagem sob medida</p>
            <p className="display mt-4 max-w-[20ch] text-sub">
              Diga o uso e a faixa de preço que montamos a configuração
            </p>
            <p className="mt-4 max-w-[54ch] text-[14px] leading-relaxed text-white/55">
              PC para jogo, edição, escritório ou ponto de venda. Fechamos a lista de peças com preço item a item, você aprova e a máquina sai montada, testada e com o sistema instalado. <Link href="/notebooks" className="text-accent underline underline-offset-4">
                Se procura só notebook, a vitrine é aqui
              </Link>.
            </p>
          </div>
          <CtaPanel
            etiqueta="Orçamento"
            titulo="Montar um PC para o meu uso"
            acao="Mandar no WhatsApp"
            href={waGenerico("montagem de PC sob medida")}
          />
        </div>
      </section>
    </>
  );
}
