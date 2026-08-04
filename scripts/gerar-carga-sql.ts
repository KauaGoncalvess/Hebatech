/**
 * Gera `supabase/carga-inicial.sql` a partir do mesmo catálogo que o
 * `npm run seed` usa.
 *
 *   npm run carga-sql
 *
 * Existe para quem prefere colar no SQL Editor do Supabase em vez de rodar o
 * seed na máquina: o seed precisa do projeto clonado e da chave de serviço,
 * o arquivo SQL não precisa de nada além do navegador.
 *
 * Rode isto sempre que `src/data/seed.ts` ou `src/data/seed-planos.ts` mudarem.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { seedProdutos } from "../src/data/seed";
import { CHAVE_REGRAS, seedPlanos, seedRegras } from "../src/data/seed-planos";
import { paraLinhaPlano } from "../src/lib/plano-mapper";
import { paraLinha } from "../src/lib/produto-mapper";

function literal(s: string): string {
  return `'${s.replace(/'/g, "''")}'`;
}

function valor(v: unknown): string {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "object") return `${literal(JSON.stringify(v))}::jsonb`;
  return literal(String(v));
}

/** Upsert por uma coluna única, para o arquivo poder ser colado mais de uma vez. */
function insert(
  tabela: string,
  linhas: Record<string, unknown>[],
  conflito: string,
): string {
  const colunas = Object.keys(linhas[0]);
  return [
    `insert into public.${tabela} (${colunas.join(", ")})`,
    "values",
    linhas.map((l) => `  (${colunas.map((c) => valor(l[c])).join(", ")})`).join(",\n"),
    `on conflict (${conflito}) do update set`,
    colunas
      .filter((c) => c !== conflito)
      .map((c) => `    ${c} = excluded.${c}`)
      .join(",\n"),
    ";",
  ].join("\n");
}

// A coluna `fotos` fica de fora de propósito: foto enviada pelo painel não pode
// ser sobrescrita por uma nova colagem deste arquivo.
const produtos = seedProdutos.map(({ id: _i, ...p }) => {
  const { fotos: _f, ...linha } = paraLinha(p);
  return linha;
});
const planos = seedPlanos.map(({ id: _i, ...p }) => paraLinhaPlano(p));

const sql = `-- ============================================================================
-- HebaTech — carga inicial do catálogo
--
-- Gerado por \`npm run carga-sql\`. Não edite à mão.
--
-- Como usar: Supabase → SQL Editor → cole este arquivo inteiro → Run.
-- Rode DEPOIS do supabase/schema.sql.
--
-- Pode colar de novo sem duplicar nada: produto com o mesmo código é
-- atualizado. Mas atenção — colar de novo devolve preço, texto e
-- disponibilidade ao valor de fábrica. Depois que a loja começar a editar pelo
-- painel, não cole mais. Foto enviada pelo painel é sempre preservada.
-- ============================================================================

-- ── ${produtos.length} produtos ──
${insert("produtos", produtos, "codigo")}

-- ── ${planos.length} planos de manutenção mensal ──
${insert("planos_manutencao", planos, "codigo")}

-- ── Regras do contrato de manutenção ──
-- Só entra se ainda não existir, para não apagar o que foi editado no painel.
insert into public.configuracoes (chave, valor)
values (${literal(CHAVE_REGRAS)}, ${valor(seedRegras)})
on conflict (chave) do nothing;
`;

writeFileSync(resolve(process.cwd(), "supabase/carga-inicial.sql"), sql);

/**
 * O par do arquivo acima: tira do banco exatamente o que ele põe.
 *
 * A carga inicial é catálogo de demonstração — modelo, preço e estado foram
 * escritos para o site ter o que mostrar antes de existir estoque. Na hora em
 * que a loja cadastra os aparelhos de verdade, isso precisa sair inteiro, senão
 * um cliente pergunta por um notebook que nunca existiu.
 *
 * Apaga pelos códigos exatos, um a um: assim nada que o lojista cadastrou é
 * levado junto, mesmo que ele tenha usado o prefixo HT- também.
 */
const limpeza = `-- ============================================================================
-- HebaTech — remover o catálogo de demonstração
--
-- Gerado por \`npm run carga-sql\`. Não edite à mão.
--
-- Use quando o estoque de verdade estiver cadastrado. Apaga só os ${produtos.length}
-- produtos e os ${planos.length} planos que vieram da carga inicial, pelos códigos exatos —
-- nada que você cadastrou é tocado, nem que use o mesmo prefixo.
--
-- Não dá para desfazer. Se quiser os exemplos de volta, é só colar de novo o
-- supabase/carga-inicial.sql.
-- ============================================================================

delete from public.produtos
 where codigo in (
${produtos.map((p) => `   ${literal(String(p.codigo))}`).join(",\n")}
 );

delete from public.planos_manutencao
 where codigo in (
${planos.map((p) => `   ${literal(String(p.codigo))}`).join(",\n")}
 );

-- As regras do contrato ficam: são texto da casa, não produto de exemplo.
-- Para apagá-las também, tire o comentário da linha abaixo.
-- delete from public.configuracoes where chave = ${literal(CHAVE_REGRAS)};
`;

writeFileSync(resolve(process.cwd(), "supabase/limpar-demonstracao.sql"), limpeza);

console.log(
  `carga-inicial.sql: ${produtos.length} produtos, ${planos.length} planos, ${seedRegras.length} regras.\n` +
    `limpar-demonstracao.sql: remove os mesmos ${produtos.length} produtos e ${planos.length} planos.`,
);
