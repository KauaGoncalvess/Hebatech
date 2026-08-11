import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { site } from "@/data/site";
import { buscarPorId } from "@/lib/catalogo";
import { preco } from "@/lib/format";
import { resumoTecnico, rotuloCategoria } from "@/types/produto";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Etiqueta",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ id: string }> };

/**
 * Etiqueta para colar no aparelho na vitrine. O cliente aponta a câmera e cai
 * na ficha completa — estado, revisão e garantia — sem precisar chamar ninguém.
 *
 * Sai do layout do painel de propósito: é uma folha para imprimir.
 */
export default async function EtiquetaPage({ params }: Props) {
  const { id } = await params;
  const produto = await buscarPorId(id);
  if (!produto) notFound();

  const destino = `${site.url}/produtos/${produto.slug}`;

  // SVG em vez de PNG: imprime nítido em qualquer tamanho.
  const qr = await QRCode.toString(destino, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#0000" },
  });

  const resumo = resumoTecnico(produto);

  return (
    <div className="min-h-screen bg-white p-6 text-black print:p-0">
      <div className="mx-auto max-w-[640px]">
        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <Link
            href={`/admin/produtos/${produto.id}`}
            className="rounded-full bg-black/5 px-5 py-3 font-mono text-rotulo tracking-[0.12em] uppercase"
          >
            ← Voltar
          </Link>
          <p className="font-mono text-rotulo text-black/50">
            Use o Ctrl+P do navegador para imprimir esta folha.
          </p>
        </div>

        {/* A etiqueta em si */}
        <div className="mt-6 flex gap-6 rounded-2xl border-2 border-black p-6 print:mt-0 print:rounded-none">
          <div className="w-[168px] shrink-0">
            {/* SVG gerado no servidor a partir do endereço do produto. */}
            <div
              aria-hidden
              className="h-[168px] w-[168px] [&>svg]:h-full [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
            <p className="mt-3 text-center font-mono text-rotulo tracking-[0.1em] uppercase">
              Aponte a câmera
            </p>
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-mono text-rotulo tracking-[0.14em] uppercase">
              {produto.marca} · {rotuloCategoria(produto.categoria)}
            </p>
            <p className="mt-1 text-[26px] leading-[1.05] font-bold">{produto.modelo}</p>

            {resumo.length > 0 && (
              <p className="mt-3 font-mono text-nota leading-relaxed">
                {resumo.join(" · ")}
              </p>
            )}

            <p className="mt-4 text-[30px] leading-none font-bold">
              {preco(produto.preco)}
            </p>
            <p className="mt-1 font-mono text-rotulo">
              {produto.condicao === "novo" ? "Novo" : "Seminovo"}
              {produto.estadoGrau ? ` · grau ${produto.estadoGrau}` : ""} ·{" "}
              {produto.garantiaDias} dias de garantia
            </p>

            <p className="mt-4 font-mono text-rotulo tracking-[0.1em] uppercase">
              {produto.codigo} · {site.nome}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
