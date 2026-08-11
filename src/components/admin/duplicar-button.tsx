"use client";

import { useState, useTransition } from "react";
import { duplicarProduto } from "@/app/admin/actions";

/** Abre a cópia já em edição. Em caso de sucesso a action redireciona. */
export function DuplicarButton({ id }: { id: string }) {
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        disabled={pendente}
        onClick={() =>
          iniciar(async () => {
            const { erro } = await duplicarProduto(id);
            setErro(erro ?? null);
          })
        }
        className="flex h-11 items-center rounded-full bg-surface-2 px-5 font-mono text-rotulo tracking-[0.12em] text-texto-3 uppercase transition-colors hover:bg-surface-3 hover:text-white disabled:opacity-50"
      >
        {pendente ? "Duplicando..." : "Duplicar"}
      </button>
      {erro && (
        <p role="alert" className="font-mono text-rotulo text-accent">
          Não deu para duplicar: {erro}
        </p>
      )}
    </>
  );
}
