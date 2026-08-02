"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CHAVE_REGRAS } from "@/data/seed-planos";
import { paraLinhaPlano } from "@/lib/plano-mapper";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { Plano, RegraManutencao } from "@/types/plano";

export type Resultado = { erro?: string; ok?: true };

function revalidarManutencao() {
  revalidatePath("/assistencia");
  revalidatePath("/");
  revalidatePath("/admin/planos");
}

function texto(dados: FormData, campo: string): string {
  const v = dados.get(campo);
  return typeof v === "string" ? v.trim() : "";
}

function inteiro(dados: FormData, campo: string): number | null {
  const v = texto(dados, campo).replace(",", ".");
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function listaDeLinhas(bruto: string): string[] {
  return bruto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Cada linha do campo de regras vem como "Título: texto". */
function regrasDeTexto(bruto: string): RegraManutencao[] {
  return listaDeLinhas(bruto).flatMap((linha) => {
    const sep = linha.indexOf(":");
    if (sep < 1) return [];
    const titulo = linha.slice(0, sep).trim();
    const texto = linha.slice(sep + 1).trim();
    return titulo && texto ? [{ titulo, texto }] : [];
  });
}

export async function salvarPlano(
  _anterior: Resultado,
  dados: FormData,
): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  const codigo = texto(dados, "codigo").toUpperCase();
  const nome = texto(dados, "nome");
  const precoMensal = inteiro(dados, "precoMensal");

  if (!codigo) return { erro: "Informe o código do plano." };
  if (!nome) return { erro: "Informe o nome do plano." };
  if (precoMensal !== null && precoMensal < 0) {
    return { erro: "O valor mensal não pode ser negativo." };
  }

  const plano: Omit<Plano, "id"> = {
    codigo,
    nome,
    faixa: texto(dados, "faixa"),
    precoMensal,
    visitas: texto(dados, "visitas"),
    destaque: dados.get("destaque") === "on",
    ativo: dados.get("ativo") === "on",
    inclui: listaDeLinhas(texto(dados, "inclui")),
    ordem: inteiro(dados, "ordem") ?? 0,
  };

  const id = texto(dados, "id");
  const linha = paraLinhaPlano(plano);

  // Só um plano por vez pode carregar o selo de mais contratado.
  if (plano.destaque) {
    const limpeza = supabase.from("planos_manutencao").update({ destaque: false });
    await (id ? limpeza.neq("id", id) : limpeza.neq("codigo", codigo));
  }

  const resposta = id
    ? await supabase.from("planos_manutencao").update(linha).eq("id", id)
    : await supabase.from("planos_manutencao").insert(linha);

  if (resposta.error) {
    const msg = resposta.error.message;
    if (msg.includes("planos_manutencao_codigo_key")) {
      return { erro: "Já existe plano com esse código." };
    }
    return { erro: msg };
  }

  revalidarManutencao();
  redirect("/admin/planos?ok=1");
}

export async function alternarPlanoAtivo(id: string, ativo: boolean) {
  const supabase = await criarClienteServidor();
  if (!supabase) return;

  await supabase.from("planos_manutencao").update({ ativo }).eq("id", id);
  revalidarManutencao();
}

export async function excluirPlano(id: string) {
  const supabase = await criarClienteServidor();
  if (!supabase) return;

  await supabase.from("planos_manutencao").delete().eq("id", id);
  revalidarManutencao();
  redirect("/admin/planos?excluido=1");
}

export async function salvarRegras(
  _anterior: Resultado,
  dados: FormData,
): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  const regras = regrasDeTexto(texto(dados, "regras"));
  if (regras.length === 0) {
    return { erro: 'Escreva ao menos uma regra no formato "Título: texto".' };
  }

  const { error } = await supabase
    .from("configuracoes")
    .upsert({ chave: CHAVE_REGRAS, valor: regras }, { onConflict: "chave" });

  if (error) return { erro: error.message };

  revalidarManutencao();
  return { ok: true };
}
