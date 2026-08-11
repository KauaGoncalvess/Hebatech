"use client";

import { useTransition } from "react";
import {
  apagarLancamento,
  darBaixa,
  desfazerBaixa,
} from "@/app/admin/financeiro-actions";
import { preco } from "@/lib/format";
import { BotaoAcao } from "./botao-acao";
import { EtiquetaEstado } from "./etiqueta-estado";
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
        <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-rotulo tracking-[0.12em] text-texto-3 uppercase">
          <span className="tabular-nums">
            {l.pagoEm
              ? formatarDia(l.pagoEm)
              : l.venceEm
                ? `vence ${formatarDia(l.venceEm)}`
                : "sem prazo"}
          </span>
          <span aria-hidden className="h-3 w-px bg-line-strong" />
          {rotuloCategoria(l.categoria)}
        </p>
        <p className="mt-1.5 text-corpo leading-snug text-texto sm:truncate">
          {l.descricao}
        </p>
        {/* Em aberto e vencido deixam de ser texto colorido e viram estado. */}
        {aberto && (
          <p className="mt-2">
            <EtiquetaEstado tom={vencido ? "alerta" : "andamento"}>
              {vencido ? "Vencido" : "Em aberto"}
            </EtiquetaEstado>
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span
          className={`display shrink-0 text-[1.35rem] leading-none tabular-nums ${
            aberto ? "text-texto-3" : entrada ? "text-accent" : "text-texto-2"
          }`}
        >
          {entrada ? "+" : "−"}
          {preco(l.valor)}
        </span>

        {aberto ? (
          <BotaoAcao
            variante="principal"
            type="button"
            onClick={() => enviar(darBaixa)}
            disabled={pendente}
          >
            {entrada ? "Recebi" : "Paguei"}
          </BotaoAcao>
        ) : (
          <BotaoAcao
            type="button"
            onClick={() => enviar(desfazerBaixa)}
            disabled={pendente}
          >
            Desfazer
          </BotaoAcao>
        )}

        <BotaoAcao
          variante="perigo"
          type="button"
          onClick={apagar}
          disabled={pendente}
          aria-label={`Apagar ${l.descricao}`}
          className="px-4"
        >
          ✕
        </BotaoAcao>
      </div>
    </li>
  );
}
