"use server";

import { gravarOrcamento } from "@/lib/orcamentos";
import { consultarOrdem } from "@/lib/ordens";
import type { NovoOrcamento } from "@/types/orcamento";
import type { OrdemPublica } from "@/types/ordem";

/**
 * Guarda o pedido de orçamento feito no site.
 *
 * Nunca estoura: o formulário chama isto de lado enquanto abre o WhatsApp, e a
 * conversa vale mais que o registro. O retorno serve só para o formulário saber
 * se pode navegar sem cortar a gravação no meio.
 */
export async function registrarOrcamento(pedido: NovoOrcamento): Promise<boolean> {
  try {
    return await gravarOrcamento(pedido);
  } catch (erro) {
    console.error("Falha inesperada ao registrar orçamento:", erro);
    return false;
  }
}

export type EstadoConsulta = {
  erro?: string;
  ordem?: OrdemPublica;
};

/**
 * Consulta de /acompanhar. Roda no servidor porque a tabela de ordens não é
 * legível de fora — o navegador nunca fala com ela direto.
 *
 * A mensagem de erro é a mesma para código inexistente e telefone errado, de
 * propósito: dizer "esse código existe, mas o telefone não bate" entregaria a
 * quem estivesse chutando que o código é válido.
 */
export async function buscarOrdem(
  _anterior: EstadoConsulta,
  dados: FormData,
): Promise<EstadoConsulta> {
  const codigo = String(dados.get("codigo") ?? "").trim();
  const telefone = String(dados.get("telefone") ?? "").trim();

  if (!codigo) return { erro: "Digite o código que está no seu comprovante." };
  if (telefone.replace(/\D/g, "").length < 4) {
    return { erro: "Digite os quatro últimos dígitos do seu telefone." };
  }

  try {
    const ordem = await consultarOrdem(codigo, telefone);
    if (!ordem) {
      return {
        erro: "Não encontramos nenhum aparelho com esse código e esse telefone. Confira os dois e tente de novo.",
      };
    }
    return { ordem };
  } catch (erro) {
    console.error("Falha na consulta de ordem:", erro);
    return {
      erro: "A consulta está fora do ar neste momento. Chame a gente no WhatsApp que respondemos na hora.",
    };
  }
}
