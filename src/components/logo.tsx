type Props = {
  className?: string;
  /** Esconde a assinatura em telas muito estreitas. */
  compacto?: boolean;
};

/**
 * Marca desenhada em vetor para ficar nítida em qualquer tamanho.
 * A divisão de cor HEBA / TE / CH segue o logotipo original.
 */
export function Logo({ className = "", compacto = false }: Props) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 40 30"
        aria-hidden="true"
        className="h-[22px] w-[29px] shrink-0"
        fill="none"
      >
        <rect
          x="6.5"
          y="2.5"
          width="27"
          height="19"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        <path
          d="M2 24.5h36l-2.5 3.5h-31L2 24.5Z"
          fill="var(--color-accent-deep)"
        />
        <path d="M16 25.6h8" stroke="#000" strokeWidth="1.2" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className="font-mono text-corpo-g font-bold tracking-[-0.02em]">
          HEBA<span className="text-accent">TE</span>CH
        </span>
        {!compacto && (
          <span className="mt-1 font-sans text-rotulo leading-none tracking-[0.16em] text-texto-3 uppercase">
            Soluções em Informática
          </span>
        )}
      </span>
    </span>
  );
}
