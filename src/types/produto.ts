/**
 * Modelo único de produto. Serve para notebook, desktop, monitor, periférico
 * e peça — o que muda entre eles é quais campos técnicos vêm preenchidos.
 */

export const CATEGORIAS = [
  { id: "notebook", rotulo: "Notebook", plural: "Notebooks" },
  { id: "desktop", rotulo: "Desktop", plural: "Desktops e PCs montados" },
  { id: "monitor", rotulo: "Monitor", plural: "Monitores" },
  { id: "periferico", rotulo: "Periférico", plural: "Periféricos" },
  { id: "peca", rotulo: "Peça", plural: "Peças e upgrades" },
  { id: "acessorio", rotulo: "Acessório", plural: "Acessórios" },
] as const;

export type CategoriaId = (typeof CATEGORIAS)[number]["id"];

export const CONDICOES = ["novo", "seminovo"] as const;
export type Condicao = (typeof CONDICOES)[number];

export const GRAUS = ["A", "B", "C"] as const;
export type GrauEstado = (typeof GRAUS)[number];

/** Uma linha da tabela de especificação. */
export type LinhaFicha = { rotulo: string; valor: string };

export type Produto = {
  id: string;
  codigo: string;
  slug: string;
  categoria: CategoriaId;
  marca: string;
  modelo: string;
  condicao: Condicao;
  preco: number;
  precoReferencia: number | null;
  destaque: boolean;
  disponivel: boolean;
  resumo: string;

  /** Campos técnicos — alimentam os filtros e o resumo do card. */
  cpuFamilia: string | null;
  cpuNome: string | null;
  ramGb: number | null;
  armazenamentoGb: number | null;
  armazenamentoTipo: string | null;
  telaPolegadas: number | null;
  telaResolucao: string | null;
  bateriaSaude: number | null;
  pesoKg: number | null;

  ficha: LinhaFicha[];
  estadoGrau: GrauEstado | null;
  estadoObservacoes: string[];
  garantiaDias: number;
  fotos: string[];
  ordem: number;
};

export const GRAU_DESCRICAO: Record<GrauEstado, string> = {
  A: "Mínimo sinal de uso. Sem trinca, sem amassado e sem defeito estético relevante.",
  B: "Funcionamento pleno com desgaste estético visível, descrito na lista abaixo.",
  C: "Marcas acentuadas de uso. Preço reflete o estado; funcionamento testado e garantido.",
};

export function rotuloCategoria(id: CategoriaId): string {
  return CATEGORIAS.find((c) => c.id === id)?.rotulo ?? id;
}

/** Resumo curto exibido no card, montado a partir do que o produto tem. */
export function resumoTecnico(p: Produto): string[] {
  const partes: string[] = [];
  if (p.cpuNome) partes.push(p.cpuNome.replace("Intel Core ", "").replace("AMD ", ""));
  if (p.ramGb) partes.push(`${p.ramGb} GB`);
  if (p.armazenamentoGb) {
    const t = p.armazenamentoGb >= 1024 ? `${p.armazenamentoGb / 1024} TB` : `${p.armazenamentoGb} GB`;
    partes.push(`${t}${p.armazenamentoTipo ? ` ${p.armazenamentoTipo}` : ""}`);
  }
  if (p.telaPolegadas) {
    partes.push(`${p.telaPolegadas}"${p.telaResolucao ? ` ${p.telaResolucao}` : ""}`);
  }
  return partes;
}
