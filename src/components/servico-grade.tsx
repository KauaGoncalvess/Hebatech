import Link from "next/link";
import { rotaServico, servicos } from "@/data/servicos";
import { ServicoArt } from "./servico-art";

/**
 * As oito frentes da bancada, todas visíveis. Duas colunas já no celular —
 * em coluna única viravam uma torre de oito cards que ninguém rola até o fim.
 * No telefone o card é enxuto: ilustração, nome e preço, sem o parágrafo.
 */
export function ServicoGrade() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {servicos.map((s) => (
        <li key={s.slug}>
          <Link
            href={rotaServico(s)}
            className="card group flex h-full flex-col overflow-hidden transition-colors hover:bg-surface-2"
          >
            <span className="relative block aspect-[16/10] overflow-hidden text-white">
              <ServicoArt
                area={s.area}
                className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute top-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-1 font-mono text-rotulo tracking-[0.12em] text-accent uppercase backdrop-blur sm:top-3 sm:left-3 sm:px-3 sm:py-1.5 sm:text-rotulo sm:tracking-[0.14em]">
                {s.etiqueta}
              </span>
            </span>

            <span className="flex flex-1 flex-col p-4 sm:p-5">
              <span className="display text-[1.15rem] leading-[0.95] sm:text-[1.35rem]">
                {s.titulo}
              </span>

              {/* O resumo só cabe a partir do tablet; no celular vira ruído. */}
              <span className="mt-3 hidden flex-1 text-nota leading-relaxed text-texto-3 sm:block">
                {s.resumo}
              </span>

              <span className="mt-4 flex flex-1 items-end justify-between gap-2 sm:mt-5 sm:flex-none">
                <span className="font-mono text-rotulo leading-tight text-texto-3 sm:text-rotulo">
                  Orçamento após a medição
                </span>
                <span
                  aria-hidden
                  className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-nota transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-black sm:flex"
                >
                  →
                </span>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
