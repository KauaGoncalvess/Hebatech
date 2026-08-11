import type { Metadata } from "next";
import { Aura } from "@/components/aura";
import Link from "next/link";
import { PlanosManutencao } from "@/components/planos-manutencao";
import { SectionHead } from "@/components/section-head";
import { site } from "@/data/site";
import { listarPlanosAtivos, listarRegras } from "@/lib/planos";
import { waGenerico } from "@/lib/whatsapp";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Manutenção mensal de computadores para empresa",
  description: `Contrato de manutenção mensal para empresa sem TI própria em ${site.endereco.cidade}/${site.endereco.uf}. Visita programada, chamado remoto e backup testado. Sem fidelidade.`,
  alternates: { canonical: "/manutencao" },
};

const DORES = [
  [
    "Só chamam técnico quando já parou",
    "Aí o problema virou urgência, custa mais caro e o trabalho fica parado esperando peça.",
  ],
  [
    "Ninguém sabe o que tem na empresa",
    "Sem inventário, cada compra vira adivinhação e máquina boa fica parada enquanto se compra outra.",
  ],
  [
    "Backup que ninguém testa",
    "Backup só serve se alguém já provou que ele volta. Testamos a restauração, não só a cópia.",
  ],
];

export default async function ManutencaoPage() {
  const [planos, regras] = await Promise.all([listarPlanosAtivos(), listarRegras()]);

  const trilhaLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: site.url },
      { "@type": "ListItem", position: 2, name: "Manutenção mensal", item: `${site.url}/manutencao` },
    ],
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <Aura forte className="-top-32 -left-24 h-[440px] w-[440px] md:h-[600px] md:w-[600px]" />
        <div className="relative mx-auto max-w-[1180px] px-5 pt-32 pb-12 md:pt-40 md:pb-16">
        <p className="eyebrow text-accent">Para empresa</p>
        <h1 className="display mt-5 max-w-[17ch] text-title">
          Manutenção mensal para quem não tem TI próprio
        </h1>
        <p className="mt-6 max-w-[58ch] text-corpo-g leading-relaxed text-texto-2">
          Você paga um valor previsível por mês em vez de chamar
          técnico só quando o problema já parou o trabalho — com visita programada,
          chamado remoto no horário comercial e backup testado.
        </p>

        <ul className="mt-8 flex flex-wrap gap-2">
          {["Sem fidelidade", "Visita programada", "Chamado remoto", "Nota fiscal todo mês"].map(
            (t) => (
              <li
                key={t}
                className="rounded-full bg-surface-2 px-4 py-2.5 font-mono text-rotulo text-texto-3"
              >
                {t}
              </li>
            ),
          )}
        </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-12 md:py-16">
        <SectionHead
          etiqueta="Por que contratar"
          titulo="O que costuma dar errado sem contrato"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {DORES.map(([titulo, texto]) => (
            <article key={titulo} className="card p-6">
              <h3 className="display max-w-[18ch] text-[1.4rem] leading-[0.95]">{titulo}</h3>
              <p className="mt-4 text-nota leading-relaxed text-texto-3">{texto}</p>
            </article>
          ))}
        </div>
      </section>

      {planos.length > 0 ? (
        <section className="mx-auto max-w-[1180px] px-5 py-12 md:py-16">
          <SectionHead
            etiqueta="Planos"
            titulo="Escolha pelo tamanho da sua operação"
            nota="O valor final sai depois de uma visita rápida para conferir quantas máquinas existem e em que estado elas estão."
          />
          <PlanosManutencao planos={planos} regras={regras} />
        </section>
      ) : (
        <section className="mx-auto max-w-[1180px] px-5 py-12 md:py-16">
          <div className="card p-6 md:p-10">
            <p className="eyebrow text-accent">Proposta sob medida</p>
            <h2 className="display mt-4 max-w-[20ch] text-sub">
              Monte o contrato conforme o tamanho da sua empresa
            </h2>
            <p className="mt-4 max-w-[56ch] text-corpo leading-relaxed text-texto-3">
              Diga quantas máquinas você tem e o que mais te atrapalha hoje. Voltamos com
              uma proposta com escopo, prazo de atendimento e valor mensal.
            </p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1180px] px-5 pb-20 md:pb-28">
        <div className="spot card p-6 text-center md:p-12">
          <p className="eyebrow text-accent">Próximo passo</p>
          <h2 className="display mx-auto mt-5 max-w-[20ch] text-title">
            Conte quantas máquinas você tem
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-corpo leading-relaxed text-texto-3">
            A partir daí montamos a proposta com escopo e valor fechado, sem compromisso.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={waGenerico("contrato de manutenção mensal para a minha empresa")}
              data-origem="manutencao"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center rounded-full bg-accent px-8 font-mono text-nota font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-accent-hover"
            >
              Pedir proposta
            </a>
            <Link
              href="/assistencia"
              className="flex h-14 items-center rounded-full bg-surface-2 px-8 font-mono text-nota tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
            >
              Atendimento avulso
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trilhaLd) }}
      />
    </>
  );
}
