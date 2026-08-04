/**
 * Ponto único de configuração do site.
 * Tudo que muda de tempos em tempos (telefone, endereço, horário) fica aqui.
 *
 * >>> CONFERIR ANTES DE PUBLICAR: whatsapp, endereco e mapaQuery.
 * O atendimento é só por WhatsApp e Instagram — não há telefone fixo nem
 * e-mail publicados.
 */

export const site = {
  nome: "HebaTech",
  nomeCompleto: "HebaTech Soluções em Informática",
  descricao:
    "Assistência técnica em notebooks e computadores, consultoria e venda de notebooks corporativos seminovos em Sete Lagoas, MG.",
  url: "https://hebatech.com.br",

  /** Número no formato internacional, só dígitos — usado no link wa.me. */
  whatsapp: "5531999612371",
  whatsappVisivel: "(31) 99961-2371",

  instagram: "https://instagram.com/hebatech.informatica",
  instagramHandle: "@hebatech.informatica",

  endereco: {
    logradouro: "Avenida José Sérvulo Soalheiro, 1625",
    bairro: "Jardim Europa",
    cidade: "Sete Lagoas",
    uf: "MG",
    /** Faixa da avenida em Jardim Europa. Conferir com o cliente. */
    cep: "35701-456",
  },

  /**
   * Termo enviado ao Google Maps no embed e no botão "traçar rota".
   * É o endereço, não o nome fantasia: assim o mapa acerta o ponto mesmo
   * antes de a loja ter ficha no Google.
   */
  mapaQuery:
    "Avenida José Sérvulo Soalheiro, 1625 - Jardim Europa, Sete Lagoas - MG, 35701-456",

  horario: [
    { dia: "Segunda a sexta", faixa: "08:30 — 18:00" },
    { dia: "Sábado", faixa: "08:30 — 12:00" },
    { dia: "Domingo e feriado", faixa: "Fechado" },
  ],

  operacao: {
    atendimentos: 3000,
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
