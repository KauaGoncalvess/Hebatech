"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Notebook } from "@/data/notebooks";
import { ProductCard } from "./product-card";

/**
 * Trilho horizontal com encaixe. Usa rolagem nativa — sem biblioteca de
 * carrossel — então funciona com gesto de toque e teclado de graça.
 */
export function ProductRail({ itens }: { itens: Notebook[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [limites, setLimites] = useState({ inicio: true, fim: false });

  const medir = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setLimites({
      inicio: el.scrollLeft <= 2,
      fim: el.scrollLeft >= el.scrollWidth - el.clientWidth - 2,
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
    el.scrollBy({ left: direcao * (passo + 1), behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-line px-4 py-3 md:px-6">
        <p className="eyebrow text-white/40">
          Arraste para o lado · {itens.length} aparelhos em destaque
        </p>
        <div className="hidden gap-px md:flex">
          {([-1, 1] as const).map((d) => {
            const off = d === -1 ? limites.inicio : limites.fim;
            return (
              <button
                key={d}
                type="button"
                onClick={() => mover(d)}
                disabled={off}
                aria-label={d === -1 ? "Anterior" : "Próximo"}
                className="flex h-9 w-11 items-center justify-center border border-line font-mono text-sm transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:text-white/15"
              >
                {d === -1 ? "←" : "→"}
              </button>
            );
          })}
        </div>
      </div>

      <ul
        ref={ref}
        onScroll={medir}
        className="rail flex snap-x snap-mandatory gap-px overflow-x-auto px-4 py-px md:px-6"
      >
        {itens.map((n, i) => (
          <li
            key={n.codigo}
            className="w-[82vw] shrink-0 snap-start xs:w-[74vw] sm:w-[340px] lg:w-[380px]"
          >
            <ProductCard n={n} indice={i + 1} />
          </li>
        ))}
      </ul>
    </div>
  );
}
