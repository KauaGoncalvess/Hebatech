import type { ReactNode } from "react";

const BASE =
  "mt-2.5 min-h-toque w-full rounded-2xl bg-surface-2 px-4 py-3 font-mono text-nota transition-colors placeholder:text-texto-3 focus-visible:bg-surface-3";

export function Campo({
  rotulo,
  nota,
  obrigatorio,
  className = "",
  children,
}: {
  rotulo: string;
  nota?: string;
  obrigatorio?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="flex items-baseline justify-between gap-3">
        <span className="eyebrow text-texto-3">
          {rotulo}
          {obrigatorio && <span className="text-accent"> *</span>}
        </span>
        {nota && <span className="font-mono text-rotulo text-texto-3">{nota}</span>}
      </span>
      {children}
    </label>
  );
}

/**
 * `autoComplete="off"` vem antes do spread de propósito: é só um padrão, e o
 * formulário de login o substitui por "username" e "current-password", onde
 * guardar a senha ajuda.
 *
 * No resto do painel ele atrapalha. Quem cadastra cinquenta produtos digita
 * "i5" cinquenta vezes, e o navegador passa a cobrir o campo seguinte com uma
 * lista de sugestões a cada clique.
 */
export function Entrada(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...resto } = props;
  return <input autoComplete="off" {...resto} className={`${BASE} ${className}`} />;
}

export function AreaTexto(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...resto } = props;
  return (
    <textarea
      autoComplete="off"
      {...resto}
      className={`${BASE} resize-y leading-relaxed ${className}`}
    />
  );
}

export function Selecao(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", children, ...resto } = props;
  return (
    <span className="relative block">
      <select {...resto} className={`${BASE} appearance-none pr-10 ${className}`}>
        {children}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 mt-[5px] -translate-y-1/2 font-mono text-rotulo text-accent"
      >
        ▼
      </span>
    </span>
  );
}

export function Bloco({
  indice,
  titulo,
  descricao,
  children,
}: {
  indice: string;
  titulo: string;
  descricao?: string;
  children: ReactNode;
}) {
  return (
    <section className="card mb-4 p-6 md:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-3 font-mono text-rotulo text-accent">
          {indice}
        </span>
        <h2 className="font-mono text-nota tracking-[0.12em] uppercase">{titulo}</h2>
      </div>
      {descricao && (
        <p className="mt-3 max-w-[70ch] text-nota leading-relaxed text-texto-3">
          {descricao}
        </p>
      )}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}
