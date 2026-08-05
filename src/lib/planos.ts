import "server-only";

import { cache } from "react";
// `seedRegras` continua servindo de queda: as regras do contrato são texto da
// própria casa (sem fidelidade, peça à parte, nota fiscal), não preço nem
// estoque inventado. Mostrá-las com o banco fora do ar não engana ninguém.
import { CHAVE_REGRAS, seedRegras } from "@/data/seed-planos";
import { paraPlano, type LinhaPlano } from "@/lib/plano-mapper";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { criarClientePublico } from "@/lib/supabase/publico";
import type { Plano, RegraManutencao } from "@/types/plano";

/**
 * Planos de manutenção mensal. Mesma divisão do catálogo: o site cai para a
 * carga inicial, o painel exige o banco de verdade.
 */
const lerDoBanco = cache(async (): Promise<Plano[] | null> => {
  if (!supabaseConfigurado) return null;

  const supabase = criarClientePublico();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("planos_manutencao")
    .select("*")
    .order("ordem", { ascending: true });

  if (error || !data) {
    console.error("Falha ao ler planos do Supabase:", error?.message);
    return null;
  }

  return (data as LinhaPlano[]).map(paraPlano);
});

async function carregarTodosEstrito(): Promise<Plano[]> {
  const lista = await lerDoBanco();
  if (!lista) {
    throw new Error(
      "Não foi possível ler os planos no Supabase. Confira a conexão antes de editar.",
    );
  }
  return lista;
}

/**
 * Sem queda para a carga inicial, pela mesma razão do catálogo: os valores de
 * exemplo são inventados, e anunciar mensalidade que a loja não pratica é pior
 * que não anunciar. A página de manutenção já esconde a seção inteira quando
 * não há plano publicado.
 */
export async function listarPlanosAtivos(): Promise<Plano[]> {
  const lista = (await lerDoBanco()) ?? [];
  return lista.filter((p) => p.ativo);
}

function comoRegras(valor: unknown): RegraManutencao[] {
  if (!Array.isArray(valor)) return [];
  return valor.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const { titulo, texto } = item as { titulo?: unknown; texto?: unknown };
    if (typeof titulo !== "string" || typeof texto !== "string") return [];
    return [{ titulo, texto }];
  });
}

export const listarRegras = cache(async (): Promise<RegraManutencao[]> => {
  if (!supabaseConfigurado) return seedRegras;

  const supabase = criarClientePublico();
  if (!supabase) return seedRegras;

  const { data, error } = await supabase
    .from("configuracoes")
    .select("valor")
    .eq("chave", CHAVE_REGRAS)
    .maybeSingle();

  if (error) {
    console.error("Falha ao ler as regras de manutenção:", error.message);
    return seedRegras;
  }

  const regras = comoRegras(data?.valor);
  return regras.length ? regras : seedRegras;
});

/* ── Só o painel usa daqui para baixo: leitura estrita ── */

export async function listarPlanos(): Promise<Plano[]> {
  return carregarTodosEstrito();
}

export async function buscarPlanoPorId(id: string): Promise<Plano | null> {
  const todos = await carregarTodosEstrito();
  return todos.find((p) => p.id === id) ?? null;
}
