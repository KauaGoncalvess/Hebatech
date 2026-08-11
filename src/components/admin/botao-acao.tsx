import type { ReactNode } from "react";

/**
 * Botão de ação do painel.
 *
 * Existia como classe solta repetida em quatro arquivos — `px-4 py-2.5` com
 * fonte de 9,5px, o que dava 32px de altura, abaixo dos 44px mínimos — e
 * deixava cada lista com um acabamento ligeiramente diferente do vizinho.
 *
 * As variantes têm significado fixo, e é isso que dá previsibilidade à lista:
 *
 * - `principal` — o trabalho em si. Na ordem de serviço é avançar a etapa, não
 *   abrir a tela: navegar não é tarefa.
 * - `secundaria` — ações de apoio (avisar no WhatsApp, abrir, desfazer).
 * - `perigo` — apagar. Só ganha cor no hover, para não gritar em repouso.
 */
type Variante = "principal" | "secundaria" | "perigo";

const BASE =
  "toque rounded-full px-5 font-mono text-rotulo tracking-[0.1em] uppercase " +
  "whitespace-nowrap transition-colors disabled:opacity-45 " +
  "disabled:pointer-events-none";

const VARIANTES: Record<Variante, string> = {
  principal: "bg-accent font-bold text-black hover:bg-accent-hover",
  secundaria: "bg-surface-2 text-texto-2 hover:bg-surface-3 hover:text-texto",
  perigo: "bg-surface-2 text-texto-3 hover:bg-accent-deep hover:text-white",
};

type Comuns = {
  variante?: Variante;
  className?: string;
  children: ReactNode;
};

export function BotaoAcao({
  variante = "secundaria",
  className = "",
  children,
  ...resto
}: Comuns & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...resto}
      className={`${BASE} ${VARIANTES[variante]} ${className}`}
    >
      {children}
    </button>
  );
}

/** Mesma aparência para quando a ação é navegar ou abrir o WhatsApp. */
export function LinkAcao({
  variante = "secundaria",
  className = "",
  children,
  ...resto
}: Comuns & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...resto} className={`${BASE} ${VARIANTES[variante]} ${className}`}>
      {children}
    </a>
  );
}

/**
 * Lugar do botão que não existe nesta linha — "sem telefone", "encerrada".
 * Ocupa a mesma altura para a fileira de botões não dançar entre um cartão e
 * o outro.
 */
export function AcaoIndisponivel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`${BASE} bg-surface-2 text-texto-3 opacity-60 ${className}`}
      aria-disabled="true"
    >
      {children}
    </span>
  );
}
