import "server-only";

import { CHAVE_REGRAS, seedPlanos, seedRegras } from "@/data/seed-planos";
import { paraPlano, type LinhaPlano } from "@/lib/plano-mapper";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { Plano, RegraManutencao } from "@/types/plano";

/**
 * Planos de manutenção mensal. Mesma regra do catálogo: sem Supabase, ou com o
 * banco fora do ar, o site cai para a carga inicial em vez de quebrar.
 */
async function carregarTodos(): Promise<Plano[]> {
  if (!supabaseConfigurado) return seedPlanos;

  const supabase = await criarClienteServidor();
  if (!supabase) return seedPlanos;

  const { data, error } = await supabase
    .from("planos_manutencao")
    .select("*")
    .order("ordem", { ascending: true });

  if (error || !data) {
    console.error("Falha ao ler planos do Supabase:", error?.message);
    return seedPlanos;
  }

  return (data as LinhaPlano[]).map(paraPlano);
}

export async function listarPlanos(): Promise<Plano[]> {
  return carregarTodos();
}

export async function listarPlanosAtivos(): Promise<Plano[]> {
  return (await carregarTodos()).filter((p) => p.ativo);
}

export async function buscarPlanoPorId(id: string): Promise<Plano | null> {
  return (await carregarTodos()).find((p) => p.id === id) ?? null;
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

export async function listarRegras(): Promise<RegraManutencao[]> {
  if (!supabaseConfigurado) return seedRegras;

  const supabase = await criarClienteServidor();
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
}
