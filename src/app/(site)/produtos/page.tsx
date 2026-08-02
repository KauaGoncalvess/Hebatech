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
      <section className="mx-auto max-w-[1600px] border-b border-line">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="px-4 pt-10 pb-8 md:px-6 md:pt-16 lg:col-span-7 lg:border-r lg:border-line">
            <p className="eyebrow text-accent">Produtos à venda</p>
            <h1 className="display mt-5 text-title">
              PC montado,
              <br />
              monitor, peça
              <br />
              e periférico
            </h1>
            <p className="mt-6 max-w-[52ch] text-[14px] leading-relaxed text-white/60">
              O que sai do balcão além de notebook. Peça nova vem com nota fiscal e
              garantia de fábrica; item seminovo passa pela mesma revisão de bancada e
              tem o estado declarado. Upgrade de SSD e memória já sai com instalação
              inclusa no preço.
            </p>

            {presentes.length > 1 && (
              <ul className="mt-8 flex flex-wrap gap-px">
                {presentes.map((c) => (
                  <li
                    key={c.id}
                    className="border border-line px-3 py-2 font-mono text-[10.5px] tracking-[0.12em] text-white/60 uppercase"
                  >
                    {c.plural}
                    <span className="ml-2 text-accent">
                      {itens.filter((p) => p.categoria === c.id).length}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <dl className="grid grid-cols-2 border-t border-line lg:col-span-5 lg:border-t-0">
            {[
              ["Itens à venda", `${itens.length} produtos`],
              ["Faixa de preço", faixa],
              ["Peça nova", "Garantia de fábrica"],
              ["Pagamento", "Pix, débito e 10x sem juros"],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`border-line p-4 md:p-6 ${i % 2 === 0 ? "border-r" : ""} ${
                  i < 2 ? "border-b" : ""
                }`}
              >
                <dt className="eyebrow text-white/35">{k}</dt>
                <dd className="mt-2 font-mono text-[13px] text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] border-b border-line">
        <CatalogoBrowser itens={itens} filtrarCategoria />
      </section>

      <section className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="px-4 py-10 md:col-span-8 md:border-r md:border-line md:px-6 md:py-14">
            <p className="eyebrow text-white/35">Montagem sob medida</p>
            <p className="display mt-4 text-sub">
              Diga o uso e a faixa de preço que montamos a configuração
            </p>
            <p className="mt-4 max-w-[54ch] text-[13.5px] text-white/55">
              PC para jogo, edição, escritório ou ponto de venda. Fechamos a lista de
              peças com preço item a item, você aprova e a máquina sai montada, testada
              e com o sistema instalado.{" "}
              <Link href="/notebooks" className="text-accent underline underline-offset-4">
                Se procura notebook, o estoque está aqui
              </Link>
              .
            </p>
          </div>
          <CtaPanel
            etiqueta="Orçamento"
            titulo="Montar um PC para o meu uso"
            acao="Mandar no WhatsApp"
            href={waGenerico("montagem de PC sob medida")}
            className="border-t border-line md:col-span-4 md:border-t-0"
          />
        </div>
      </section>
    </>
  );
}
