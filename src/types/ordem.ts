export const STATUS_ORDEM = [
  "recebido",
  "diagnosticado",
  "aguardando_aprovacao",
  "em_reparo",
  "pronto",
  "entregue",
  "cancelado",
] as const;

export type StatusOrdem = (typeof STATUS_ORDEM)[number];

/**
 * A etapa como o cliente lê. `passo` é a posição na linha do tempo pública;
 * `cancelado` fica com -1 porque não é etapa, é desvio.
 */
export const ETAPA: Record<
  StatusOrdem,
  { rotulo: string; explicacao: string; passo: number }
> = {
  recebido: {
    rotulo: "Recebido",
    explicacao: "O aparelho entrou na loja e está na fila da bancada.",
    passo: 0,
  },
  diagnosticado: {
    rotulo: "Diagnosticado",
    explicacao: "Já sabemos o que ele tem. O orçamento sai em seguida.",
    passo: 1,
  },
  aguardando_aprovacao: {
    rotulo: "Esperando você aprovar",
    explicacao: "O orçamento está pronto. Nada é aberto ou trocado sem o seu sim.",
    passo: 2,
  },
  em_reparo: {
    rotulo: "Em reparo",
    explicacao: "Aprovado e em execução na bancada.",
    passo: 3,
  },
  pronto: {
    rotulo: "Pronto para retirar",
    explicacao: "Serviço concluído e testado. Pode vir buscar no horário da loja.",
    passo: 4,
  },
  entregue: {
    rotulo: "Entregue",
    explicacao: "Aparelho retirado. A garantia do serviço corre a partir da retirada.",
    passo: 5,
  },
  cancelado: {
    rotulo: "Cancelado",
    explicacao: "O serviço não seguiu. Se precisar retomar, fale com a gente.",
    passo: -1,
  },
};

/** Os passos que a linha do tempo pública desenha, na ordem. */
export const LINHA_DO_TEMPO: StatusOrdem[] = [
  "recebido",
  "diagnosticado",
  "aguardando_aprovacao",
  "em_reparo",
  "pronto",
  "entregue",
];

export function rotuloStatus(status: StatusOrdem): string {
  return ETAPA[status].rotulo;
}

/** A ordem completa. Só o painel enxerga isto: tem nome e telefone. */
export type Ordem = {
  id: string;
  codigo: string;
  clienteNome: string;
  clienteTelefone: string;
  equipamento: string;
  marca: string;
  modelo: string;
  defeito: string;
  status: StatusOrdem;
  valorOrcado: number | null;
  observacoes: string;
  previsao: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

/**
 * O que a página pública mostra. Sem nome e sem telefone de propósito: quem
 * acertar um código não pode descobrir de quem é o aparelho.
 */
export type OrdemPublica = Pick<
  Ordem,
  | "codigo"
  | "equipamento"
  | "marca"
  | "modelo"
  | "defeito"
  | "status"
  | "valorOrcado"
  | "observacoes"
  | "previsao"
  | "criadoEm"
  | "atualizadoEm"
>;

export type LinhaOrdem = {
  id: string;
  codigo: string;
  cliente_nome: string | null;
  cliente_telefone: string | null;
  equipamento: string | null;
  marca: string | null;
  modelo: string | null;
  defeito: string | null;
  status: string | null;
  valor_orcado: number | null;
  observacoes: string | null;
  previsao: string | null;
  criado_em: string;
  atualizado_em: string;
};

function comoStatus(bruto: unknown): StatusOrdem {
  return STATUS_ORDEM.includes(bruto as StatusOrdem) ? (bruto as StatusOrdem) : "recebido";
}

export function paraOrdem(linha: LinhaOrdem): Ordem {
  return {
    id: linha.id,
    codigo: linha.codigo,
    clienteNome: linha.cliente_nome ?? "",
    clienteTelefone: linha.cliente_telefone ?? "",
    equipamento: linha.equipamento ?? "",
    marca: linha.marca ?? "",
    modelo: linha.modelo ?? "",
    defeito: linha.defeito ?? "",
    status: comoStatus(linha.status),
    valorOrcado: linha.valor_orcado,
    observacoes: linha.observacoes ?? "",
    previsao: linha.previsao,
    criadoEm: linha.criado_em,
    atualizadoEm: linha.atualizado_em,
  };
}

export function paraOrdemPublica(linha: Omit<LinhaOrdem, "id">): OrdemPublica {
  return {
    codigo: linha.codigo,
    equipamento: linha.equipamento ?? "",
    marca: linha.marca ?? "",
    modelo: linha.modelo ?? "",
    defeito: linha.defeito ?? "",
    status: comoStatus(linha.status),
    valorOrcado: linha.valor_orcado,
    observacoes: linha.observacoes ?? "",
    previsao: linha.previsao,
    criadoEm: linha.criado_em,
    atualizadoEm: linha.atualizado_em,
  };
}

/** Descrição curta do aparelho, montada do que estiver preenchido. */
export function aparelhoDe(o: Pick<Ordem, "equipamento" | "marca" | "modelo">): string {
  return [o.equipamento, o.marca, o.modelo]
    .map((p) => p.trim())
    .filter(Boolean)
    .join(" ");
}
