import type { ReactNode } from "react";

type Props = {
  indice: string;
  etiqueta: string;
  titulo: ReactNode;
  nota?: ReactNode;
  acao?: ReactNode;
};

/**
 * Cabeçalho de seção assimétrico: índice e etiqueta em mono na coluna
 * estreita, título condensado na coluna larga.
 */
export function SectionHead({ indice, etiqueta, titulo, nota, acao }: Props) {
  return (
    <div className="border-b border-line">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="flex items-start gap-3 px-4 pt-6 md:col-span-3 md:border-r md:border-line md:px-6 md:py-8">
          <span className="font-mono text-[11px] leading-none text-accent">{indice}</span>
          <span className="eyebrow text-white/45">{etiqueta}</span>
        </div>

        <div className="px-4 pt-4 pb-6 md:col-span-6 md:px-6 md:py-8">
          <h2 className="display text-title">{titulo}</h2>
        </div>

        <div className="flex flex-col justify-end gap-4 border-t border-line px-4 py-5 md:col-span-3 md:border-t-0 md:border-l md:border-line md:px-6 md:py-8">
          {nota && <p className="max-w-[34ch] text-[13px] text-white/55">{nota}</p>}
          {acao}
        </div>
      </div>
    </div>
  );
}
