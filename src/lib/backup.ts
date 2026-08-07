import "server-only";

import { criarClienteServidor } from "@/lib/supabase/server";

/**
 * Cópia de segurança do banco.
 *
 * O plano gratuito do Supabase não faz backup diário — isso é do plano pago.
 * Numa loja que não tem quem cuide do sistema, isso significa que um acidente
 * no banco leva junto o histórico de ordens e a ficha de todo mundo, sem volta.
 *
 * A saída é um arquivo HTML único que serve para as duas pessoas que podem
 * precisar dele:
 *
 * - o dono da loja abre no navegador e enxerga clientes, ordens e produtos em
 *   tabela, sem depender do sistema estar de pé;
 * - quem for restaurar acha o JSON cru dentro do próprio arquivo, num bloco
 *   `<script type="application/json">`, com as linhas exatamente como saíram
 *   do banco.
 *
 * Por isso as linhas não passam por mapper nenhum: `select *` puro, para o
 * arquivo continuar servindo mesmo que os tipos do site mudem depois.
 */

/** Ordem de restauração: pai antes de filho, por causa das chaves estrangeiras. */
const TABELAS = [
  { nome: "configuracoes", rotulo: "Configurações", mostrar: false },
  { nome: "contadores", rotulo: "Numeração das ordens", mostrar: false },
  { nome: "produtos", rotulo: "Produtos", mostrar: true },
  { nome: "planos_manutencao", rotulo: "Planos de manutenção", mostrar: true },
  { nome: "clientes", rotulo: "Clientes", mostrar: true },
  { nome: "ordens", rotulo: "Ordens de serviço", mostrar: true },
  { nome: "orcamentos", rotulo: "Pedidos de orçamento", mostrar: true },
  { nome: "lancamentos", rotulo: "Caixa", mostrar: true },
] as const;

type Linha = Record<string, unknown>;

export type Copia = {
  geradoEm: string;
  versao: number;
  tabelas: { nome: string; rotulo: string; mostrar: boolean; linhas: Linha[] }[];
};

export async function montarCopia(): Promise<Copia> {
  const supabase = await criarClienteServidor();
  if (!supabase) {
    throw new Error("Supabase não configurado — não há o que copiar.");
  }

  const tabelas = await Promise.all(
    TABELAS.map(async (t) => {
      const { data, error } = await supabase.from(t.nome).select("*");
      if (error) {
        // Uma tabela que falha invalida a cópia inteira. Backup pela metade é
        // pior que nenhum: dá a sensação de estar salvo sem estar.
        throw new Error(`Não foi possível copiar "${t.rotulo}": ${error.message}`);
      }
      return { ...t, linhas: (data ?? []) as Linha[] };
    }),
  );

  return { geradoEm: new Date().toISOString(), versao: 1, tabelas };
}

/* ── Montagem do arquivo ────────────────────────────────────────────────── */

function escapar(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const dataHora = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

const soData = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeZone: "America/Sao_Paulo",
});

/** Uma célula da tabela legível. Data vira data, valor vira valor, nulo some. */
function celula(chave: string, valor: unknown): string {
  if (valor === null || valor === undefined || valor === "") return "—";

  if (typeof valor === "boolean") return valor ? "sim" : "não";

  if (typeof valor === "number") {
    if (chave === "preco" || chave.startsWith("valor")) {
      return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
    return String(valor);
  }

  if (typeof valor === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(valor)) return dataHora.format(new Date(valor));
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return soData.format(new Date(`${valor}T12:00:00`));
    return valor;
  }

  if (Array.isArray(valor)) return valor.length ? valor.join(", ") : "—";

  return JSON.stringify(valor);
}

/**
 * Colunas que só interessam a quem for restaurar. Ficam no JSON, mas poluem a
 * tabela que o dono da loja lê.
 */
const OCULTAS = new Set(["id", "cliente_id", "produto_id", "telefone_digitos", "ordem"]);

function tabelaHtml(rotulo: string, linhas: Linha[]): string {
  if (!linhas.length) {
    return `<section><h2>${escapar(rotulo)}</h2><p class="vazio">Nada registrado.</p></section>`;
  }

  const colunas = Object.keys(linhas[0]).filter((c) => !OCULTAS.has(c));
  const cabecalho = colunas
    .map((c) => `<th>${escapar(c.replace(/_/g, " "))}</th>`)
    .join("");
  const corpo = linhas
    .map(
      (l) =>
        `<tr>${colunas.map((c) => `<td>${escapar(celula(c, l[c]))}</td>`).join("")}</tr>`,
    )
    .join("");

  return `<section>
  <h2>${escapar(rotulo)} <span class="contagem">${linhas.length}</span></h2>
  <div class="rolagem"><table><thead><tr>${cabecalho}</tr></thead><tbody>${corpo}</tbody></table></div>
</section>`;
}

export function copiaComoHtml(copia: Copia): string {
  const quando = dataHora.format(new Date(copia.geradoEm));
  const visiveis = copia.tabelas.filter((t) => t.mostrar);
  const resumo = visiveis
    .map((t) => `<li><strong>${t.linhas.length}</strong> ${escapar(t.rotulo.toLowerCase())}</li>`)
    .join("");

  // O JSON vai num <script type="application/json">: o navegador não executa,
  // e quem for restaurar abre o arquivo num editor e copia o bloco inteiro.
  // `</script>` dentro de um texto qualquer fecharia a tag antes da hora.
  const json = JSON.stringify(copia).replace(/<\/script/gi, "<\\/script");

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>HebaTech — cópia de segurança de ${escapar(quando)}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 32px 20px 80px; background: #fafaf9; color: #1a1a1a;
    font: 15px/1.6 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  main { max-width: 1200px; margin: 0 auto; }
  h1 { font-size: 26px; margin: 0 0 6px; letter-spacing: -0.02em; }
  .quando { margin: 0 0 28px; color: #6b6b6b; font-size: 14px; }
  .aviso {
    background: #fff4ea; border: 1px solid #f0c9a3; border-radius: 10px;
    padding: 16px 18px; margin-bottom: 32px; font-size: 14px;
  }
  .aviso strong { color: #b4500d; }
  .resumo { display: flex; flex-wrap: wrap; gap: 10px; list-style: none; padding: 0; margin: 0 0 36px; }
  .resumo li { background: #fff; border: 1px solid #e4e4e2; border-radius: 8px; padding: 8px 14px; font-size: 13px; }
  .resumo strong { font-size: 17px; }
  section { margin-bottom: 40px; }
  h2 { font-size: 17px; margin: 0 0 12px; display: flex; align-items: center; gap: 10px; }
  .contagem {
    background: #1a1a1a; color: #fff; border-radius: 999px;
    padding: 2px 9px; font-size: 12px; font-weight: 500;
  }
  .rolagem { overflow-x: auto; border: 1px solid #e4e4e2; border-radius: 10px; background: #fff; }
  table { border-collapse: collapse; width: 100%; font-size: 13px; }
  th, td { padding: 9px 13px; text-align: left; border-bottom: 1px solid #efefed; vertical-align: top; }
  th { background: #f4f4f2; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; white-space: nowrap; }
  tbody tr:last-child td { border-bottom: 0; }
  td { max-width: 380px; }
  .vazio { color: #8a8a8a; font-size: 14px; }
  @media print { body { background: #fff; padding: 0; } .rolagem { overflow: visible; } }
</style>
</head>
<body>
<main>
  <h1>HebaTech — cópia de segurança</h1>
  <p class="quando">Gerada em ${escapar(quando)}</p>

  <div class="aviso">
    <strong>Guarde este arquivo.</strong> Ele tem tudo o que estava no sistema neste
    momento. Se um dia o banco de dados se perder, é por ele que dá para
    recuperar — os dados originais estão dentro do próprio arquivo, no formato
    que um técnico consegue reimportar. Salve no Google Drive ou no WhatsApp
    para você mesmo, e faça uma cópia nova todo mês.
  </div>

  <ul class="resumo">${resumo}</ul>

  ${visiveis.map((t) => tabelaHtml(t.rotulo, t.linhas)).join("\n  ")}
</main>

<!-- Dados originais para restauração. Não apague este bloco. -->
<script type="application/json" id="dados-hebatech">${json}</script>
</body>
</html>`;
}

/** Nome do arquivo: ordenável por data quando ele tiver doze deles na pasta. */
export function nomeDoArquivo(geradoEm: string): string {
  const d = new Date(geradoEm);
  const p = (n: number) => String(n).padStart(2, "0");
  return `hebatech-copia-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.html`;
}
