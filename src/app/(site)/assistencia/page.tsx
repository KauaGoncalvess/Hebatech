import type { Metadata } from "next";
import { OrcamentoForm } from "@/components/orcamento-form";
import { PlanosManutencao } from "@/components/planos-manutencao";
import { SectionHead } from "@/components/section-head";
import { site } from "@/data/site";
import { listarPlanosAtivos, listarRegras } from "@/lib/planos";

export const metadata: Metadata = {
  title: "Assistência técnica em notebook e computador",
  description:
    "Diagnóstico em até 48h, orçamento antes de qualquer reparo e 90 dias de garantia. Assistência técnica e contrato de manutenção mensal em Sete Lagoas/MG.",
  alternates: { canonical: "/assistencia" },
};

const TABELA = [
  ["Diagnóstico completo", "Sem custo se você aprovar o reparo", "até 48h"],
  ["Formatação com backup", "A partir de R$ 120", "1 dia útil"],
  ["Limpeza interna e pasta térmica", "A partir de R$ 140", "1 dia útil"],
  ["Upgrade de SSD ou memória", "Mão de obra a partir de R$ 90 + peça", "no mesmo dia"],
  ["Troca de tela", "Mão de obra a partir de R$ 150 + peça", "2 a 5 dias úteis"],
  ["Conector de carga", "A partir de R$ 180", "2 a 4 dias úteis"],
  ["Reparo de placa-mãe", "Sob orçamento após medição", "3 a 7 dias úteis"],
  ["Recuperação de dados", "Sob orçamento após análise do disco", "2 a 10 dias úteis"],
];

const REGRAS = [
  {
    titulo: "Você aprova antes",
    texto:
      "Nenhuma peça é trocada e nenhum reparo começa sem o seu aval por escrito no WhatsApp, com o valor fechado.",
  },
  {
    titulo: "Sem conserto, sem cobrança",
    texto:
      "Se o reparo não for viável ou você desistir, o aparelho volta montado e o diagnóstico não é cobrado.",
  },
  {
    titulo: "Backup antes de formatar",
    texto:
      "Copiamos os seus arquivos para um disco da loja antes de qualquer formatação e devolvemos junto com o aparelho.",
  },
  {
    titulo: "Peça com procedência",
    texto:
      "Tela, bateria e teclado com nota fiscal. A garantia de 90 dias cobre peça e mão de obra do que foi feito.",
  },
];

export const revalidate = 300;

export default async function AssistenciaPage() {
  const [planos, regras] = await Promise.all([listarPlanosAtivos(), listarRegras()]);

  return (
    <>
      <section className="mx-auto max-w-[1600px] border-b border-line pt-28 md:pt-36">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="px-4 pt-10 pb-8 md:px-6 md:pt-16 lg:col-span-7 lg:border-r lg:border-line">
            <p className="eyebrow text-accent">Assistência técnica</p>
            <h1 className="display mt-5 text-title">
              Diagnóstico em
              <br />
              até {site.operacao.prazoDiagnosticoHoras}h. Orçamento
              <br />
              antes do reparo
            </h1>
            <p className="mt-6 max-w-[52ch] text-[14px] leading-relaxed text-white/60">
              Notebook e desktop de qualquer marca. Preencha o formulário abaixo: ele
              monta a mensagem com marca, modelo e defeito e abre o seu WhatsApp. Você
              confere o texto antes de enviar.
            </p>
          </div>

          <dl className="grid grid-cols-2 border-t border-line lg:col-span-5 lg:border-t-0">
            {[
              ["Prazo de diagnóstico", `${site.operacao.prazoDiagnosticoHoras} horas`],
              ["Garantia do serviço", `${site.operacao.garantiaServicoDias} dias`],
              ["Taxa de diagnóstico", "R$ 0 com reparo aprovado"],
              ["Atendimento", "Presencial na loja"],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`border-line p-4 md:p-6 ${i % 2 === 0 ? "border-r" : ""} ${
                  i < 2 ? "border-b" : ""
                }`}
              >
                <dt className="eyebrow text-white/35">{k}</dt>
                <dd className="mt-2 font-mono text-[13px] text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] border-b border-line">
        <div className="flex items-baseline gap-3 border-b border-line px-4 py-4 md:px-6">
          <span className="font-mono text-[11px] text-accent">01</span>
          <h2 className="eyebrow text-white/45">Formulário de orçamento</h2>
        </div>
        <OrcamentoForm />
      </section>

      <section className="mx-auto max-w-[1600px] border-b border-line">
        <SectionHead
          etiqueta="Referência de preço"
          titulo={
            <>
              O que costuma
              <br />
              custar e demorar
            </>
          }
          nota="Valores de partida praticados na loja. O número final só sai depois da medição, e nunca sobe sem você autorizar."
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                {["Serviço", "Valor de partida", "Prazo"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 font-mono text-[9.5px] font-normal tracking-[0.16em] text-white/35 uppercase md:px-6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABELA.map(([servico, valor, prazo]) => (
                <tr key={servico} className="border-b border-line hover:bg-surface">
                  <th
                    scope="row"
                    className="border-r border-line px-4 py-3.5 text-[13px] font-normal text-white md:px-6"
                  >
                    {servico}
                  </th>
                  <td className="border-r border-line px-4 py-3.5 font-mono text-[11.5px] text-white/65 md:px-6">
                    {valor}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11.5px] text-accent md:px-6">
                    {prazo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {planos.length > 0 && (
      <section id="manutencao" className="mx-auto max-w-[1600px] scroll-mt-16 border-b border-line">
        <SectionHead
          etiqueta="Manutenção mensal"
          titulo={
            <>
              Contrato fixo para
              <br />
              empresa sem TI próprio
            </>
          }
          nota="De 3 a 30 máquinas. Você paga um valor previsível por mês em vez de chamar técnico só quando o problema já parou o trabalho."
        />
        <PlanosManutencao planos={planos} regras={regras} />
      </section>
      )}

      <section className="mx-auto max-w-[1600px]">
        <SectionHead
          etiqueta="Regras da casa"
          titulo={
            <>
              Quatro compromissos
              <br />
              que valem sempre
            </>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {REGRAS.map((r, i) => (
            <article
              key={r.titulo}
              className={`relative border-line p-4 md:p-6 ${
                i < 3 ? "border-b lg:border-r lg:border-b-0" : ""
              } ${i % 2 === 0 ? "sm:border-r" : ""} ${
                i === 2 ? "sm:border-b lg:border-b-0" : ""
              }`}
            >
              <span aria-hidden className="absolute top-0 left-0 h-px w-10 bg-accent" />
              <p className="font-mono text-[11px] text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="display mt-3 text-[1.5rem] leading-none">{r.titulo}</h3>
              <p className="mt-3 text-[13px] text-white/55">{r.texto}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
