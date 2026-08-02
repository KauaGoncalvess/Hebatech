import type { CategoriaId, GrauEstado, LinhaFicha, Produto } from "@/types/produto";

/** Formato bruto da tabela `produtos` no Supabase. */
export type LinhaProduto = {
  id: string;
  codigo: string;
  slug: string;
  categoria: string;
  marca: string;
  modelo: string;
  condicao: string;
  preco: number;
  preco_referencia: number | null;
  destaque: boolean;
  disponivel: boolean;
  resumo: string | null;
  cpu_familia: string | null;
  cpu_nome: string | null;
  ram_gb: number | null;
  armazenamento_gb: number | null;
  armazenamento_tipo: string | null;
  tela_polegadas: number | string | null;
  tela_resolucao: string | null;
  bateria_saude: number | null;
  peso_kg: number | string | null;
  ficha: unknown;
  estado_grau: string | null;
  estado_observacoes: unknown;
  garantia_dias: number;
  fotos: unknown;
  ordem: number;
};

function comoFicha(valor: unknown): LinhaFicha[] {
  if (!Array.isArray(valor)) return [];
  return valor.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const { rotulo, valor: v } = item as { rotulo?: unknown; valor?: unknown };
    if (typeof rotulo !== "string" || typeof v !== "string") return [];
    return [{ rotulo, valor: v }];
  });
}

function comoTextos(valor: unknown): string[] {
  return Array.isArray(valor) ? valor.filter((v): v is string => typeof v === "string") : [];
}

function comoNumero(valor: number | string | null): number | null {
  if (valor === null) return null;
  const n = typeof valor === "number" ? valor : Number(valor);
  return Number.isFinite(n) ? n : null;
}

/** Converte a linha do banco (snake_case) para o modelo usado no site. */
export function paraProduto(linha: LinhaProduto): Produto {
  return {
    id: linha.id,
    codigo: linha.codigo,
    slug: linha.slug,
    categoria: linha.categoria as CategoriaId,
    marca: linha.marca,
    modelo: linha.modelo,
    condicao: linha.condicao === "novo" ? "novo" : "seminovo",
    preco: linha.preco,
    precoReferencia: linha.preco_referencia,
    destaque: linha.destaque,
    disponivel: linha.disponivel,
    resumo: linha.resumo ?? "",
    cpuFamilia: linha.cpu_familia,
    cpuNome: linha.cpu_nome,
    ramGb: linha.ram_gb,
    armazenamentoGb: linha.armazenamento_gb,
    armazenamentoTipo: linha.armazenamento_tipo,
    telaPolegadas: comoNumero(linha.tela_polegadas),
    telaResolucao: linha.tela_resolucao,
    bateriaSaude: linha.bateria_saude,
    pesoKg: comoNumero(linha.peso_kg),
    ficha: comoFicha(linha.ficha),
    estadoGrau: (linha.estado_grau as GrauEstado | null) ?? null,
    estadoObservacoes: comoTextos(linha.estado_observacoes),
    garantiaDias: linha.garantia_dias,
    fotos: comoTextos(linha.fotos),
    ordem: linha.ordem,
  };
}

/** Converte o modelo do site para o formato de gravação no banco. */
export function paraLinha(p: Omit<Produto, "id">): Omit<LinhaProduto, "id"> {
  return {
    codigo: p.codigo,
    slug: p.slug,
    categoria: p.categoria,
    marca: p.marca,
    modelo: p.modelo,
    condicao: p.condicao,
    preco: p.preco,
    preco_referencia: p.precoReferencia,
    destaque: p.destaque,
    disponivel: p.disponivel,
    resumo: p.resumo,
    cpu_familia: p.cpuFamilia,
    cpu_nome: p.cpuNome,
    ram_gb: p.ramGb,
    armazenamento_gb: p.armazenamentoGb,
    armazenamento_tipo: p.armazenamentoTipo,
    tela_polegadas: p.telaPolegadas,
    tela_resolucao: p.telaResolucao,
    bateria_saude: p.bateriaSaude,
    peso_kg: p.pesoKg,
    ficha: p.ficha,
    estado_grau: p.estadoGrau,
    estado_observacoes: p.estadoObservacoes,
    garantia_dias: p.garantiaDias,
    fotos: p.fotos,
    ordem: p.ordem,
  };
}
