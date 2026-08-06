import Link from "next/link";
import { listarProdutos } from "@/lib/catalogo";
import { contarOrcamentosAbertos } from "@/lib/orcamentos";
import { contarClientesPorConferir } from "@/lib/clientes";
import { contarOrdensAbertas } from "@/lib/ordens";
import { listarPlanos } from "@/lib/planos";
import { preco } from "@/lib/format";
import { CATEGORIAS } from "@/types/produto";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [produtos, todosOsPlanos, orcamentosAbertos, ordensAbertas, porConferir] =
    await Promise.all([
      listarProdutos(),
      listarPlanos(),
      contarOrcamentosAbertos(),
      contarOrdensAbertas(),
      contarClientesPorConferir(),
    ]);
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
      <section className="py-8 md:py-14">
        <p className="eyebrow text-accent">Painel</p>
        <h1 className="display mt-3 text-title md:mt-4">A loja hoje</h1>
        <p className="mt-4 max-w-[54ch] text-[14px] leading-relaxed text-white/55 md:mt-5">
          Bancada, clientes e catálogo. O que você salva aqui aparece no site na
          hora — não precisa publicar nada.
        </p>
      </section>

      <dl className="grid grid-cols-2 gap-2.5 md:gap-4 lg:grid-cols-4">
        {[
          [`${aVenda.length}`, "à venda", "produtos visíveis no site"],
          [`${produtos.length - aVenda.length}`, "fora do ar", "vendidos ou pausados"],
          [`${semFoto.length}`, "sem foto", "usando o desenho técnico"],
          [preco(valorEstoque), "em estoque", "soma dos preços anunciados"],
        ].map(([num, unidade, texto]) => (
          <div key={unidade} className="spot card p-4 md:p-6">
            <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="display text-[clamp(1.6rem,7vw,2.8rem)] leading-none text-accent">
                {num}
              </span>
              <span className="font-mono text-[10px] tracking-[0.14em] text-white/40 uppercase">
                {unidade}
              </span>
            </dt>
            <dd className="mt-2 text-[12px] leading-snug text-white/50 md:mt-3 md:text-[13px]">{texto}</dd>
          </div>
        ))}
      </dl>

      {porCategoria.length > 0 && (
        <section className="mt-2.5 md:mt-4">
          <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6 md:gap-3">
            {porCategoria.map((c) => (
              <li key={c.id} className="rounded-2xl bg-surface-2 p-3 md:p-4">
                <p className="font-mono text-[10px] tracking-[0.12em] text-white/35 uppercase">
                  {c.rotulo}
                </p>
                <p className="display mt-1.5 text-[1.5rem] leading-none md:mt-2 md:text-[1.8rem]">{c.total}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-2.5 grid gap-2.5 md:mt-4 md:gap-4 md:grid-cols-2 2xl:grid-cols-3">
        <Link
          href="/admin/ordens"
          className="spot card group flex items-center justify-between gap-3 p-5 transition-colors hover:bg-surface-2 md:p-6 lg:p-8"
        >
          <span>
            <span className="eyebrow text-accent">Bancada</span>
            <span className="display mt-3 block text-sub">Ordens de serviço</span>
            <span className="mt-2 block text-[13px] text-white/45">
              {ordensAbertas === null
                ? "Rode o SQL novo para começar a usar"
                : ordensAbertas === 0
                  ? "Nenhum aparelho na bancada"
                  : `${ordensAbertas} em andamento`}
            </span>
          </span>
          <span aria-hidden className="font-mono text-lg text-white/30 group-hover:text-accent">
            →
          </span>
        </Link>

        <Link
          href="/admin/clientes"
          className="spot card group flex items-center justify-between gap-3 p-5 transition-colors hover:bg-surface-2 md:p-6 lg:p-8"
        >
          <span>
            <span className="eyebrow text-white/35">Cadastro</span>
            <span className="display mt-3 block text-sub">Clientes</span>
            <span className="mt-2 block text-[13px] text-white/45">
              {porConferir === null
                ? "Rode o SQL novo para começar a usar"
                : porConferir === 0
                  ? "Histórico de serviço por pessoa"
                  : `${porConferir} pré-cadastro${porConferir === 1 ? "" : "s"} por conferir`}
            </span>
          </span>
          <span aria-hidden className="font-mono text-lg text-white/30 group-hover:text-accent">
            →
          </span>
        </Link>

        <Link
          href="/admin/orcamentos"
          className="spot card group flex items-center justify-between gap-3 p-5 transition-colors hover:bg-surface-2 md:p-6 lg:p-8"
        >
          <span>
            <span className="eyebrow text-accent">Chegou pelo site</span>
            <span className="display mt-3 block text-sub">Pedidos de orçamento</span>
            <span className="mt-2 block text-[13px] text-white/45">
              {orcamentosAbertos === null
                ? "Rode o SQL novo para começar a guardar"
                : orcamentosAbertos === 0
                  ? "Nenhum esperando retorno"
                  : `${orcamentosAbertos} esperando retorno`}
            </span>
          </span>
          <span aria-hidden className="font-mono text-lg text-white/30 group-hover:text-accent">
            →
          </span>
        </Link>

        <Link
          href="/admin/produtos"
          className="spot card group flex items-center justify-between gap-3 p-5 transition-colors hover:bg-surface-2 md:p-6 lg:p-8"
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
          className="spot card group flex items-center justify-between gap-3 p-5 transition-colors hover:bg-surface-2 md:p-6 lg:p-8"
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
          className="spot card group flex items-center justify-between gap-3 p-5 transition-colors hover:bg-surface-2 md:p-6 lg:p-8"
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
