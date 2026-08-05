"use client";

import { useActionState } from "react";
import { buscarOrdem, type EstadoConsulta } from "@/app/(site)/actions";
import { preco } from "@/lib/format";
import { waAprovarOrcamento, waSobreOrdem } from "@/lib/whatsapp";
import { aparelhoDe, ETAPA, LINHA_DO_TEMPO, type OrdemPublica } from "@/types/ordem";

const data = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** `previsao` vem como "2026-08-12" e não pode virar Date direto: viraria o dia anterior no fuso. */
function dataSimples(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

const CAMPO =
  "mt-2.5 w-full rounded-2xl bg-surface-2 px-4 py-3.5 font-mono text-[13.5px] transition-colors placeholder:text-white/40 focus-visible:bg-surface-3";

export function AcompanharForm() {
  const [estado, acao, pendente] = useActionState<EstadoConsulta, FormData>(
    buscarOrdem,
    {},
  );

  return (
    <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_1.3fr] lg:items-start">
      <form action={acao} className="card p-6 md:p-8">
        <label className="block">
          <span className="eyebrow text-white/55">
            Código da ordem <span className="text-accent">*</span>
          </span>
          <input
            name="codigo"
            required
            autoComplete="off"
            autoCapitalize="characters"
            className={`${CAMPO} uppercase`}
          />
        </label>

        <label className="mt-5 block">
          <span className="flex items-baseline justify-between gap-3">
            <span className="eyebrow text-white/55">
              Últimos 4 do seu telefone <span className="text-accent">*</span>
            </span>
            <span className="font-mono text-[10px] text-white/40">Confere que é você</span>
          </span>
          <input
            name="telefone"
            required
            inputMode="numeric"
            maxLength={4}
            autoComplete="off"
            className={CAMPO}
          />
        </label>

        <button
          type="submit"
          disabled={pendente}
          className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-accent font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white disabled:opacity-50"
        >
          {pendente ? "Consultando…" : "Ver meu aparelho"}
          {!pendente && <span aria-hidden>→</span>}
        </button>

        {estado.erro && (
          <p
            role="alert"
            className="mt-5 rounded-2xl bg-surface-2 p-4 text-[13px] leading-relaxed text-accent"
          >
            {estado.erro}
          </p>
        )}

        <p className="mt-6 text-[12.5px] leading-relaxed text-white/45">
          O código está no comprovante que você recebeu ao deixar o aparelho. Perdeu?
          Chame a gente no WhatsApp que a gente localiza pelo seu nome.
        </p>
      </form>

      {estado.ordem ? (
        <Resultado o={estado.ordem} />
      ) : (
        <aside className="card p-6 md:p-8">
          <p className="eyebrow text-white/45">Como funciona</p>
          <ol className="mt-5 space-y-4">
            {LINHA_DO_TEMPO.map((s, i) => (
              <li key={s} className="flex gap-3.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-3 font-mono text-[10px] text-white/50">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-mono text-[12.5px] text-white">
                    {ETAPA[s].rotulo}
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-white/50">
                    {ETAPA[s].explicacao}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </aside>
      )}
    </div>
  );
}

function Resultado({ o }: { o: OrdemPublica }) {
  const etapa = ETAPA[o.status];
  const aparelho = aparelhoDe(o) || "Aparelho";
  const cancelado = o.status === "cancelado";

  return (
    <section className="card p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-accent">Ordem {o.codigo}</p>
          <h2 className="display mt-3 text-sub">{aparelho}</h2>
        </div>
        <span
          className={`rounded-full px-4 py-2.5 font-mono text-[10px] tracking-[0.12em] uppercase ${
            cancelado ? "bg-surface-3 text-white/50" : "bg-accent text-black"
          }`}
        >
          {etapa.rotulo}
        </span>
      </div>

      <p className="mt-4 text-[14px] leading-relaxed text-white/60">{etapa.explicacao}</p>

      {!cancelado && (
        <ol className="mt-8 space-y-0">
          {LINHA_DO_TEMPO.map((s) => {
            const passo = ETAPA[s].passo;
            const feito = passo < etapa.passo;
            const atual = passo === etapa.passo;
            return (
              <li key={s} className="flex gap-4">
                <span className="flex flex-col items-center">
                  <span
                    className={`h-3.5 w-3.5 shrink-0 rounded-full ${
                      atual
                        ? "bg-accent ring-4 ring-accent/25"
                        : feito
                          ? "bg-accent/50"
                          : "bg-surface-3"
                    }`}
                  />
                  {s !== "entregue" && (
                    <span
                      className={`w-0.5 flex-1 rounded-full ${
                        feito ? "bg-accent/45" : "bg-line-strong"
                      }`}
                    />
                  )}
                </span>
                <span className={`pb-6 ${atual ? "" : "opacity-45"}`}>
                  <span
                    className={`block font-mono text-[12.5px] ${atual ? "text-accent" : "text-white"}`}
                  >
                    {ETAPA[s].rotulo}
                  </span>
                  {atual && (
                    <span className="mt-1 block text-[13px] leading-relaxed text-white/55">
                      {ETAPA[s].explicacao}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <dl className="mt-2 grid gap-3 sm:grid-cols-2">
        <Dado rotulo="Entrou na loja" valor={data.format(new Date(o.criadoEm))} />
        <Dado
          rotulo="Previsão"
          valor={o.previsao ? dataSimples(o.previsao) : "A definir no diagnóstico"}
        />
        {o.defeito && <Dado rotulo="Aberto por" valor={o.defeito} />}
        <Dado
          rotulo="Última movimentação"
          valor={data.format(new Date(o.atualizadoEm))}
        />
      </dl>

      {o.observacoes && (
        <div className="mt-5 rounded-2xl bg-surface-2 p-5">
          <p className="eyebrow text-white/40">Recado da bancada</p>
          <p className="mt-3 text-[13.5px] leading-relaxed whitespace-pre-wrap text-white/65">
            {o.observacoes}
          </p>
        </div>
      )}

      {o.status === "aguardando_aprovacao" && (
        <div className="mt-5 rounded-2xl bg-accent p-6 text-black">
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase">
            Esperando o seu sim
          </p>
          {o.valorOrcado !== null && (
            <p className="display mt-3 text-[clamp(2rem,6vw,3rem)] leading-none">
              {preco(o.valorOrcado)}
            </p>
          )}
          <p className="mt-3 max-w-[42ch] text-[13.5px] leading-relaxed">
            Nada é aberto, trocado ou cobrado sem a sua autorização. Se o valor não
            compensar, você retira o aparelho sem pagar o diagnóstico.
          </p>
          <a
            href={waAprovarOrcamento(o.codigo, aparelhoDe(o))}
            target="_blank"
            rel="noopener noreferrer"
            data-origem="acompanhar-aprovar"
            className="mt-5 inline-flex h-13 items-center gap-3 rounded-full bg-black px-7 font-mono text-[11.5px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-ink"
          >
            Aprovar pelo WhatsApp
            <span aria-hidden>→</span>
          </a>
        </div>
      )}

      <a
        href={waSobreOrdem(o.codigo)}
        target="_blank"
        rel="noopener noreferrer"
        data-origem="acompanhar-duvida"
        className="mt-5 inline-flex items-center gap-3 rounded-full bg-surface-2 px-6 py-3.5 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
      >
        Falar sobre esta ordem
        <span aria-hidden>→</span>
      </a>
    </section>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-4">
      <dt className="font-mono text-[10px] tracking-[0.12em] text-white/40 uppercase">
        {rotulo}
      </dt>
      <dd className="mt-2 text-[13.5px] text-white/75">{valor}</dd>
    </div>
  );
}
