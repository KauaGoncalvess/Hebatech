import Link from "next/link";
import { CabecalhoPainel } from "@/components/admin/cabecalho-painel";
import { CartaoNumero } from "@/components/admin/cartao-numero";
import { LinhaLancamento } from "@/components/admin/linha-lancamento";
import {
  listarLancamentos,
  porCategoriaNoMes,
  resumoDoMes,
} from "@/lib/financeiro";
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
      <CabecalhoPainel
        titulo="Financeiro"
        nota="Ordem marcada como entregue entra aqui sozinha."
        acao={
          <Link
            href="/admin/financeiro/novo"
            className="toque rounded-full bg-accent px-7 font-mono text-rotulo font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-accent-hover"
          >
            Lançar
          </Link>
        }
      />

      {resumo === null ? (
        <p className="card px-6 py-10 text-center text-nota text-texto-3">
          O financeiro ainda não foi ligado no banco. Rode o{" "}
          <span className="font-mono text-texto-2">supabase/schema.sql</span> de
          novo para criar a tabela do caixa.
        </p>
      ) : (
        <>
          {/*
            A cor separa dinheiro que entra de dinheiro que sai, para o dono
            ler a fileira sem decorar a ordem dos cartões: laranja soma, cinza
            subtrai, vermelho é atraso. Saldo negativo entra como saída, porque
            é isso que ele é.
          */}
          <ul className="grid grid-cols-2 gap-2.5 md:gap-3 lg:grid-cols-4">
            {[
              {
                rotulo: `Entrou em ${mes}`,
                valor: preco(resumo.entradasDoMes),
                nota: "só o que foi recebido",
                tom: "acento" as const,
              },
              {
                rotulo: `Saiu em ${mes}`,
                valor: preco(resumo.saidasDoMes),
                nota: "peça, fixo e retirada",
                tom: "neutro" as const,
              },
              {
                rotulo: "Sobrou no mês",
                valor: preco(resumo.saldoDoMes),
                nota:
                  resumo.saldoDoMes >= 0
                    ? "entradas menos saídas"
                    : "no vermelho",
                tom: (resumo.saldoDoMes >= 0 ? "acento" : "alerta") as
                  | "acento"
                  | "alerta",
              },
              {
                rotulo: "A receber",
                valor: preco(resumo.aReceber),
                nota:
                  resumo.aReceberVencido > 0
                    ? `${preco(resumo.aReceberVencido)} já venceu`
                    : "nada vencido",
                tom: "acento" as const,
                notaTom: (resumo.aReceberVencido > 0 ? "alerta" : "padrao") as
                  | "alerta"
                  | "padrao",
              },
            ].map((c) => (
              <li key={c.rotulo}>
                <CartaoNumero
                  rotulo={c.rotulo}
                  valor={c.valor}
                  nota={c.nota}
                  tom={c.tom}
                  notaTom={"notaTom" in c ? c.notaTom : undefined}
                />
              </li>
            ))}
          </ul>

          <ul className="mt-2.5 grid grid-cols-3 gap-2.5 md:mt-3 md:gap-3">
            {[
              ["Hoje entrou", preco(resumo.entradasDeHoje)],
              ["Hoje saiu", preco(resumo.saidasDeHoje)],
              [
                "Na prateleira",
                resumo.lucroNoEstoque === null
                  ? "—"
                  : preco(resumo.lucroNoEstoque),
              ],
            ].map(([rotulo, valor]) => (
              <li key={rotulo}>
                <CartaoNumero
                  rotulo={rotulo}
                  valor={valor}
                  tom="neutro"
                  compacto
                />
              </li>
            ))}
          </ul>

          {resumo.lucroNoEstoque !== null && (
            <p className="mt-3 text-nota leading-relaxed text-texto-3">
              &ldquo;Na prateleira&rdquo; é o lucro do estoque à venda, e só
              conta produto com custo preenchido — chutar margem seria inventar
              número.
            </p>
          )}
        </>
      )}

      {categorias.length > 0 && (
        <section className="mt-8">
          <p className="eyebrow mb-4 text-texto-3">
            Para onde foi o dinheiro em {mes}
          </p>
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {categorias.map((c) => (
              <li key={`${c.tipo}:${c.categoria}`}>
                <CartaoNumero
                  rotulo={rotuloCategoria(c.categoria)}
                  valor={`${c.tipo === "entrada" ? "+" : "−"}${preco(c.total)}`}
                  tom={c.tipo === "entrada" ? "acento" : "neutro"}
                  compacto
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {abertos.length > 0 && (
        <section className="mt-10">
          <p className="eyebrow mb-4 text-texto-3">
            Em aberto · {abertos.length}
          </p>
          <ul className="grid gap-3">
            {abertos.map((l) => (
              <LinhaLancamento key={l.id} l={l} />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <p className="eyebrow mb-4 text-texto-3">
          Movimento de {mes} · {doMes.length}
        </p>
        {doMes.length === 0 ? (
          <div className="card px-6 py-16 text-center">
            <p className="display text-sub">Nada lançado neste mês</p>
            <p className="mx-auto mt-4 max-w-[46ch] text-nota text-texto-3">
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
