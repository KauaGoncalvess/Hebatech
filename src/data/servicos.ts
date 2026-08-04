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
  /** Endereço da página do serviço: /servicos/<slug>. */
  slug: string;
  etiqueta: string;
  titulo: string;
  /** Como a pessoa procura isso no Google. Vira o <h1> e o title. */
  chamada: string;
  resumo: string;
  itens: string[];
  /** Parágrafo de abertura da página do serviço. */
  descricao: string;
  precoPartida: string;
  prazo: string;
  perguntas: [string, string][];
  /** Serviço que tem página própria fora de /servicos. */
  href?: string;
};

/** Endereço da página de um serviço. */
export function rotaServico(s: Servico): string {
  return s.href ?? `/servicos/${s.slug}`;
}

export const servicos: Servico[] = [
  {
    area: "reparo",
    slug: "troca-de-tela-e-componentes",
    etiqueta: "Manutenção",
    titulo: "Troca de componentes",
    chamada: "Troca de tela, teclado, bateria e conector de carga",
    resumo:
      "Peça quebrada não condena o aparelho. Trocamos o que estragou e devolvemos testado.",
    itens: [
      "Tela, dobradiça e carcaça",
      "Teclado e touchpad",
      "Conector de carga e bateria",
      "Reparo de placa-mãe e trilha",
    ],
    descricao:
      "Tela trincada, notebook que não carrega mais, teclado com tecla morta, dobradiça solta. Na maioria dos casos a peça sai por bem menos que um aparelho novo — e a gente te diz o valor fechado antes de abrir. Peça de tela, bateria e teclado sai com nota fiscal.",
    precoPartida: "Mão de obra a partir de R$ 150 + peça",
    prazo: "2 a 5 dias úteis, conforme a peça",
    perguntas: [
      [
        "Vale mais a pena consertar ou comprar outro?",
        "A gente te diz com número na mão. Depois da medição você recebe o valor do conserto e, se for o caso, o preço de um aparelho equivalente do nosso estoque. Se não compensar, falamos isso.",
      ],
      [
        "A peça é original?",
        "Trabalhamos com peça nova de procedência, com nota fiscal. Quando existe opção paralela mais barata, mostramos as duas e você escolhe.",
      ],
      [
        "Perco meus arquivos na troca de peça?",
        "Não. Troca de tela, teclado, bateria e conector não encosta no disco. Se o serviço envolver o disco, fazemos backup antes.",
      ],
    ],
  },
  {
    area: "limpeza",
    slug: "limpeza-e-pasta-termica",
    etiqueta: "Limpeza",
    titulo: "Limpeza e organização",
    chamada: "Limpeza interna e troca de pasta térmica",
    resumo:
      "Máquina esquentando e ventoinha barulhenta quase sempre é sujeira e pasta térmica ressecada.",
    itens: [
      "Desmontagem e limpeza interna",
      "Troca de pasta térmica e thermal pad",
      "Revisão do sistema de ventilação",
      "Organização de cabos e bancada",
    ],
    descricao:
      "Computador que esquenta desliga sozinho, trava em jogo e perde desempenho para se proteger. Quase sempre é poeira acumulada no dissipador e pasta térmica seca. Desmontamos, limpamos por dentro, trocamos a pasta e os thermal pads e medimos a temperatura antes e depois.",
    precoPartida: "A partir de R$ 140",
    prazo: "1 dia útil",
    perguntas: [
      [
        "De quanto em quanto tempo preciso fazer?",
        "Uma vez por ano dá conta na maioria dos casos. Em ambiente com muita poeira ou animal em casa, a cada seis meses.",
      ],
      [
        "Isso resolve o barulho da ventoinha?",
        "Na maior parte das vezes sim, porque o barulho vem da ventoinha girando no máximo para dar conta do calor. Se a ventoinha já estiver com desgaste no eixo, avisamos e orçamos a troca à parte.",
      ],
    ],
  },
  {
    area: "sistema",
    slug: "formatacao-e-instalacao",
    etiqueta: "Sistema",
    titulo: "Formatação e instalação",
    chamada: "Formatação com backup, Windows e drivers instalados",
    resumo:
      "Windows lento, travando ou com propaganda. Fazemos backup antes de qualquer formatação.",
    itens: [
      "Backup dos seus arquivos",
      "Instalação de Windows e drivers",
      "Office e programas do dia a dia",
      "Remoção de vírus e limpeza de inicialização",
    ],
    descricao:
      "Antes de formatar qualquer coisa, copiamos os seus arquivos para um disco da loja e devolvemos junto com o aparelho. Depois vem o Windows limpo, os drivers certos para o seu modelo, os programas do dia a dia e a inicialização enxuta — sem aquele monte de coisa abrindo junto.",
    precoPartida: "A partir de R$ 120",
    prazo: "1 dia útil",
    perguntas: [
      [
        "Meus arquivos e fotos se perdem?",
        "Não. O backup é feito antes da formatação e devolvido junto. É a nossa regra da casa, não um serviço extra.",
      ],
      [
        "O Windows é original?",
        "Instalamos e ativamos a licença. Se o aparelho já tem licença vinculada à placa, ela volta sozinha; se não tiver, orçamos a licença à parte antes de fazer.",
      ],
      [
        "Formatar resolve lentidão?",
        "Às vezes. Se o disco for HD mecânico, a lentidão volta em pouco tempo — nesse caso a troca por SSD resolve de verdade, e a gente fala isso antes de você gastar com formatação à toa.",
      ],
    ],
  },
  {
    area: "pecas",
    slug: "upgrade-de-ssd-e-memoria",
    etiqueta: "Upgrade",
    titulo: "SSD e memória",
    chamada: "Upgrade de SSD e memória com instalação inclusa",
    resumo:
      "O upgrade mais barato que existe: um SSD tira o computador do sufoco e ele liga em segundos.",
    itens: [
      "Instalação de SSD com clonagem",
      "Aumento de memória RAM",
      "Troca de bateria",
      "Conferência de compatibilidade antes",
    ],
    descricao:
      "Trocar o HD por SSD é o que mais muda a vida de um computador antigo: liga em segundos, abre programa na hora e para de travar. Conferimos a compatibilidade do seu modelo antes de vender qualquer coisa, e clonamos o sistema para você não perder nada nem precisar reinstalar tudo.",
    precoPartida: "Mão de obra a partir de R$ 90 + peça",
    prazo: "No mesmo dia",
    perguntas: [
      [
        "Preciso reinstalar tudo depois?",
        "Não. Clonamos o sistema do disco antigo para o novo — você liga e está tudo do jeito que estava, só que rápido.",
      ],
      [
        "Vale a pena em computador velho?",
        "Quase sempre. É o upgrade com melhor relação custo-benefício que existe. Se o aparelho for antigo demais para valer o investimento, dizemos isso na medição.",
      ],
      [
        "Posso comprar a peça com vocês?",
        "Pode, e aí a instalação já sai inclusa. Também instalamos peça que você trouxe, cobrando só a mão de obra.",
      ],
    ],
  },
  {
    area: "montagem",
    slug: "pc-montado-sob-medida",
    etiqueta: "Montagem",
    titulo: "PC montado sob medida",
    chamada: "PC montado para jogo, edição, escritório ou PDV",
    resumo:
      "Você diz o uso e a faixa de preço, a gente fecha a lista de peças item a item.",
    itens: [
      "Escolha das peças com você",
      "Montagem e cabeamento organizado",
      "Teste de estresse antes da entrega",
      "Sistema instalado e ativado",
    ],
    descricao:
      "Você diz para que vai usar e quanto quer gastar. A gente monta a lista de peças com preço item a item, sem empurrar o que não faz diferença para o seu caso. Depois de aprovada, a máquina sai montada, com cabeamento organizado, testada sob carga e com o sistema instalado.",
    precoPartida: "Mão de obra de montagem a partir de R$ 200",
    prazo: "2 a 7 dias úteis, conforme as peças",
    perguntas: [
      [
        "Posso levar minhas peças?",
        "Pode. Conferimos a compatibilidade antes e cobramos só a montagem.",
      ],
      [
        "Tem garantia?",
        "A montagem tem garantia da loja e cada peça mantém a garantia do fabricante, com a nota fiscal em seu nome.",
      ],
    ],
  },
  {
    area: "rede",
    slug: "rede-e-wifi",
    etiqueta: "Rede",
    titulo: "Internet e Wi-Fi",
    chamada: "Instalação de rede, Wi-Fi e cabeamento",
    resumo:
      "Sinal que cai, ponto morto na loja, cabo passado de qualquer jeito. Isso tem conserto.",
    itens: [
      "Instalação e ajuste de roteador",
      "Cabeamento de rede",
      "Ponto de acesso para área sem sinal",
      "Configuração de rede para empresa",
    ],
    descricao:
      "Wi-Fi que cai no fundo da casa ou da loja quase nunca é culpa da operadora — é posição de roteador, canal congestionado ou parede no caminho. Medimos o sinal no local, ajustamos o que dá para ajustar e, quando precisa, passamos cabo ou instalamos um ponto de acesso onde o sinal morre.",
    precoPartida: "Visita e diagnóstico a partir de R$ 150",
    prazo: "Agendado, normalmente no mesmo dia da visita",
    perguntas: [
      [
        "Vocês vão até o local?",
        "Vamos, em Sete Lagoas e região. A taxa de deslocamento é fechada antes, junto com o orçamento.",
      ],
      [
        "Atende empresa?",
        "Sim. Para quem tem várias máquinas, costuma sair melhor dentro do contrato de manutenção mensal.",
      ],
    ],
  },
  {
    area: "dados",
    slug: "recuperacao-de-arquivos",
    etiqueta: "Dados",
    titulo: "Recuperação de arquivos",
    chamada: "Recuperação de arquivos de HD e SSD",
    resumo:
      "Disco que não é mais reconhecido, barulho estranho ou arquivo apagado sem querer.",
    itens: [
      "Análise do disco antes do orçamento",
      "Recuperação de foto, documento e sistema",
      "Clonagem para disco novo",
      "Você aprova antes de qualquer cobrança",
    ],
    descricao:
      "Disco que sumiu do computador, que faz barulho de clique ou arquivo apagado sem querer. Analisamos o disco primeiro e só depois falamos de valor — e o valor sai junto com a lista do que dá para recuperar. Se não der para recuperar, você não paga a recuperação.",
    precoPartida: "Sob orçamento, após análise do disco",
    prazo: "2 a 10 dias úteis",
    perguntas: [
      [
        "E se não conseguirem recuperar?",
        "Você não paga a recuperação. A análise é o que define se é viável, e ela vem antes de qualquer cobrança.",
      ],
      [
        "Alguém vê meus arquivos?",
        "O acesso fica restrito ao técnico responsável e serve só para conferir se a recuperação funcionou. Nada é copiado para fora da loja.",
      ],
      [
        "Disco que faz barulho tem jeito?",
        "Barulho de clique costuma ser problema mecânico, que é o caso mais difícil. Desligue o disco e traga — quanto menos ele girar, maior a chance.",
      ],
    ],
  },
  {
    area: "contrato",
    slug: "manutencao-mensal",
    etiqueta: "Empresa",
    titulo: "Manutenção mensal",
    chamada: "Contrato de manutenção mensal para empresa",
    resumo:
      "Para quem tem várias máquinas e nenhum TI. Valor fixo por mês, visita programada.",
    itens: [
      "Visita técnica programada",
      "Chamado remoto no horário comercial",
      "Rotina de backup com teste",
      "Sem fidelidade",
    ],
    descricao:
      "Empresa que só chama técnico quando o problema já parou o trabalho paga caro duas vezes: na urgência e no tempo parado. O contrato mensal troca isso por um valor previsível, com visita programada, chamado remoto e backup testado.",
    precoPartida: "A partir de R$ 390 por mês",
    prazo: "Visita programada, urgência em até 4h úteis",
    perguntas: [],
    href: "/manutencao",
  },
];
