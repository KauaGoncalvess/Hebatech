import Link from "next/link";
import { LancamentoForm } from "@/components/admin/lancamento-form";

export const dynamic = "force-dynamic";

export default function NovoLancamentoPage() {
  return (
    <>
      <section className="py-10 md:py-12">
        <Link
          href="/admin/financeiro"
          className="font-mono text-[11px] tracking-[0.12em] text-white/45 uppercase transition-colors hover:text-accent"
        >
          ← Financeiro
        </Link>
        <h1 className="display mt-4 text-title">Novo lançamento</h1>
        <p className="mt-4 max-w-[52ch] text-[13.5px] leading-relaxed text-white/55">
          Compra de peça, aluguel, luz, retirada, venda avulsa. Serviço entregue
          não precisa: a ordem já lança sozinha.
        </p>
      </section>

      <LancamentoForm />
    </>
  );
}
