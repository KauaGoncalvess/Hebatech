import Link from "next/link";
import { LinhaOrdem } from "@/components/admin/linha-ordem";
import { listarOrdens } from "@/lib/ordens";
import { waAvisoDaOrdem } from "@/lib/whatsapp";
import { aparelhoDe, type Ordem } from "@/types/ordem";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ ok?: string; excluido?: string }> };

function aviso(o: Ordem) {
  return waAvisoDaOrdem({
    clienteNome: o.clienteNome,
    clienteTelefone: o.clienteTelefone,
    codigo: o.codigo,
    aparelho: aparelhoDe(o),
    status: o.status,
    valorOrcado: o.valorOrcado,
  });
}

export default async function ListaOrdens({ searchParams }: Props) {
  const { ok, excluido } = await searchParams;
  const ordens = await listarOrdens();

  const naBancada = ordens.filter(
    (o) => o.status !== "entregue" && o.status !== "cancelado",
  );
  const esperandoRetirada = naBancada.filter((o) => o.status === "pronto");
  const esperandoCliente = naBancada.filter((o) => o.status === "aguardando_aprovacao");
  const encerradas = ordens.filter(
    (o) => o.status === "entregue" || o.status === "cancelado",
  );

  return (
    <>
      {(ok || excluido) && (
        <p className="mt-4 rounded-full bg-accent px-5 py-3 text-center font-mono text-[11px] tracking-[0.12em] text-black uppercase">
          {ok ? "Ordem salva." : "Ordem excluída."}
        </p>
      )}

      <section className="flex flex-wrap items-end justify-between gap-4 py-10 md:py-12">
        <div>
          <p className="eyebrow text-accent">Bancada</p>
          <h1 className="display mt-3 text-title">Ordens de serviço</h1>
          <p className="mt-4 max-w-[54ch] text-[13.5px] leading-relaxed text-white/55">
            Cada ordem daqui o cliente consulta sozinho em{" "}
            <span className="font-mono text-white/75">/acompanhar</span>, com o código e
            os quatro últimos dígitos do telefone dele. Mudar a etapa aqui muda o que ele
            vê na hora.
          </p>
        </div>
        <Link
          href="/admin/ordens/nova"
          className="flex h-13 items-center rounded-full bg-accent px-7 py-4 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
        >
          Abrir ordem
        </Link>
      </section>

      {ordens.length === 0 ? (
        <div className="card px-6 py-20 text-center">
          <p className="display text-sub">Nenhuma ordem aberta</p>
          <p className="mx-auto mt-4 max-w-[46ch] text-[13px] text-white/55">
            Abra a primeira quando o próximo aparelho entrar na loja. O cliente recebe o
            código e passa a acompanhar sozinho.
          </p>
        </div>
      ) : (
        <>
          <dl className="mb-8 grid gap-3 sm:grid-cols-3">
            {[
              [`${naBancada.length}`, "na bancada"],
              [`${esperandoCliente.length}`, "esperando aprovação"],
              [`${esperandoRetirada.length}`, "prontas para retirar"],
            ].map(([num, texto]) => (
              <div key={texto} className="rounded-2xl bg-surface-2 p-4">
                <dt className="font-mono text-[10px] tracking-[0.12em] text-white/35 uppercase">
                  {texto}
                </dt>
                <dd className="display mt-2 text-[1.8rem] leading-none text-accent">
                  {num}
                </dd>
              </div>
            ))}
          </dl>

          <p className="eyebrow mb-4 text-white/35">Em andamento · {naBancada.length}</p>
          {naBancada.length === 0 ? (
            <p className="card px-6 py-10 text-center text-[13px] text-white/45">
              Nenhum aparelho na bancada.
            </p>
          ) : (
            <ul className="grid gap-3">
              {naBancada.map((o) => (
                <LinhaOrdem key={o.id} o={o} aviso={aviso(o)} />
              ))}
            </ul>
          )}

          {encerradas.length > 0 && (
            <>
              <p className="eyebrow mt-10 mb-4 text-white/35">
                Encerradas · {encerradas.length}
              </p>
              <ul className="grid gap-3">
                {encerradas.slice(0, 40).map((o) => (
                  <LinhaOrdem key={o.id} o={o} aviso={aviso(o)} />
                ))}
              </ul>
              {encerradas.length > 40 && (
                <p className="mt-4 text-center font-mono text-[11px] text-white/35">
                  Mostrando as 40 mais recentes de {encerradas.length}.
                </p>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
