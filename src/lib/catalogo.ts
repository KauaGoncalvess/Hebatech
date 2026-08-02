import "server-only";

import { seedProdutos } from "@/data/seed";
import { paraProduto, type LinhaProduto } from "@/lib/produto-mapper";
import { criarClienteServidor } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import type { CategoriaId, Produto } from "@/types/produto";

/**
 * Fonte única do catálogo para as páginas públicas.
 *
 * Com Supabase configurado, lê do banco. Sem ele, cai no arquivo de carga
 * inicial — o site continua de pé e o build passa sem variável de ambiente.
 */
async function carregarTodos(): Promise<Produto[]> {
  if (!supabaseConfigurado) return seedProdutos;

  const supabase = await criarClienteServidor();
  if (!supabase) return seedProdutos;

  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .order("ordem", { ascending: true })
    .order("preco", { ascending: true });

  if (error || !data) {
    // Banco fora do ar não pode derrubar a loja: mostra a carga inicial.
    console.error("Falha ao ler produtos do Supabase:", error?.message);
    return seedProdutos;
  }

  return (data as LinhaProduto[]).map(paraProduto);
}

export async function listarProdutos(): Promise<Produto[]> {
  return carregarTodos();
}

export async function listarDisponiveis(categoria?: CategoriaId): Promise<Produto[]> {
  const todos = await carregarTodos();
  const ativos = todos.filter((p) => p.disponivel);
  return categoria ? ativos.filter((p) => p.categoria === categoria) : ativos;
}

export async function listarNotebooks(): Promise<Produto[]> {
  return listarDisponiveis("notebook");
}

/** Tudo que não é notebook — alimenta a página de produtos gerais. */
export async function listarOutrosProdutos(): Promise<Produto[]> {
  const ativos = await listarDisponiveis();
  return ativos.filter((p) => p.categoria !== "notebook");
}

export async function listarDestaques(limite = 4): Promise<Produto[]> {
  const ativos = await listarDisponiveis();
  const destacados = ativos.filter((p) => p.destaque);
  const lista = destacados.length ? destacados : ativos;
  return lista.slice(0, limite);
}

export async function buscarPorId(id: string): Promise<Produto | null> {
  const todos = await carregarTodos();
  return todos.find((p) => p.id === id) ?? null;
}

export async function buscarPorSlug(slug: string): Promise<Produto | null> {
  const todos = await carregarTodos();
  return todos.find((p) => p.slug === slug) ?? null;
}

/** Aparelhos de preço próximo, para a seção de sugestão. */
export async function listarRelacionados(base: Produto, limite = 3): Promise<Produto[]> {
  const ativos = await listarDisponiveis();
  return ativos
    .filter((p) => p.id !== base.id && p.categoria === base.categoria)
    .sort((a, b) => Math.abs(a.preco - base.preco) - Math.abs(b.preco - base.preco))
    .slice(0, limite);
}
