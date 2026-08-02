import Link from "next/link";
import { LinhaPlano } from "@/components/admin/linha-plano";
import { RegrasForm } from "@/components/admin/regras-form";
import { listarPlanos, listarRegras } from "@/lib/planos";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ ok?: string; excluido?: string }> };

export default async function ListaPlanos({ searchParams }: Props) {
  const { ok, excluido } = await searchParams;
  const [planos, regras] = await Promise.all([listarPlanos(), listarRegras()]);

  const publicados = planos.filter((p) => p.ativo);
  const pausados = planos.filter((p) => !p.ativo);

  return (
    <>
      {(ok || excluido) && (
        <p className="border-b border-accent bg-accent px-4 py-3 font-mono text-[11px] tracking-[0.14em] text-black uppercase md:px-6">
          {ok ? "Plano salvo. Já está no ar." : "Plano excluído."}
        </p>
      )}

      <section className="flex flex-wrap items-end justify-between gap-4 border-b border-line px-4 py-8 md:px-6 md:py-10">
        <div>
          <p className="eyebrow text-accent">Assistência</p>
          <h1 className="display mt-3 text-title">Manutenção mensal</h1>
          <p className="mt-4 max-w-[54ch] text-[13px] text-white/50">
            Os planos que aparecem em{" "}
            <Link
              href="/assistencia#manutencao"
              target="_blank"
              className="text-accent underline decoration-line underline-offset-4"
            >
              /assistencia
            </Link>
            . Mudou o valor? Altere aqui e o site atualiza na hora.
          </p>
        </div>
        <Link
          href="/admin/planos/novo"
          className="flex h-12 items-center bg-accent px-6 font-mono text-[11.5px] font-bold tracking-[0.16em] text-black uppercase transition-colors hover:bg-white"
        >
          Novo plano
        </Link>
      </section>

      {planos.length === 0 ? (
        <div className="px-4 py-20 text-center md:px-6">
          <p className="display text-sub">Nenhum plano cadastrado</p>
          <p className="mx-auto mt-4 max-w-[44ch] text-[13px] text-white/55">
            Sem plano publicado, a seção de manutenção mensal não aparece no site.
          </p>
        </div>
      ) : (
        <>
          <p className="eyebrow border-b border-line px-4 py-3 text-white/35 md:px-6">
            Publicados · {publicados.length}
          </p>
          <ul>
            {publicados.map((p) => (
              <LinhaPlano key={p.id} p={p} />
            ))}
          </ul>

          {pausados.length > 0 && (
            <>
              <p className="eyebrow border-y border-line px-4 py-3 text-white/35 md:px-6">
                Fora do ar · {pausados.length}
              </p>
              <ul>
                {pausados.map((p) => (
                  <LinhaPlano key={p.id} p={p} />
                ))}
              </ul>
            </>
          )}
        </>
      )}

      <section className="border-t border-line">
        <div className="flex items-baseline gap-3 border-b border-line px-4 py-3 md:px-6">
          <span className="font-mono text-[11px] text-accent">·</span>
          <h2 className="eyebrow text-white/45">Regras do contrato</h2>
        </div>
        <p className="border-b border-line px-4 py-3 text-[12.5px] text-white/45 md:px-6">
          As quatro caixas exibidas logo abaixo dos planos. Servem para deixar claro o
          que a mensalidade cobre e o que não cobre.
        </p>
        <RegrasForm regras={regras} />
      </section>
    </>
  );
}
