import "server-only";

import { cache } from "react";
import { seedProdutos } from "@/data/seed";
import { paraProduto, type LinhaProduto } from "@/lib/produto-mapper";
import { criarClienteServidor } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import type { CategoriaId, Produto } from "@/types/produto";

/**
 * Fonte única do catálogo.
 *
 * `cache` memoiza por requisição: a home chama destaques e notebooks, a página
 * de produto chama a busca e os relacionados — tudo isso vira uma leitura só.
 *
 * Devolve `null` quando não há banco ou a consulta falhou. Quem chama decide o
 * que fazer com isso: o site cai para a carga inicial, o painel dá erro.
 */
const lerDoBanco = cache(async (): Promise<Produto[] | null> => {
  if (!supabaseConfigurado) return null;

  const supabase = await criarClienteServidor();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .order("ordem", { ascending: true })
    .order("preco", { ascending: true });

  if (error || !data) {
    console.error("Falha ao ler produtos do Supabase:", error?.message);
    return null;
  }

  return (data as LinhaProduto[]).map(paraProduto);
});

/** Site público: banco fora do ar não pode derrubar a loja. */
async function carregarTodos(): Promise<Produto[]> {
  return (await lerDoBanco()) ?? seedProdutos;
}

/**
 * Painel: precisa dos dados reais. Mostrar a carga inicial aqui seria pior que
 * mostrar erro — o lojista editaria um item de arquivo, cujo id não é um UUID,
 * e o salvar quebraria com erro de banco sem explicação.
 */
async function carregarTodosEstrito(): Promise<Produto[]> {
  const lista = await lerDoBanco();
  if (!lista) {
    throw new Error(
      "Não foi possível ler o catálogo no Supabase. Confira a conexão antes de editar.",
    );
  }
  return lista;
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

/* ── Só o painel usa daqui para baixo: leitura estrita ── */

export async function listarProdutos(): Promise<Produto[]> {
  return carregarTodosEstrito();
}

export async function buscarPorId(id: string): Promise<Produto | null> {
  const todos = await carregarTodosEstrito();
  return todos.find((p) => p.id === id) ?? null;
}
