/**
 * Ponto único de configuração do site.
 * Tudo que muda de tempos em tempos (telefone, endereço, horário) fica aqui.
 *
 * >>> CONFERIR ANTES DE PUBLICAR: whatsapp, telefoneFixo, endereco e mapaQuery.
 */

export const site = {
  nome: "HebaTech",
  nomeCompleto: "HebaTech Soluções em Informática",
  descricao:
    "Assistência técnica em notebooks e computadores, consultoria e venda de notebooks corporativos seminovos em Sete Lagoas, MG.",
  url: "https://hebatech.com.br",

  /** Número no formato internacional, só dígitos — usado no link wa.me. */
  whatsapp: "5531977000000",
  whatsappVisivel: "(31) 97700-0000",

  telefoneFixo: "(31) 3771-7333",
  telefoneFixoLink: "+553137717333",

  instagram: "https://instagram.com/hebatech.informatica",
  instagramHandle: "@hebatech.informatica",

  email: "contato@hebatech.com.br",

  endereco: {
    logradouro: "Rua Coronel Randolfo Silva, 214",
    bairro: "Centro",
    cidade: "Sete Lagoas",
    uf: "MG",
    cep: "35700-030",
  },

  /** Termo enviado ao Google Maps no embed e no botão "traçar rota". */
  mapaQuery: "HebaTech Soluções em Informática, Sete Lagoas, MG",

  horario: [
    { dia: "Segunda a sexta", faixa: "08:30 — 18:00" },
    { dia: "Sábado", faixa: "08:30 — 12:00" },
    { dia: "Domingo e feriado", faixa: "Fechado" },
  ],

  operacao: {
    anos: 6,
    atendimentos: 2400,
    garantiaServicoDias: 90,
    garantiaEquipamentoDias: 90,
    prazoDiagnosticoHoras: 48,
  },
} as const;

export const navegacao = [
  { href: "/", rotulo: "Início", indice: "01" },
  { href: "/notebooks", rotulo: "Notebooks", indice: "02" },
  { href: "/produtos", rotulo: "Produtos", indice: "03" },
  { href: "/assistencia", rotulo: "Assistência", indice: "04" },
  { href: "/contato", rotulo: "Contato", indice: "05" },
] as const;

export const enderecoLinha = `${site.endereco.logradouro} — ${site.endereco.bairro}, ${site.endereco.cidade}/${site.endereco.uf}`;
