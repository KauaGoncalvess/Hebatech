import type { ReactNode } from "react";

type Props = {
  etiqueta: string;
  titulo: ReactNode;
  nota?: ReactNode;
  acao?: ReactNode;
};

/**
 * Cabeçalho de seção. Sem moldura e sem divisória — o que separa é o
 * espaço em volta e o contraste do título.
 */
export function SectionHead({ etiqueta, titulo, nota, acao }: Props) {
  return (
    <header className="mb-10 md:mb-14">
      <p className="eyebrow text-accent">{etiqueta}</p>
      <h2 className="display mt-4 max-w-[20ch] text-title">{titulo}</h2>
      {nota && (
        <p className="mt-5 max-w-[54ch] text-[14.5px] leading-relaxed text-white/55">
          {nota}
        </p>
      )}
      {acao && <div className="mt-7">{acao}</div>}
    </header>
  );
}
