import Link from "next/link";
import { listarProdutos } from "@/lib/catalogo";
import { preco } from "@/lib/format";
import { CATEGORIAS } from "@/types/produto";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const produtos = await listarProdutos();
  const aVenda = produtos.filter((p) => p.disponivel);
  const semFoto = aVenda.filter((p) => p.fotos.length === 0);
  const valorEstoque = aVenda.reduce((soma, p) => soma + p.preco, 0);

  const porCategoria = CATEGORIAS.map((c) => ({
    ...c,
    total: aVenda.filter((p) => p.categoria === c.id).length,
  })).filter((c) => c.total > 0);

  return (
    <>
      <section className="border-b border-line px-4 py-10 md:px-6 md:py-14">
        <p className="eyebrow text-accent">Painel</p>
        <h1 className="display mt-4 text-title">Catálogo</h1>
        <p className="mt-5 max-w-[54ch] text-[13.5px] text-white/55">
          Tudo que está aqui aparece no site. Ao salvar, a página do produto e as
          listas são atualizadas na hora — não precisa publicar nada.
        </p>
      </section>

      <dl className="grid grid-cols-2 border-b border-line lg:grid-cols-4">
        {[
          [`${aVenda.length}`, "à venda", "produtos visíveis no site"],
          [`${produtos.length - aVenda.length}`, "fora do ar", "vendidos ou pausados"],
          [`${semFoto.length}`, "sem foto", "usando o desenho técnico"],
          [preco(valorEstoque), "em estoque", "soma dos preços anunciados"],
        ].map(([num, unidade, texto], i) => (
          <div
            key={unidade}
            className={`border-line p-4 md:p-6 ${i < 2 ? "border-b lg:border-b-0" : ""} ${
              i % 2 === 0 ? "border-r" : ""
            } ${i === 2 ? "lg:border-r" : ""}`}
          >
            <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="display text-[clamp(2rem,5vw,3.4rem)] leading-[0.8] text-accent">
                {num}
              </span>
              <span className="font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
                {unidade}
              </span>
            </dt>
            <dd className="mt-3 text-[12.5px] text-white/50">{texto}</dd>
          </div>
        ))}
      </dl>

      {porCategoria.length > 0 && (
        <section className="border-b border-line">
          <p className="eyebrow border-b border-line px-4 py-3 text-white/35 md:px-6">
            Por categoria
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {porCategoria.map((c, i) => (
              <li
                key={c.id}
                className={`border-line p-4 ${i < porCategoria.length - 1 ? "border-r" : ""} border-b sm:border-b-0`}
              >
                <p className="font-mono text-[10px] tracking-[0.14em] text-white/35 uppercase">
                  {c.rotulo}
                </p>
                <p className="display mt-2 text-[1.8rem] leading-none">{c.total}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2">
        <Link
          href="/admin/produtos"
          className="group flex items-center justify-between border-b border-line p-6 transition-colors hover:bg-surface md:border-r md:border-b-0 md:p-8"
        >
          <span>
            <span className="eyebrow text-white/35">Gerenciar</span>
            <span className="display mt-3 block text-sub">Lista de produtos</span>
            <span className="mt-2 block text-[12.5px] text-white/45">
              Editar preço, trocar foto, tirar do ar
            </span>
          </span>
          <span aria-hidden className="font-mono text-lg text-white/30 group-hover:text-accent">
            →
          </span>
        </Link>

        <Link
          href="/admin/produtos/novo"
          className="group flex items-center justify-between p-6 transition-colors hover:bg-surface md:p-8"
        >
          <span>
            <span className="eyebrow text-accent">Cadastrar</span>
            <span className="display mt-3 block text-sub">Novo produto</span>
            <span className="mt-2 block text-[12.5px] text-white/45">
              Notebook, PC montado, monitor, peça ou periférico
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
