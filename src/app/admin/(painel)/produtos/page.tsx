import Link from "next/link";
import { LinhaProduto } from "@/components/admin/linha-produto";
import { listarProdutos } from "@/lib/catalogo";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ ok?: string; excluido?: string }> };

export default async function ListaProdutos({ searchParams }: Props) {
  const { ok, excluido } = await searchParams;
  const produtos = await listarProdutos();

  const aVenda = produtos.filter((p) => p.disponivel);
  const foraDoAr = produtos.filter((p) => !p.disponivel);

  return (
    <>
      {(ok || excluido) && (
        <p className="mt-4 rounded-full bg-accent px-5 py-3 text-center font-mono text-[11px] tracking-[0.12em] text-black uppercase">
          {ok ? "Produto salvo. Já está no ar." : "Produto excluído."}
        </p>
      )}

      <section className="flex flex-wrap items-end justify-between gap-4 py-10 md:py-12">
        <div>
          <p className="eyebrow text-accent">Catálogo</p>
          <h1 className="display mt-3 text-title">Produtos</h1>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex h-13 items-center rounded-full bg-accent px-7 py-4 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
        >
          Cadastrar produto
        </Link>
      </section>

      {produtos.length === 0 ? (
        <div className="card px-6 py-20 text-center">
          <p className="display text-sub">Nenhum produto cadastrado</p>
          <p className="mx-auto mt-4 max-w-[44ch] text-[13px] text-white/55">
            Rode <code className="font-mono text-accent">npm run seed</code> para subir o
            catálogo inicial, ou cadastre o primeiro produto pelo botão acima.
          </p>
        </div>
      ) : (
        <>
          <p className="eyebrow mb-4 text-white/35">À venda · {aVenda.length}</p>
          <ul className="grid gap-3">
            {aVenda.map((p) => (
              <LinhaProduto key={p.id} p={p} />
            ))}
          </ul>

          {foraDoAr.length > 0 && (
            <>
              <p className="eyebrow mt-10 mb-4 text-white/35">Fora do ar · {foraDoAr.length}</p>
              <ul className="grid gap-3">
                {foraDoAr.map((p) => (
                  <LinhaProduto key={p.id} p={p} />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </>
  );
}
