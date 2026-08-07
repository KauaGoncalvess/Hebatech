import "server-only";

import { criarClienteServidor } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import {
  hojeNaLoja,
  inicioDoMes,
  paraLancamento,
  type Lancamento,
  type LinhaLancamento,
} from "@/types/lancamento";

/**
 * Leitura do financeiro.
 *
 * Leitura estrita como em ordens: número de mentira sobre o próprio caixa é
 * pior que tela de erro. A única exceção é `resumoDoMes`, que alimenta cartões
 * da capa do painel e por isso devolve `null` em vez de derrubar a tela — uma
 * instalação que ainda não rodou o SQL novo não pode ficar sem painel.
 */
async function cliente() {
  if (!supabaseConfigurado) {
    throw new Error("Supabase não configurado. O caixa fica guardado no banco.");
  }
  const supabase = await criarClienteServidor();
  if (!supabase) throw new Error("Supabase não configurado.");
  return supabase;
}

export async function listarLancamentos(limite = 300): Promise<Lancamento[]> {
  const supabase = await cliente();
  const { data, error } = await supabase
    .from("lancamentos")
    .select("*")
    .order("pago_em", { ascending: false, nullsFirst: true })
    .order("criado_em", { ascending: false })
    .limit(limite);

  if (error || !data) {
    throw new Error(
      `Não foi possível ler o caixa: ${error?.message ?? "resposta vazia"}`,
    );
  }
  return (data as LinhaLancamento[]).map(paraLancamento);
}

export type ResumoFinanceiro = {
  /** Do primeiro dia do mês até hoje, só o que foi efetivamente pago. */
  entradasDoMes: number;
  saidasDoMes: number;
  saldoDoMes: number;
  /** Movimento de hoje. */
  entradasDeHoje: number;
  saidasDeHoje: number;
  /** Prometido e ainda não recebido, e a parte disso que já venceu. */
  aReceber: number;
  aReceberVencido: number;
  aPagar: number;
  /** Lucro que ainda está na prateleira: soma de (preço − custo) do que está à venda. */
  lucroNoEstoque: number | null;
};

/**
 * Os números da capa. Engole falha e devolve null, pelo mesmo motivo dos
 * contadores de ordens e pré-cadastros: um SQL não rodado não pode apagar o
 * painel inteiro.
 */
export async function resumoDoMes(): Promise<ResumoFinanceiro | null> {
  if (!supabaseConfigurado) return null;
  const supabase = await criarClienteServidor();
  if (!supabase) return null;

  const hoje = hojeNaLoja();
  const inicio = inicioDoMes();

  const [pagos, abertos, estoque] = await Promise.all([
    supabase
      .from("lancamentos")
      .select("tipo, valor, pago_em")
      .gte("pago_em", inicio)
      .lte("pago_em", hoje),
    supabase
      .from("lancamentos")
      .select("tipo, valor, vence_em")
      .is("pago_em", null),
    supabase.from("produtos").select("preco, custo").eq("disponivel", true),
  ]);

  if (pagos.error || abertos.error) {
    console.error(
      "Falha ao ler o resumo financeiro:",
      pagos.error?.message ?? abertos.error?.message,
    );
    return null;
  }

  const soma = (linhas: { tipo: string; valor: number }[], tipo: string) =>
    linhas.filter((l) => l.tipo === tipo).reduce((s, l) => s + (l.valor ?? 0), 0);

  const doMes = (pagos.data ?? []) as { tipo: string; valor: number; pago_em: string }[];
  const emAberto = (abertos.data ?? []) as {
    tipo: string;
    valor: number;
    vence_em: string | null;
  }[];

  const entradasDoMes = soma(doMes, "entrada");
  const saidasDoMes = soma(doMes, "saida");

  // Só conta como vencido o que tem data e a data já passou. Conta sem
  // vencimento é promessa sem prazo, não atraso.
  const venceu = (l: { vence_em: string | null }) => !!l.vence_em && l.vence_em < hoje;

  // Produto sem custo preenchido não entra: chutar margem seria inventar
  // número, e é justamente disso que a loja precisa fugir.
  const comCusto = ((estoque.data ?? []) as { preco: number; custo: number | null }[]).filter(
    (p) => typeof p.custo === "number",
  );

  return {
    entradasDoMes,
    saidasDoMes,
    saldoDoMes: entradasDoMes - saidasDoMes,
    entradasDeHoje: soma(doMes.filter((l) => l.pago_em === hoje), "entrada"),
    saidasDeHoje: soma(doMes.filter((l) => l.pago_em === hoje), "saida"),
    aReceber: soma(emAberto, "entrada"),
    aReceberVencido: soma(emAberto.filter(venceu), "entrada"),
    aPagar: soma(emAberto, "saida"),
    lucroNoEstoque: estoque.error
      ? null
      : comCusto.reduce((s, p) => s + (p.preco - (p.custo ?? 0)), 0),
  };
}

/** Quanto cada categoria movimentou no mês, para a tela do financeiro. */
export async function porCategoriaNoMes(): Promise<
  { categoria: string; tipo: string; total: number }[]
> {
  const supabase = await cliente();
  const { data, error } = await supabase
    .from("lancamentos")
    .select("categoria, tipo, valor")
    .gte("pago_em", inicioDoMes())
    .lte("pago_em", hojeNaLoja());

  if (error || !data) return [];

  const mapa = new Map<string, { categoria: string; tipo: string; total: number }>();
  for (const l of data as { categoria: string; tipo: string; valor: number }[]) {
    const chave = `${l.tipo}:${l.categoria}`;
    const atual = mapa.get(chave);
    if (atual) atual.total += l.valor ?? 0;
    else mapa.set(chave, { categoria: l.categoria, tipo: l.tipo, total: l.valor ?? 0 });
  }
  return [...mapa.values()].sort((a, b) => b.total - a.total);
}
