"use client";

import { useTransition } from "react";
import {
  apagarLancamento,
  darBaixa,
  desfazerBaixa,
} from "@/app/admin/financeiro-actions";
import { preco } from "@/lib/format";
import { hojeNaLoja, rotuloCategoria, type Lancamento } from "@/types/lancamento";

const dia = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "America/Sao_Paulo",
});

/** Data solta do banco (`2026-08-07`) sem o fuso puxar para o dia anterior. */
function formatarDia(data: string): string {
  return dia.format(new Date(`${data}T12:00:00`));
}

export function LinhaLancamento({ l }: { l: Lancamento }) {
  const [pendente, iniciar] = useTransition();

  const entrada = l.tipo === "entrada";
  const aberto = !l.pagoEm;
  const vencido = aberto && !!l.venceEm && l.venceEm < hojeNaLoja();

  const enviar = (acao: (d: FormData) => Promise<void>) => {
    const dados = new FormData();
    dados.set("id", l.id);
    iniciar(() => acao(dados));
  };

  const apagar = () => {
    if (!confirm(`Apagar "${l.descricao}"? Não dá para desfazer.`)) return;
    enviar(apagarLancamento);
  };

  return (
    <li
      className={`card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
        pendente ? "opacity-50" : ""
      }`}
    >
      <div className="min-w-0 sm:flex-1">
        <p className="flex flex-wrap items-center gap-x-2 font-mono text-[9.5px] tracking-[0.16em] text-white/35 uppercase">
          {l.pagoEm ? formatarDia(l.pagoEm) : l.venceEm ? `vence ${formatarDia(l.venceEm)}` : "sem prazo"}
          <span className="text-white/15">/</span>
          {rotuloCategoria(l.categoria)}
          {vencido && <span className="text-accent">· vencido</span>}
          {aberto && !vencido && <span className="text-white/50">· em aberto</span>}
        </p>
        <p className="mt-1 text-[13.5px] leading-snug text-white sm:truncate">
          {l.descricao}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span
          className={`display shrink-0 text-[1.35rem] leading-none tabular-nums ${
            aberto ? "text-white/40" : entrada ? "text-accent" : "text-white/70"
          }`}
        >
          {entrada ? "+" : "−"}
          {preco(l.valor)}
        </span>

        {aberto ? (
          <button
            type="button"
            onClick={() => enviar(darBaixa)}
            disabled={pendente}
            className="rounded-full bg-accent px-4 py-2.5 font-mono text-[9.5px] font-bold tracking-[0.1em] text-black uppercase transition-colors hover:bg-white disabled:opacity-50"
          >
            {entrada ? "Recebi" : "Paguei"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => enviar(desfazerBaixa)}
            disabled={pendente}
            className="rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[9.5px] tracking-[0.1em] text-white/55 uppercase transition-colors hover:bg-surface-3 disabled:opacity-50"
          >
            Desfazer
          </button>
        )}

        <button
          type="button"
          onClick={apagar}
          disabled={pendente}
          aria-label={`Apagar ${l.descricao}`}
          className="rounded-full bg-surface-2 px-3 py-2.5 font-mono text-[11px] text-white/35 transition-colors hover:bg-surface-3 hover:text-white disabled:opacity-50"
        >
          ✕
        </button>
      </div>
    </li>
  );
}
