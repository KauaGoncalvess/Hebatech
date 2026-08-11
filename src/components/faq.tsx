/**
 * Sanfona de perguntas em <details>: acessível pelo teclado e funciona sem
 * JavaScript nenhum. Usada na home, na assistência e nas páginas de serviço.
 */
export function Faq({ perguntas }: { perguntas: [string, string][] }) {
  return (
    <div className="grid gap-3">
      {perguntas.map(([pergunta, resposta]) => (
        <details key={pergunta} className="card group p-6">
          <summary className="flex list-none cursor-pointer items-center justify-between gap-6">
            <h3 className="font-mono text-nota tracking-[0.02em] text-white">
              {pergunta}
            </h3>
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-sm transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-4 max-w-[72ch] text-nota leading-relaxed text-texto-3">
            {resposta}
          </p>
        </details>
      ))}
    </div>
  );
}
