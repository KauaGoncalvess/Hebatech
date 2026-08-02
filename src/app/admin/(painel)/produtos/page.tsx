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
        <p className="border-b border-accent bg-accent px-4 py-3 font-mono text-[11px] tracking-[0.14em] text-black uppercase md:px-6">
          {ok ? "Produto salvo. Já está no ar." : "Produto excluído."}
        </p>
      )}

      <section className="flex flex-wrap items-end justify-between gap-4 border-b border-line px-4 py-8 md:px-6 md:py-10">
        <div>
          <p className="eyebrow text-accent">Catálogo</p>
          <h1 className="display mt-3 text-title">Produtos</h1>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex h-12 items-center bg-accent px-6 font-mono text-[11.5px] font-bold tracking-[0.16em] text-black uppercase transition-colors hover:bg-white"
        >
          Cadastrar produto
        </Link>
      </section>

      {produtos.length === 0 ? (
        <div className="px-4 py-20 text-center md:px-6">
          <p className="display text-sub">Nenhum produto cadastrado</p>
          <p className="mx-auto mt-4 max-w-[44ch] text-[13px] text-white/55">
            Rode <code className="font-mono text-accent">npm run seed</code> para subir o
            catálogo inicial, ou cadastre o primeiro produto pelo botão acima.
          </p>
        </div>
      ) : (
        <>
          <p className="eyebrow border-b border-line px-4 py-3 text-white/35 md:px-6">
            À venda · {aVenda.length}
          </p>
          <ul>
            {aVenda.map((p) => (
              <LinhaProduto key={p.id} p={p} />
            ))}
          </ul>

          {foraDoAr.length > 0 && (
            <>
              <p className="eyebrow border-y border-line px-4 py-3 text-white/35 md:px-6">
                Fora do ar · {foraDoAr.length}
              </p>
              <ul>
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
