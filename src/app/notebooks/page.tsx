import type { Metadata } from "next";
import { CtaPanel } from "@/components/cta-panel";
import { NotebooksBrowser } from "@/components/notebooks-browser";
import { faixaPrecoCatalogo, notebooksDisponiveis } from "@/data/notebooks";
import { preco } from "@/lib/format";
import { waGenerico } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Notebooks corporativos seminovos",
  description:
    "Dell Latitude, Lenovo ThinkPad, HP EliteBook e Acer TravelMate revisados, com estado declarado e 90 dias de garantia. Estoque em Sete Lagoas/MG.",
};

export default function NotebooksPage() {
  return (
    <>
      <section className="mx-auto max-w-[1600px] border-b border-line">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="px-4 pt-10 pb-8 md:px-6 md:pt-16 lg:col-span-7 lg:border-r lg:border-line">
            <p className="eyebrow text-accent">Estoque · atualizado à mão</p>
            <h1 className="display mt-5 text-title">
              Notebook de
              <br />
              fim de contrato,
              <br />
              revisado item a item
            </h1>
            <p className="mt-6 max-w-[52ch] text-[14px] leading-relaxed text-white/60">
              Máquina que saiu de parque empresarial: chassi reforçado, teclado melhor
              e peça de reposição fácil de achar. Cada aparelho passa por teste de
              disco, memória, bateria, tela e portas antes de entrar nesta lista.
            </p>
          </div>

          <dl className="grid grid-cols-2 border-t border-line lg:col-span-5 lg:border-t-0">
            {[
              ["Em estoque", `${notebooksDisponiveis.length} aparelhos`],
              ["Faixa de preço", `${preco(faixaPrecoCatalogo.min)} a ${preco(faixaPrecoCatalogo.max)}`],
              ["Garantia", "90 dias na loja"],
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
        <NotebooksBrowser itens={notebooksDisponiveis} />
      </section>

      <section className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="px-4 py-10 md:col-span-8 md:px-6 md:py-14 md:border-r md:border-line">
            <p className="eyebrow text-white/35">Não achou a configuração</p>
            <p className="display mt-4 text-sub">
              Chega estoque novo toda semana e nem tudo é anunciado
            </p>
            <p className="mt-4 max-w-[54ch] text-[13.5px] text-white/55">
              Diga processador, memória e faixa de preço que você procura. Avisamos
              assim que entrar algo compatível — e avaliamos o seu notebook antigo como
              parte do pagamento.
            </p>
          </div>
          <CtaPanel
            etiqueta="Encomenda"
            titulo="Diga a configuração que você procura"
            acao="Mandar no WhatsApp"
            href={waGenerico("procuro um notebook específico")}
            className="border-t border-line md:col-span-4 md:border-t-0"
          />
        </div>
      </section>
    </>
  );
}
