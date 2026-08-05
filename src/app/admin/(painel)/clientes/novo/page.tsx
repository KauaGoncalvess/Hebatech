import { ClienteForm } from "@/components/admin/cliente-form";

export default function NovoCliente() {
  return (
    <>
      <section className="py-10 md:py-12">
        <p className="eyebrow text-accent">Cadastro</p>
        <h1 className="display mt-3 text-title">Cadastrar cliente</h1>
        <p className="mt-4 max-w-[58ch] text-[14px] leading-relaxed text-white/55">
          Só é preciso quando você quer a ficha pronta antes do aparelho chegar. Se a
          pessoa está no balcão agora, abra a ordem direto: a ficha nasce junto.
        </p>
      </section>

      <ClienteForm />
    </>
  );
}
