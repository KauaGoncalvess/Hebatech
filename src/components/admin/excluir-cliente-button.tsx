"use client";

import { useState, useTransition } from "react";
import { excluirCliente } from "@/app/admin/actions";

export function ExcluirClienteButton({ id, nome }: { id: string; nome: string }) {
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  const apagar = () =>
    iniciar(async () => {
      if (
        !confirm(
          `Excluir a ficha de ${nome}? As ordens de serviço dela continuam guardadas, mas deixam de ficar ligadas a um cliente.`,
        )
      ) {
        return;
      }
      const { erro } = await excluirCliente(id);
      setErro(erro ?? null);
    });

  return (
    <span className="flex flex-col items-end gap-2">
      <button
        type="button"
        disabled={pendente}
        onClick={apagar}
        className="flex h-11 items-center rounded-full bg-surface-2 px-5 font-mono text-rotulo tracking-[0.12em] text-texto-2 uppercase transition-colors hover:bg-surface-3 hover:text-white disabled:opacity-40"
      >
        Excluir
      </button>
      {erro && <span className="font-mono text-rotulo text-accent">{erro}</span>}
    </span>
  );
}
