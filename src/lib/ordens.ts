import "server-only";

import { supabaseConfigurado } from "@/lib/supabase/config";
import { criarClienteServidor } from "@/lib/supabase/server";
import {
  paraOrdem,
  paraOrdemPublica,
  type LinhaOrdem,
  type Ordem,
  type OrdemPublica,
} from "@/types/ordem";

/**
 * Ordens de serviço.
 *
 * Nada aqui cai para carga inicial, ao contrário do catálogo: mostrar uma
 * ordem de mentira para quem está esperando o aparelho seria pior que mostrar
 * erro. Se o banco não responde, o painel avisa e a consulta pública diz que
 * não encontrou.
 */
async function cliente() {
  if (!supabaseConfigurado) {
    throw new Error(
      "Supabase não configurado. As ordens de serviço ficam guardadas no banco.",
    );
  }
  const supabase = await criarClienteServidor();
  if (!supabase) throw new Error("Supabase não configurado.");
  return supabase;
}

export async function listarOrdens(): Promise<Ordem[]> {
  const supabase = await cliente();

  const { data, error } = await supabase
    .from("ordens")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(400);

  if (error || !data) {
    throw new Error(
      `Não foi possível ler as ordens de serviço: ${error?.message ?? "resposta vazia"}`,
    );
  }

  return (data as LinhaOrdem[]).map(paraOrdem);
}

export async function buscarOrdemPorId(id: string): Promise<Ordem | null> {
  const supabase = await cliente();

  const { data, error } = await supabase
    .from("ordens")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Não foi possível ler a ordem: ${error.message}`);
  return data ? paraOrdem(data as LinhaOrdem) : null;
}

/**
 * Quantas ordens ainda estão em andamento. Alimenta um cartão da capa do
 * painel, então engole a falha e devolve null — instalação que ainda não rodou
 * o SQL novo não pode ficar sem capa por causa de um número.
 */
export async function contarOrdensAbertas(): Promise<number | null> {
  if (!supabaseConfigurado) return null;

  const supabase = await criarClienteServidor();
  if (!supabase) return null;

  const { count, error } = await supabase
    .from("ordens")
    .select("id", { count: "exact", head: true })
    .not("status", "in", '("entregue","cancelado")');

  if (error) {
    console.error("Falha ao contar ordens abertas:", error.message);
    return null;
  }

  return count ?? 0;
}

/**
 * Consulta pública de /acompanhar.
 *
 * A tabela `ordens` não tem leitura liberada para visitante — isto chama uma
 * função do banco que confere o código E os quatro últimos dígitos do telefone
 * antes de devolver qualquer coisa, e que devolve só os campos que a página
 * mostra: nunca o nome nem o telefone.
 *
 * Só o código seria segredo fraco demais. Exigir os dois evita que alguém chute
 * códigos em sequência e leia ordem alheia. Não há rate limit aqui: a proteção
 * real é o par código+telefone e o mínimo de dado exposto.
 */
export async function consultarOrdem(
  codigo: string,
  ultimos4: string,
): Promise<OrdemPublica | null> {
  if (!supabaseConfigurado) return null;

  const supabase = await criarClienteServidor();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("consultar_ordem", {
    p_codigo: codigo.trim(),
    p_ultimos4: ultimos4.trim(),
  });

  if (error) {
    console.error("Falha ao consultar ordem:", error.message);
    return null;
  }

  const linha = Array.isArray(data) ? data[0] : data;
  if (!linha) return null;

  return paraOrdemPublica(linha as Omit<LinhaOrdem, "id">);
}
