import type { Metadata } from "next";
import { CatalogoBrowser } from "@/components/catalogo-browser";
import { CtaPanel } from "@/components/cta-panel";
import { listarNotebooks } from "@/lib/catalogo";
import { preco } from "@/lib/format";
import { waGenerico } from "@/lib/whatsapp";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Notebooks corporativos seminovos",
  description:
    "Dell Latitude, Lenovo ThinkPad, HP EliteBook e Acer TravelMate revisados, com estado declarado e 90 dias de garantia. Estoque em Sete Lagoas/MG.",
  alternates: { canonical: "/notebooks" },
};

export default async function NotebooksPage() {
  const itens = await listarNotebooks();
  const precos = itens.map((p) => p.preco);
  const faixa = precos.length
    ? `${preco(Math.min(...precos))} a ${preco(Math.max(...precos))}`
    : "sob consulta";

  return (
    <>
      <section className="mx-auto max-w-[1180px] px-5 pt-32 pb-12 md:pt-40 md:pb-16">
        <p className="eyebrow text-accent">Notebooks seminovos</p>
        <h1 className="display mt-5 max-w-[16ch] text-title">Máquina de empresa, revisada item a item</h1>
        <p className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-white/60">
          Chassi reforçado, teclado melhor e peça de reposição fácil de achar. Cada aparelho passa por teste de disco, memória, bateria, tela e portas antes de entrar na lista.
        </p>
      </section>
      <section className="mx-auto max-w-[1180px] px-5 pb-20">
        <CatalogoBrowser itens={itens} />
      </section>

      <section className="mx-auto max-w-[1180px] px-5 pb-20 md:pb-28">
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="card p-6 md:p-8">
            <p className="eyebrow text-white/35">Não achou a configuração</p>
            <p className="display mt-4 max-w-[20ch] text-sub">
              Chega estoque novo toda semana e nem tudo é anunciado
            </p>
            <p className="mt-4 max-w-[54ch] text-[14px] leading-relaxed text-white/55">
              Diga processador, memória e faixa de preço que você procura. Avisamos assim que entrar algo compatível — e avaliamos o seu notebook antigo como parte do pagamento.
            </p>
          </div>
          <CtaPanel
            etiqueta="Encomenda"
            titulo="Diga a configuração que você procura"
            acao="Mandar no WhatsApp"
            href={waGenerico("procuro um notebook específico")}
          />
        </div>
      </section>
    </>
  );
}
