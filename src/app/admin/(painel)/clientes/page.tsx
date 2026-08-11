import Link from "next/link";
import { CabecalhoPainel } from "@/components/admin/cabecalho-painel";
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
        <p className="mt-4 rounded-full bg-accent px-5 py-3 text-center font-mono text-rotulo tracking-[0.12em] text-black uppercase">
          {ok ? "Ficha salva." : "Ficha excluída."}
        </p>
      )}

      <CabecalhoPainel
        titulo="Clientes"
        nota="Procure por nome, telefone ou CPF. Cada ficha guarda o histórico completo da pessoa."
        acao={
          <Link
            href="/admin/clientes/novo"
            className="toque rounded-full bg-accent px-7 font-mono text-rotulo font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-accent-hover"
          >
            Cadastrar cliente
          </Link>
        }
      />

      <ListaClientes clientes={clientes} />
    </>
  );
}
