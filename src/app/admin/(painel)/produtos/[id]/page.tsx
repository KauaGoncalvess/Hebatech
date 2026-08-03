import Link from "next/link";
import { notFound } from "next/navigation";
import { ExcluirButton } from "@/components/admin/excluir-button";
import { ProdutoForm } from "@/components/admin/produto-form";
import { buscarPorId } from "@/lib/catalogo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditarProduto({ params }: Props) {
  const { id } = await params;
  const produto = await buscarPorId(id);
  if (!produto) notFound();

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-4 py-10 md:py-12">
        <div>
          <p className="eyebrow text-accent">
            {produto.codigo} · {produto.disponivel ? "à venda" : "fora do ar"}
          </p>
          <h1 className="display mt-3 text-title">
            {produto.marca} {produto.modelo}
          </h1>
          <Link
            href={`/produtos/${produto.slug}`}
            target="_blank"
            className="mt-4 inline-block font-mono text-[11px] text-white/45 underline underline-offset-4 transition-colors hover:text-accent"
          >
            Ver no site: /produtos/{produto.slug}
          </Link>
        </div>
        <ExcluirButton id={produto.id} nome={`${produto.marca} ${produto.modelo}`} />
      </section>

      <ProdutoForm produto={produto} />
    </>
  );
}
