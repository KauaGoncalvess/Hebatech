import type { Metadata } from "next";
import Link from "next/link";
import { AcompanharForm } from "@/components/acompanhar-form";
import { Aura } from "@/components/aura";
import { site } from "@/data/site";
import { waGenerico } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Acompanhar o conserto do meu aparelho",
  description: `Consulte em que etapa está o aparelho que você deixou na HebaTech, em ${site.endereco.cidade}/${site.endereco.uf}. Basta o código da ordem e os quatro últimos dígitos do seu telefone.`,
  alternates: { canonical: "/acompanhar" },
};

export default function AcompanharPage() {
  const trilhaLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Acompanhar o conserto",
        item: `${site.url}/acompanhar`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trilhaLd) }}
      />

      <section className="relative overflow-hidden">
        <Aura className="-top-40 -left-32 h-[520px] w-[520px]" />
        <div className="relative mx-auto max-w-[1180px] px-5 pt-32 pb-20 md:pt-40 md:pb-28">
          <p className="eyebrow text-accent">Acompanhamento</p>
          <h1 className="display mt-5 max-w-[16ch] text-title">
            Onde está o meu aparelho
          </h1>
          <p className="mt-6 max-w-[56ch] text-corpo-g leading-relaxed text-texto-3">
            Deixou o aparelho na bancada? Consulte a etapa aqui, a qualquer hora, sem
            precisar mandar mensagem perguntando se já ficou pronto.
          </p>

          <AcompanharForm />

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <a
              href={waGenerico("acompanhamento de conserto")}
              target="_blank"
              rel="noopener noreferrer"
              data-origem="acompanhar-rodape"
              className="inline-flex items-center gap-3 rounded-full bg-surface-2 px-7 py-4 font-mono text-rotulo tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
            >
              Não achei meu código
              <span aria-hidden>→</span>
            </a>
            <Link
              href="/assistencia"
              className="inline-flex items-center gap-3 rounded-full bg-surface-2 px-7 py-4 font-mono text-rotulo tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
            >
              Pedir um orçamento
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
