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
        <p className="mt-4 rounded-full bg-accent px-5 py-3 text-center font-mono text-[11px] tracking-[0.12em] text-black uppercase">
          {ok ? "Plano salvo. Já está no ar." : "Plano excluído."}
        </p>
      )}

      <section className="flex flex-wrap items-end justify-between gap-4 py-10 md:py-12">
        <div>
          <p className="eyebrow text-accent">Assistência</p>
          <h1 className="display mt-3 text-title">Manutenção mensal</h1>
          <p className="mt-4 max-w-[54ch] text-[13px] text-white/50">
            Os planos que aparecem em{" "}
            <Link
              href="/manutencao"
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
          className="flex h-13 items-center rounded-full bg-accent px-7 py-4 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
        >
          Novo plano
        </Link>
      </section>

      {planos.length === 0 ? (
        <div className="card px-6 py-20 text-center">
          <p className="display text-sub">Nenhum plano cadastrado</p>
          <p className="mx-auto mt-4 max-w-[44ch] text-[13px] text-white/55">
            Sem plano publicado, a seção de manutenção mensal não aparece no site.
          </p>
        </div>
      ) : (
        <>
          <p className="eyebrow mb-4 text-white/35">Publicados · {publicados.length}</p>
          <ul className="grid gap-3">
            {publicados.map((p) => (
              <LinhaPlano key={p.id} p={p} />
            ))}
          </ul>

          {pausados.length > 0 && (
            <>
              <p className="eyebrow mt-10 mb-4 text-white/35">Fora do ar · {pausados.length}</p>
              <ul className="grid gap-3">
                {pausados.map((p) => (
                  <LinhaPlano key={p.id} p={p} />
                ))}
              </ul>
            </>
          )}
        </>
      )}

      <section className="mt-12">
        <h2 className="eyebrow text-white/45">Regras do contrato</h2>
        <p className="mt-3 mb-5 max-w-[70ch] text-[13px] leading-relaxed text-white/45">
          As quatro caixas exibidas logo abaixo dos planos. Servem para deixar claro o
          que a mensalidade cobre e o que não cobre.
        </p>
        <RegrasForm regras={regras} />
      </section>
    </>
  );
}
