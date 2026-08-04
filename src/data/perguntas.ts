import { enderecoLinha, site } from "./site";

/**
 * As mesmas respostas que a loja dá no balcão. Alimentam a sanfona da home e da
 * assistência e viram `FAQPage` no JSON-LD, que é o formato que o Google usa
 * para mostrar a pergunta direto no resultado de busca.
 */
export const perguntas: [string, string][] = [
  [
    "O diagnóstico é cobrado?",
    `Não, se você aprovar o reparo. Se o conserto não for viável ou você desistir, o aparelho volta montado e o diagnóstico não é cobrado. O prazo é de até ${site.operacao.prazoDiagnosticoHoras} horas.`,
  ],
  [
    "Em quanto tempo fica pronto?",
    `O diagnóstico sai em até ${site.operacao.prazoDiagnosticoHoras} horas. O prazo do serviço vai junto com o orçamento: formatação em um dia útil, limpeza em um dia útil, troca de tela de dois a cinco dias úteis, conforme a peça.`,
  ],
  [
    "Vocês fazem backup antes de formatar?",
    "Sim. Copiamos os seus arquivos para um disco da loja antes de qualquer formatação e devolvemos junto com o aparelho.",
  ],
  [
    "Qual é a garantia do serviço?",
    `${site.operacao.garantiaServicoDias} dias, cobrindo peça e mão de obra do que foi feito. Tela, bateria e teclado saem com nota fiscal.`,
  ],
  [
    "Precisa agendar para levar o aparelho?",
    `Não. É só trazer na loja, na ${enderecoLinha}, de segunda a sexta das 8h30 às 18h e sábado até meio-dia.`,
  ],
  [
    "Consertam qualquer marca?",
    "Sim, notebook e desktop de qualquer marca — Dell, Lenovo, HP, Acer, Samsung, Positivo, Asus e montados.",
  ],
  [
    "Atendem empresa?",
    "Sim. Além do atendimento avulso, temos contrato de manutenção mensal para empresa sem TI própria, de 3 a 30 máquinas, com valor fixo por mês.",
  ],
  [
    "Nenhum reparo começa sem eu autorizar?",
    "Nenhum. O valor fechado de peça e mão de obra vai para você no WhatsApp e só seguimos depois do seu aval por escrito. O preço não sobe no meio do caminho.",
  ],
];

/** JSON-LD de FAQ a partir de qualquer lista de perguntas. */
export function faqJsonLd(lista: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: lista.map(([pergunta, resposta]) => ({
      "@type": "Question",
      name: pergunta,
      acceptedAnswer: { "@type": "Answer", text: resposta },
    })),
  };
}
