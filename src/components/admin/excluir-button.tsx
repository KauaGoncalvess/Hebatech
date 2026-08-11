"use client";

import { useState, useTransition } from "react";
import { excluirProduto } from "@/app/admin/actions";

/** Exclusão em dois passos — some do site e apaga as fotos do armazenamento. */
export function ExcluirButton({ id, nome }: { id: string; nome: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  // Em caso de sucesso a action redireciona e nada volta para cá.
  const excluir = () =>
    iniciar(async () => {
      const { erro } = await excluirProduto(id);
      setErro(erro ?? null);
    });

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="flex h-11 items-center rounded-full bg-surface-2 px-5 font-mono text-rotulo tracking-[0.12em] text-texto-3 uppercase transition-colors hover:bg-surface-3 hover:text-white"
      >
        Excluir
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-accent p-4">
      <p className="max-w-[38ch] font-mono text-rotulo text-texto-2">
        Excluir <span className="text-accent">{nome}</span> de vez? As fotos também são
        apagadas. Para apenas tirar do site, use &quot;à venda&quot; no formulário.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pendente}
          onClick={excluir}
          className="h-11 rounded-full bg-accent px-5 font-mono text-rotulo font-bold tracking-[0.12em] text-black uppercase disabled:opacity-50"
        >
          {pendente ? "Excluindo..." : "Confirmar"}
        </button>
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          className="h-11 rounded-full bg-surface-2 px-5 font-mono text-rotulo tracking-[0.12em] uppercase"
        >
          Voltar
        </button>
      </div>
      {erro && (
        <p role="alert" className="font-mono text-rotulo text-accent">
          Não deu para excluir: {erro}
        </p>
      )}
    </div>
  );
}
