import type { ReactNode } from "react";

const BASE =
  "mt-2 w-full border border-line bg-ink px-3 py-2.5 font-mono text-[13px] transition-colors placeholder:text-white/25 focus:border-accent focus:outline-none";

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
        <span className="eyebrow text-white/45">
          {rotulo}
          {obrigatorio && <span className="text-accent"> *</span>}
        </span>
        {nota && <span className="font-mono text-[9.5px] text-white/30">{nota}</span>}
      </span>
      {children}
    </label>
  );
}

export function Entrada(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...resto } = props;
  return <input {...resto} className={`${BASE} ${className}`} />;
}

export function AreaTexto(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...resto } = props;
  return <textarea {...resto} className={`${BASE} resize-y leading-relaxed ${className}`} />;
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
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[9px] text-accent"
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
    <section className="border-b border-line">
      <div className="flex items-baseline gap-3 border-b border-line px-4 py-3 md:px-6">
        <span className="font-mono text-[11px] text-accent">{indice}</span>
        <h2 className="eyebrow text-white/45">{titulo}</h2>
      </div>
      {descricao && (
        <p className="border-b border-line px-4 py-3 text-[12.5px] text-white/45 md:px-6">
          {descricao}
        </p>
      )}
      <div className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:p-6">{children}</div>
    </section>
  );
}
