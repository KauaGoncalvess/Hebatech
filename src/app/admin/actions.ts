"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { paraLinha } from "@/lib/produto-mapper";
import { gerarSlug } from "@/lib/slug";
import { criarClienteServidor } from "@/lib/supabase/server";
import { BUCKET_FOTOS } from "@/lib/supabase/config";
import {
  CATEGORIAS,
  CONDICOES,
  GRAUS,
  type CategoriaId,
  type Condicao,
  type GrauEstado,
  type LinhaFicha,
  type Produto,
} from "@/types/produto";

export type Resultado = { erro?: string };

/** Limpa os caminhos que mostram catálogo, para a alteração aparecer na hora. */
function revalidarSite(slug?: string) {
  revalidatePath("/");
  revalidatePath("/notebooks");
  revalidatePath("/produtos");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/produtos/${slug}`);
}

function texto(dados: FormData, campo: string): string {
  const v = dados.get(campo);
  return typeof v === "string" ? v.trim() : "";
}

function numero(dados: FormData, campo: string): number | null {
  const v = texto(dados, campo).replace(",", ".");
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function inteiro(dados: FormData, campo: string): number | null {
  const n = numero(dados, campo);
  return n === null ? null : Math.round(n);
}

function listaDeLinhas(bruto: string): string[] {
  return bruto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Cada linha vira "Rótulo: valor" na tabela de especificação. */
function fichaDeTexto(bruto: string): LinhaFicha[] {
  return listaDeLinhas(bruto).flatMap((linha) => {
    const sep = linha.indexOf(":");
    if (sep < 1) return [];
    const rotulo = linha.slice(0, sep).trim();
    const valor = linha.slice(sep + 1).trim();
    return rotulo && valor ? [{ rotulo, valor }] : [];
  });
}

function lerFormulario(dados: FormData): { produto: Omit<Produto, "id">; erro?: string } {
  const marca = texto(dados, "marca");
  const modelo = texto(dados, "modelo");
  const codigo = texto(dados, "codigo").toUpperCase();
  const preco = inteiro(dados, "preco");

  const categoriaBruta = texto(dados, "categoria");
  const categoria = (CATEGORIAS.find((c) => c.id === categoriaBruta)?.id ??
    "notebook") as CategoriaId;

  const condicaoBruta = texto(dados, "condicao");
  const condicao = (CONDICOES.includes(condicaoBruta as Condicao)
    ? condicaoBruta
    : "seminovo") as Condicao;

  const grauBruto = texto(dados, "estadoGrau");
  const estadoGrau = GRAUS.includes(grauBruto as GrauEstado)
    ? (grauBruto as GrauEstado)
    : null;

  const slug = gerarSlug(texto(dados, "slug") || `${marca} ${modelo}`);

  const produto: Omit<Produto, "id"> = {
    codigo,
    slug,
    categoria,
    marca,
    modelo,
    condicao,
    preco: preco ?? 0,
    precoReferencia: inteiro(dados, "precoReferencia"),
    destaque: dados.get("destaque") === "on",
    disponivel: dados.get("disponivel") === "on",
    resumo: texto(dados, "resumo"),
    cpuFamilia: texto(dados, "cpuFamilia") || null,
    cpuNome: texto(dados, "cpuNome") || null,
    ramGb: inteiro(dados, "ramGb"),
    armazenamentoGb: inteiro(dados, "armazenamentoGb"),
    armazenamentoTipo: texto(dados, "armazenamentoTipo") || null,
    telaPolegadas: numero(dados, "telaPolegadas"),
    telaResolucao: texto(dados, "telaResolucao") || null,
    bateriaSaude: inteiro(dados, "bateriaSaude"),
    pesoKg: numero(dados, "pesoKg"),
    ficha: fichaDeTexto(texto(dados, "ficha")),
    estadoGrau,
    estadoObservacoes: listaDeLinhas(texto(dados, "estadoObservacoes")),
    garantiaDias: inteiro(dados, "garantiaDias") ?? 90,
    fotos: listaDeLinhas(texto(dados, "fotos")),
    ordem: inteiro(dados, "ordem") ?? 0,
  };

  if (!marca) return { produto, erro: "Informe a marca." };
  if (!modelo) return { produto, erro: "Informe o modelo." };
  if (!codigo) return { produto, erro: "Informe o código do produto." };
  if (preco === null || preco < 0) return { produto, erro: "Informe um preço válido." };
  if (produto.bateriaSaude !== null && (produto.bateriaSaude < 0 || produto.bateriaSaude > 100)) {
    return { produto, erro: "A saúde da bateria precisa ficar entre 0 e 100." };
  }
  if (
    produto.precoReferencia !== null &&
    produto.precoReferencia > 0 &&
    produto.precoReferencia <= produto.preco
  ) {
    return {
      produto,
      erro: "O preço de referência precisa ser maior que o preço de venda.",
    };
  }

  return { produto };
}

export async function salvarProduto(
  _anterior: Resultado,
  dados: FormData,
): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  const { produto, erro } = lerFormulario(dados);
  if (erro) return { erro };

  const id = texto(dados, "id");
  const linha = paraLinha(produto);

  const resposta = id
    ? await supabase.from("produtos").update(linha).eq("id", id)
    : await supabase.from("produtos").insert(linha);

  if (resposta.error) {
    const msg = resposta.error.message;
    if (msg.includes("produtos_codigo_key")) return { erro: "Já existe produto com esse código." };
    if (msg.includes("produtos_slug_key")) return { erro: "Já existe produto com esse endereço (slug)." };
    return { erro: msg };
  }

  revalidarSite(produto.slug);
  redirect("/admin/produtos?ok=1");
}

/**
 * Copia um produto para servir de base a outro parecido. Cadastrar cinco
 * ThinkPad quase iguais deixa de ser digitar tudo cinco vezes.
 *
 * A cópia nasce fora do ar e com código e endereço novos, para não colidir com
 * o original nem aparecer no site antes de ser revisada.
 */
export async function duplicarProduto(id: string): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { erro: error.message };
  if (!data) return { erro: "Produto não encontrado." };

  const sufixo = Date.now().toString(36).slice(-4).toUpperCase();
  const {
    id: _id,
    criado_em: _criado,
    atualizado_em: _atualizado,
    ...resto
  } = data as Record<string, unknown>;

  const copia = {
    ...resto,
    codigo: `${String(resto.codigo ?? "HT")}-${sufixo}`,
    slug: gerarSlug(`${String(resto.slug ?? "produto")}-${sufixo}`),
    disponivel: false,
    destaque: false,
  };

  const { data: nova, error: erroInsert } = await supabase
    .from("produtos")
    .insert(copia)
    .select("id")
    .single();

  if (erroInsert) return { erro: erroInsert.message };

  revalidatePath("/admin/produtos");
  redirect(`/admin/produtos/${nova.id}`);
}

export async function alternarDisponibilidade(
  id: string,
  disponivel: boolean,
): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  const { error } = await supabase.from("produtos").update({ disponivel }).eq("id", id);
  if (error) return { erro: error.message };

  revalidarSite();
  revalidatePath("/admin/produtos");
  return {};
}

export async function excluirProduto(id: string): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  const { data, error: erroLeitura } = await supabase
    .from("produtos")
    .select("fotos")
    .eq("id", id)
    .single();

  if (erroLeitura) return { erro: erroLeitura.message };

  // Remove as imagens do Storage junto com o registro. Uma falha aqui deixa
  // arquivo órfão no bucket, mas não impede apagar o produto: só registra.
  const fotos = Array.isArray(data?.fotos) ? (data.fotos as string[]) : [];
  const caminhos = fotos
    .map((url) => url.split(`/${BUCKET_FOTOS}/`)[1])
    .filter((c): c is string => Boolean(c));

  if (caminhos.length) {
    const { error } = await supabase.storage.from(BUCKET_FOTOS).remove(caminhos);
    if (error) console.error("Falha ao remover fotos do Storage:", error.message);
  }

  const { error } = await supabase.from("produtos").delete().eq("id", id);
  if (error) return { erro: error.message };

  revalidarSite();
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos?excluido=1");
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
