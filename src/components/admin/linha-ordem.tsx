"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { mudarStatusOrdem } from "@/app/admin/actions";
import { preco } from "@/lib/format";
import {
  aparelhoDe,
  ETAPA,
  LINHA_DO_TEMPO,
  type Ordem,
  type StatusOrdem,
} from "@/types/ordem";

const quando = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" });

/** A próxima etapa da fila, para o botão de avanço rápido. */
function proxima(status: StatusOrdem): StatusOrdem | null {
  const i = LINHA_DO_TEMPO.indexOf(status);
  if (i === -1 || i === LINHA_DO_TEMPO.length - 1) return null;
  return LINHA_DO_TEMPO[i + 1];
}

export function LinhaOrdem({ o, aviso }: { o: Ordem; aviso: string | null }) {
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  const seguinte = proxima(o.status);
  const encerrada = o.status === "entregue" || o.status === "cancelado";

  const avancar = () =>
    iniciar(async () => {
      if (!seguinte) return;
      const { erro } = await mudarStatusOrdem(o.id, seguinte);
      setErro(erro ?? null);
    });

  return (
    <li className={`card p-4 ${encerrada ? "opacity-45" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 font-mono text-[9.5px] tracking-[0.16em] text-white/35 uppercase">
            {o.codigo}
            <span className="text-white/15">/</span>
            {quando.format(new Date(o.criadoEm))}
            {o.previsao && (
              <>
                <span className="text-white/15">/</span>
                <span>previsão {o.previsao.split("-").reverse().join("/")}</span>
              </>
            )}
          </p>
          <p className="mt-1 font-mono text-[13px] text-white">
            {aparelhoDe(o) || "Aparelho"}
          </p>
          <p className="mt-0.5 font-mono text-[12px] text-white/55">
            {o.clienteNome} · {o.clienteTelefone}
          </p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[12.5px]">
            <span className="text-accent">{ETAPA[o.status].rotulo}</span>
            {o.valorOrcado !== null && (
              <span className="font-mono text-white/45">{preco(o.valorOrcado)}</span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {seguinte && (
            <button
              type="button"
              disabled={pendente}
              onClick={avancar}
              className="rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[9.5px] tracking-[0.1em] uppercase transition-colors hover:bg-surface-3 disabled:opacity-40"
            >
              → {ETAPA[seguinte].rotulo}
            </button>
          )}
          {aviso ? (
            <a
              href={aviso}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[9.5px] tracking-[0.1em] uppercase transition-colors hover:bg-surface-3"
            >
              Avisar
            </a>
          ) : (
            <span className="rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[9.5px] tracking-[0.1em] text-white/30 uppercase">
              Telefone inválido
            </span>
          )}
          <Link
            href={`/admin/ordens/${o.id}`}
            className="rounded-full bg-accent px-4 py-2.5 font-mono text-[9.5px] font-bold tracking-[0.1em] text-black uppercase transition-colors hover:bg-white"
          >
            Abrir
          </Link>
        </div>
      </div>

      {erro && (
        <p role="alert" className="mt-3 font-mono text-[11px] text-accent">
          Não deu para mudar a etapa: {erro}
        </p>
      )}
    </li>
  );
}
