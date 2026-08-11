import { LinhaOrcamento } from "@/components/admin/linha-orcamento";
import { listarOrcamentos } from "@/lib/orcamentos";
import { waRetorno } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function ListaOrcamentos() {
  const pedidos = await listarOrcamentos();

  const abertos = pedidos.filter((p) => !p.atendido);
  const fechados = pedidos.filter((p) => p.atendido);

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-4 py-7 md:py-9">
        <div>
          <h1 className="display text-[clamp(1.9rem,6vw,2.8rem)] leading-none">Pedidos de orçamento</h1>
          <p className="mt-4 max-w-[52ch] text-nota leading-relaxed text-texto-3">
            Tudo que foi preenchido no formulário do site, inclusive de quem não chegou a
            mandar a mensagem no WhatsApp. Esses são os que mais valem uma ligação.
          </p>
        </div>
      </section>

      {pedidos.length === 0 ? (
        <div className="card px-6 py-20 text-center">
          <p className="display text-sub">Nenhum pedido ainda</p>
          <p className="mx-auto mt-4 max-w-[46ch] text-nota text-texto-3">
            Assim que alguém preencher o formulário da página de assistência, o pedido
            aparece aqui.
          </p>
        </div>
      ) : (
        <>
          <p className="eyebrow mb-4 text-texto-3">A retornar · {abertos.length}</p>
          {abertos.length === 0 ? (
            <p className="card px-6 py-10 text-center text-nota text-texto-3">
              Nenhum pedido em aberto. Tudo respondido.
            </p>
          ) : (
            <ul className="grid gap-3">
              {abertos.map((p) => (
                <LinhaOrcamento key={p.id} p={p} retorno={waRetorno(p)} />
              ))}
            </ul>
          )}

          {fechados.length > 0 && (
            <>
              <p className="eyebrow mt-10 mb-4 text-texto-3">
                Já atendidos · {fechados.length}
              </p>
              <ul className="grid gap-3">
                {fechados.map((p) => (
                  <LinhaOrcamento key={p.id} p={p} retorno={waRetorno(p)} />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </>
  );
}
