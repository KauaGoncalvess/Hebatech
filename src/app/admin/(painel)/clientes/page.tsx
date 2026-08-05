import Link from "next/link";
import { ListaClientes } from "@/components/admin/lista-clientes";
import { listarClientes } from "@/lib/clientes";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ ok?: string; excluido?: string }> };

export default async function ClientesPage({ searchParams }: Props) {
  const { ok, excluido } = await searchParams;
  const clientes = await listarClientes();

  return (
    <>
      {(ok || excluido) && (
        <p className="mt-4 rounded-full bg-accent px-5 py-3 text-center font-mono text-[11px] tracking-[0.12em] text-black uppercase">
          {ok ? "Ficha salva." : "Ficha excluída."}
        </p>
      )}

      <section className="flex flex-wrap items-end justify-between gap-4 py-10 md:py-12">
        <div>
          <p className="eyebrow text-accent">Cadastro</p>
          <h1 className="display mt-3 text-title">Clientes</h1>
          <p className="mt-4 max-w-[56ch] text-[13.5px] leading-relaxed text-white/55">
            Procure por nome, telefone ou CPF. Cada ficha guarda o histórico completo:
            todas as ordens da pessoa, com defeito, o que foi feito e o aparelho de cada
            visita. A ficha nasce sozinha quando você abre uma ordem para alguém novo.
          </p>
        </div>
        <Link
          href="/admin/clientes/novo"
          className="flex h-13 items-center rounded-full bg-accent px-7 py-4 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
        >
          Cadastrar cliente
        </Link>
      </section>

      <ListaClientes clientes={clientes} />
    </>
  );
}
