"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * No painel a mensagem técnica aparece: quem está aqui é a equipe da loja e
 * precisa saber se o problema é conexão, permissão ou dado inválido.
 */
export default function ErroDoPainel({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro no painel:", error);
  }, [error]);

  return (
    <section className="py-16 md:py-24">
      <p className="eyebrow text-accent">Painel</p>
      <h1 className="display mt-4 max-w-[18ch] text-title">
        Não deu para carregar os dados
      </h1>
      <p className="mt-6 max-w-[56ch] text-corpo leading-relaxed text-texto-3">
        O painel só trabalha com os dados reais do banco — por isso ele para em
        vez de mostrar o catálogo do arquivo, que faria você editar um item que
        não existe no Supabase.
      </p>

      <div className="card mt-8 max-w-[64ch] p-5">
        <p className="eyebrow text-texto-3">Mensagem</p>
        <p className="mt-3 font-mono text-nota leading-relaxed break-words text-texto-2">
          {error.message || "Erro desconhecido."}
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-rotulo text-texto-3">
            Código: {error.digest}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex h-12 items-center rounded-full bg-accent px-7 font-mono text-rotulo font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-accent-hover"
        >
          Tentar de novo
        </button>
        <Link
          href="/admin"
          className="flex h-12 items-center rounded-full bg-surface-2 px-7 font-mono text-rotulo tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
        >
          Voltar ao painel
        </Link>
      </div>
    </section>
  );
}
