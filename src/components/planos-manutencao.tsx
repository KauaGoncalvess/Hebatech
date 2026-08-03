import { preco } from "@/lib/format";
import { waContrato } from "@/lib/whatsapp";
import type { Plano, RegraManutencao } from "@/types/plano";

type Props = { planos: Plano[]; regras: RegraManutencao[] };

/** A grade acompanha quantos planos estão publicados. */
const COLUNAS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

/** Planos de contrato mensal para empresa sem TI próprio. */
export function PlanosManutencao({ planos, regras }: Props) {
  return (
    <>
      <div className={`grid gap-4 ${COLUNAS[planos.length] ?? "lg:grid-cols-3"}`}>
        {planos.map((p) => {
          const valor = p.precoMensal === null ? "Sob proposta" : preco(p.precoMensal);
          return (
            <article
              key={p.id}
              className={`spot card flex flex-col p-6 ${p.destaque ? "bg-surface-2" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.14em] text-white/35">
                    {p.codigo}
                  </p>
                  <h3 className="display mt-2 text-sub">{p.nome}</h3>
                  {p.faixa && (
                    <p className="mt-2 font-mono text-[12px] text-accent">{p.faixa}</p>
                  )}
                </div>
                {p.destaque && (
                  <span className="shrink-0 rounded-full bg-accent px-3 py-1.5 font-mono text-[9.5px] font-bold tracking-[0.1em] text-black uppercase">
                    Mais contratado
                  </span>
                )}
              </div>

              <div className="mt-6">
                <p className="display text-[2.4rem] leading-none">{valor}</p>
                {p.visitas && (
                  <p className="mt-2 font-mono text-[11.5px] text-white/45">
                    {p.precoMensal === null ? p.visitas : `por mês · ${p.visitas}`}
                  </p>
                )}
              </div>

              <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
                {p.inclui.map((item) => (
                  <li key={item} className="flex gap-3 text-[13.5px] text-white/70">
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href={waContrato({ plano: `${p.nome} (${p.codigo})`, maquinas: p.faixa })}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-7 flex h-13 items-center justify-center rounded-full py-4 font-mono text-[12px] tracking-[0.12em] uppercase transition-colors ${
                  p.destaque
                    ? "bg-accent font-bold text-black hover:bg-white"
                    : "bg-surface-2 hover:bg-surface-3"
                }`}
              >
                Pedir proposta
              </a>
            </article>
          );
        })}
      </div>

      {regras.length > 0 && (
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {regras.map((r) => (
            <div key={r.titulo} className="rounded-2xl bg-surface-2 p-5">
              <dt className="eyebrow text-accent">{r.titulo}</dt>
              <dd className="mt-3 text-[13px] leading-relaxed text-white/55">{r.texto}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );
}
