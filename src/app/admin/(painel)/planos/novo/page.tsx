import { PlanoForm } from "@/components/admin/plano-form";

export const dynamic = "force-dynamic";

export default function NovoPlano() {
  return (
    <>
      <section className="border-b border-line px-4 py-8 md:px-6 md:py-10">
        <p className="eyebrow text-accent">Manutenção mensal</p>
        <h1 className="display mt-3 text-title">Novo plano</h1>
        <p className="mt-4 max-w-[54ch] text-[13px] text-white/50">
          Código e nome bastam para salvar. Deixe o valor em branco marcando “sem
          valor fixo” se o plano for sob proposta.
        </p>
      </section>
      <PlanoForm />
    </>
  );
}
