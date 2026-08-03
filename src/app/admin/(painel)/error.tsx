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
      <p className="mt-6 max-w-[56ch] text-[14px] leading-relaxed text-white/60">
        O painel só trabalha com os dados reais do banco — por isso ele para em
        vez de mostrar o catálogo do arquivo, que faria você editar um item que
        não existe no Supabase.
      </p>

      <div className="card mt-8 max-w-[64ch] p-5">
        <p className="eyebrow text-white/35">Mensagem</p>
        <p className="mt-3 font-mono text-[12.5px] leading-relaxed break-words text-white/70">
          {error.message || "Erro desconhecido."}
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-[11px] text-white/35">
            Código: {error.digest}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex h-12 items-center rounded-full bg-accent px-7 font-mono text-[11.5px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
        >
          Tentar de novo
        </button>
        <Link
          href="/admin"
          className="flex h-12 items-center rounded-full bg-surface-2 px-7 font-mono text-[11.5px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
        >
          Voltar ao painel
        </Link>
      </div>
    </section>
  );
}
