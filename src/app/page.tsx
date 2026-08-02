import Image from "next/image";
import Link from "next/link";
import { CtaPanel } from "@/components/cta-panel";
import { ProductRail } from "@/components/product-rail";
import { SectionHead } from "@/components/section-head";
import { Ticker } from "@/components/ticker";
import { notebooksDestaque, notebooksDisponiveis } from "@/data/notebooks";
import { site } from "@/data/site";
import { preco } from "@/lib/format";
import { waGenerico } from "@/lib/whatsapp";

const SERVICOS = [
  {
    indice: "01",
    titulo: "Assistência técnica",
    resumo:
      "Notebook e desktop de qualquer marca. Abertura, medição e laudo antes de encostar em qualquer peça.",
    itens: [
      "Troca de tela, dobradiça, teclado e carcaça",
      "Reparo de placa-mãe: conector de carga, trilha e BGA",
      "Limpeza interna, troca de pasta térmica e thermal pad",
      "Recuperação de dados e clonagem de disco",
      "Formatação com backup e reinstalação de programa",
    ],
    metricas: [
      ["Diagnóstico", "até 48h"],
      ["Garantia", "90 dias"],
    ],
    href: "/assistencia",
    acao: "Pedir orçamento",
  },
  {
    indice: "02",
    titulo: "Consultoria",
    resumo:
      "Para quem tem 3 a 30 máquinas e nenhum TI fixo. Levantamento do parque, plano de troca e rotina de backup.",
    itens: [
      "Inventário de equipamento e licença",
      "Projeto de rede, cabeamento e Wi-Fi",
      "Rotina de backup e teste de restauração",
      "Padronização de imagem do Windows",
      "Plano de reposição em 12 e 24 meses",
    ],
    metricas: [
      ["Visita técnica", "agendada"],
      ["Escopo", "por escrito"],
    ],
    href: "/contato",
    acao: "Agendar visita",
  },
  {
    indice: "03",
    titulo: "Compra e venda",
    resumo:
      "Notebook corporativo de fim de contrato, revisado na bancada e vendido com estado declarado.",
    itens: [
      "Dell Latitude, ThinkPad, HP EliteBook e Acer TravelMate",
      "SSD, memória e bateria testados um a um",
      "Estado de conservação declarado por grau A, B ou C",
      "Windows 11 Pro ativado e nota fiscal",
      "Avaliamos o seu usado como parte do pagamento",
    ],
    metricas: [
      ["Em estoque", `${notebooksDisponiveis.length} aparelhos`],
      ["A partir de", preco(Math.min(...notebooksDisponiveis.map((n) => n.preco)))],
    ],
    href: "/notebooks",
    acao: "Ver estoque",
  },
];

const PROCESSO = [
  ["01", "Contato", "Você descreve o defeito no WhatsApp ou traz o aparelho na loja."],
  ["02", "Diagnóstico", "Teste de bancada em até 48h. Nada é aberto sem registro."],
  ["03", "Orçamento", "Valor fechado de peça e mão de obra. Só seguimos com o seu aval."],
  ["04", "Entrega", "Aparelho testado na sua frente, com garantia de 90 dias por escrito."],
];

export default function Home() {
  return (
    <>
      {/* ── Hero: grade assimétrica, título colado na margem, foto sangrando ── */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1600px]">
          <ul className="grid grid-cols-2 border-b border-line md:grid-cols-4">
            {[
              ["Base", `${site.endereco.cidade} / ${site.endereco.uf}`],
              ["Operação", `${site.operacao.anos} anos de loja física`],
              ["Diagnóstico", `até ${site.operacao.prazoDiagnosticoHoras}h`],
              ["Garantia", `${site.operacao.garantiaServicoDias} dias`],
            ].map(([k, v], i) => (
              <li
                key={k}
                className={`px-4 py-3 md:px-6 ${i % 2 === 0 ? "border-r border-line" : ""} ${
                  i < 2 ? "border-b border-line md:border-b-0" : ""
                } ${i === 2 ? "md:border-r md:border-line" : ""}`}
              >
                <p className="eyebrow text-white/35">{k}</p>
                <p className="mt-1.5 font-mono text-[12px] text-white">{v}</p>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="grid-field relative px-4 pt-12 pb-10 md:px-6 md:pt-20 md:pb-14 lg:col-span-7 lg:border-r lg:border-line">
              <p className="eyebrow text-accent">
                Assistência · Consultoria · Seminovos
              </p>

              <h1 className="display mt-6 text-display">
                Conserto de
                <br />
                notebook com
                <br />
                <span className="text-accent">laudo</span> antes
                <br />
                do orçamento
              </h1>

              <span
                aria-hidden
                className="measure-in mt-8 block h-px w-full max-w-[520px] bg-accent"
              />

              <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-white/60">
                Bancada própria em {site.endereco.cidade}. O aparelho entra, é medido e
                você recebe o valor fechado de peça e mão de obra antes de autorizar
                qualquer reparo. Se não tiver conserto viável, você leva de volta sem
                custo de diagnóstico.
              </p>

              <div className="mt-10 flex flex-col items-stretch gap-px sm:flex-row sm:flex-wrap">
                <a
                  href={waGenerico("assistência técnica")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center justify-center bg-accent px-7 font-mono text-[11.5px] font-bold tracking-[0.16em] text-black uppercase transition-colors hover:bg-white sm:justify-start"
                >
                  Descrever o defeito
                </a>
                <Link
                  href="/notebooks"
                  className="flex h-14 items-center justify-center gap-3 border border-line px-7 font-mono text-[11.5px] tracking-[0.16em] uppercase transition-colors hover:border-accent hover:text-accent sm:justify-start"
                >
                  {notebooksDisponiveis.length} notebooks em estoque
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            {/* Foto real da bancada, tratada em duotone para não brigar com a marca */}
            <div className="relative min-h-[340px] border-t border-line lg:col-span-5 lg:min-h-0 lg:border-t-0">
              <Image
                src="/fotos/setup-montagem.jpg"
                alt="Computador montado e organizado na bancada da HebaTech"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover brightness-[0.72] contrast-[1.12] grayscale"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-accent opacity-45 mix-blend-color"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-ink via-transparent to-ink/40"
              />
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 border-t border-line/80 bg-ink/80">
                <p className="border-r border-line px-4 py-3 font-mono text-[10px] tracking-[0.16em] text-white/70 uppercase">
                  Montagem e organização
                </p>
                <p className="px-4 py-3 font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
                  Serviço executado na loja
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      {/* ── Prova de operação ── */}
      <section className="mx-auto max-w-[1600px] border-b border-line">
        <SectionHead
          indice="01"
          etiqueta="Quem atende você"
          titulo={
            <>
              Loja com endereço,
              <br />
              bancada e nota fiscal
            </>
          }
          nota={
            <>
              Não é serviço de garagem nem intermediário. O aparelho fica na loja, sob
              responsabilidade registrada, e você acompanha o andamento pelo WhatsApp.
            </>
          }
        />

        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {[
            [`${site.operacao.anos}`, "anos", "de operação contínua em Sete Lagoas"],
            [`${site.operacao.atendimentos}+`, "atendimentos", "entre pessoa física e empresa"],
            [`${site.operacao.garantiaServicoDias}`, "dias", "de garantia em serviço e equipamento"],
            [`${site.operacao.prazoDiagnosticoHoras}h`, "prazo", "para o diagnóstico ficar pronto"],
          ].map(([num, unidade, texto], i) => (
            <div
              key={unidade}
              className={`border-line p-4 md:p-6 ${i < 2 ? "border-b lg:border-b-0" : ""} ${
                i % 2 === 0 ? "border-r" : ""
              } ${i === 2 ? "lg:border-r" : ""}`}
            >
              <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="display text-[clamp(2.75rem,7vw,5rem)] leading-[0.8] text-accent">
                  {num}
                </span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
                  {unidade}
                </span>
              </dt>
              <dd className="mt-4 max-w-[24ch] text-[13px] text-white/55">{texto}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Serviços ── */}
      <section className="mx-auto max-w-[1600px] border-b border-line">
        <SectionHead
          indice="02"
          etiqueta="O que fazemos"
          titulo={
            <>
              Três frentes,
              <br />
              um mesmo técnico
            </>
          }
          nota="Tudo passa pela mesma bancada. Não terceirizamos reparo nem revisão de estoque."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {SERVICOS.map((s, i) => (
            <article
              key={s.indice}
              className={`group flex flex-col border-line ${
                i < SERVICOS.length - 1 ? "border-b lg:border-r lg:border-b-0" : ""
              }`}
            >
              <div className="flex items-start justify-between px-4 pt-6 md:px-6">
                <span className="display text-[3.5rem] leading-[0.75] text-white/10 transition-colors duration-300 group-hover:text-accent">
                  {s.indice}
                </span>
                <span className="eyebrow pt-2 text-white/30">Serviço</span>
              </div>

              <h3 className="display mt-4 px-4 text-sub md:px-6">{s.titulo}</h3>
              <p className="mt-3 px-4 pb-5 text-[13.5px] leading-relaxed text-white/55 md:px-6">
                {s.resumo}
              </p>

              <ul className="border-t border-line">
                {s.itens.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 border-b border-line px-4 py-2.5 text-[12.5px] text-white/70 md:px-6"
                  >
                    <span aria-hidden className="font-mono text-accent">
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <dl className="mt-auto grid grid-cols-2">
                {s.metricas.map(([k, v], j) => (
                  <div
                    key={k}
                    className={`px-4 py-3 md:px-6 ${j === 0 ? "border-r border-line" : ""}`}
                  >
                    <dt className="eyebrow text-white/30">{k}</dt>
                    <dd className="mt-1.5 font-mono text-[13px] text-white">{v}</dd>
                  </div>
                ))}
              </dl>

              <Link
                href={s.href}
                className="flex items-center justify-between border-t border-line px-4 py-4 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors hover:bg-accent hover:text-black md:px-6"
              >
                {s.acao}
                <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── Estoque em destaque ── */}
      <section className="mx-auto max-w-[1600px] border-b border-line">
        <SectionHead
          indice="03"
          etiqueta="Estoque"
          titulo={
            <>
              Notebook corporativo
              <br />
              revisado na bancada
            </>
          }
          nota="Máquina de fim de contrato empresarial: chassi reforçado, teclado melhor e peça de reposição fácil de achar."
          acao={
            <Link
              href="/notebooks"
              className="inline-flex w-fit items-center gap-3 border border-line px-5 py-3 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors hover:border-accent hover:text-accent"
            >
              Ver os {notebooksDisponiveis.length}
              <span aria-hidden>→</span>
            </Link>
          }
        />
        <ProductRail itens={notebooksDestaque} />
        <div className="h-4" />
      </section>

      {/* ── Processo ── */}
      <section className="mx-auto max-w-[1600px] border-b border-line">
        <SectionHead
          indice="04"
          etiqueta="Como funciona"
          titulo={
            <>
              Do defeito
              <br />
              até a entrega
            </>
          }
          nota="Quatro etapas, sem surpresa no meio do caminho."
        />
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESSO.map(([n, titulo, texto], i) => (
            <li
              key={n}
              className={`relative border-line p-4 md:p-6 ${
                i < 3 ? "border-b lg:border-r lg:border-b-0" : ""
              } ${i % 2 === 0 ? "sm:border-r" : ""} ${i === 2 ? "sm:border-b lg:border-b-0" : ""}`}
            >
              <span aria-hidden className="absolute top-0 left-0 h-px w-10 bg-accent" />
              <p className="font-mono text-[11px] text-accent">{n}</p>
              <h3 className="display mt-3 text-[1.5rem] leading-none">{titulo}</h3>
              <p className="mt-3 max-w-[30ch] text-[13px] text-white/55">{texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Chamada final ── */}
      <section className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="px-4 py-12 md:px-6 md:py-20 lg:col-span-8 lg:border-r lg:border-line">
            <p className="eyebrow text-white/35">Próximo passo</p>
            <p className="display mt-5 text-title">
              Descreva o defeito
              <br />
              ou o modelo que
              <br />
              você <span className="text-accent">procura</span>
            </p>
            <p className="mt-6 max-w-[52ch] text-[14px] text-white/55">
              A resposta sai no horário comercial, com a informação que você precisa
              para decidir: prazo, valor e o que exatamente será feito.
            </p>
          </div>

          <div className="flex flex-col border-t border-line lg:col-span-4 lg:border-t-0">
            <CtaPanel
              etiqueta="WhatsApp"
              titulo="Fale com quem vai mexer no aparelho"
              acao="Abrir conversa"
              href={waGenerico()}
              className="flex-1"
            />
            <Link
              href="/contato"
              className="flex items-center justify-between border-t border-line p-4 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors hover:text-accent md:p-6"
            >
              Endereço e horário
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
