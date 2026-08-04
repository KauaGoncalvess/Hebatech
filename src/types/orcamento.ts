/** Pedido de orçamento que saiu do formulário do site. */
export type PedidoOrcamento = {
  id: string;
  nome: string;
  telefone: string;
  tipo: string;
  marca: string;
  modelo: string;
  defeito: string;
  descricao: string;
  atendido: boolean;
  criadoEm: string;
};

/** O que o formulário manda para o servidor. Sem id, sem data, sem `atendido`. */
export type NovoOrcamento = Pick<
  PedidoOrcamento,
  "nome" | "telefone" | "tipo" | "marca" | "modelo" | "defeito" | "descricao"
>;

export type LinhaOrcamento = {
  id: string;
  nome: string | null;
  telefone: string | null;
  tipo: string | null;
  marca: string | null;
  modelo: string | null;
  defeito: string | null;
  descricao: string | null;
  atendido: boolean | null;
  criado_em: string;
};

export function paraPedido(linha: LinhaOrcamento): PedidoOrcamento {
  return {
    id: linha.id,
    nome: linha.nome ?? "",
    telefone: linha.telefone ?? "",
    tipo: linha.tipo ?? "",
    marca: linha.marca ?? "",
    modelo: linha.modelo ?? "",
    defeito: linha.defeito ?? "",
    descricao: linha.descricao ?? "",
    atendido: linha.atendido ?? false,
    criadoEm: linha.criado_em,
  };
}
