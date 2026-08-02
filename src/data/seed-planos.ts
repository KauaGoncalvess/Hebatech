/**
 * Planos de manutenção mensal — carga inicial.
 *
 * Mesma lógica do catálogo: é o que o site mostra enquanto o Supabase não
 * estiver configurado, e é o que o `npm run seed` grava no banco. Depois disso,
 * a edição do dia a dia é feita em /admin/planos.
 */

import type { Plano, RegraManutencao } from "@/types/plano";

export const seedPlanos: Plano[] = [
  {
    id: "MP-01",
    codigo: "MP-01",
    nome: "Essencial",
    faixa: "Até 5 máquinas",
    precoMensal: 390,
    visitas: "1 visita por mês",
    destaque: false,
    ativo: true,
    ordem: 0,
    inclui: [
      "Visita técnica programada, 1x por mês",
      "Suporte remoto no horário comercial",
      "Limpeza e revisão preventiva das máquinas",
      "Atualização de Windows e antivírus",
      "Inventário de equipamento e licença",
      "Mão de obra de reparo com 20% de desconto",
    ],
  },
  {
    id: "MP-02",
    codigo: "MP-02",
    nome: "Operação",
    faixa: "De 6 a 15 máquinas",
    precoMensal: 790,
    visitas: "2 visitas por mês",
    destaque: true,
    ativo: true,
    ordem: 1,
    inclui: [
      "Tudo do plano Essencial",
      "Visita técnica programada, 2x por mês",
      "Chamado remoto ilimitado no horário comercial",
      "Rotina de backup com teste de restauração trimestral",
      "Monitoramento de disco e de saúde de bateria",
      "Máquina reserva durante reparo que passe de 48h",
      "Mão de obra de reparo inclusa no contrato",
    ],
  },
  {
    id: "MP-03",
    codigo: "MP-03",
    nome: "Completo",
    faixa: "De 16 a 30 máquinas",
    precoMensal: null,
    visitas: "Visita semanal",
    destaque: false,
    ativo: true,
    ordem: 2,
    inclui: [
      "Tudo do plano Operação",
      "Visita técnica semanal com técnico fixo",
      "Atendimento emergencial em até 4h úteis",
      "Gestão de rede, cabeamento e Wi-Fi",
      "Padronização de imagem do Windows",
      "Plano de reposição de máquina em 12 e 24 meses",
      "Relatório mensal dos equipamentos por e-mail",
    ],
  },
];

export const seedRegras: RegraManutencao[] = [
  {
    titulo: "Sem fidelidade",
    texto: "Contrato mensal. Você cancela avisando com 30 dias.",
  },
  {
    titulo: "Peça à parte",
    texto:
      "A mensalidade cobre mão de obra e visita. Peça é orçada e aprovada por você.",
  },
  {
    titulo: "Nota fiscal",
    texto: "Emitida todo mês, com o serviço discriminado para lançar no contábil.",
  },
  {
    titulo: "Fora de Sete Lagoas",
    texto: "Atendemos a região com taxa de deslocamento fechada no contrato.",
  },
];

/** Chave usada na tabela `configuracoes` para guardar as regras. */
export const CHAVE_REGRAS = "manutencao_regras";
