"use client";

import { useState, useTransition } from "react";
import { excluirPlano } from "@/app/admin/planos-actions";

export function ExcluirPlanoButton({ id, nome }: { id: string; nome: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [pendente, iniciar] = useTransition();

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="flex h-11 items-center border border-line px-5 font-mono text-[10.5px] tracking-[0.14em] text-white/50 uppercase transition-colors hover:border-accent hover:text-accent"
      >
        Excluir
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 border border-accent p-4">
      <p className="max-w-[38ch] font-mono text-[11.5px] text-white/70">
        Excluir o plano <span className="text-accent">{nome}</span> de vez? Para apenas
        tirar do site, use &quot;publicado&quot; no formulário.
      </p>
      <div className="flex gap-px">
        <button
          type="button"
          disabled={pendente}
          onClick={() => iniciar(() => excluirPlano(id))}
          className="h-10 bg-accent px-5 font-mono text-[10.5px] font-bold tracking-[0.14em] text-black uppercase disabled:opacity-50"
        >
          {pendente ? "Excluindo..." : "Confirmar"}
        </button>
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          className="h-10 border border-line px-5 font-mono text-[10.5px] tracking-[0.14em] uppercase"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
