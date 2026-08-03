import { site } from "@/data/site";
import { resumoTecnico, type Produto } from "@/types/produto";
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

/**
 * Avaliação do aparelho usado como parte do pagamento. A mensagem já sai com
 * os campos que o técnico precisa saber para dar um valor.
 */
export function waTroca(): string {
  return link(
    [
      "Olá, vim pelo site da HebaTech.",
      "Quero saber quanto vale o meu notebook usado como parte do pagamento.",
      "",
      "Marca e modelo:",
      "Tempo de uso:",
      "Estado da tela, da bateria e do teclado:",
    ].join("\n"),
  );
}

export function waProduto(p: Produto): string {
  const resumo = resumoTecnico(p);
  return link(
    [
      "Olá, vim pelo site da HebaTech.",
      `Tenho interesse no ${p.marca} ${p.modelo}.`,
      `Código: ${p.codigo}`,
      ...(resumo.length ? [`Configuração: ${resumo.join(", ")}`] : []),
      `Preço anunciado: ${preco(p.preco)}`,
      "Ainda está disponível?",
    ].join("\n"),
  );
}

/** Produto já vendido: a conversa começa pelo que a pessoa veio procurar. */
export function waParecido(p: Produto): string {
  const resumo = resumoTecnico(p);
  return link(
    [
      "Olá, vim pelo site da HebaTech.",
      `Vi o ${p.marca} ${p.modelo} (${p.codigo}), mas já está vendido.`,
      ...(resumo.length ? [`Procuro algo parecido: ${resumo.join(", ")}`] : []),
      "Tem outro nessa linha ou entra em breve?",
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

export type PedidoContrato = {
  plano: string;
  maquinas: string;
};

/** Contrato de manutenção mensal — a mensagem já sai com o plano escolhido. */
export function waContrato(p: PedidoContrato): string {
  return link(
    [
      "Olá, vim pelo site da HebaTech e quero falar sobre contrato de manutenção mensal.",
      "",
      `Plano de interesse: ${p.plano}`,
      `Quantidade de máquinas: ${p.maquinas}`,
      "Pode me passar a proposta?",
    ].join("\n"),
  );
}
