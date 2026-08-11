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
        <p className="mt-4 rounded-full bg-accent px-5 py-3 text-center font-mono text-rotulo tracking-[0.12em] text-black uppercase">
          {ok ? "Produto salvo. Já está no ar." : "Produto excluído."}
        </p>
      )}

      <section className="flex flex-wrap items-end justify-between gap-4 py-7 md:py-9">
        <div>
          <h1 className="display text-[clamp(1.9rem,6vw,2.8rem)] leading-none">Produtos</h1>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="toque rounded-full bg-accent px-7 font-mono text-rotulo font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-accent-hover"
        >
          Cadastrar produto
        </Link>
      </section>

      {produtos.length === 0 ? (
        <div className="card px-6 py-20 text-center">
          <p className="display text-sub">Nenhum produto cadastrado</p>
          <p className="mx-auto mt-4 max-w-[46ch] text-nota leading-relaxed text-texto-3">
            Cadastre o primeiro pelo botão acima. Enquanto não houver nenhum, a vitrine
            do site avisa que está em renovação e manda quem entrar para o WhatsApp.
          </p>
        </div>
      ) : (
        <>
          <p className="eyebrow mb-4 text-texto-3">À venda · {aVenda.length}</p>
          <ul className="grid gap-3">
            {aVenda.map((p) => (
              <LinhaProduto key={p.id} p={p} />
            ))}
          </ul>

          {foraDoAr.length > 0 && (
            <>
              <p className="eyebrow mt-10 mb-4 text-texto-3">Fora do ar · {foraDoAr.length}</p>
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
