/** Áreas de serviço da assistência. Alimentam o carrossel da home. */

export type AreaServico =
  | "reparo"
  | "limpeza"
  | "sistema"
  | "pecas"
  | "montagem"
  | "rede"
  | "dados"
  | "contrato";

export type Servico = {
  area: AreaServico;
  etiqueta: string;
  titulo: string;
  resumo: string;
  itens: string[];
};

export const servicos: Servico[] = [
  {
    area: "reparo",
    etiqueta: "Manutenção",
    titulo: "Troca de componentes",
    resumo:
      "Peça quebrada não condena o aparelho. Trocamos o que estragou e devolvemos testado.",
    itens: [
      "Tela, dobradiça e carcaça",
      "Teclado e touchpad",
      "Conector de carga e bateria",
      "Reparo de placa-mãe e trilha",
    ],
  },
  {
    area: "limpeza",
    etiqueta: "Limpeza",
    titulo: "Limpeza e organização",
    resumo:
      "Máquina esquentando e ventoinha barulhenta quase sempre é sujeira e pasta térmica ressecada.",
    itens: [
      "Desmontagem e limpeza interna",
      "Troca de pasta térmica e thermal pad",
      "Revisão do sistema de ventilação",
      "Organização de cabos e bancada",
    ],
  },
  {
    area: "sistema",
    etiqueta: "Sistema",
    titulo: "Formatação e instalação",
    resumo:
      "Windows lento, travando ou com propaganda. Fazemos backup antes de qualquer formatação.",
    itens: [
      "Backup dos seus arquivos",
      "Instalação de Windows e drivers",
      "Office e programas do dia a dia",
      "Remoção de vírus e limpeza de inicialização",
    ],
  },
  {
    area: "pecas",
    etiqueta: "Upgrade",
    titulo: "SSD e memória",
    resumo:
      "O upgrade mais barato que existe: um SSD tira o computador do sufoco e ele liga em segundos.",
    itens: [
      "Instalação de SSD com clonagem",
      "Aumento de memória RAM",
      "Troca de bateria",
      "Conferência de compatibilidade antes",
    ],
  },
  {
    area: "montagem",
    etiqueta: "Montagem",
    titulo: "PC montado sob medida",
    resumo:
      "Você diz o uso e a faixa de preço, a gente fecha a lista de peças item a item.",
    itens: [
      "Escolha das peças com você",
      "Montagem e cabeamento organizado",
      "Teste de estresse antes da entrega",
      "Sistema instalado e ativado",
    ],
  },
  {
    area: "rede",
    etiqueta: "Rede",
    titulo: "Internet e Wi-Fi",
    resumo:
      "Sinal que cai, ponto morto na loja, cabo passado de qualquer jeito. Isso tem conserto.",
    itens: [
      "Instalação e ajuste de roteador",
      "Cabeamento de rede",
      "Ponto de acesso para área sem sinal",
      "Configuração de rede para empresa",
    ],
  },
  {
    area: "dados",
    etiqueta: "Dados",
    titulo: "Recuperação de arquivos",
    resumo:
      "Disco que não é mais reconhecido, barulho estranho ou arquivo apagado sem querer.",
    itens: [
      "Análise do disco antes do orçamento",
      "Recuperação de foto, documento e sistema",
      "Clonagem para disco novo",
      "Você aprova antes de qualquer cobrança",
    ],
  },
  {
    area: "contrato",
    etiqueta: "Empresa",
    titulo: "Manutenção mensal",
    resumo:
      "Para quem tem várias máquinas e nenhum TI. Valor fixo por mês, visita programada.",
    itens: [
      "Visita técnica programada",
      "Chamado remoto no horário comercial",
      "Rotina de backup com teste",
      "Sem fidelidade",
    ],
  },
];
