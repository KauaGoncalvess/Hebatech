/** Plano de contrato de manutenção mensal, editável pelo painel. */
export type Plano = {
  id: string;
  codigo: string;
  nome: string;
  /** Quantas máquinas o plano atende: "Até 5 máquinas". */
  faixa: string;
  /** Valor mensal em reais. `null` publica o plano como "Sob proposta". */
  precoMensal: number | null;
  /** Frequência das visitas: "2 visitas por mês". */
  visitas: string;
  destaque: boolean;
  ativo: boolean;
  inclui: string[];
  ordem: number;
};

/** Regra de contrato exibida abaixo dos planos. */
export type RegraManutencao = { titulo: string; texto: string };
