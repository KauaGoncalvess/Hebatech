"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  itens: { chave: string; conteudo: ReactNode }[];
  /** Largura de cada card. Muda entre o trilho de produto e o de serviço. */
  larguraItem: string;
  rotulo: string;
};

/**
 * Trilho horizontal com encaixe e setas sobrepostas, no modelo da referência.
 * Rolagem nativa: funciona com gesto de toque, roda do mouse e teclado.
 */
export function Carrossel({ itens, larguraItem, rotulo }: Props) {
  const ref = useRef<HTMLUListElement>(null);
  const [limites, setLimites] = useState({ inicio: true, fim: false });

  const medir = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setLimites({
      inicio: el.scrollLeft <= 4,
      fim: el.scrollLeft >= el.scrollWidth - el.clientWidth - 4,
    });
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

      {([-1, 1] as const).map((d) => {
        const desligado = d === -1 ? limites.inicio : limites.fim;
        return (
          <button
            key={d}
            type="button"
            onClick={() => mover(d)}
            disabled={desligado}
            aria-label={d === -1 ? "Anterior" : "Próximo"}
            className={`absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface-2/90 font-mono text-sm backdrop-blur transition-all hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-0 lg:flex ${
              d === -1 ? "-left-5" : "-right-5"
            }`}
          >
            {d === -1 ? "←" : "→"}
          </button>
        );
      })}
    </div>
  );
}
