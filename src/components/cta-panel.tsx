type Props = {
  etiqueta: string;
  titulo: string;
  acao: string;
  href: string;
  className?: string;
};

/** Chamada de ação em painel arredondado, usada no fim das listagens. */
export function CtaPanel({ etiqueta, titulo, acao, href, className = "" }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`spot card group flex flex-col justify-between gap-8 p-6 transition-colors hover:bg-surface-2 md:p-8 ${className}`}
    >
      <span className="eyebrow text-accent">{etiqueta}</span>
      <span className="block">
        <span className="display block max-w-[16ch] text-[clamp(1.6rem,3vw,2.2rem)] leading-[0.95]">
          {titulo}
        </span>
        <span className="mt-7 inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3.5 font-mono text-[11.5px] font-bold tracking-[0.12em] text-black uppercase transition-colors group-hover:bg-white">
          {acao}
          <span aria-hidden>→</span>
        </span>
      </span>
    </a>
  );
}
