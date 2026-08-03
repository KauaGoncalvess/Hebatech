import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Carrossel } from "@/components/carrossel";
import { ProductCard } from "@/components/product-card";
import { SectionHead } from "@/components/section-head";
import { ServicoCard } from "@/components/servico-card";
import { servicos } from "@/data/servicos";
import { site } from "@/data/site";
import { listarDestaques, listarNotebooks } from "@/lib/catalogo";
import { waGenerico } from "@/lib/whatsapp";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `Assistência técnica e notebooks seminovos em ${site.endereco.cidade}/${site.endereco.uf}`,
  description: `Conserto de notebook e computador com diagnóstico em até ${site.operacao.prazoDiagnosticoHoras}h e orçamento fechado antes do reparo. Também vendemos notebook corporativo revisado, PC montado, monitor e peça. Loja física em ${site.endereco.cidade}/${site.endereco.uf}.`,
  alternates: { canonical: "/" },
};

const PROCESSO = [
  ["Contato", "Você descreve o defeito no WhatsApp ou traz o aparelho na loja."],
  ["Diagnóstico", "Teste de bancada em até 48h. Nada é aberto sem registro."],
  ["Orçamento", "Valor fechado de peça e mão de obra. Só seguimos com o seu aval."],
  ["Entrega", "Aparelho testado na sua frente, com 90 dias de garantia por escrito."],
];

export default async function Home() {
  const [destaques, notebooks] = await Promise.all([
    listarDestaques(8),
    listarNotebooks(),
  ]);

  return (
    <>
      {/* ── Topo: a foto da bancada é o fundo ── */}
      <section className="relative overflow-hidden">
        <Image
          src="/fotos/setup-montagem.jpg"
          alt="Computador montado e organizado na bancada da HebaTech"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.62] contrast-[1.08] grayscale"
        />
        <div aria-hidden className="absolute inset-0 bg-accent opacity-40 mix-blend-color" />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-ink via-ink/80 to-ink/25 lg:bg-linear-to-r lg:from-ink lg:via-ink/80 lg:to-ink/10"
        />

        <div className="relative mx-auto max-w-[1180px] px-5 pt-32 pb-16 md:pt-44 md:pb-24">
          <p className="eyebrow text-accent">
            {site.endereco.cidade} / {site.endereco.uf} · Loja física
          </p>

          <h1 className="display mt-6 max-w-[15ch] text-display">
            Conserto com <span className="text-accent">laudo</span> antes do orçamento
          </h1>

          <span
            aria-hidden
            className="measure-in mt-8 block h-px w-full max-w-[480px] bg-accent"
          />

          <p className="mt-6 max-w-[40ch] text-[16px] leading-relaxed text-white/70">
            Bancada própria. Você recebe o valor fechado de peça e mão de obra antes de
            autorizar qualquer reparo.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={waGenerico("assistência técnica")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center justify-center rounded-full bg-accent px-8 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
            >
              Descrever o defeito
            </a>
            <Link
              href="/produtos"
              className="flex h-14 items-center justify-center gap-3 rounded-full border border-white/25 bg-black/40 px-8 font-mono text-[12px] tracking-[0.12em] uppercase backdrop-blur transition-colors hover:border-accent hover:text-accent"
            >
              Ver produtos à venda
              <span aria-hidden>→</span>
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] tracking-[0.08em] text-white/55">
            {[
              "loja física com bancada",
              `diagnóstico em até ${site.operacao.prazoDiagnosticoHoras}h`,
              `${site.operacao.garantiaServicoDias} dias de garantia`,
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 whitespace-nowrap">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Nossos serviços ── */}
      <section className="mx-auto max-w-[1180px] px-5 py-20 md:py-28">
        <SectionHead
          etiqueta="Nossos serviços"
          titulo="Tudo que a bancada resolve"
          nota="De limpeza e formatação a reparo de placa e montagem de PC. Qualquer marca, com orçamento fechado antes de começar."
        />

        <Carrossel
          rotulo="Serviços da assistência"
          larguraItem="w-[85vw] xs:w-[78vw] sm:w-[400px] lg:w-[440px]"
          itens={servicos.map((s) => ({
            chave: s.area,
            conteudo: <ServicoCard s={s} />,
          }))}
        />

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/assistencia"
            className="flex items-center rounded-full bg-surface-2 px-7 py-4 font-mono text-[12px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
          >
            Tabela de preço e prazo
          </Link>
          <a
            href={waGenerico("assistência técnica")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center rounded-full bg-accent px-7 py-4 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
          >
            Pedir orçamento
          </a>
        </div>
      </section>

      {/* ── Produtos em destaque ── */}
      {destaques.length > 0 && (
        <section className="bg-surface/40 py-20 md:py-28">
          <div className="mx-auto max-w-[1180px] px-5">
            <SectionHead
              etiqueta="À venda na loja"
              titulo="Em destaque nesta semana"
              nota="Notebook corporativo revisado, PC montado, monitor e peça — tudo com nota fiscal e estado declarado."
            />

            <Carrossel
              rotulo="Produtos em destaque"
              larguraItem="w-[78vw] xs:w-[68vw] sm:w-[320px] lg:w-[340px]"
              itens={destaques.map((p) => ({
                chave: p.id,
                conteudo: <ProductCard p={p} />,
              }))}
            />

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/notebooks"
                className="flex items-center rounded-full bg-surface-2 px-7 py-4 font-mono text-[12px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
              >
                {notebooks.length} notebooks
              </Link>
              <Link
                href="/produtos"
                className="flex items-center rounded-full bg-surface-2 px-7 py-4 font-mono text-[12px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
              >
                Todos os produtos
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Como funciona ── */}
      <section className="mx-auto max-w-[1180px] px-5 py-20 md:py-28">
        <SectionHead
          etiqueta="Como funciona"
          titulo="Do defeito até a entrega"
          nota="Quatro etapas, sem surpresa no meio do caminho."
        />

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESSO.map(([titulo, texto], i) => (
            <li key={titulo} className="spot card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-mono text-[13px] font-bold text-black">
                {i + 1}
              </span>
              <h3 className="display mt-5 text-[1.4rem] leading-none">{titulo}</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-white/55">{texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Quem atende ── */}
      <section className="mx-auto max-w-[1180px] px-5 pb-20 md:pb-28">
        <div className="card overflow-hidden">
          <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_1fr] md:items-center md:p-10">
            <div>
              <p className="eyebrow text-accent">Quem atende você</p>
              <h2 className="display mt-4 max-w-[16ch] text-title">
                Loja com endereço, bancada e nota fiscal
              </h2>
              <p className="mt-5 max-w-[50ch] text-[14.5px] leading-relaxed text-white/55">
                Não é serviço de garagem nem intermediário. O aparelho fica na loja, sob
                responsabilidade registrada, e você acompanha tudo pelo WhatsApp.
              </p>
            </div>

            <dl className="grid grid-cols-3 gap-3">
              {[
                [`${site.operacao.atendimentos}+`, "atendimentos"],
                [`${site.operacao.prazoDiagnosticoHoras}h`, "para o diagnóstico"],
                [`${site.operacao.garantiaServicoDias}`, "dias de garantia"],
              ].map(([num, unidade]) => (
                <div key={unidade} className="rounded-2xl bg-surface-2 p-4 text-center">
                  <dt className="display text-[clamp(1.7rem,4vw,2.6rem)] leading-none text-accent">
                    {num}
                  </dt>
                  <dd className="mt-2 font-mono text-[10px] leading-tight tracking-[0.08em] text-white/45">
                    {unidade}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Chamada final ── */}
      <section className="mx-auto max-w-[1180px] px-5 pb-20 md:pb-28">
        <div className="spot card overflow-hidden p-6 text-center md:p-14">
          <p className="eyebrow text-accent">Próximo passo</p>
          <h2 className="display mx-auto mt-5 max-w-[18ch] text-title">
            Descreva o defeito ou o modelo que você procura
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-[14.5px] leading-relaxed text-white/55">
            A resposta sai no horário comercial, com prazo, valor e o que exatamente
            será feito.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={waGenerico()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center rounded-full bg-accent px-8 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
            >
              Chamar no WhatsApp
            </a>
            <Link
              href="/contato"
              className="flex h-14 items-center rounded-full bg-surface-2 px-8 font-mono text-[12px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
            >
              Endereço e horário
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
