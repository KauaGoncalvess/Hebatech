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
        <p className="mt-4 rounded-full bg-accent px-5 py-3 text-center font-mono text-rotulo tracking-[0.12em] text-black uppercase">
          {ok ? "Plano salvo. Já está no ar." : "Plano excluído."}
        </p>
      )}

      <section className="flex flex-wrap items-end justify-between gap-4 py-7 md:py-9">
        <div>
          <h1 className="display text-[clamp(1.9rem,6vw,2.8rem)] leading-none">Manutenção mensal</h1>
          <p className="mt-4 max-w-[54ch] text-nota text-texto-3">
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
          className="toque rounded-full bg-accent px-7 font-mono text-rotulo font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-accent-hover"
        >
          Novo plano
        </Link>
      </section>

      {planos.length === 0 ? (
        <div className="card px-6 py-20 text-center">
          <p className="display text-sub">Nenhum plano cadastrado</p>
          <p className="mx-auto mt-4 max-w-[44ch] text-nota text-texto-3">
            Sem plano publicado, a seção de manutenção mensal não aparece no site.
          </p>
        </div>
      ) : (
        <>
          <p className="eyebrow mb-4 text-texto-3">Publicados · {publicados.length}</p>
          <ul className="grid gap-3">
            {publicados.map((p) => (
              <LinhaPlano key={p.id} p={p} />
            ))}
          </ul>

          {pausados.length > 0 && (
            <>
              <p className="eyebrow mt-10 mb-4 text-texto-3">Fora do ar · {pausados.length}</p>
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
        <h2 className="eyebrow text-texto-3">Regras do contrato</h2>
        <p className="mt-3 mb-5 max-w-[70ch] text-nota leading-relaxed text-texto-3">
          As quatro caixas exibidas logo abaixo dos planos. Servem para deixar claro o
          que a mensalidade cobre e o que não cobre.
        </p>
        <RegrasForm regras={regras} />
      </section>
    </>
  );
}
