import type { Metadata } from "next";
import Link from "next/link";
import { CatalogoBrowser } from "@/components/catalogo-browser";
import { CtaPanel } from "@/components/cta-panel";
import { listarOutrosProdutos } from "@/lib/catalogo";
import { preco } from "@/lib/format";
import { waGenerico } from "@/lib/whatsapp";
import { CATEGORIAS } from "@/types/produto";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Produtos à venda — desktops, monitores, peças e periféricos",
  description:
    "PC montado, monitor, SSD, memória, dock station e periférico com nota fiscal e garantia. Loja física em Sete Lagoas/MG, retirada no balcão.",
  alternates: { canonical: "/produtos" },
};

export default async function ProdutosPage() {
  const itens = await listarOutrosProdutos();
  const precos = itens.map((p) => p.preco);
  const faixa = precos.length
    ? `${preco(Math.min(...precos))} a ${preco(Math.max(...precos))}`
    : "sob consulta";

  const presentes = CATEGORIAS.filter((c) => itens.some((p) => p.categoria === c.id));

  return (
    <>
      <section className="mx-auto max-w-[1180px] px-5 pt-32 pb-12 md:pt-40 md:pb-16">
        <p className="eyebrow text-accent">Produtos à venda</p>
        <h1 className="display mt-5 max-w-[16ch] text-title">PC montado, monitor, peça e periférico</h1>
        <p className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-white/60">
          O que sai do balcão além de notebook. Peça nova vem com nota fiscal e garantia de fábrica; item seminovo passa pela mesma revisão de bancada. Upgrade de SSD e memória já sai com instalação inclusa.
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
        <CatalogoBrowser itens={itens} filtrarCategoria />
      </section>

      <section className="mx-auto max-w-[1180px] px-5 pb-20 md:pb-28">
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="card p-6 md:p-8">
            <p className="eyebrow text-white/35">Montagem sob medida</p>
            <p className="display mt-4 max-w-[20ch] text-sub">
              Diga o uso e a faixa de preço que montamos a configuração
            </p>
            <p className="mt-4 max-w-[54ch] text-[14px] leading-relaxed text-white/55">
              PC para jogo, edição, escritório ou ponto de venda. Fechamos a lista de peças com preço item a item, você aprova e a máquina sai montada, testada e com o sistema instalado. <Link href="/notebooks" className="text-accent underline underline-offset-4">
                Se procura notebook, o estoque está aqui
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
