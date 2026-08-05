"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { paraLinha } from "@/lib/produto-mapper";
import { gerarSlug } from "@/lib/slug";
import { criarClienteServidor } from "@/lib/supabase/server";
import { BUCKET_FOTOS } from "@/lib/supabase/config";
import { STATUS_ORDEM, type StatusOrdem } from "@/types/ordem";
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

/* ── Pedidos de orçamento ── */

export async function marcarOrcamento(
  id: string,
  atendido: boolean,
): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  const { error } = await supabase.from("orcamentos").update({ atendido }).eq("id", id);
  if (error) return { erro: error.message };

  revalidatePath("/admin/orcamentos");
  return {};
}

export async function excluirOrcamento(id: string): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  const { error } = await supabase.from("orcamentos").delete().eq("id", id);
  if (error) return { erro: error.message };

  revalidatePath("/admin/orcamentos");
  return {};
}

/* ── Ordens de serviço ── */

function lerOrdem(dados: FormData): { linha: Record<string, unknown>; erro?: string } {
  const codigo = texto(dados, "codigo").toUpperCase();
  const clienteNome = texto(dados, "clienteNome");
  const clienteTelefone = texto(dados, "clienteTelefone");

  const statusBruto = texto(dados, "status");
  const status = STATUS_ORDEM.includes(statusBruto as StatusOrdem)
    ? statusBruto
    : "recebido";

  const previsao = texto(dados, "previsao");

  const linha: Record<string, unknown> = {
    codigo,
    cliente_id: texto(dados, "clienteId") || null,
    cliente_nome: clienteNome,
    cliente_telefone: clienteTelefone,
    equipamento: texto(dados, "equipamento") || "Notebook",
    marca: texto(dados, "marca"),
    modelo: texto(dados, "modelo"),
    defeito: texto(dados, "defeito"),
    status,
    valor_orcado: inteiro(dados, "valorOrcado"),
    observacoes: texto(dados, "observacoes"),
    previsao: previsao || null,
  };

  // O código vazio é permitido aqui de propósito: em ordem nova ele significa
  // "numere para mim". Quem cobra o código preenchido é o salvarOrdem, e só na
  // edição, onde ele já existe.
  if (!clienteNome) return { linha, erro: "Informe o nome do cliente." };
  if (clienteTelefone.replace(/\D/g, "").length < 10) {
    return { linha, erro: "O telefone precisa ter DDD e ao menos 10 dígitos." };
  }
  if (linha.valor_orcado !== null && (linha.valor_orcado as number) < 0) {
    return { linha, erro: "O valor orçado não pode ser negativo." };
  }

  return { linha };
}

export async function salvarOrdem(
  _anterior: Resultado,
  dados: FormData,
): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  const { linha, erro } = lerOrdem(dados);
  if (erro) return { erro };

  const id = texto(dados, "id");

  /**
   * Numeração automática. É gerada no salvar, e não ao abrir o formulário, para
   * que ordem começada e abandonada não queime um número — o talão da loja não
   * pode ter buraco. Quem quiser numerar à mão é só preencher o campo.
   */
  if (!id && !linha.codigo) {
    const { data, error } = await supabase.rpc("proximo_codigo_ordem");
    if (error || typeof data !== "string") {
      return {
        erro: `Não consegui gerar o número da ordem: ${error?.message ?? "resposta vazia"}. Digite um código à mão ou rode o supabase/schema.sql novamente.`,
      };
    }
    linha.codigo = data;
  }

  if (!linha.codigo) return { erro: "Informe o código da ordem." };

  /**
   * A ficha do cliente é achada pelo telefone; se não existir, nasce agora.
   * Assim a base de clientes se forma sozinha do trabalho do dia a dia, sem
   * ninguém precisar cadastrar duas vezes a mesma pessoa.
   *
   * Falhar aqui não pode impedir a ordem de ser aberta: o aparelho já está no
   * balcão, e nome e telefone ficam gravados na própria ordem de todo jeito.
   */
  if (!linha.cliente_id) {
    try {
      linha.cliente_id = await fichaDoTelefone(
        supabase,
        String(linha.cliente_telefone ?? ""),
        String(linha.cliente_nome ?? ""),
      );
    } catch (falha) {
      console.error("Não consegui vincular a ficha do cliente:", falha);
    }
  }

  const resposta = id
    ? await supabase.from("ordens").update(linha).eq("id", id)
    : await supabase.from("ordens").insert(linha);

  if (resposta.error) {
    const msg = resposta.error.message;
    if (msg.includes("ordens_codigo_key")) {
      return { erro: "Já existe uma ordem com esse código." };
    }
    return { erro: msg };
  }

  revalidatePath("/admin/ordens");
  revalidatePath("/admin/clientes");
  redirect("/admin/ordens?ok=1");
}

type ClienteSupabase = NonNullable<Awaited<ReturnType<typeof criarClienteServidor>>>;

/** Devolve o id da ficha desse telefone, criando-a quando ainda não existe. */
async function fichaDoTelefone(
  supabase: ClienteSupabase,
  telefone: string,
  nome: string,
): Promise<string | null> {
  const digitos = telefone.replace(/\D/g, "");
  if (digitos.length < 10) return null;

  const { data: existente } = await supabase
    .from("clientes")
    .select("id")
    .eq("telefone_digitos", digitos)
    .maybeSingle();

  if (existente?.id) return existente.id as string;

  const { data: nova, error } = await supabase
    .from("clientes")
    .insert({ nome, telefone, origem: "painel", confirmado: true })
    .select("id")
    .single();

  if (error) {
    console.error("Não consegui abrir a ficha do cliente:", error.message);
    return null;
  }
  return nova.id as string;
}

/** Avanço rápido de etapa, direto da lista. */
export async function mudarStatusOrdem(
  id: string,
  status: StatusOrdem,
): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  const { error } = await supabase.from("ordens").update({ status }).eq("id", id);
  if (error) return { erro: error.message };

  revalidatePath("/admin/ordens");
  return {};
}

export async function excluirOrdem(id: string): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  const { error } = await supabase.from("ordens").delete().eq("id", id);
  if (error) return { erro: error.message };

  revalidatePath("/admin/ordens");
  redirect("/admin/ordens?excluido=1");
}

/* ── Fichas de cliente ── */

export type ClienteAchado = {
  id: string;
  nome: string;
  telefone: string;
  documento: string;
  ordens: number;
  ultimoAparelho: string;
};

/**
 * Busca por nome, telefone ou documento, para a abertura de ordem não obrigar
 * a redigitar quem já é cliente. Joana que voltou depois de um ano aparece com
 * o histórico junto, e o atendente só clica.
 *
 * Roda no servidor porque a tabela de clientes não é legível de fora.
 */
export async function procurarClientes(termo: string): Promise<ClienteAchado[]> {
  const busca = termo.trim();
  if (busca.length < 2) return [];

  const supabase = await criarClienteServidor();
  if (!supabase) return [];

  const digitos = busca.replace(/\D/g, "");
  // `ilike` já ignora maiúscula; o `%` dos dois lados acha no meio do nome.
  const filtros = [`nome.ilike.%${busca}%`, `documento.ilike.%${busca}%`];
  if (digitos.length >= 3) filtros.push(`telefone_digitos.ilike.%${digitos}%`);

  const { data, error } = await supabase
    .from("clientes")
    .select("id, nome, telefone, documento")
    .or(filtros.join(","))
    .order("nome")
    .limit(6);

  if (error || !data?.length) {
    if (error) console.error("Falha ao procurar cliente:", error.message);
    return [];
  }

  const ids = data.map((c) => c.id as string);
  const { data: ordens } = await supabase
    .from("ordens")
    .select("cliente_id, equipamento, marca, modelo, criado_em")
    .in("cliente_id", ids)
    .order("criado_em", { ascending: false });

  return data.map((c) => {
    const minhas = (ordens ?? []).filter((o) => o.cliente_id === c.id);
    const ultima = minhas[0];
    return {
      id: c.id as string,
      nome: (c.nome as string) ?? "",
      telefone: (c.telefone as string) ?? "",
      documento: (c.documento as string) ?? "",
      ordens: minhas.length,
      ultimoAparelho: ultima
        ? [ultima.equipamento, ultima.marca, ultima.modelo]
            .filter(Boolean)
            .join(" ")
        : "",
    };
  });
}

export async function salvarCliente(
  _anterior: Resultado,
  dados: FormData,
): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  const nome = texto(dados, "nome");
  const telefone = texto(dados, "telefone");

  if (!nome) return { erro: "Informe o nome do cliente." };
  if (telefone.replace(/\D/g, "").length < 10) {
    return { erro: "O telefone precisa ter DDD e ao menos 10 dígitos." };
  }

  const linha = {
    nome,
    telefone,
    email: texto(dados, "email"),
    documento: texto(dados, "documento"),
    endereco: texto(dados, "endereco"),
    observacoes: texto(dados, "observacoes"),
    // Salvar pelo painel é a conferência: o pré-cadastro do site sai da fila.
    confirmado: true,
  };

  const id = texto(dados, "id");
  const resposta = id
    ? await supabase.from("clientes").update(linha).eq("id", id)
    : await supabase.from("clientes").insert({ ...linha, origem: "painel" });

  if (resposta.error) {
    const msg = resposta.error.message;
    if (msg.includes("clientes_telefone_idx")) {
      return { erro: "Já existe uma ficha com esse telefone." };
    }
    return { erro: msg };
  }

  revalidatePath("/admin/clientes");
  redirect("/admin/clientes?ok=1");
}

export async function excluirCliente(id: string): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  // As ordens desse cliente não são apagadas: o vínculo delas fica nulo, por
  // conta do `on delete set null`. Histórico de serviço é documento de garantia.
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) return { erro: error.message };

  revalidatePath("/admin/clientes");
  redirect("/admin/clientes?excluido=1");
}

export async function confirmarCliente(id: string): Promise<Resultado> {
  const supabase = await criarClienteServidor();
  if (!supabase) return { erro: "Supabase não configurado." };

  const { error } = await supabase
    .from("clientes")
    .update({ confirmado: true })
    .eq("id", id);
  if (error) return { erro: error.message };

  revalidatePath("/admin/clientes");
  return {};
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
