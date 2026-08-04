import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Aura } from "@/components/aura";
import { Carrossel } from "@/components/carrossel";
import { Comparativo } from "@/components/comparativo";
import { Faq } from "@/components/faq";
import { ProductCard } from "@/components/product-card";
import { ProvaSocial } from "@/components/prova-social";
import { SectionHead } from "@/components/section-head";
import { ServicoGrade } from "@/components/servico-grade";
import { faqJsonLd, perguntas } from "@/data/perguntas";
import { temProva } from "@/data/provas";
import { site } from "@/data/site";
import { listarDestaques } from "@/lib/catalogo";
import { numero } from "@/lib/format";
import { waGenerico } from "@/lib/whatsapp";

export const revalidate = 300;

/**
 * Prévia de 16×10 da foto da bancada, já escurecida como o hero a mostra.
 * Evita o retângulo preto piscando antes de a foto chegar.
 */
const PREVIA_BANCADA =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDmfNj4yAT3Lc1EWBk3DH4CmScOccUJ1NPoB//Z";

export const metadata: Metadata = {
  title: `Assistência técnica e notebooks seminovos em ${site.endereco.cidade}/${site.endereco.uf}`,
  description: `Conserto de notebook e computador com diagnóstico em até ${site.operacao.prazoDiagnosticoHoras}h e preço fechado antes do reparo. Também vendemos notebook corporativo revisado, PC montado, monitor e peça. Loja física em ${site.endereco.cidade}/${site.endereco.uf}.`,
  alternates: { canonical: "/" },
};

/** Três motivos de chegada, três destinos. Segmenta quem vem do Instagram. */
const PORTAS = [
  {
    etiqueta: "Quebrou ou está lento",
    titulo: "Quero consertar",
    texto:
      "Notebook, desktop ou all in one de qualquer marca. Você recebe o valor fechado antes de a gente abrir o aparelho.",
    acao: "Descrever o defeito",
    href: "/assistencia",
  },
  {
    etiqueta: "Quero comprar",
    titulo: "Procuro um equipamento",
    texto:
      "Notebook corporativo revisado, PC montado, monitor e peça — com estado declarado, nota fiscal e garantia.",
    acao: "Ver o estoque",
    href: "/produtos",
  },
  {
    etiqueta: "Tenho uma empresa",
    titulo: "Preciso de manutenção",
    texto:
      "De 3 a 30 máquinas, com visita programada, chamado remoto e backup testado por um valor fixo por mês.",
    acao: "Ver os planos",
    href: "/manutencao",
  },
];

const PROCESSO = [
  ["Contato", "Você descreve o defeito no WhatsApp ou traz o aparelho na loja."],
  ["Diagnóstico", "Teste de bancada em até 48h. Nada é aberto sem registro."],
  ["Orçamento", "Valor fechado de peça e mão de obra. Só seguimos com o seu aval."],
  ["Entrega", "Aparelho testado na sua frente, com 90 dias de garantia por escrito."],
];

export default async function Home() {
  const destaques = await listarDestaques(8);

  const numeros: [string, string][] = [
    [`${numero(site.operacao.atendimentos)}+`, "atendimentos na bancada"],
    [`${site.operacao.prazoDiagnosticoHoras}h`, "para o diagnóstico"],
    [`${site.operacao.garantiaServicoDias}`, "dias de garantia"],
  ];

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
          placeholder="blur"
          blurDataURL={PREVIA_BANCADA}
          className="object-cover object-center brightness-[0.5] contrast-[1.05] saturate-[0.6]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-ink via-ink/85 to-ink/30 lg:bg-linear-to-r lg:from-ink lg:via-ink/85 lg:to-ink/20"
        />
        <Aura forte className="-top-40 -left-32 h-[520px] w-[520px] md:h-[680px] md:w-[680px]" />
        <Aura className="right-[-10%] bottom-[-30%] h-[420px] w-[420px] md:h-[560px] md:w-[560px]" />

        <div className="relative mx-auto max-w-[1180px] px-5 pt-32 pb-14 md:pt-44 md:pb-20">
          <p className="eyebrow text-accent">
            {site.endereco.cidade} / {site.endereco.uf} · Loja física
          </p>

          <h1 className="display mt-6 max-w-[15ch] text-display">
            Você aprova o preço <span className="text-accent">antes</span> da gente abrir
          </h1>

          <span
            aria-hidden
            className="measure-in mt-8 block h-px w-full max-w-[480px] bg-accent"
          />

          <p className="mt-6 max-w-[42ch] text-[16px] leading-relaxed text-white/75">
            Testamos o aparelho na bancada, mandamos o valor fechado de peça e mão de obra
            no WhatsApp e só começamos com o seu sim. Sem conserto, sem cobrança.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={waGenerico("assistência técnica")}
              data-origem="hero"
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

          {/* Régua de números: a prova mais barata que existe, na primeira tela */}
          <dl className="mt-14 grid max-w-[620px] grid-cols-3 gap-4 border-t border-line-strong pt-8">
            {numeros.map(([n, rotulo]) => (
              <div key={rotulo}>
                <dt className="display text-[clamp(1.9rem,5vw,3rem)] leading-none text-accent">
                  {n}
                </dt>
                <dd className="mt-2 font-mono text-[10.5px] leading-tight tracking-[0.08em] text-white/60 uppercase">
                  {rotulo}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Três portas ── */}
      <section className="relative overflow-hidden bg-surface/40 py-24 md:py-32">
        <Aura className="top-[-20%] left-1/2 h-[420px] w-[420px] -translate-x-1/2 md:h-[560px] md:w-[560px]" />
        <div className="relative mx-auto max-w-[1180px] px-5">
        <SectionHead
          etiqueta="Por onde começar"
          titulo="O que te trouxe até aqui?"
          nota="Três caminhos, três respostas. Escolha o seu e a conversa já começa no assunto certo."
        />

        <ul className="grid gap-4 md:grid-cols-3">
          {PORTAS.map((p, i) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="spot card group flex h-full flex-col p-6 transition-colors hover:bg-surface-2 md:p-8"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[12px] font-bold text-black">
                    {i + 1}
                  </span>
                  <span className="eyebrow text-white/55">{p.etiqueta}</span>
                </span>
                <span className="display mt-6 text-sub">{p.titulo}</span>
                <span className="mt-4 flex-1 text-[14px] leading-relaxed text-white/60">
                  {p.texto}
                </span>
                <span className="mt-7 inline-flex items-center gap-3 font-mono text-[11.5px] tracking-[0.12em] text-accent uppercase">
                  {p.acao}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
          </ul>
        </div>
      </section>

      {/* ── Nossos serviços ── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <Aura className="top-1/4 right-[-15%] h-[440px] w-[440px] md:h-[620px] md:w-[620px]" />
        <div className="relative mx-auto max-w-[1180px] px-5">
          <SectionHead
            etiqueta="Nossos serviços"
            titulo="Tudo que a bancada resolve"
            nota="De limpeza e formatação a reparo de placa e montagem de PC. Qualquer marca, com preço fechado antes de começar."
          />

          <ServicoGrade />
        </div>
      </section>

      {/* ── Faixa de cor cheia, no modelo da referência ── */}
      <section className="faixa-laranja relative overflow-hidden">
        <div className="relative mx-auto grid max-w-[1180px] items-center gap-8 px-5 py-16 md:grid-cols-[1.4fr_auto] md:py-20">
          <div>
            <p className="eyebrow text-black/70">Tudo num lugar só</p>
            <h2 className="display mt-5 max-w-[20ch] text-title text-black">
              Conserto, venda e contrato na mesma bancada
            </h2>
            <p className="mt-6 max-w-[54ch] text-[15px] leading-relaxed text-black/75">
              Você não precisa de uma loja para consertar, outra para comprar e um
              técnico avulso para a empresa. Aqui é o mesmo endereço, a mesma nota
              fiscal e a mesma garantia por escrito.
            </p>
          </div>

          <a
            href={waGenerico()}
            data-origem="faixa-laranja"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-16 items-center justify-center rounded-full bg-black px-10 font-mono text-[12px] font-bold tracking-[0.12em] whitespace-nowrap text-white uppercase transition-colors hover:bg-ink"
          >
            Falar agora
          </a>
        </div>
      </section>

      {/* ── Prova: só entra quando houver material real ── */}
      {temProva && <ProvaSocial />}

      {/* ── Produtos em destaque ── */}
      {destaques.length > 0 && (
        <section className="relative overflow-hidden py-24 md:py-32">
          <Aura className="top-0 left-[-12%] h-[420px] w-[420px] md:h-[560px] md:w-[560px]" />
          <div className="relative mx-auto max-w-[1180px] px-5">
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
                href="/produtos"
                className="flex items-center gap-3 rounded-full bg-accent px-8 py-4 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
              >
                Todos os produtos
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Como funciona: linha do tempo ── */}
      <section className="bg-surface/40 py-24 md:py-32">
        <div className="mx-auto max-w-[1180px] px-5">
        <SectionHead
          etiqueta="Como funciona"
          titulo="Do defeito até a entrega"
          nota="Quatro etapas, sem surpresa no meio do caminho."
        />

        <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <span
            aria-hidden
            className="absolute top-[26px] right-0 left-0 hidden h-px bg-line-strong lg:block"
          />
          {PROCESSO.map(([titulo, texto], i) => (
            <li key={titulo} className="relative">
              <span className="display block text-[3.4rem] leading-none text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-5 text-[1.4rem] leading-none">{titulo}</h3>
              <p className="mt-3 max-w-[34ch] text-[13.5px] leading-relaxed text-white/60">
                {texto}
              </p>
            </li>
          ))}
          </ol>
        </div>
      </section>

      {/* ── Comparativo ── */}
      <section className="relative mx-auto max-w-[1180px] overflow-hidden px-5 py-24 md:py-32">
        <SectionHead
          etiqueta="A diferença"
          titulo="Por que sai daqui sem susto na conta"
        />
        <Comparativo />
      </section>

      {/* ── Perguntas frequentes ── */}
      <section className="mx-auto max-w-[1180px] px-5 pb-24 md:pb-32">
        <SectionHead
          etiqueta="Perguntas frequentes"
          titulo="O que mais perguntam no balcão"
          nota="Se a sua dúvida não estiver aqui, manda no WhatsApp que respondemos."
        />
        <Faq perguntas={perguntas} />
      </section>

      {/* ── Fechamento em faixa ── */}
      <section className="relative overflow-hidden">
        <Image
          src="/fotos/setup-montagem.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={PREVIA_BANCADA}
          className="object-cover object-center brightness-[0.32] saturate-[0.5]"
        />
        <div aria-hidden className="absolute inset-0 bg-ink/70" />
        <Aura forte className="bottom-[-40%] left-1/2 h-[520px] w-[520px] -translate-x-1/2 md:h-[720px] md:w-[720px]" />

        <div className="relative mx-auto max-w-[1180px] px-5 py-24 text-center md:py-32">
          <p className="eyebrow text-accent">Próximo passo</p>
          <h2 className="display mx-auto mt-5 max-w-[18ch] text-title">
            Descreva o defeito ou o modelo que você procura
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-[14.5px] leading-relaxed text-white/70">
            A resposta sai no horário comercial, com prazo, valor e o que exatamente
            será feito.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={waGenerico()}
              data-origem="fechamento-home"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center rounded-full bg-accent px-8 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
            >
              Chamar no WhatsApp
            </a>
            <Link
              href="/contato"
              className="flex h-14 items-center rounded-full border border-white/25 bg-black/40 px-8 font-mono text-[12px] tracking-[0.12em] uppercase backdrop-blur transition-colors hover:border-accent hover:text-accent"
            >
              Endereço e horário
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        // Perguntas fixas do arquivo — nada vem do visitante.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(perguntas)) }}
      />
    </>
  );
}
