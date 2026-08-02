import { ProdutoForm } from "@/components/admin/produto-form";

export const dynamic = "force-dynamic";

export default function NovoProduto() {
  return (
    <>
      <section className="border-b border-line px-4 py-8 md:px-6 md:py-10">
        <p className="eyebrow text-accent">Cadastro</p>
        <h1 className="display mt-3 text-title">Novo produto</h1>
        <p className="mt-4 max-w-[54ch] text-[13px] text-white/50">
          O mínimo para publicar é marca, modelo, código e preço. O resto você
          completa depois.
        </p>
      </section>
      <ProdutoForm />
    </>
  );
}
