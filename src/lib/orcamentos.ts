import "server-only";

import { supabaseConfigurado } from "@/lib/supabase/config";
import { criarClienteServidor } from "@/lib/supabase/server";
import {
  paraPedido,
  type LinhaOrcamento,
  type NovoOrcamento,
  type PedidoOrcamento,
} from "@/types/orcamento";

/**
 * Pedidos de orçamento do site.
 *
 * Aqui não existe queda para carga inicial, como acontece no catálogo: pedido
 * de cliente inventado seria pior que tela de erro. Se o banco não responde, o
 * painel avisa.
 */
export async function listarOrcamentos(): Promise<PedidoOrcamento[]> {
  if (!supabaseConfigurado) {
    throw new Error(
      "Supabase não configurado. Os pedidos de orçamento ficam guardados no banco.",
    );
  }

  const supabase = await criarClienteServidor();
  if (!supabase) {
    throw new Error("Supabase não configurado.");
  }

  const { data, error } = await supabase
    .from("orcamentos")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(300);

  if (error || !data) {
    throw new Error(
      `Não foi possível ler os pedidos de orçamento: ${error?.message ?? "resposta vazia"}`,
    );
  }

  return (data as LinhaOrcamento[]).map(paraPedido);
}

/**
 * Quantos pedidos ainda esperam retorno. Ao contrário da listagem, engole a
 * falha e devolve null: isso aqui alimenta um cartão da capa do painel, e uma
 * instalação que ainda não rodou o SQL novo não pode ficar sem capa por causa
 * de um número.
 */
export async function contarOrcamentosAbertos(): Promise<number | null> {
  if (!supabaseConfigurado) return null;

  const supabase = await criarClienteServidor();
  if (!supabase) return null;

  const { count, error } = await supabase
    .from("orcamentos")
    .select("id", { count: "exact", head: true })
    .eq("atendido", false);

  if (error) {
    console.error("Falha ao contar pedidos de orçamento:", error.message);
    return null;
  }

  return count ?? 0;
}

/** Corta o que passar do limite da coluna e tira quebra de linha do que é linha única. */
function limpar(valor: string, limite: number): string {
  return valor.replace(/\s+/g, " ").trim().slice(0, limite);
}

/**
 * Grava o pedido. Devolve `false` em qualquer falha em vez de estourar: quem
 * chama é o formulário do site, e nada aqui pode impedir a pessoa de abrir a
 * conversa no WhatsApp.
 */
export async function gravarOrcamento(pedido: NovoOrcamento): Promise<boolean> {
  if (!supabaseConfigurado) return false;

  const supabase = await criarClienteServidor();
  if (!supabase) return false;

  const nome = limpar(pedido.nome, 120);
  const telefone = limpar(pedido.telefone, 40);
  if (!nome || !telefone) return false;

  const { error } = await supabase.from("orcamentos").insert({
    nome,
    telefone,
    tipo: limpar(pedido.tipo, 40),
    marca: limpar(pedido.marca, 60),
    modelo: limpar(pedido.modelo, 80),
    defeito: limpar(pedido.defeito, 120),
    descricao: pedido.descricao.trim().slice(0, 1200),
  });

  if (error) {
    console.error("Falha ao gravar pedido de orçamento:", error.message);
    return false;
  }

  return true;
}
