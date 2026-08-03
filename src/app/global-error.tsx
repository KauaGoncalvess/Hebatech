"use client";

import { useEffect } from "react";
import { classesDeFonte } from "./fonts";
import "./globals.css";

/**
 * Última rede de segurança: erro que derruba o próprio layout. Precisa trazer
 * o próprio <html>, então repete as fontes e o CSS base.
 */
export default function ErroGlobal({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro global:", error);
  }, [error]);

  return (
    <html lang="pt-BR" className={classesDeFonte}>
      <body>
        <main className="mx-auto flex min-h-screen max-w-[640px] flex-col justify-center px-5">
          <p className="eyebrow text-accent">Erro</p>
          <h1 className="display mt-5 text-title">O site caiu aqui</h1>
          <p className="mt-6 text-[15px] leading-relaxed text-white/60">
            Recarregue a página. Se continuar assim, chame a HebaTech no
            WhatsApp que a gente resolve por lá.
          </p>
          {error.digest && (
            <p className="mt-4 font-mono text-[11px] text-white/35">
              Código do erro: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            className="mt-9 flex h-14 w-fit items-center rounded-full bg-accent px-8 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
          >
            Recarregar
          </button>
        </main>
      </body>
    </html>
  );
}
