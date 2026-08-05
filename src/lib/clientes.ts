import "server-only";

import { supabaseConfigurado } from "@/lib/supabase/config";
import { criarClientePublico } from "@/lib/supabase/publico";
import { criarClienteServidor } from "@/lib/supabase/server";
import {
  digitosDoTelefone,
  paraCliente,
  type Cliente,
  type LinhaCliente,
  type NovoCliente,
} from "@/types/cliente";

/**
 * Fichas de cliente.
 *
 * Leitura sempre estrita, como em ordens: cliente de mentira no painel seria
 * pior que tela de erro. Só a gravação do pré-cadastro público é tolerante,
 * porque ela roda para quem está do lado de fora.
 */
async function cliente() {
  if (!supabaseConfigurado) {
    throw new Error("Supabase não configurado. As fichas ficam guardadas no banco.");
  }
  const supabase = await criarClienteServidor();
  if (!supabase) throw new Error("Supabase não configurado.");
  return supabase;
}

export async function listarClientes(): Promise<Cliente[]> {
  const supabase = await cliente();

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(500);

  if (error || !data) {
    throw new Error(
      `Não foi possível ler os clientes: ${error?.message ?? "resposta vazia"}`,
    );
  }

  return (data as LinhaCliente[]).map(paraCliente);
}

export async function buscarClientePorId(id: string): Promise<Cliente | null> {
  const supabase = await cliente();

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Não foi possível ler a ficha: ${error.message}`);
  return data ? paraCliente(data as LinhaCliente) : null;
}

/** O telefone é a chave de verdade da ficha — é por ele que o balcão procura. */
export async function buscarClientePorTelefone(
  telefone: string,
): Promise<Cliente | null> {
  const digitos = digitosDoTelefone(telefone);
  if (digitos.length < 10) return null;

  const supabase = await cliente();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("telefone_digitos", digitos)
    .maybeSingle();

  if (error) throw new Error(`Não foi possível procurar a ficha: ${error.message}`);
  return data ? paraCliente(data as LinhaCliente) : null;
}

/**
 * Quantos pré-cadastros do site ainda esperam conferência. Engole a falha e
 * devolve null: alimenta um cartão da capa do painel, que não pode sumir numa
 * instalação que ainda não rodou o SQL novo.
 */
export async function contarClientesPorConferir(): Promise<number | null> {
  if (!supabaseConfigurado) return null;

  const supabase = await criarClienteServidor();
  if (!supabase) return null;

  const { count, error } = await supabase
    .from("clientes")
    .select("id", { count: "exact", head: true })
    .eq("confirmado", false);

  if (error) {
    console.error("Falha ao contar pré-cadastros:", error.message);
    return null;
  }

  return count ?? 0;
}

export type ResultadoPreCadastro = "gravado" | "ja-existe" | "falhou";

/**
 * Pré-cadastro feito no site, sem login.
 *
 * Devolve `ja-existe` quando o telefone já tem ficha — o índice único no banco
 * é quem decide isso, então não há corrida entre conferir e gravar. Para quem
 * está do outro lado da tela, "já temos seu cadastro" é uma boa notícia, não
 * um erro.
 */
export async function gravarPreCadastro(
  novo: NovoCliente,
): Promise<ResultadoPreCadastro> {
  if (!supabaseConfigurado) return "falhou";

  // Sem cookie: quem preenche o formulário não tem sessão, e a RLS já libera
  // o insert para visitante anônimo.
  const supabase = criarClientePublico();
  if (!supabase) return "falhou";

  const nome = novo.nome.replace(/\s+/g, " ").trim().slice(0, 120);
  const telefone = novo.telefone.trim().slice(0, 40);
  if (!nome || digitosDoTelefone(telefone).length < 10) return "falhou";

  const { error } = await supabase.from("clientes").insert({
    nome,
    telefone,
    email: novo.email.trim().slice(0, 160),
    documento: novo.documento.trim().slice(0, 32),
    endereco: novo.endereco.replace(/\s+/g, " ").trim().slice(0, 240),
    observacoes: novo.observacoes.trim().slice(0, 600),
    origem: "site",
    confirmado: false,
  });

  if (error) {
    if (error.message.includes("clientes_telefone_idx")) return "ja-existe";
    console.error("Falha ao gravar pré-cadastro:", error.message);
    return "falhou";
  }

  return "gravado";
}
