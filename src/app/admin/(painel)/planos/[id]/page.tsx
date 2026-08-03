import { notFound } from "next/navigation";
import { ExcluirPlanoButton } from "@/components/admin/excluir-plano-button";
import { PlanoForm } from "@/components/admin/plano-form";
import { buscarPlanoPorId } from "@/lib/planos";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditarPlano({ params }: Props) {
  const { id } = await params;
  const plano = await buscarPlanoPorId(id);
  if (!plano) notFound();

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-4 py-10 md:py-12">
        <div>
          <p className="eyebrow text-accent">
            {plano.codigo} · {plano.ativo ? "publicado" : "fora do ar"}
          </p>
          <h1 className="display mt-3 text-title">{plano.nome}</h1>
        </div>
        <ExcluirPlanoButton id={plano.id} nome={plano.nome} />
      </section>

      <PlanoForm plano={plano} />
    </>
  );
}
