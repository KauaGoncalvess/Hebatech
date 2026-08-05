import Link from "next/link";
import { notFound } from "next/navigation";
import { ClienteForm } from "@/components/admin/cliente-form";
import { ExcluirClienteButton } from "@/components/admin/excluir-cliente-button";
import { buscarClientePorId } from "@/lib/clientes";
import { preco } from "@/lib/format";
import { listarOrdensDoCliente } from "@/lib/ordens";
import { numeroWhatsApp } from "@/lib/whatsapp";
import { aparelhoDe, ETAPA, type Ordem } from "@/types/ordem";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const data = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default async function FichaCliente({ params }: Props) {
  const { id } = await params;
  const cliente = await buscarClientePorId(id);
  if (!cliente) notFound();

  const ordens = await listarOrdensDoCliente(cliente.id);
  const numero = numeroWhatsApp(cliente.telefone);

  const entregues = ordens.filter((o) => o.status === "entregue");
  const gasto = entregues.reduce((soma, o) => soma + (o.valorOrcado ?? 0), 0);
  const emAndamento = ordens.filter(
    (o) => o.status !== "entregue" && o.status !== "cancelado",
  );

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-4 py-10 md:py-12">
        <div className="min-w-0">
          <p className="eyebrow text-accent">
            Cliente{cliente.origem === "site" ? " · veio pelo site" : ""}
            {!cliente.confirmado ? " · por conferir" : ""}
          </p>
          <h1 className="display mt-3 text-title">{cliente.nome}</h1>
          <p className="mt-3 font-mono text-[12.5px] text-white/50">
            {[cliente.telefone, cliente.documento, cliente.email]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {cliente.endereco && (
            <p className="mt-1 font-mono text-[12.5px] text-white/40">
              {cliente.endereco}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-start gap-2">
          {numero && (
            <a
              href={`https://wa.me/${numero}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center rounded-full bg-surface-2 px-5 font-mono text-[10.5px] tracking-[0.12em] text-white/60 uppercase transition-colors hover:bg-surface-3 hover:text-white"
            >
              Chamar no zap
            </a>
          )}
          <Link
            href="/admin/ordens/nova"
            className="flex h-11 items-center rounded-full bg-surface-2 px-5 font-mono text-[10.5px] tracking-[0.12em] text-white/60 uppercase transition-colors hover:bg-surface-3 hover:text-white"
          >
            Abrir ordem
          </Link>
          <ExcluirClienteButton id={cliente.id} nome={cliente.nome} />
        </div>
      </section>

      <dl className="grid gap-3 sm:grid-cols-4">
        {[
          [`${ordens.length}`, ordens.length === 1 ? "ordem" : "ordens", "no total"],
          [`${emAndamento.length}`, "na bancada", "agora"],
          [`${entregues.length}`, "entregues", "concluídas"],
          [preco(gasto), "somados", "nas entregues"],
        ].map(([num, unidade, texto]) => (
          <div key={unidade} className="rounded-2xl bg-surface-2 p-4">
            <dt className="font-mono text-[10px] tracking-[0.12em] text-white/35 uppercase">
              {unidade}
            </dt>
            <dd className="display mt-2 text-[1.6rem] leading-none text-accent">{num}</dd>
            <dd className="mt-1.5 font-mono text-[10px] text-white/30">{texto}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        <h2 className="eyebrow mb-4 text-white/35">
          Histórico de serviços · {ordens.length}
        </h2>

        {ordens.length === 0 ? (
          <p className="card px-6 py-14 text-center text-[13.5px] text-white/50">
            Nenhuma ordem para este cliente ainda. Ordens abertas com este telefone
            passam a aparecer aqui sozinhas.
          </p>
        ) : (
          <ol className="grid gap-3">
            {ordens.map((o) => (
              <LinhaHistorico key={o.id} o={o} />
            ))}
          </ol>
        )}
      </section>

      {cliente.observacoes && (
        <section className="card mt-4 p-6">
          <p className="eyebrow text-white/40">Observações da ficha</p>
          <p className="mt-3 text-[13.5px] leading-relaxed whitespace-pre-wrap text-white/65">
            {cliente.observacoes}
          </p>
        </section>
      )}

      <section className="mt-12">
        <h2 className="eyebrow mb-6 text-white/35">Editar ficha</h2>
        <ClienteForm cliente={cliente} />
      </section>
    </>
  );
}

/** Uma visita: quando, qual aparelho, o que tinha e o que foi feito. */
function LinhaHistorico({ o }: { o: Ordem }) {
  return (
    <li className="card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="flex flex-wrap items-center gap-x-2 font-mono text-[10px] tracking-[0.14em] text-white/35 uppercase">
          <Link href={`/admin/ordens/${o.id}`} className="text-accent hover:underline">
            {o.codigo}
          </Link>
          <span className="text-white/15">/</span>
          {data.format(new Date(o.criadoEm))}
        </p>
        <p className="flex flex-wrap items-center gap-x-3 font-mono text-[11px]">
          <span className="text-white/60">{ETAPA[o.status].rotulo}</span>
          {o.valorOrcado !== null && (
            <span className="text-accent">{preco(o.valorOrcado)}</span>
          )}
        </p>
      </div>

      <p className="mt-2 font-mono text-[13px] text-white">
        {aparelhoDe(o) || "Aparelho não informado"}
      </p>

      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="font-mono text-[9.5px] tracking-[0.12em] text-white/30 uppercase">
            Defeito
          </dt>
          <dd className="mt-1 text-[13px] leading-relaxed text-white/60">
            {o.defeito || "—"}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[9.5px] tracking-[0.12em] text-white/30 uppercase">
            Solução
          </dt>
          <dd className="mt-1 text-[13px] leading-relaxed whitespace-pre-wrap text-white/60">
            {o.observacoes || "—"}
          </dd>
        </div>
      </dl>
    </li>
  );
}
