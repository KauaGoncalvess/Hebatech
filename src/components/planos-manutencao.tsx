import { preco } from "@/lib/format";
import { waContrato } from "@/lib/whatsapp";
import type { Plano, RegraManutencao } from "@/types/plano";

type Props = { planos: Plano[]; regras: RegraManutencao[] };

/** Planos de contrato mensal para empresa sem TI próprio. */
/** A grade acompanha quantos planos estão publicados. */
const COLUNAS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export function PlanosManutencao({ planos, regras }: Props) {
  return (
    <>
      <div className={`grid grid-cols-1 ${COLUNAS[planos.length] ?? "lg:grid-cols-3"}`}>
        {planos.map((p, i) => {
          const valor = p.precoMensal === null ? "Sob proposta" : preco(p.precoMensal);
          return (
            <article
              key={p.id}
              className={`relative flex flex-col border-line ${
                i < planos.length - 1 ? "border-b lg:border-r lg:border-b-0" : ""
              } ${p.destaque ? "bg-surface" : ""}`}
            >
              {p.destaque && (
                <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-accent" />
              )}

              <div className="flex items-start justify-between gap-4 px-4 pt-6 md:px-6">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.18em] text-white/35">
                    {p.codigo}
                  </p>
                  <h3 className="display mt-2 text-sub">{p.nome}</h3>
                  <p className="mt-2 font-mono text-[11px] text-accent">{p.faixa}</p>
                </div>
                {p.destaque && (
                  <span className="shrink-0 border border-accent px-2 py-1 font-mono text-[9px] tracking-[0.14em] text-accent uppercase">
                    Mais contratado
                  </span>
                )}
              </div>

              <div className="mt-5 border-y border-line px-4 py-4 md:px-6">
                <p className="display text-[2.4rem] leading-none">{valor}</p>
                <p className="mt-2 font-mono text-[10.5px] tracking-[0.12em] text-white/45">
                  {p.precoMensal === null ? p.visitas : `por mês · ${p.visitas}`}
                </p>
              </div>

              <ul>
                {p.inclui.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 border-b border-line px-4 py-2.5 text-[12.5px] text-white/70 md:px-6"
                  >
                    <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href={waContrato({ plano: `${p.nome} (${p.codigo})`, maquinas: p.faixa })}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-auto flex items-center justify-between px-4 py-4 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors md:px-6 ${
                  p.destaque
                    ? "bg-accent text-black hover:bg-white"
                    : "border-t border-line hover:bg-accent hover:text-black"
                }`}
              >
                Pedir proposta
                <span aria-hidden>→</span>
              </a>
            </article>
          );
        })}
      </div>

      {regras.length > 0 && (
        <dl className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {regras.map((r, i) => (
            <div
              key={r.titulo}
              className={`border-line p-4 md:p-6 ${
                i < regras.length - 1 ? "border-b lg:border-b-0" : ""
              } ${i % 2 === 0 ? "sm:border-r" : ""} ${
                i < regras.length - 1 ? "lg:border-r" : ""
              }`}
            >
              <dt className="eyebrow text-accent">{r.titulo}</dt>
              <dd className="mt-3 max-w-[32ch] text-[12.5px] text-white/55">{r.texto}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );
}
