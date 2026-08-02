import { site } from "@/data/site";
import type { Notebook } from "@/data/notebooks";
import { preco } from "./format";

function link(texto: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`;
}

export function waGenerico(assunto?: string): string {
  return link(
    assunto
      ? `Olá, vim pelo site da HebaTech. Assunto: ${assunto}.`
      : "Olá, vim pelo site da HebaTech e queria falar com um técnico.",
  );
}

export function waNotebook(n: Notebook): string {
  return link(
    [
      `Olá, vim pelo site da HebaTech.`,
      `Tenho interesse no ${n.marca} ${n.modelo}.`,
      `Código: ${n.codigo}`,
      `Configuração: ${n.cpu.nome}, ${n.ramGb} GB, ${n.armazenamentoGb} GB ${n.armazenamentoTipo}`,
      `Preço anunciado: ${preco(n.preco)}`,
      `Ainda está disponível?`,
    ].join("\n"),
  );
}

export type Orcamento = {
  nome: string;
  telefone: string;
  tipo: string;
  marca: string;
  modelo: string;
  defeito: string;
  descricao: string;
};

export function waOrcamento(o: Orcamento): string {
  const linhas = [
    "Olá, vim pelo site da HebaTech e quero um orçamento de assistência técnica.",
    "",
    `Nome: ${o.nome}`,
    `Telefone: ${o.telefone}`,
    `Equipamento: ${o.tipo}`,
    `Marca: ${o.marca}`,
    `Modelo: ${o.modelo}`,
    `Defeito: ${o.defeito}`,
  ];
  if (o.descricao.trim()) {
    linhas.push(`Detalhes: ${o.descricao.trim()}`);
  }
  return link(linhas.join("\n"));
}
