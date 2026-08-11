import Link from "next/link";
import { CabecalhoPainel } from "@/components/admin/cabecalho-painel";
import { CartaoNumero } from "@/components/admin/cartao-numero";
import { listarProdutos } from "@/lib/catalogo";
import { contarOrcamentosAbertos } from "@/lib/orcamentos";
import { contarClientesPorConferir } from "@/lib/clientes";
import { contarOrdensAbertas } from "@/lib/ordens";
import { resumoDoMes } from "@/lib/financeiro";
import { listarPlanos } from "@/lib/planos";
import { preco } from "@/lib/format";

export const dynamic = "force-dynamic";

/**
 * Capa do painel.
 *
 * Era oito cartões de navegação de ~300px de altura, um por destino — os
 * mesmos destinos que já estão na barra e na gaveta. No celular davam perto de
 * 2.400px de rolagem só para repetir o menu, e como todos acendiam com o mesmo
 * halo laranja, nada tinha prioridade sobre nada.
 *
 * Agora a tela responde uma pergunta só: o que precisa de mim hoje? Em cima, o
 * que pede ação; no meio, os números da loja; embaixo, uma fileira compacta de
 * começos — que existe porque abrir a gaveta no celular é um toque a mais, não
 * porque a capa precise repetir a navegação.
 */
export default async function AdminHome() {
  const [
    produtos,
    todosOsPlanos,
    orcamentosAbertos,
    ordensAbertas,
    porConferir,
    caixa,
  ] = await Promise.all([
    listarProdutos(),
    listarPlanos(),
    contarOrcamentosAbertos(),
    contarOrdensAbertas(),
    contarClientesPorConferir(),
    resumoDoMes(),
  ]);

  const planos = todosOsPlanos.filter((p) => p.ativo);
  const aVenda = produtos.filter((p) => p.disponivel);
  const semFoto = aVenda.filter((p) => p.fotos.length === 0);

  /**
   * Só entra o que pede ação hoje. Contagem em zero some da fileira em vez de
   * ocupar espaço avisando que não há nada — a ausência já é a informação, e é
   * o que faz a fileira valer um olhar quando tem alguma coisa nela.
   */
  const atencao = [
    ordensAbertas
      ? {
          rotulo: "Na bancada",
          valor: String(ordensAbertas),
          nota: "aparelhos em andamento",
          href: "/admin/ordens",
          tom: "acento" as const,
        }
      : null,
    porConferir
      ? {
          rotulo: "Pré-cadastros",
          valor: String(porConferir),
          nota: "esperando conferência",
          href: "/admin/clientes",
          tom: "acento" as const,
        }
      : null,
    orcamentosAbertos
      ? {
          rotulo: "Orçamentos",
          valor: String(orcamentosAbertos),
          nota: "esperando retorno",
          href: "/admin/orcamentos",
          tom: "acento" as const,
        }
      : null,
    caixa && caixa.aReceberVencido > 0
      ? {
          rotulo: "Vencido",
          valor: preco(caixa.aReceberVencido),
          nota: "a receber, já passou do prazo",
          href: "/admin/financeiro",
          tom: "alerta" as const,
        }
      : null,
    semFoto.length
      ? {
          rotulo: "Sem foto",
          valor: String(semFoto.length),
          nota: "usando o desenho técnico",
          href: "/admin/produtos",
          tom: "neutro" as const,
        }
      : null,
  ].filter((c) => c !== null);

  const numeros = [
    { rotulo: "À venda", valor: String(aVenda.length), tom: "neutro" as const },
    {
      rotulo: "Saldo do mês",
      valor: caixa ? preco(caixa.saldoDoMes) : "—",
      tom: (caixa && caixa.saldoDoMes < 0 ? "neutro" : "acento") as
        | "neutro"
        | "acento",
    },
    {
      rotulo: "Planos no ar",
      valor: String(planos.length),
      tom: "neutro" as const,
    },
  ];

  const atalhos = [
    { href: "/admin/ordens/nova", rotulo: "Abrir ordem", destaque: true },
    { href: "/admin/produtos/novo", rotulo: "Novo produto" },
    { href: "/admin/financeiro/novo", rotulo: "Lançar no caixa" },
    { href: "/admin/clientes/novo", rotulo: "Novo cliente" },
    { href: "/admin/copia", rotulo: "Cópia de segurança" },
    { href: "/admin/manual", rotulo: "Manual" },
  ];

  return (
    <>
      <CabecalhoPainel
        titulo="A loja hoje"
        nota="O que você salva aqui aparece no site na hora."
      />

      {atencao.length > 0 ? (
        <section>
          <h2 className="eyebrow mb-3 text-texto-3">Pede atenção</h2>
          <ul className="grid grid-cols-2 gap-2.5 md:gap-3 lg:grid-cols-4">
            {atencao.map((c) => (
              <li key={c.rotulo}>
                <Link
                  href={c.href}
                  className="block rounded-card transition-opacity hover:opacity-80"
                >
                  <CartaoNumero
                    rotulo={c.rotulo}
                    valor={c.valor}
                    nota={c.nota}
                    tom={c.tom}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="card px-6 py-8 text-center text-nota text-texto-3">
          Nada esperando por você agora — bancada vazia, cadastros conferidos e
          orçamentos respondidos.
        </p>
      )}

      <section className="mt-6">
        <h2 className="eyebrow mb-3 text-texto-3">A loja em números</h2>
        <ul className="grid grid-cols-3 gap-2.5 md:gap-3">
          {numeros.map((n) => (
            <li key={n.rotulo}>
              <CartaoNumero
                rotulo={n.rotulo}
                valor={n.valor}
                tom={n.tom}
                compacto
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="eyebrow mb-3 text-texto-3">Começar agora</h2>
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3">
          {atalhos.map((a) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className={`toque w-full rounded-2xl px-4 text-center font-mono text-rotulo tracking-[0.1em] uppercase transition-colors ${
                  a.destaque
                    ? "bg-accent font-bold text-black hover:bg-accent-hover"
                    : "bg-surface-2 text-texto-2 hover:bg-surface-3 hover:text-texto"
                }`}
              >
                {a.rotulo}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
