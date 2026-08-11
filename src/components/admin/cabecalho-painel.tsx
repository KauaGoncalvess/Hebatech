import type { ReactNode } from "react";

/**
 * Cabeçalho de tela do painel.
 *
 * Toda tela abria com sobrancelha + título display de até 70px + um parágrafo
 * de três linhas — perto de 200px antes do primeiro dado, numa ferramenta que
 * o balcão abre dezenas de vezes por dia. E o padding divergia entre a capa
 * (`py-8 md:py-14`) e as demais (`py-10 md:py-12`).
 *
 * O parágrafo vira opcional e curto: quem usa o sistema todo dia não lê a
 * explicação da tela na centésima vez. O que precisa ser lembrado está no
 * manual.
 */
export function CabecalhoPainel({
  titulo,
  nota,
  acao,
}: {
  titulo: string;
  nota?: ReactNode;
  acao?: ReactNode;
}) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-7 md:py-9">
      <div className="min-w-0">
        <h1 className="display text-[clamp(1.9rem,6vw,2.8rem)] leading-none">
          {titulo}
        </h1>
        {nota && (
          <p className="mt-2.5 max-w-[58ch] text-nota leading-relaxed text-texto-3">
            {nota}
          </p>
        )}
      </div>
      {acao}
    </section>
  );
}
