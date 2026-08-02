type Props = {
  etiqueta: string;
  titulo: string;
  acao: string;
  href: string;
  className?: string;
};

/**
 * Chamada de ação lateral. O acento fica no filete, na etiqueta e no botão —
 * nunca preenchendo o bloco inteiro.
 */
export function CtaPanel({ etiqueta, titulo, acao, href, className = "" }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col justify-between gap-10 bg-surface p-4 transition-colors hover:bg-surface-2 md:p-6 ${className}`}
    >
      <span aria-hidden className="absolute top-0 left-0 h-px w-14 bg-accent" />
      <span className="eyebrow text-accent">{etiqueta}</span>
      <span className="block">
        <span className="display block max-w-[16ch] text-[clamp(1.8rem,3.4vw,2.4rem)] leading-[0.9]">
          {titulo}
        </span>
        <span className="mt-7 inline-flex items-center gap-3 bg-accent px-5 py-3 font-mono text-[11px] font-bold tracking-[0.16em] text-black uppercase transition-colors group-hover:bg-white">
          {acao}
          <span aria-hidden>→</span>
        </span>
      </span>
    </a>
  );
}
