import type { Plano } from "@/types/plano";

/** Formato bruto da tabela `planos_manutencao` no Supabase. */
export type LinhaPlano = {
  id: string;
  codigo: string;
  nome: string;
  faixa: string;
  preco_mensal: number | null;
  visitas: string;
  destaque: boolean;
  ativo: boolean;
  inclui: unknown;
  ordem: number;
};

function comoTextos(valor: unknown): string[] {
  return Array.isArray(valor) ? valor.filter((v): v is string => typeof v === "string") : [];
}

export function paraPlano(linha: LinhaPlano): Plano {
  return {
    id: linha.id,
    codigo: linha.codigo,
    nome: linha.nome,
    faixa: linha.faixa,
    precoMensal: linha.preco_mensal,
    visitas: linha.visitas,
    destaque: linha.destaque,
    ativo: linha.ativo,
    inclui: comoTextos(linha.inclui),
    ordem: linha.ordem,
  };
}

export function paraLinhaPlano(p: Omit<Plano, "id">): Omit<LinhaPlano, "id"> {
  return {
    codigo: p.codigo,
    nome: p.nome,
    faixa: p.faixa,
    preco_mensal: p.precoMensal,
    visitas: p.visitas,
    destaque: p.destaque,
    ativo: p.ativo,
    inclui: p.inclui,
    ordem: p.ordem,
  };
}
