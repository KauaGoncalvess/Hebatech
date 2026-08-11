"use client";

import { useState, useTransition } from "react";
import { excluirOrcamento, marcarOrcamento } from "@/app/admin/actions";
import { AcaoIndisponivel, BotaoAcao, LinkAcao } from "./botao-acao";
import { EtiquetaEstado } from "./etiqueta-estado";
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
    <li className={`card p-4 ${p.atendido ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 font-mono text-rotulo tracking-[0.12em] text-texto-3 uppercase">
            {quando.format(new Date(p.criadoEm))}
            <span className="tabular-nums normal-case">{p.telefone}</span>
          </p>
          <p className="mt-2 text-corpo-g text-texto">{p.nome}</p>
          {aparelho && <p className="mt-0.5 text-nota text-texto-3">{aparelho}</p>}
          {p.defeito && <p className="mt-1.5 text-nota text-texto-2">{p.defeito}</p>}
          <p className="mt-3">
            <EtiquetaEstado tom={p.atendido ? "ok" : "espera"}>
              {p.atendido ? "Atendido" : "A retornar"}
            </EtiquetaEstado>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {retorno ? (
            <LinkAcao
              variante="principal"
              href={retorno}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chamar no zap
            </LinkAcao>
          ) : (
            <AcaoIndisponivel>Sem telefone</AcaoIndisponivel>
          )}
          <BotaoAcao type="button" disabled={pendente} onClick={alternar}>
            {p.atendido ? "Reabrir" : "Atendido"}
          </BotaoAcao>
          <BotaoAcao
            variante="perigo"
            type="button"
            disabled={pendente}
            onClick={apagar}
            aria-label={`Apagar o pedido de ${p.nome}`}
            className="px-4"
          >
            ✕
          </BotaoAcao>
        </div>
      </div>

      {p.descricao && (
        <div className="mt-3 border-t border-line pt-3">
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            className="toque -mx-2 px-2 font-mono text-rotulo tracking-[0.12em] text-texto-3 uppercase transition-colors hover:text-texto"
          >
            {aberto ? "− Detalhes" : "+ Detalhes"}
          </button>
          {aberto && (
            <p className="mt-2 text-nota leading-relaxed whitespace-pre-wrap text-texto-2">
              {p.descricao}
            </p>
          )}
        </div>
      )}

      {erro && (
        <p
          role="alert"
          className="mt-3 rounded-2xl bg-alerta/12 px-4 py-3 text-nota text-alerta"
        >
          Não deu para salvar: {erro}
        </p>
      )}
    </li>
  );
}
