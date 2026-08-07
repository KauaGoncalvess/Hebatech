import { criarClienteServidor } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Cópia de segurança.
 *
 * A loja roda no plano gratuito do Supabase, que não faz backup diário. Esta é
 * a única rede de proteção que existe, e ela depende de alguém clicar. Por isso
 * a tela é uma instrução, não um painel: diz o que fazer, com que frequência e
 * onde guardar.
 */
async function contar(tabela: string): Promise<number | null> {
  const supabase = await criarClienteServidor();
  if (!supabase) return null;
  const { count, error } = await supabase
    .from(tabela)
    .select("id", { count: "exact", head: true });
  return error ? null : (count ?? 0);
}

export default async function CopiaPage() {
  const [clientes, ordens, produtos, orcamentos] = await Promise.all([
    contar("clientes"),
    contar("ordens"),
    contar("produtos"),
    contar("orcamentos"),
  ]);

  const contagens = [
    { rotulo: "clientes", n: clientes },
    { rotulo: "ordens de serviço", n: ordens },
    { rotulo: "produtos", n: produtos },
    { rotulo: "pedidos de orçamento", n: orcamentos },
  ].filter((c) => c.n !== null);

  return (
    <>
      <section className="py-10 md:py-12">
        <p className="eyebrow text-accent">Segurança</p>
        <h1 className="display mt-3 text-title">Cópia de segurança</h1>
        <p className="mt-4 max-w-[58ch] text-[13.5px] leading-relaxed text-white/55">
          Baixa um arquivo com tudo que está no sistema neste momento: clientes,
          ordens de serviço, produtos e orçamentos. É a sua garantia de não
          perder nada.
        </p>
      </section>

      <div className="grid gap-3 lg:grid-cols-[1.15fr_1fr] lg:gap-4">
        <div className="spot card flex flex-col justify-between gap-8 p-6 md:p-8">
          <div>
            <p className="eyebrow text-white/35">Vai entrar no arquivo</p>
            <ul className="mt-5 grid gap-3">
              {contagens.map((c) => (
                <li key={c.rotulo} className="flex items-baseline gap-3">
                  <span className="display min-w-[2.5ch] text-[1.9rem] leading-none text-accent">
                    {c.n}
                  </span>
                  <span className="text-[13.5px] text-white/55">{c.rotulo}</span>
                </li>
              ))}
            </ul>
          </div>

          {/*
            <a download> e não botão com fetch: o navegador cuida do download
            sozinho, funciona no celular e não deixa a tela travada esperando.
          */}
          <a
            href="/admin/copia/baixar"
            download
            className="flex h-14 items-center justify-center rounded-full bg-accent px-8 font-mono text-[12px] tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
          >
            Baixar a cópia agora
          </a>
        </div>

        <div className="card p-6 md:p-8">
          <p className="eyebrow text-white/35">Como usar</p>

          <ol className="mt-5 grid gap-5">
            {[
              [
                "Uma vez por mês",
                "Todo primeiro dia útil do mês, entre aqui e baixe. Vale marcar no celular para não esquecer.",
              ],
              [
                "Guarde fora do computador da loja",
                "Mande para o seu Google Drive, ou para você mesmo no WhatsApp. Guardado só na máquina da loja, some junto com ela.",
              ],
              [
                "Guarde as últimas três",
                "Se um erro passar despercebido por umas semanas, a cópia do mês retrasado ainda salva.",
              ],
              [
                "Dá para abrir e ler",
                "É um arquivo que abre no navegador, com as tabelas montadas. Serve para consultar um cliente antigo mesmo com o sistema fora do ar.",
              ],
            ].map(([titulo, texto], i) => (
              <li key={titulo} className="flex gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-[11px] text-accent">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-[14px] font-medium">{titulo}</span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-white/50">
                    {texto}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-7 border-t border-line pt-6 text-[12.5px] leading-relaxed text-white/40">
            O arquivo tem nome e telefone de cliente. Trate como trata a agenda
            da loja: não repasse para quem não trabalha aqui.
          </p>
        </div>
      </div>
    </>
  );
}
