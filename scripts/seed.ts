/**
 * Sobe o catálogo inicial para o Supabase.
 *
 *   npm run seed
 *
 * Precisa de NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no
 * .env.local. Usa a chave de serviço porque roda fora do navegador, sem login.
 *
 * É seguro rodar de novo: produto com o mesmo `codigo` é atualizado, não
 * duplicado. Fotos já enviadas pelo painel são preservadas.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { seedProdutos } from "../src/data/seed";
import { paraLinha } from "../src/lib/produto-mapper";

function carregarEnv(arquivo: string) {
  let conteudo: string;
  try {
    conteudo = readFileSync(resolve(process.cwd(), arquivo), "utf8");
  } catch {
    return;
  }
  for (const linha of conteudo.split("\n")) {
    const limpa = linha.trim();
    if (!limpa || limpa.startsWith("#")) continue;
    const igual = limpa.indexOf("=");
    if (igual < 0) continue;
    const chave = limpa.slice(0, igual).trim();
    const valor = limpa.slice(igual + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[chave]) process.env[chave] = valor;
  }
}

carregarEnv(".env.local");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const chaveServico = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !chaveServico) {
  console.error(
    "Faltam variáveis. Coloque no .env.local:\n" +
      "  NEXT_PUBLIC_SUPABASE_URL=...\n" +
      "  SUPABASE_SERVICE_ROLE_KEY=...   (Supabase → Settings → API → service_role)",
  );
  process.exit(1);
}

const supabase = createClient(url, chaveServico, {
  auth: { persistSession: false },
});

async function main() {
  const { data: existentes, error: erroLeitura } = await supabase
    .from("produtos")
    .select("codigo, fotos");

  if (erroLeitura) {
    console.error("Não consegui ler a tabela `produtos`:", erroLeitura.message);
    console.error("Rode antes o supabase/schema.sql no SQL Editor.");
    process.exit(1);
  }

  const fotosSalvas = new Map<string, unknown>(
    (existentes ?? []).map((p) => [p.codigo as string, p.fotos]),
  );

  const linhas = seedProdutos.map((p) => {
    const { id: _ignorado, ...semId } = p;
    const linha = paraLinha(semId);
    // Nunca sobrescreve foto que já foi enviada pelo painel.
    const jaTem = fotosSalvas.get(p.codigo);
    if (Array.isArray(jaTem) && jaTem.length > 0) linha.fotos = jaTem;
    return linha;
  });

  const { error, count } = await supabase
    .from("produtos")
    .upsert(linhas, { onConflict: "codigo", count: "exact" });

  if (error) {
    console.error("Falha ao gravar:", error.message);
    process.exit(1);
  }

  console.log(`${count ?? linhas.length} produtos gravados no Supabase.`);
  console.log("Painel: /admin");
}

main();
