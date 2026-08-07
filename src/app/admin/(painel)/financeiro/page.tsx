import Link from "next/link";
import { LinhaLancamento } from "@/components/admin/linha-lancamento";
import { listarLancamentos, porCategoriaNoMes, resumoDoMes } from "@/lib/financeiro";
import { preco } from "@/lib/format";
import { inicioDoMes, rotuloCategoria } from "@/types/lancamento";

export const dynamic = "force-dynamic";

const mesPorExtenso = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  timeZone: "America/Sao_Paulo",
});

export default async function FinanceiroPage() {
  const [lancamentos, resumo, categorias] = await Promise.all([
    listarLancamentos(),
    resumoDoMes(),
    porCategoriaNoMes(),
  ]);

  const inicio = inicioDoMes();
  const abertos = lancamentos.filter((l) => !l.pagoEm);
  const doMes = lancamentos.filter((l) => l.pagoEm && l.pagoEm >= inicio);
  const mes = mesPorExtenso.format(new Date());

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-4 py-10 md:py-12">
        <div>
          <p className="eyebrow text-accent">Caixa</p>
          <h1 className="display mt-3 text-title">Financeiro</h1>
          <p className="mt-4 max-w-[52ch] text-[13.5px] leading-relaxed text-white/55">
            O que entrou, o que saiu e o que ainda está para receber. Ordem
            marcada como entregue entra aqui sozinha.
          </p>
        </div>
        <Link
          href="/admin/financeiro/novo"
          className="flex h-13 items-center justify-center rounded-full bg-accent px-7 font-mono text-[11.5px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
        >
          Lançar
        </Link>
      </section>

      {resumo === null ? (
        <p className="card px-6 py-10 text-center text-[13px] text-white/55">
          O financeiro ainda não foi ligado no banco. Rode o{" "}
          <span className="font-mono text-white/70">supabase/schema.sql</span> de novo
          para criar a tabela do caixa.
        </p>
      ) : (
        <>
          {/*
            A cor separa dinheiro que entra de dinheiro que sai, para o dono
            ler a linha sem precisar decorar a ordem dos cartões: laranja é o
            que soma, branco apagado é o que subtrai. Saldo negativo entra como
            saída, porque é isso que ele é.
          */}
          <dl className="grid grid-cols-2 gap-2.5 md:gap-4 lg:grid-cols-4">
            {[
              {
                num: preco(resumo.entradasDoMes),
                unidade: `entrou em ${mes}`,
                texto: "só o que foi recebido",
                soma: true,
              },
              {
                num: preco(resumo.saidasDoMes),
                unidade: `saiu em ${mes}`,
                texto: "peça, fixo e retirada",
                soma: false,
              },
              {
                num: preco(resumo.saldoDoMes),
                unidade: "sobrou no mês",
                texto: resumo.saldoDoMes >= 0 ? "entradas menos saídas" : "no vermelho",
                soma: resumo.saldoDoMes >= 0,
              },
              {
                num: preco(resumo.aReceber),
                unidade: "a receber",
                texto:
                  resumo.aReceberVencido > 0
                    ? `${preco(resumo.aReceberVencido)} já venceu`
                    : "nada vencido",
                soma: true,
              },
            ].map(({ num, unidade, texto, soma }) => (
              <div key={unidade} className="spot card p-4 md:p-6">
                <dt>
                  <span
                    className={`display block text-[clamp(1.35rem,5.5vw,2.3rem)] leading-none tabular-nums ${
                      soma ? "text-accent" : "text-white/70"
                    }`}
                  >
                    {num}
                  </span>
                  <span className="mt-2 block font-mono text-[10px] tracking-[0.14em] text-white/40 uppercase">
                    {unidade}
                  </span>
                </dt>
                <dd className="mt-2 text-[12px] leading-snug text-white/50 md:mt-3">
                  {texto}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3 md:mt-4 md:gap-4">
            {[
              ["Hoje entrou", preco(resumo.entradasDeHoje)],
              ["Hoje saiu", preco(resumo.saidasDeHoje)],
              [
                "Lucro parado na prateleira",
                resumo.lucroNoEstoque === null
                  ? "—"
                  : preco(resumo.lucroNoEstoque),
              ],
            ].map(([rotulo, valor]) => (
              <div key={rotulo} className="rounded-2xl bg-surface-2 p-4">
                <p className="font-mono text-[10px] tracking-[0.12em] text-white/35 uppercase">
                  {rotulo}
                </p>
                <p className="display mt-1.5 text-[1.5rem] leading-none tabular-nums">
                  {valor}
                </p>
              </div>
            ))}
          </div>

          {resumo.lucroNoEstoque !== null && (
            <p className="mt-3 text-[12.5px] leading-relaxed text-white/40">
              O lucro da prateleira só conta produtos com custo preenchido —
              chutar margem seria inventar número.
            </p>
          )}
        </>
      )}

      {categorias.length > 0 && (
        <section className="mt-8">
          <p className="eyebrow mb-4 text-white/35">Para onde foi o dinheiro em {mes}</p>
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {categorias.map((c) => (
              <li key={`${c.tipo}:${c.categoria}`} className="rounded-2xl bg-surface-2 p-4">
                <p className="font-mono text-[10px] tracking-[0.12em] text-white/35 uppercase">
                  {rotuloCategoria(c.categoria)}
                </p>
                <p
                  className={`display mt-1.5 text-[1.4rem] leading-none tabular-nums ${
                    c.tipo === "entrada" ? "text-accent" : "text-white/70"
                  }`}
                >
                  {c.tipo === "entrada" ? "+" : "−"}
                  {preco(c.total)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {abertos.length > 0 && (
        <section className="mt-10">
          <p className="eyebrow mb-4 text-white/35">Em aberto · {abertos.length}</p>
          <ul className="grid gap-3">
            {abertos.map((l) => (
              <LinhaLancamento key={l.id} l={l} />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <p className="eyebrow mb-4 text-white/35">Movimento de {mes} · {doMes.length}</p>
        {doMes.length === 0 ? (
          <div className="card px-6 py-16 text-center">
            <p className="display text-sub">Nada lançado neste mês</p>
            <p className="mx-auto mt-4 max-w-[46ch] text-[13px] text-white/55">
              Entregue uma ordem de serviço com o valor cobrado preenchido e ela
              aparece aqui automaticamente. Compra de peça, aluguel e retirada
              você lança no botão acima.
            </p>
          </div>
        ) : (
          <ul className="grid gap-3">
            {doMes.map((l) => (
              <LinhaLancamento key={l.id} l={l} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
