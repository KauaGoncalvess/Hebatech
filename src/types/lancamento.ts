/**
 * Lançamento do caixa.
 *
 * Uma tabela só cobre caixa e contas a receber/pagar. O que separa os dois é
 * `pagoEm`: preenchido, o dinheiro andou; nulo, ainda é promessa.
 */
export const TIPOS_LANCAMENTO = ["entrada", "saida"] as const;
export type TipoLancamento = (typeof TIPOS_LANCAMENTO)[number];

export const CATEGORIAS_LANCAMENTO = [
  { id: "servico", rotulo: "Serviço", tipo: "entrada" },
  { id: "venda", rotulo: "Venda de produto", tipo: "entrada" },
  { id: "plano", rotulo: "Contrato mensal", tipo: "entrada" },
  { id: "outra-entrada", rotulo: "Outra entrada", tipo: "entrada" },
  { id: "peca", rotulo: "Compra de peça", tipo: "saida" },
  { id: "mercadoria", rotulo: "Compra de mercadoria", tipo: "saida" },
  { id: "fixo", rotulo: "Aluguel, luz, internet", tipo: "saida" },
  { id: "pessoal", rotulo: "Salário e retirada", tipo: "saida" },
  { id: "outros", rotulo: "Outra saída", tipo: "saida" },
] as const satisfies readonly { id: string; rotulo: string; tipo: TipoLancamento }[];

export type CategoriaLancamento = (typeof CATEGORIAS_LANCAMENTO)[number]["id"];

export function rotuloCategoria(id: string): string {
  return CATEGORIAS_LANCAMENTO.find((c) => c.id === id)?.rotulo ?? "Outros";
}

export type Lancamento = {
  id: string;
  tipo: TipoLancamento;
  valor: number;
  descricao: string;
  categoria: string;
  /** Nulo em lançamento à vista. Preenchido, é conta a receber ou a pagar. */
  venceEm: string | null;
  /** Nulo enquanto não foi pago. É o que decide se entra no caixa. */
  pagoEm: string | null;
  clienteId: string | null;
  ordemId: string | null;
  produtoId: string | null;
  criadoEm: string;
};

export type LinhaLancamento = {
  id: string;
  tipo: string | null;
  valor: number | null;
  descricao: string | null;
  categoria: string | null;
  vence_em: string | null;
  pago_em: string | null;
  cliente_id: string | null;
  ordem_id: string | null;
  produto_id: string | null;
  criado_em: string;
};

export function paraLancamento(l: LinhaLancamento): Lancamento {
  return {
    id: l.id,
    tipo: l.tipo === "saida" ? "saida" : "entrada",
    valor: l.valor ?? 0,
    descricao: l.descricao ?? "",
    categoria: l.categoria ?? "outros",
    venceEm: l.vence_em,
    pagoEm: l.pago_em,
    clienteId: l.cliente_id,
    ordemId: l.ordem_id,
    produtoId: l.produto_id,
    criadoEm: l.criado_em,
  };
}

/** Hoje no fuso da loja, em `YYYY-MM-DD`. O servidor da Vercel roda em UTC. */
export function hojeNaLoja(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}

/** Primeiro dia do mês corrente, no fuso da loja. */
export function inicioDoMes(): string {
  return `${hojeNaLoja().slice(0, 7)}-01`;
}
