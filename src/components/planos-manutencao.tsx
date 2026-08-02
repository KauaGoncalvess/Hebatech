import { waContrato } from "@/lib/whatsapp";

type Plano = {
  codigo: string;
  nome: string;
  faixa: string;
  mensal: string;
  visitas: string;
  destaque: boolean;
  inclui: string[];
};

const PLANOS: Plano[] = [
  {
    codigo: "MP-01",
    nome: "Essencial",
    faixa: "Até 5 máquinas",
    mensal: "R$ 390",
    visitas: "1 visita por mês",
    destaque: false,
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
    codigo: "MP-02",
    nome: "Operação",
    faixa: "De 6 a 15 máquinas",
    mensal: "R$ 790",
    visitas: "2 visitas por mês",
    destaque: true,
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
    codigo: "MP-03",
    nome: "Parque completo",
    faixa: "De 16 a 30 máquinas",
    mensal: "Sob proposta",
    visitas: "Visita semanal",
    destaque: false,
    inclui: [
      "Tudo do plano Operação",
      "Visita técnica semanal com técnico fixo",
      "Atendimento emergencial em até 4h úteis",
      "Gestão de rede, cabeamento e Wi-Fi",
      "Padronização de imagem do Windows",
      "Plano de reposição de máquina em 12 e 24 meses",
      "Relatório mensal do parque por e-mail",
    ],
  },
];

const REGRAS = [
  ["Sem fidelidade", "Contrato mensal. Você cancela avisando com 30 dias."],
  ["Peça à parte", "A mensalidade cobre mão de obra e visita. Peça é orçada e aprovada por você."],
  ["Nota fiscal", "Emitida todo mês, com o serviço discriminado para lançar no contábil."],
  ["Fora de Sete Lagoas", "Atendemos a região com taxa de deslocamento fechada no contrato."],
];

/** Planos de contrato mensal para empresa sem TI próprio. */
export function PlanosManutencao() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {PLANOS.map((p, i) => (
          <article
            key={p.codigo}
            className={`relative flex flex-col border-line ${
              i < PLANOS.length - 1 ? "border-b lg:border-r lg:border-b-0" : ""
            } ${p.destaque ? "bg-surface" : ""}`}
          >
            {p.destaque && (
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-accent" />
            )}

            <div className="flex items-start justify-between gap-4 px-4 pt-6 md:px-6">
              <div>
                <p className="font-mono text-[10px] tracking-[0.18em] text-white/35">
                  {p.codigo}
                </p>
                <h3 className="display mt-2 text-sub">{p.nome}</h3>
                <p className="mt-2 font-mono text-[11px] text-accent">{p.faixa}</p>
              </div>
              {p.destaque && (
                <span className="shrink-0 border border-accent px-2 py-1 font-mono text-[9px] tracking-[0.14em] text-accent uppercase">
                  Mais contratado
                </span>
              )}
            </div>

            <div className="mt-5 border-y border-line px-4 py-4 md:px-6">
              <p className="display text-[2.4rem] leading-none">{p.mensal}</p>
              <p className="mt-2 font-mono text-[10.5px] tracking-[0.12em] text-white/45">
                {p.mensal === "Sob proposta" ? p.visitas : `por mês · ${p.visitas}`}
              </p>
            </div>

            <ul>
              {p.inclui.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-line px-4 py-2.5 text-[12.5px] text-white/70 md:px-6"
                >
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={waContrato({ plano: `${p.nome} (${p.codigo})`, maquinas: p.faixa })}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-auto flex items-center justify-between px-4 py-4 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors md:px-6 ${
                p.destaque
                  ? "bg-accent text-black hover:bg-white"
                  : "border-t border-line hover:bg-accent hover:text-black"
              }`}
            >
              Pedir proposta
              <span aria-hidden>→</span>
            </a>
          </article>
        ))}
      </div>

      <dl className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {REGRAS.map(([k, v], i) => (
          <div
            key={k}
            className={`border-line p-4 md:p-6 ${i < 3 ? "border-b lg:border-b-0" : ""} ${
              i % 2 === 0 ? "sm:border-r" : ""
            } ${i < 3 ? "lg:border-r" : ""}`}
          >
            <dt className="eyebrow text-accent">{k}</dt>
            <dd className="mt-3 max-w-[32ch] text-[12.5px] text-white/55">{v}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
