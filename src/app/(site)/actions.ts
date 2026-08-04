"use server";

import { gravarOrcamento } from "@/lib/orcamentos";
import type { NovoOrcamento } from "@/types/orcamento";

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
