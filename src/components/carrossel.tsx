"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  itens: { chave: string; conteudo: ReactNode }[];
  /** Largura de cada card. Muda entre o trilho de produto e o de serviço. */
  larguraItem: string;
  rotulo: string;
};

/**
 * Trilho horizontal com encaixe. Rolagem nativa: funciona com gesto de toque,
 * roda do mouse e teclado. As setas e a barra de posição aparecem em qualquer
 * largura — sem elas, no celular nada indicava que havia mais coisa à direita.
 */
export function Carrossel({ itens, larguraItem, rotulo }: Props) {
  const ref = useRef<HTMLUListElement>(null);
  const [limites, setLimites] = useState({ inicio: true, fim: false });
  const [progresso, setProgresso] = useState(0);

  const medir = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rolavel = el.scrollWidth - el.clientWidth;
    setLimites({
      inicio: el.scrollLeft <= 4,
      fim: el.scrollLeft >= rolavel - 4,
    });
    setProgresso(rolavel > 0 ? el.scrollLeft / rolavel : 0);
  }, []);

  useEffect(() => {
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [medir]);

  const mover = (direcao: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const passo = el.querySelector("li")?.clientWidth ?? el.clientWidth * 0.8;
    el.scrollBy({ left: direcao * (passo + 16), behavior: "smooth" });
  };

  const temRolagem = !limites.inicio || !limites.fim;

  return (
    <div className="relative">
      <ul
        ref={ref}
        onScroll={medir}
        aria-label={rotulo}
        className="rail -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0"
      >
        {itens.map((item) => (
          <li key={item.chave} className={`shrink-0 snap-start ${larguraItem}`}>
            {item.conteudo}
          </li>
        ))}
      </ul>

      {temRolagem && (
        <div className="mt-5 flex items-center gap-4">
          {/* Barra de posição: diz que há mais conteúdo e onde você está */}
          <div className="h-px flex-1 bg-line-strong">
            <div
              aria-hidden
              className="h-px w-1/3 bg-accent transition-transform duration-200"
              style={{ transform: `translateX(${progresso * 200}%)` }}
            />
          </div>

          <div className="flex shrink-0 gap-2">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => mover(d)}
                disabled={d === -1 ? limites.inicio : limites.fim}
                aria-label={d === -1 ? `${rotulo}: anterior` : `${rotulo}: próximo`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-2 font-mono text-sm transition-colors hover:border-accent hover:text-accent disabled:opacity-30"
              >
                {d === -1 ? "←" : "→"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
