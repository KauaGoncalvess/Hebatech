import { OrdemForm } from "@/components/admin/ordem-form";
import { codigoPrevisto } from "@/lib/ordens";

export const dynamic = "force-dynamic";

export default async function NovaOrdem() {
  // Só para mostrar: o número é reservado de verdade no salvar.
  const numero = await codigoPrevisto();

  return (
    <>
      <section className="py-7 md:py-9">
        <p className="eyebrow text-accent">Bancada</p>
        <h1 className="display mt-3 text-title">Abrir ordem</h1>
        <p className="mt-4 max-w-[58ch] text-corpo leading-relaxed text-texto-3">
          Anote o número no comprovante do cliente e diga a ele que dá para acompanhar
          pelo site, com esse número e os quatro últimos dígitos do telefone.
        </p>
      </section>

      <OrdemForm codigoPrevisto={numero} />
    </>
  );
}
