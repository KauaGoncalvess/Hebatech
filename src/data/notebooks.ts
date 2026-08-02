/**
 * Catálogo de notebooks seminovos.
 * Arquivo editado à mão — não há banco de dados nem painel.
 *
 * Para publicar um novo aparelho: copie um bloco, troque os valores e
 * mantenha o `codigo` único. Para tirar do ar, use `disponivel: false`.
 *
 * Fotos: coloque os arquivos em /public/produtos/<codigo-minusculo>-1.jpg
 * e liste em `fotos`. Sem fotos, o card usa o render técnico vetorial.
 */

export type Marca = "Dell" | "Lenovo" | "HP" | "Acer";
export type FamiliaCpu = "i3" | "i5" | "i7" | "Ryzen 5" | "Ryzen 7";
export type GrauEstado = "A" | "B" | "C";

export type Notebook = {
  codigo: string;
  slug: string;
  marca: Marca;
  modelo: string;
  preco: number;
  /** Preço de referência de mercado, só para comparação. Omitir se não houver. */
  precoReferencia?: number;
  destaque: boolean;
  disponivel: boolean;
  cpu: {
    nome: string;
    familia: FamiliaCpu;
    nucleos: number;
    threads: number;
    clockBase: string;
    clockTurbo: string;
  };
  ramGb: number;
  ramTipo: string;
  ramSlots: string;
  armazenamentoGb: number;
  armazenamentoTipo: string;
  armazenamentoLivre: string;
  tela: {
    polegadas: number;
    resolucao: string;
    painel: string;
    acabamento: "Antirreflexo" | "Brilhante";
  };
  video: string;
  bateria: { saudePct: number; autonomia: string; tipo: string };
  portas: string[];
  teclado: string;
  rede: string;
  sistema: string;
  pesoKg: number;
  estado: { grau: GrauEstado; resumo: string; observacoes: string[] };
  garantiaDias: number;
  fotos: string[];
};

export const notebooks: Notebook[] = [
  {
    codigo: "HT-L5490",
    slug: "dell-latitude-5490-i5-8gb-256gb",
    marca: "Dell",
    modelo: "Latitude 5490",
    preco: 1590,
    precoReferencia: 1890,
    destaque: true,
    disponivel: true,
    cpu: {
      nome: "Intel Core i5-8350U",
      familia: "i5",
      nucleos: 4,
      threads: 8,
      clockBase: "1.7 GHz",
      clockTurbo: "3.6 GHz",
    },
    ramGb: 8,
    ramTipo: "DDR4 2400 MHz",
    ramSlots: "2 slots SODIMM — 1 ocupado, expansível até 32 GB",
    armazenamentoGb: 256,
    armazenamentoTipo: "SSD NVMe M.2",
    armazenamentoLivre: "1 baia 2.5\" livre para HD adicional",
    tela: {
      polegadas: 14,
      resolucao: "1920 x 1080",
      painel: "IPS",
      acabamento: "Antirreflexo",
    },
    video: "Intel UHD Graphics 620 (integrado)",
    bateria: { saudePct: 84, autonomia: "4h a 5h em uso de escritório", tipo: "3 células, 51 Wh" },
    portas: [
      "2x USB 3.1 Type-A",
      "1x USB-C com DisplayPort",
      "HDMI 1.4",
      "RJ-45 Gigabit",
      "Leitor de cartão SD",
      "Combo P2",
    ],
    teclado: "ABNT2 retroiluminado",
    rede: "Wi-Fi 5 (ac) + Bluetooth 4.2",
    sistema: "Windows 11 Pro ativado",
    pesoKg: 1.63,
    estado: {
      grau: "A",
      resumo: "Chassi sem trincas, tela sem pixel morto, dobradiças firmes.",
      observacoes: [
        "Marcas leves de uso na tampa, visíveis apenas contra a luz",
        "Teclado sem brilho de desgaste nas teclas centrais",
        "Bateria original, 84% de saúde medida no diagnóstico",
      ],
    },
    garantiaDias: 90,
    fotos: [],
  },
  {
    codigo: "HT-T480",
    slug: "lenovo-thinkpad-t480-i5-16gb-512gb",
    marca: "Lenovo",
    modelo: "ThinkPad T480",
    preco: 2190,
    precoReferencia: 2490,
    destaque: true,
    disponivel: true,
    cpu: {
      nome: "Intel Core i5-8250U",
      familia: "i5",
      nucleos: 4,
      threads: 8,
      clockBase: "1.6 GHz",
      clockTurbo: "3.4 GHz",
    },
    ramGb: 16,
    ramTipo: "DDR4 2400 MHz",
    ramSlots: "2 slots SODIMM — 2 ocupados (8+8)",
    armazenamentoGb: 512,
    armazenamentoTipo: "SSD NVMe M.2",
    armazenamentoLivre: "1 slot M.2 2242 livre",
    tela: {
      polegadas: 14,
      resolucao: "1920 x 1080",
      painel: "IPS",
      acabamento: "Antirreflexo",
    },
    video: "Intel UHD Graphics 620 (integrado)",
    bateria: {
      saudePct: 91,
      autonomia: "7h a 9h em uso de escritório",
      tipo: "Sistema duplo: interna 24 Wh + externa 24 Wh",
    },
    portas: [
      "2x USB 3.1 Type-A",
      "2x USB-C (1 Thunderbolt 3)",
      "HDMI 1.4",
      "RJ-45 Gigabit",
      "Leitor de cartão microSD",
      "Combo P2",
    ],
    teclado: "ABNT2 retroiluminado com TrackPoint",
    rede: "Wi-Fi 5 (ac) + Bluetooth 4.2",
    sistema: "Windows 11 Pro ativado",
    pesoKg: 1.58,
    estado: {
      grau: "A",
      resumo: "Troca a quente de bateria funcionando, leitor biométrico testado.",
      observacoes: [
        "Ambas as baterias substituídas por novas na revisão",
        "Base emborrachada íntegra, sem descascado",
        "Tampa com um risco fino de 2 cm no canto inferior direito",
      ],
    },
    garantiaDias: 90,
    fotos: [],
  },
  {
    codigo: "HT-E840G5",
    slug: "hp-elitebook-840-g5-i5-8gb-256gb",
    marca: "HP",
    modelo: "EliteBook 840 G5",
    preco: 1790,
    destaque: true,
    disponivel: true,
    cpu: {
      nome: "Intel Core i5-8250U",
      familia: "i5",
      nucleos: 4,
      threads: 8,
      clockBase: "1.6 GHz",
      clockTurbo: "3.4 GHz",
    },
    ramGb: 8,
    ramTipo: "DDR4 2400 MHz",
    ramSlots: "2 slots SODIMM — 1 ocupado, expansível até 32 GB",
    armazenamentoGb: 256,
    armazenamentoTipo: "SSD NVMe M.2",
    armazenamentoLivre: "Sem baia adicional",
    tela: {
      polegadas: 14,
      resolucao: "1920 x 1080",
      painel: "IPS",
      acabamento: "Antirreflexo",
    },
    video: "Intel UHD Graphics 620 (integrado)",
    bateria: { saudePct: 79, autonomia: "4h a 6h em uso de escritório", tipo: "3 células, 50 Wh" },
    portas: [
      "2x USB 3.1 Type-A",
      "2x USB-C Thunderbolt 3",
      "HDMI 1.4",
      "RJ-45 Gigabit",
      "Combo P2",
    ],
    teclado: "ABNT2 retroiluminado, resistente a respingos",
    rede: "Wi-Fi 5 (ac) + Bluetooth 4.2",
    sistema: "Windows 11 Pro ativado",
    pesoKg: 1.48,
    estado: {
      grau: "B",
      resumo: "Funcional em tudo, com desgaste estético visível no apoio de mão.",
      observacoes: [
        "Brilho de uso no descanso de pulso do lado esquerdo",
        "Moldura da tela com um ponto de tinta lascada",
        "Bateria em 79% — troca opcional por R$ 320 no ato da compra",
      ],
    },
    garantiaDias: 90,
    fotos: [],
  },
  {
    codigo: "HT-L7490",
    slug: "dell-latitude-7490-i7-16gb-512gb",
    marca: "Dell",
    modelo: "Latitude 7490",
    preco: 2690,
    destaque: true,
    disponivel: true,
    cpu: {
      nome: "Intel Core i7-8650U",
      familia: "i7",
      nucleos: 4,
      threads: 8,
      clockBase: "1.9 GHz",
      clockTurbo: "4.2 GHz",
    },
    ramGb: 16,
    ramTipo: "DDR4 2400 MHz",
    ramSlots: "2 slots SODIMM — 2 ocupados (8+8)",
    armazenamentoGb: 512,
    armazenamentoTipo: "SSD NVMe M.2",
    armazenamentoLivre: "Sem baia adicional",
    tela: {
      polegadas: 14,
      resolucao: "1920 x 1080",
      painel: "IPS",
      acabamento: "Antirreflexo",
    },
    video: "Intel UHD Graphics 620 (integrado)",
    bateria: { saudePct: 88, autonomia: "6h a 8h em uso de escritório", tipo: "4 células, 60 Wh" },
    portas: [
      "2x USB 3.1 Type-A",
      "2x USB-C Thunderbolt 3",
      "HDMI 1.4",
      "RJ-45 Gigabit",
      "Leitor de cartão microSD",
      "Combo P2",
    ],
    teclado: "ABNT2 retroiluminado",
    rede: "Wi-Fi 5 (ac) + Bluetooth 4.2",
    sistema: "Windows 11 Pro ativado",
    pesoKg: 1.4,
    estado: {
      grau: "A",
      resumo: "Aparelho de lote corporativo com pouco uso, chassi de carbono íntegro.",
      observacoes: [
        "Sem marcas de uso no apoio de mão",
        "Leitor de digital e câmera testados",
        "Pasta térmica trocada na revisão",
      ],
    },
    garantiaDias: 90,
    fotos: [],
  },
  {
    codigo: "HT-T14G1",
    slug: "lenovo-thinkpad-t14-gen1-i5-16gb-512gb",
    marca: "Lenovo",
    modelo: "ThinkPad T14 Gen 1",
    preco: 2990,
    destaque: false,
    disponivel: true,
    cpu: {
      nome: "Intel Core i5-10310U",
      familia: "i5",
      nucleos: 4,
      threads: 8,
      clockBase: "1.7 GHz",
      clockTurbo: "4.4 GHz",
    },
    ramGb: 16,
    ramTipo: "DDR4 2666 MHz",
    ramSlots: "8 GB soldados + 1 slot com 8 GB",
    armazenamentoGb: 512,
    armazenamentoTipo: "SSD NVMe M.2",
    armazenamentoLivre: "Sem baia adicional",
    tela: {
      polegadas: 14,
      resolucao: "1920 x 1080",
      painel: "IPS",
      acabamento: "Antirreflexo",
    },
    video: "Intel UHD Graphics (integrado)",
    bateria: { saudePct: 93, autonomia: "8h a 10h em uso de escritório", tipo: "3 células, 50 Wh" },
    portas: [
      "2x USB 3.2 Type-A",
      "2x USB-C (1 Thunderbolt 3)",
      "HDMI 2.0",
      "RJ-45 Gigabit",
      "Combo P2",
    ],
    teclado: "ABNT2 retroiluminado com TrackPoint",
    rede: "Wi-Fi 6 (ax) + Bluetooth 5.1",
    sistema: "Windows 11 Pro ativado",
    pesoKg: 1.55,
    estado: {
      grau: "A",
      resumo: "O mais novo do estoque. Praticamente sem sinal de uso.",
      observacoes: [
        "Tampa e base sem riscos perceptíveis",
        "Bateria em 93% de saúde",
        "Acompanha carregador USB-C original de 65 W",
      ],
    },
    garantiaDias: 90,
    fotos: [],
  },
  {
    codigo: "HT-P640G4",
    slug: "hp-probook-640-g4-i5-8gb-256gb",
    marca: "HP",
    modelo: "ProBook 640 G4",
    preco: 1490,
    destaque: false,
    disponivel: true,
    cpu: {
      nome: "Intel Core i5-8250U",
      familia: "i5",
      nucleos: 4,
      threads: 8,
      clockBase: "1.6 GHz",
      clockTurbo: "3.4 GHz",
    },
    ramGb: 8,
    ramTipo: "DDR4 2400 MHz",
    ramSlots: "2 slots SODIMM — 1 ocupado, expansível até 32 GB",
    armazenamentoGb: 256,
    armazenamentoTipo: "SSD SATA M.2",
    armazenamentoLivre: "1 baia 2.5\" livre para HD adicional",
    tela: {
      polegadas: 14,
      resolucao: "1366 x 768",
      painel: "TN",
      acabamento: "Antirreflexo",
    },
    video: "Intel UHD Graphics 620 (integrado)",
    bateria: { saudePct: 76, autonomia: "3h a 4h em uso de escritório", tipo: "3 células, 48 Wh" },
    portas: [
      "3x USB 3.1 Type-A",
      "1x USB-C",
      "HDMI 1.4",
      "VGA",
      "RJ-45 Gigabit",
      "Combo P2",
    ],
    teclado: "ABNT2 sem retroiluminação",
    rede: "Wi-Fi 5 (ac) + Bluetooth 4.2",
    sistema: "Windows 11 Pro ativado",
    pesoKg: 1.75,
    estado: {
      grau: "B",
      resumo: "Opção de entrada. Cumpre bem tarefa de escritório e sistema web.",
      observacoes: [
        "Tela HD com ângulo de visão limitado — confira pessoalmente na loja",
        "Riscos leves espalhados na tampa",
        "Bateria em 76% — recomendamos uso com carregador na mesa",
      ],
    },
    garantiaDias: 90,
    fotos: [],
  },
  {
    codigo: "HT-L5400",
    slug: "dell-latitude-5400-i5-16gb-256gb",
    marca: "Dell",
    modelo: "Latitude 5400",
    preco: 1990,
    destaque: false,
    disponivel: true,
    cpu: {
      nome: "Intel Core i5-8365U",
      familia: "i5",
      nucleos: 4,
      threads: 8,
      clockBase: "1.6 GHz",
      clockTurbo: "4.1 GHz",
    },
    ramGb: 16,
    ramTipo: "DDR4 2666 MHz",
    ramSlots: "2 slots SODIMM — 2 ocupados (8+8)",
    armazenamentoGb: 256,
    armazenamentoTipo: "SSD NVMe M.2",
    armazenamentoLivre: "1 slot M.2 livre",
    tela: {
      polegadas: 14,
      resolucao: "1920 x 1080",
      painel: "IPS",
      acabamento: "Antirreflexo",
    },
    video: "Intel UHD Graphics 620 (integrado)",
    bateria: { saudePct: 85, autonomia: "5h a 7h em uso de escritório", tipo: "4 células, 68 Wh" },
    portas: [
      "2x USB 3.1 Type-A",
      "1x USB-C com DisplayPort",
      "HDMI 1.4",
      "RJ-45 Gigabit",
      "Leitor de cartão microSD",
      "Combo P2",
    ],
    teclado: "ABNT2 retroiluminado",
    rede: "Wi-Fi 5 (ac) + Bluetooth 5.0",
    sistema: "Windows 11 Pro ativado",
    pesoKg: 1.6,
    estado: {
      grau: "A",
      resumo: "Bateria de 68 Wh, boa autonomia para quem trabalha fora do escritório.",
      observacoes: [
        "Chassi sem amassado, borrachinhas da base completas",
        "Tela sem mancha de pressão",
        "Limpeza interna e troca de pasta térmica feitas",
      ],
    },
    garantiaDias: 90,
    fotos: [],
  },
  {
    codigo: "HT-TMP214",
    slug: "acer-travelmate-p214-i5-8gb-256gb",
    marca: "Acer",
    modelo: "TravelMate P214-52",
    preco: 1690,
    destaque: false,
    disponivel: true,
    cpu: {
      nome: "Intel Core i5-1035G1",
      familia: "i5",
      nucleos: 4,
      threads: 8,
      clockBase: "1.0 GHz",
      clockTurbo: "3.6 GHz",
    },
    ramGb: 8,
    ramTipo: "DDR4 2666 MHz",
    ramSlots: "2 slots SODIMM — 1 ocupado, expansível até 32 GB",
    armazenamentoGb: 256,
    armazenamentoTipo: "SSD NVMe M.2",
    armazenamentoLivre: "1 baia 2.5\" livre para HD adicional",
    tela: {
      polegadas: 14,
      resolucao: "1920 x 1080",
      painel: "IPS",
      acabamento: "Antirreflexo",
    },
    video: "Intel UHD Graphics G1 (integrado)",
    bateria: { saudePct: 87, autonomia: "6h a 7h em uso de escritório", tipo: "3 células, 48 Wh" },
    portas: [
      "3x USB 3.2 Type-A",
      "1x USB-C",
      "HDMI 2.0",
      "RJ-45 Gigabit",
      "Combo P2",
    ],
    teclado: "ABNT2 retroiluminado",
    rede: "Wi-Fi 6 (ax) + Bluetooth 5.0",
    sistema: "Windows 11 Pro ativado",
    pesoKg: 1.6,
    estado: {
      grau: "A",
      resumo: "Wi-Fi 6 e HDMI 2.0 pelo menor preço da lista com tela Full HD IPS.",
      observacoes: [
        "Aparelho de lote escolar com uso leve",
        "Sem marca no apoio de mão",
        "Carregador original incluso",
      ],
    },
    garantiaDias: 90,
    fotos: [],
  },
  {
    codigo: "HT-X1C6",
    slug: "lenovo-thinkpad-x1-carbon-6-i7-16gb-512gb",
    marca: "Lenovo",
    modelo: "ThinkPad X1 Carbon 6ª geração",
    preco: 3190,
    precoReferencia: 3690,
    destaque: true,
    disponivel: true,
    cpu: {
      nome: "Intel Core i7-8650U",
      familia: "i7",
      nucleos: 4,
      threads: 8,
      clockBase: "1.9 GHz",
      clockTurbo: "4.2 GHz",
    },
    ramGb: 16,
    ramTipo: "LPDDR3 2133 MHz",
    ramSlots: "Memória soldada — não expansível",
    armazenamentoGb: 512,
    armazenamentoTipo: "SSD NVMe M.2",
    armazenamentoLivre: "Sem baia adicional",
    tela: {
      polegadas: 14,
      resolucao: "1920 x 1080",
      painel: "IPS 300 nits",
      acabamento: "Antirreflexo",
    },
    video: "Intel UHD Graphics 620 (integrado)",
    bateria: { saudePct: 82, autonomia: "7h a 9h em uso de escritório", tipo: "4 células, 57 Wh" },
    portas: [
      "2x USB 3.1 Type-A",
      "2x USB-C Thunderbolt 3",
      "HDMI 1.4",
      "RJ-45 via adaptador (incluso)",
      "Combo P2",
    ],
    teclado: "ABNT2 retroiluminado com TrackPoint",
    rede: "Wi-Fi 5 (ac) + Bluetooth 4.2",
    sistema: "Windows 11 Pro ativado",
    pesoKg: 1.13,
    estado: {
      grau: "A",
      resumo: "1,13 kg. O mais leve do estoque, chassi de fibra de carbono.",
      observacoes: [
        "Acabamento soft touch da tampa preservado, sem descascado",
        "Dobradiça firme, sem folga",
        "Acompanha adaptador de rede e carregador original de 65 W",
      ],
    },
    garantiaDias: 90,
    fotos: [],
  },
  {
    codigo: "HT-E840G6",
    slug: "hp-elitebook-840-g6-i7-16gb-512gb",
    marca: "HP",
    modelo: "EliteBook 840 G6",
    preco: 2590,
    destaque: false,
    disponivel: true,
    cpu: {
      nome: "Intel Core i7-8565U",
      familia: "i7",
      nucleos: 4,
      threads: 8,
      clockBase: "1.8 GHz",
      clockTurbo: "4.6 GHz",
    },
    ramGb: 16,
    ramTipo: "DDR4 2400 MHz",
    ramSlots: "2 slots SODIMM — 2 ocupados (8+8)",
    armazenamentoGb: 512,
    armazenamentoTipo: "SSD NVMe M.2",
    armazenamentoLivre: "Sem baia adicional",
    tela: {
      polegadas: 14,
      resolucao: "1920 x 1080",
      painel: "IPS 400 nits",
      acabamento: "Antirreflexo",
    },
    video: "Intel UHD Graphics 620 (integrado)",
    bateria: { saudePct: 90, autonomia: "7h a 9h em uso de escritório", tipo: "3 células, 50 Wh" },
    portas: [
      "2x USB 3.1 Type-A",
      "2x USB-C Thunderbolt 3",
      "HDMI 1.4",
      "RJ-45 Gigabit",
      "Combo P2",
    ],
    teclado: "ABNT2 retroiluminado, resistente a respingos",
    rede: "Wi-Fi 5 (ac) + Bluetooth 5.0",
    sistema: "Windows 11 Pro ativado",
    pesoKg: 1.49,
    estado: {
      grau: "A",
      resumo: "Tela de 400 nits — a mais clara do estoque, boa para ambiente iluminado.",
      observacoes: [
        "Chassi de alumínio sem amassado",
        "Bateria em 90% de saúde",
        "Tampa da webcam física funcionando",
      ],
    },
    garantiaDias: 90,
    fotos: [],
  },
  {
    codigo: "HT-L3420",
    slug: "dell-latitude-3420-i3-8gb-256gb",
    marca: "Dell",
    modelo: "Latitude 3420",
    preco: 1690,
    destaque: false,
    disponivel: true,
    cpu: {
      nome: "Intel Core i3-1115G4",
      familia: "i3",
      nucleos: 2,
      threads: 4,
      clockBase: "3.0 GHz",
      clockTurbo: "4.1 GHz",
    },
    ramGb: 8,
    ramTipo: "DDR4 3200 MHz",
    ramSlots: "2 slots SODIMM — 1 ocupado, expansível até 64 GB",
    armazenamentoGb: 256,
    armazenamentoTipo: "SSD NVMe M.2",
    armazenamentoLivre: "1 baia 2.5\" livre para HD adicional",
    tela: {
      polegadas: 14,
      resolucao: "1366 x 768",
      painel: "TN",
      acabamento: "Antirreflexo",
    },
    video: "Intel UHD Graphics (integrado)",
    bateria: { saudePct: 95, autonomia: "7h a 8h em uso de escritório", tipo: "3 células, 54 Wh" },
    portas: [
      "2x USB 3.2 Type-A",
      "1x USB-C com DisplayPort",
      "HDMI 1.4",
      "RJ-45 Gigabit",
      "Combo P2",
    ],
    teclado: "ABNT2 sem retroiluminação",
    rede: "Wi-Fi 6 (ax) + Bluetooth 5.1",
    sistema: "Windows 11 Pro ativado",
    pesoKg: 1.63,
    estado: {
      grau: "A",
      resumo: "Aparelho de 2021 com bateria em 95%. Tela HD é a única concessão.",
      observacoes: [
        "Praticamente sem sinal de uso, veio de lote lacrado de contrato",
        "Tela 1366x768 — ideal para sistema de gestão e planilha simples",
        "Upgrade para 16 GB por R$ 210 no ato da compra",
      ],
    },
    garantiaDias: 90,
    fotos: [],
  },
  {
    codigo: "HT-L14G2",
    slug: "lenovo-thinkpad-l14-gen2-ryzen5-16gb-512gb",
    marca: "Lenovo",
    modelo: "ThinkPad L14 Gen 2",
    preco: 2390,
    destaque: false,
    disponivel: true,
    cpu: {
      nome: "AMD Ryzen 5 PRO 4650U",
      familia: "Ryzen 5",
      nucleos: 6,
      threads: 12,
      clockBase: "2.1 GHz",
      clockTurbo: "4.0 GHz",
    },
    ramGb: 16,
    ramTipo: "DDR4 3200 MHz",
    ramSlots: "2 slots SODIMM — 2 ocupados (8+8)",
    armazenamentoGb: 512,
    armazenamentoTipo: "SSD NVMe M.2",
    armazenamentoLivre: "Sem baia adicional",
    tela: {
      polegadas: 14,
      resolucao: "1920 x 1080",
      painel: "IPS",
      acabamento: "Antirreflexo",
    },
    video: "AMD Radeon Graphics (integrado)",
    bateria: { saudePct: 89, autonomia: "8h a 10h em uso de escritório", tipo: "3 células, 45 Wh" },
    portas: [
      "2x USB 3.2 Type-A",
      "2x USB-C",
      "HDMI 2.0",
      "RJ-45 Gigabit",
      "Leitor de cartão SD",
      "Combo P2",
    ],
    teclado: "ABNT2 retroiluminado com TrackPoint",
    rede: "Wi-Fi 6 (ax) + Bluetooth 5.1",
    sistema: "Windows 11 Pro ativado",
    pesoKg: 1.61,
    estado: {
      grau: "A",
      resumo: "6 núcleos e 12 threads — o mais rápido em tarefa pesada por este preço.",
      observacoes: [
        "Melhor escolha para quem roda máquina virtual ou edita planilha grande",
        "Bateria em 89% de saúde",
        "Sem marca no apoio de mão",
      ],
    },
    garantiaDias: 90,
    fotos: [],
  },
];

export const notebooksDisponiveis = notebooks.filter((n) => n.disponivel);

export const notebooksDestaque = notebooksDisponiveis
  .filter((n) => n.destaque)
  .slice(0, 4);

export function buscarPorSlug(slug: string): Notebook | undefined {
  return notebooks.find((n) => n.slug === slug);
}

/** Limites de preço reais do catálogo — alimenta o filtro sem número mágico. */
export const faixaPrecoCatalogo = {
  min: Math.min(...notebooksDisponiveis.map((n) => n.preco)),
  max: Math.max(...notebooksDisponiveis.map((n) => n.preco)),
};
