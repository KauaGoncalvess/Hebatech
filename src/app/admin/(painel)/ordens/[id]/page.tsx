import { notFound } from "next/navigation";
import { ExcluirOrdemButton } from "@/components/admin/excluir-ordem-button";
import { OrdemForm } from "@/components/admin/ordem-form";
import { buscarOrdemPorId } from "@/lib/ordens";
import { waAvisoDaOrdem } from "@/lib/whatsapp";
import { aparelhoDe } from "@/types/ordem";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditarOrdem({ params }: Props) {
  const { id } = await params;
  const ordem = await buscarOrdemPorId(id);
  if (!ordem) notFound();

  const aviso = waAvisoDaOrdem({
    clienteNome: ordem.clienteNome,
    clienteTelefone: ordem.clienteTelefone,
    codigo: ordem.codigo,
    aparelho: aparelhoDe(ordem),
    status: ordem.status,
    valorOrcado: ordem.valorOrcado,
  });

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-4 py-10 md:py-12">
        <div>
          <p className="eyebrow text-accent">Ordem {ordem.codigo}</p>
          <h1 className="display mt-3 text-title">{aparelhoDe(ordem) || "Aparelho"}</h1>
          <p className="mt-3 font-mono text-[12px] text-white/45">
            {ordem.clienteNome} · {ordem.clienteTelefone}
          </p>
        </div>

        <div className="flex flex-wrap items-start gap-2">
          {aviso && (
            <a
              href={aviso}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center rounded-full bg-surface-2 px-5 font-mono text-[10.5px] tracking-[0.12em] text-white/60 uppercase transition-colors hover:bg-surface-3 hover:text-white"
            >
              Avisar o cliente
            </a>
          )}
          <ExcluirOrdemButton id={ordem.id} codigo={ordem.codigo} />
        </div>
      </section>

      <OrdemForm ordem={ordem} />
    </>
  );
}
