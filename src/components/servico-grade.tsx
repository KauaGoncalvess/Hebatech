import Link from "next/link";
import { rotaServico, servicos } from "@/data/servicos";
import { ServicoArt } from "./servico-art";

/**
 * As oito frentes da bancada, todas visíveis de uma vez. Substitui o carrossel
 * que escondia seis delas atrás de um arrasto que quase ninguém faz.
 */
export function ServicoGrade() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {servicos.map((s) => (
        <li key={s.slug}>
          <Link
            href={rotaServico(s)}
            className="spot card group flex h-full flex-col overflow-hidden transition-colors hover:bg-surface-2"
          >
            <span className="relative block aspect-[16/10] overflow-hidden text-white">
              <ServicoArt
                area={s.area}
                className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-accent uppercase backdrop-blur">
                {s.etiqueta}
              </span>
            </span>

            <span className="flex flex-1 flex-col p-5">
              <span className="display text-[1.35rem] leading-[0.95]">{s.titulo}</span>
              <span className="mt-3 flex-1 text-[13.5px] leading-relaxed text-white/55">
                {s.resumo}
              </span>
              <span className="mt-5 flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] text-white/50">{s.precoPartida}</span>
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-[13px] transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-black"
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
