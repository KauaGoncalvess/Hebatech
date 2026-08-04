import type { Metadata } from "next";
import { Aura } from "@/components/aura";
import Link from "next/link";
import { Faq } from "@/components/faq";
import { OrcamentoForm } from "@/components/orcamento-form";
import { SectionHead } from "@/components/section-head";
import { faqJsonLd, perguntas } from "@/data/perguntas";
import { site } from "@/data/site";

export const revalidate = 300;

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
      "Copiamos os seus arquivos para um disco da loja antes de qualquer formatação e devolvemos junto.",
  },
  {
    titulo: "Peça com procedência",
    texto:
      "Tela, bateria e teclado com nota fiscal. A garantia de 90 dias cobre peça e mão de obra do que foi feito.",
  },
];

export default function AssistenciaPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <Aura forte className="-top-32 -left-24 h-[440px] w-[440px] md:h-[600px] md:w-[600px]" />
        <div className="relative mx-auto max-w-[1180px] px-5 pt-32 pb-12 md:pt-40 md:pb-16">
        <p className="eyebrow text-accent">Assistência técnica</p>
        <h1 className="display mt-5 max-w-[16ch] text-title">
          Diagnóstico em até {site.operacao.prazoDiagnosticoHoras}h, orçamento antes do
          reparo
        </h1>
        <p className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-white/60">
          Notebook e desktop de qualquer marca. Preencha o formulário abaixo: ele monta a
          mensagem com marca, modelo e defeito e abre o seu WhatsApp. Você confere o texto
          antes de enviar.
        </p>

        <ul className="mt-8 flex flex-wrap gap-2">
          {[
            `Diagnóstico em ${site.operacao.prazoDiagnosticoHoras}h`,
            `${site.operacao.garantiaServicoDias} dias de garantia`,
            "Taxa de diagnóstico R$ 0 com reparo aprovado",
          ].map((t) => (
            <li
              key={t}
              className="rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[11.5px] text-white/60"
            >
              {t}
            </li>
          ))}
        </ul>

        {/* Quem já deixou o aparelho não vem aqui pedir orçamento — vem saber se ficou pronto. */}
        <p className="mt-7 text-[14px] text-white/50">
          Já deixou o aparelho na loja?{" "}
          <Link
            href="/acompanhar"
            className="text-accent underline underline-offset-4 transition-colors hover:text-white"
          >
            Acompanhe o conserto pelo código da ordem
          </Link>
          .
        </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 pb-20">
        <OrcamentoForm />
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-16 md:py-20">
        <SectionHead
          etiqueta="Referência de preço"
          titulo="O que costuma custar e demorar"
          nota="Valores de partida praticados na loja. O número final só sai depois da medição, e nunca sobe sem você autorizar."
        />

        <div className="card divide-y divide-line overflow-hidden">
          {TABELA.map(([servico, valor, prazo]) => (
            <div
              key={servico}
              className="grid gap-2 p-5 transition-colors hover:bg-surface-2 sm:grid-cols-[1.3fr_1.4fr_auto] sm:items-center sm:gap-6"
            >
              <p className="text-[14.5px] text-white">{servico}</p>
              <p className="font-mono text-[12.5px] text-white/55">{valor}</p>
              <p className="font-mono text-[12.5px] whitespace-nowrap text-accent">{prazo}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-16 md:py-20">
        <div className="spot card grid gap-6 p-6 md:grid-cols-[1.3fr_auto] md:items-center md:p-10">
          <div>
            <p className="eyebrow text-accent">Para empresa</p>
            <h2 className="display mt-4 max-w-[22ch] text-sub">
              Tem várias máquinas e nenhum TI?
            </h2>
            <p className="mt-4 max-w-[56ch] text-[14px] leading-relaxed text-white/55">
              Existe contrato mensal com visita programada, chamado remoto e backup
              testado, de 3 a 30 máquinas — sai bem mais barato que chamar técnico só
              quando o trabalho já parou.
            </p>
          </div>
          <Link
            href="/manutencao"
            className="flex h-14 items-center justify-center rounded-full bg-surface-2 px-8 font-mono text-[12px] tracking-[0.12em] whitespace-nowrap uppercase transition-colors hover:bg-surface-3"
          >
            Ver planos
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 pb-20 md:pb-28">
        <SectionHead
          etiqueta="Regras da casa"
          titulo="Quatro compromissos que valem sempre"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REGRAS.map((r, i) => (
            <article key={r.titulo} className="spot card p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-mono text-[12px] font-bold text-black">
                {i + 1}
              </span>
              <h3 className="display mt-5 text-[1.35rem] leading-none">{r.titulo}</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-white/55">{r.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="duvidas" className="mx-auto max-w-[1180px] scroll-mt-28 px-5 pb-20 md:pb-28">
        <SectionHead
          etiqueta="Perguntas frequentes"
          titulo="O que mais perguntam no balcão"
          nota="Se a sua dúvida não estiver aqui, manda no WhatsApp que respondemos."
        />

        <Faq perguntas={perguntas} />
      </section>

      <script
        type="application/ld+json"
        // Perguntas e respostas fixas do arquivo — nada vem do visitante.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(perguntas)) }}
      />
    </>
  );
}
