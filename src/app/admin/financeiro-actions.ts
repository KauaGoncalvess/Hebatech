"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { hojeNaLoja, TIPOS_LANCAMENTO, type TipoLancamento } from "@/types/lancamento";

export type Resultado = { erro?: string };

function texto(dados: FormData, campo: string): string {
  const v = dados.get(campo);
  return typeof v === "string" ? v.trim() : "";
}

/** Valor em reais inteiros. Aceita "1.250,00", "1250" e "1250,50". */
function reais(dados: FormData, campo: string): number | null {
  const bruto = texto(dados, campo);
  if (!bruto) return null;
  const limpo = bruto.replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}\b)/g, "").replace(",", ".");
  const n = Number(limpo);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function limpar() {
  revalidatePath("/admin/financeiro");
  revalidatePath("/admin");
}

export async function salvarLancamento(
  _anterior: Resultado,
  dados: FormData,
): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  const tipoBruto = texto(dados, "tipo");
  const tipo: TipoLancamento = TIPOS_LANCAMENTO.includes(tipoBruto as TipoLancamento)
    ? (tipoBruto as TipoLancamento)
    : "entrada";

  const valor = reais(dados, "valor");
  if (valor === null || valor <= 0) return { erro: "Informe um valor maior que zero." };

  const descricao = texto(dados, "descricao");
  if (!descricao) return { erro: "Escreva do que se trata." };

  const venceEm = texto(dados, "venceEm");
  // Marcado como já pago, a data do pagamento é hoje; senão fica em aberto e
  // vira conta a receber ou a pagar.
  const jaPago = texto(dados, "jaPago") === "on";

  const linha = {
    tipo,
    valor,
    descricao: descricao.slice(0, 200),
    categoria: texto(dados, "categoria") || "outros",
    vence_em: venceEm || null,
    pago_em: jaPago ? hojeNaLoja() : null,
  };

  const id = texto(dados, "id");
  const { error } = id
    ? await supabase.from("lancamentos").update(linha).eq("id", id)
    : await supabase.from("lancamentos").insert(linha);

  if (error) return { erro: error.message };

  limpar();
  redirect("/admin/financeiro?ok=1");
}

/** Baixa de uma conta: só preenche a data do pagamento. */
export async function darBaixa(dados: FormData): Promise<void> {
  const supabase = await criarClienteServidor();
  if (!supabase) return;

  const id = texto(dados, "id");
  if (!id) return;

  await supabase
    .from("lancamentos")
    .update({ pago_em: hojeNaLoja() })
    .eq("id", id);

  limpar();
}

/** Desfaz a baixa, para quando o dedo escorregar na linha errada. */
export async function desfazerBaixa(dados: FormData): Promise<void> {
  const supabase = await criarClienteServidor();
  if (!supabase) return;

  const id = texto(dados, "id");
  if (!id) return;

  await supabase.from("lancamentos").update({ pago_em: null }).eq("id", id);
  limpar();
}

export async function apagarLancamento(dados: FormData): Promise<void> {
  const supabase = await criarClienteServidor();
  if (!supabase) return;

  const id = texto(dados, "id");
  if (!id) return;

  await supabase.from("lancamentos").delete().eq("id", id);
  limpar();
}
