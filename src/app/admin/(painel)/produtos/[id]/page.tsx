import Link from "next/link";
import { notFound } from "next/navigation";
import { DuplicarButton } from "@/components/admin/duplicar-button";
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
      <section className="flex flex-wrap items-end justify-between gap-4 py-7 md:py-9">
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
            className="mt-4 inline-block font-mono text-rotulo text-texto-3 underline underline-offset-4 transition-colors hover:text-accent"
          >
            Ver no site: /produtos/{produto.slug}
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/etiqueta/${produto.id}`}
            className="flex h-11 items-center rounded-full bg-surface-2 px-5 font-mono text-rotulo tracking-[0.12em] text-texto-3 uppercase transition-colors hover:bg-surface-3 hover:text-white"
          >
            Etiqueta
          </Link>
          <a
            href={`/admin/post/${produto.id}`}
            download={`${produto.slug}.png`}
            className="flex h-11 items-center rounded-full bg-surface-2 px-5 font-mono text-rotulo tracking-[0.12em] text-texto-3 uppercase transition-colors hover:bg-surface-3 hover:text-white"
          >
            Post do Instagram
          </a>
          <DuplicarButton id={produto.id} />
          <ExcluirButton id={produto.id} nome={`${produto.marca} ${produto.modelo}`} />
        </div>
      </section>

      <ProdutoForm produto={produto} />
    </>
  );
}
