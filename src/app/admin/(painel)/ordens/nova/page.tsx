import { OrdemForm } from "@/components/admin/ordem-form";

export default function NovaOrdem() {
  return (
    <>
      <section className="py-10 md:py-12">
        <p className="eyebrow text-accent">Bancada</p>
        <h1 className="display mt-3 text-title">Abrir ordem</h1>
        <p className="mt-4 max-w-[58ch] text-[14px] leading-relaxed text-white/55">
          Anote o código no comprovante do cliente e diga a ele que dá para acompanhar
          pelo site, com esse código e os quatro últimos dígitos do telefone.
        </p>
      </section>

      <OrdemForm />
    </>
  );
}
