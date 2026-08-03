"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Falha inesperada numa página pública. Não expõe a mensagem técnica: quem
 * está do outro lado quer uma loja, não um log.
 */
export default function ErroDoSite({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro na página:", error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[1180px] flex-col justify-center px-5 pt-32 pb-20 md:pt-40">
      <p className="eyebrow text-accent">Algo quebrou aqui</p>
      <h1 className="display mt-5 max-w-[16ch] text-title">
        Esta página não carregou
      </h1>
      <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-white/60">
        O problema é nosso, não seu. Tente de novo em alguns segundos — se
        continuar, fale com a gente no WhatsApp que resolvemos por lá.
      </p>

      {error.digest && (
        <p className="mt-4 font-mono text-[11px] text-white/35">
          Código do erro: {error.digest}
        </p>
      )}

      <div className="mt-9 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex h-14 items-center rounded-full bg-accent px-8 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
        >
          Tentar de novo
        </button>
        <Link
          href="/"
          className="flex h-14 items-center rounded-full bg-surface-2 px-8 font-mono text-[12px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
        >
          Voltar para o início
        </Link>
      </div>
    </section>
  );
}
