import Link from "next/link";
import { listarProdutos } from "@/lib/catalogo";
import { listarPlanos } from "@/lib/planos";
import { preco } from "@/lib/format";
import { CATEGORIAS } from "@/types/produto";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [produtos, todosOsPlanos] = await Promise.all([listarProdutos(), listarPlanos()]);
  const planos = todosOsPlanos.filter((p) => p.ativo);
  const aVenda = produtos.filter((p) => p.disponivel);
  const semFoto = aVenda.filter((p) => p.fotos.length === 0);
  const valorEstoque = aVenda.reduce((soma, p) => soma + p.preco, 0);

  const porCategoria = CATEGORIAS.map((c) => ({
    ...c,
    total: aVenda.filter((p) => p.categoria === c.id).length,
  })).filter((c) => c.total > 0);

  return (
    <>
      <section className="py-10 md:py-14">
        <p className="eyebrow text-accent">Painel</p>
        <h1 className="display mt-4 text-title">Catálogo</h1>
        <p className="mt-5 max-w-[54ch] text-[14px] leading-relaxed text-white/55">
          Tudo que está aqui aparece no site. Ao salvar, a página do produto e as
          listas são atualizadas na hora — não precisa publicar nada.
        </p>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [`${aVenda.length}`, "à venda", "produtos visíveis no site"],
          [`${produtos.length - aVenda.length}`, "fora do ar", "vendidos ou pausados"],
          [`${semFoto.length}`, "sem foto", "usando o desenho técnico"],
          [preco(valorEstoque), "em estoque", "soma dos preços anunciados"],
        ].map(([num, unidade, texto]) => (
          <div key={unidade} className="spot card p-6">
            <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="display text-[clamp(1.8rem,4vw,2.8rem)] leading-none text-accent">
                {num}
              </span>
              <span className="font-mono text-[10px] tracking-[0.14em] text-white/40 uppercase">
                {unidade}
              </span>
            </dt>
            <dd className="mt-3 text-[13px] text-white/50">{texto}</dd>
          </div>
        ))}
      </dl>

      {porCategoria.length > 0 && (
        <section className="mt-4">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {porCategoria.map((c) => (
              <li key={c.id} className="rounded-2xl bg-surface-2 p-4">
                <p className="font-mono text-[10px] tracking-[0.12em] text-white/35 uppercase">
                  {c.rotulo}
                </p>
                <p className="display mt-2 text-[1.8rem] leading-none">{c.total}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Link
          href="/admin/produtos"
          className="spot card group flex items-center justify-between p-6 transition-colors hover:bg-surface-2 lg:p-8"
        >
          <span>
            <span className="eyebrow text-white/35">Gerenciar</span>
            <span className="display mt-3 block text-sub">Lista de produtos</span>
            <span className="mt-2 block text-[13px] text-white/45">
              Editar preço, trocar foto, tirar do ar
            </span>
          </span>
          <span aria-hidden className="font-mono text-lg text-white/30 group-hover:text-accent">
            →
          </span>
        </Link>

        <Link
          href="/admin/planos"
          className="spot card group flex items-center justify-between p-6 transition-colors hover:bg-surface-2 lg:p-8"
        >
          <span>
            <span className="eyebrow text-white/35">Assistência</span>
            <span className="display mt-3 block text-sub">Manutenção mensal</span>
            <span className="mt-2 block text-[13px] text-white/45">
              {planos.length} {planos.length === 1 ? "plano publicado" : "planos publicados"}
            </span>
          </span>
          <span aria-hidden className="font-mono text-lg text-white/30 group-hover:text-accent">
            →
          </span>
        </Link>

        <Link
          href="/admin/produtos/novo"
          className="spot card group flex items-center justify-between p-6 transition-colors hover:bg-surface-2 lg:p-8"
        >
          <span>
            <span className="eyebrow text-accent">Cadastrar</span>
            <span className="display mt-3 block text-sub">Novo produto</span>
            <span className="mt-2 block text-[13px] text-white/45">
              Notebook, PC, monitor, peça ou periférico
            </span>
          </span>
          <span aria-hidden className="font-mono text-lg text-white/30 group-hover:text-accent">
            →
          </span>
        </Link>
      </div>
    </>
  );
}
