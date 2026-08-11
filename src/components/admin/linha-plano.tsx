"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { alternarPlanoAtivo } from "@/app/admin/planos-actions";
import { preco } from "@/lib/format";
import type { Plano } from "@/types/plano";

export function LinhaPlano({ p }: { p: Plano }) {
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  const alternar = () =>
    iniciar(async () => {
      const { erro } = await alternarPlanoAtivo(p.id, !p.ativo);
      setErro(erro ?? null);
    });

  return (
    <li
      className={`card flex flex-wrap items-center justify-between gap-4 p-5 transition-colors hover:bg-surface-2 ${
        p.ativo ? "" : "opacity-45"
      }`}
    >
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 font-mono text-rotulo tracking-[0.16em] text-texto-3 uppercase">
          {p.codigo}
          {p.faixa && (
            <>
              <span aria-hidden className="h-3 w-px bg-line-strong" />
              {p.faixa}
            </>
          )}
          {p.destaque && <span className="text-accent">· mais contratado</span>}
        </p>
        <p className="font-mono text-nota text-white">{p.nome}</p>
        <p className="mt-0.5 font-mono text-nota text-accent">
          {p.precoMensal === null ? "Sob proposta" : `${preco(p.precoMensal)} / mês`}
          <span className="text-texto-3"> · {p.inclui.length} itens inclusos</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pendente}
          onClick={alternar}
          className="rounded-full bg-surface-2 px-4 py-2.5 font-mono text-rotulo tracking-[0.1em] uppercase transition-colors hover:bg-surface-3 disabled:opacity-40"
        >
          {p.ativo ? "Tirar do ar" : "Publicar"}
        </button>
        <Link
          href={`/admin/planos/${p.id}`}
          className="rounded-full bg-accent px-4 py-2.5 font-mono text-rotulo font-bold tracking-[0.1em] text-black uppercase transition-colors hover:bg-accent-hover"
        >
          Editar
        </Link>
      </div>

      {erro && (
        <p role="alert" className="w-full font-mono text-rotulo text-accent">
          Não deu para mudar: {erro}
        </p>
      )}
    </li>
  );
}
