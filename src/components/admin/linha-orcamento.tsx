"use client";

import { useState, useTransition } from "react";
import { excluirOrcamento, marcarOrcamento } from "@/app/admin/actions";
import type { PedidoOrcamento } from "@/types/orcamento";

const quando = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function LinhaOrcamento({ p, retorno }: { p: PedidoOrcamento; retorno: string | null }) {
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [aberto, setAberto] = useState(false);

  const alternar = () =>
    iniciar(async () => {
      const { erro } = await marcarOrcamento(p.id, !p.atendido);
      setErro(erro ?? null);
    });

  const apagar = () =>
    iniciar(async () => {
      if (!confirm(`Apagar o pedido de ${p.nome}? Não dá para desfazer.`)) return;
      const { erro } = await excluirOrcamento(p.id);
      setErro(erro ?? null);
    });

  const aparelho = [p.tipo, p.marca, p.modelo].filter(Boolean).join(" ");

  return (
    <li className={`card p-4 ${p.atendido ? "opacity-45" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 font-mono text-[9.5px] tracking-[0.16em] text-white/35 uppercase">
            {quando.format(new Date(p.criadoEm))}
            <span className="text-white/15">/</span>
            {p.telefone}
            {p.atendido && <span className="text-accent">· atendido</span>}
          </p>
          <p className="mt-1 font-mono text-[13px] text-white">{p.nome}</p>
          {aparelho && (
            <p className="mt-0.5 font-mono text-[12px] text-white/55">{aparelho}</p>
          )}
          {p.defeito && <p className="mt-1 text-[13px] text-accent">{p.defeito}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {retorno ? (
            <a
              href={retorno}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-4 py-2.5 font-mono text-[9.5px] font-bold tracking-[0.1em] text-black uppercase transition-colors hover:bg-white"
            >
              Chamar no zap
            </a>
          ) : (
            <span className="rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[9.5px] tracking-[0.1em] text-white/35 uppercase">
              Telefone inválido
            </span>
          )}
          <button
            type="button"
            disabled={pendente}
            onClick={alternar}
            className="rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[9.5px] tracking-[0.1em] uppercase transition-colors hover:bg-surface-3 disabled:opacity-40"
          >
            {p.atendido ? "Reabrir" : "Atendido"}
          </button>
          <button
            type="button"
            disabled={pendente}
            onClick={apagar}
            aria-label={`Apagar o pedido de ${p.nome}`}
            className="rounded-full bg-surface-2 px-3 py-2.5 font-mono text-[9.5px] tracking-[0.1em] text-white/40 uppercase transition-colors hover:bg-surface-3 hover:text-white disabled:opacity-40"
          >
            ✕
          </button>
        </div>
      </div>

      {p.descricao && (
        <div className="mt-3 border-t border-line pt-3">
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            className="font-mono text-[10px] tracking-[0.12em] text-white/40 uppercase transition-colors hover:text-white"
          >
            {aberto ? "− Detalhes" : "+ Detalhes"}
          </button>
          {aberto && (
            <p className="mt-2 text-[13px] leading-relaxed whitespace-pre-wrap text-white/60">
              {p.descricao}
            </p>
          )}
        </div>
      )}

      {erro && (
        <p role="alert" className="mt-3 font-mono text-[11px] text-accent">
          Não deu para salvar: {erro}
        </p>
      )}
    </li>
  );
}
