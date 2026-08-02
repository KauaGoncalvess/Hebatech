"use client";

import Link from "next/link";
import { useTransition } from "react";
import { alternarPlanoAtivo } from "@/app/admin/planos-actions";
import { preco } from "@/lib/format";
import type { Plano } from "@/types/plano";

export function LinhaPlano({ p }: { p: Plano }) {
  const [pendente, iniciar] = useTransition();

  return (
    <li
      className={`flex flex-wrap items-center justify-between gap-4 border-b border-line px-4 py-4 transition-colors hover:bg-surface md:px-6 ${
        p.ativo ? "" : "opacity-45"
      }`}
    >
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 font-mono text-[9.5px] tracking-[0.16em] text-white/35 uppercase">
          {p.codigo}
          {p.faixa && (
            <>
              <span className="text-white/15">/</span>
              {p.faixa}
            </>
          )}
          {p.destaque && <span className="text-accent">· mais contratado</span>}
        </p>
        <p className="font-mono text-[13px] text-white">{p.nome}</p>
        <p className="mt-0.5 font-mono text-[12px] text-accent">
          {p.precoMensal === null ? "Sob proposta" : `${preco(p.precoMensal)} / mês`}
          <span className="text-white/30"> · {p.inclui.length} itens inclusos</span>
        </p>
      </div>

      <div className="flex items-center gap-px">
        <button
          type="button"
          disabled={pendente}
          onClick={() => iniciar(() => alternarPlanoAtivo(p.id, !p.ativo))}
          className="border border-line px-3 py-2 font-mono text-[9.5px] tracking-[0.12em] uppercase transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
        >
          {p.ativo ? "Tirar do ar" : "Publicar"}
        </button>
        <Link
          href={`/admin/planos/${p.id}`}
          className="border border-line px-3 py-2 font-mono text-[9.5px] tracking-[0.12em] uppercase transition-colors hover:border-accent hover:text-accent"
        >
          Editar
        </Link>
      </div>
    </li>
  );
}
