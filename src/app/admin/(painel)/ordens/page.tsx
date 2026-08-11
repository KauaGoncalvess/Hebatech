import Link from "next/link";
import { CabecalhoPainel } from "@/components/admin/cabecalho-painel";
import { CartaoNumero } from "@/components/admin/cartao-numero";
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
  const esperandoCliente = naBancada.filter(
    (o) => o.status === "aguardando_aprovacao",
  );
  const encerradas = ordens.filter(
    (o) => o.status === "entregue" || o.status === "cancelado",
  );

  return (
    <>
      {(ok || excluido) && (
        <p className="mt-4 rounded-full bg-accent px-5 py-3 text-center font-mono text-rotulo tracking-[0.12em] text-black uppercase">
          {ok ? "Ordem salva." : "Ordem excluída."}
        </p>
      )}

      <CabecalhoPainel
        titulo="Ordens de serviço"
        nota="Mudar a etapa aqui muda na hora o que o cliente vê em /acompanhar."
        acao={
          <Link
            href="/admin/ordens/nova"
            className="toque rounded-full bg-accent px-7 font-mono text-rotulo font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-accent-hover"
          >
            Abrir ordem
          </Link>
        }
      />

      {ordens.length === 0 ? (
        <div className="card px-6 py-20 text-center">
          <p className="display text-sub">Nenhuma ordem aberta</p>
          <p className="mx-auto mt-4 max-w-[46ch] text-nota text-texto-3">
            Abra a primeira quando o próximo aparelho entrar na loja. O cliente
            recebe o código e passa a acompanhar sozinho.
          </p>
        </div>
      ) : (
        <>
          {/*
            Três colunas já no celular. Empilhados, estes três dígitos comiam
            uns 700px — um quarto da tela — antes da primeira ordem da lista.
          */}
          <ul className="mb-6 grid grid-cols-3 gap-2.5 md:gap-3">
            {[
              {
                rotulo: "Na bancada",
                valor: naBancada.length,
                tom: "neutro" as const,
              },
              {
                rotulo: "Aprovação",
                valor: esperandoCliente.length,
                tom: (esperandoCliente.length ? "acento" : "neutro") as
                  | "acento"
                  | "neutro",
              },
              {
                rotulo: "Para retirar",
                valor: esperandoRetirada.length,
                tom: (esperandoRetirada.length ? "acento" : "neutro") as
                  | "acento"
                  | "neutro",
              },
            ].map((c) => (
              <li key={c.rotulo}>
                <CartaoNumero
                  rotulo={c.rotulo}
                  valor={String(c.valor)}
                  tom={c.tom}
                  compacto
                />
              </li>
            ))}
          </ul>

          <p className="eyebrow mb-4 text-texto-3">
            Em andamento · {naBancada.length}
          </p>
          {naBancada.length === 0 ? (
            <p className="card px-6 py-10 text-center text-nota text-texto-3">
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
              <p className="eyebrow mt-10 mb-4 text-texto-3">
                Encerradas · {encerradas.length}
              </p>
              <ul className="grid gap-3">
                {encerradas.slice(0, 40).map((o) => (
                  <LinhaOrdem key={o.id} o={o} aviso={aviso(o)} />
                ))}
              </ul>
              {encerradas.length > 40 && (
                <p className="mt-4 text-center font-mono text-rotulo text-texto-3">
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
