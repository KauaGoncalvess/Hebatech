"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { salvarLancamento, type Resultado } from "@/app/admin/financeiro-actions";
import {
  CATEGORIAS_LANCAMENTO,
  type TipoLancamento,
} from "@/types/lancamento";
import { AreaTexto, Bloco, Campo, Entrada, Selecao } from "./campo";

function Salvar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-13 items-center justify-center rounded-full bg-accent px-8 py-4 font-mono text-nota font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-accent-hover disabled:opacity-50"
    >
      {pending ? "Salvando..." : "Lançar"}
    </button>
  );
}

export function LancamentoForm() {
  const [estado, acao] = useActionState<Resultado, FormData>(salvarLancamento, {});

  // O tipo governa a lista de categorias: quem lança uma saída não deve ter
  // "venda de produto" na frente.
  const [tipo, setTipo] = useState<TipoLancamento>("entrada");
  const [jaPago, setJaPago] = useState(true);

  const categorias = CATEGORIAS_LANCAMENTO.filter((c) => c.tipo === tipo);

  return (
    <form action={acao} className="grid gap-3 pb-16 md:gap-4">
      <Bloco indice="01" titulo="O que aconteceu">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Entrou ou saiu" className="sm:col-span-2">
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              {(
                [
                  ["entrada", "Entrou dinheiro"],
                  ["saida", "Saiu dinheiro"],
                ] as const
              ).map(([id, rotulo]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTipo(id)}
                  aria-pressed={tipo === id}
                  className={`flex h-13 items-center justify-center rounded-2xl font-mono text-rotulo tracking-[0.1em] uppercase transition-colors ${
                    tipo === id
                      ? "bg-accent font-bold text-black"
                      : "bg-surface-2 text-texto-3 hover:bg-surface-3"
                  }`}
                >
                  {rotulo}
                </button>
              ))}
            </div>
            <input type="hidden" name="tipo" value={tipo} />
          </Campo>

          <Campo rotulo="Valor (R$)" obrigatorio>
            <Entrada name="valor" type="number" min={1} step={1} required />
          </Campo>

          <Campo rotulo="Categoria">
            {/* `key` no tipo: trocar entrada por saída precisa reiniciar a
                seleção, senão fica marcada uma categoria do outro lado. */}
            <Selecao key={tipo} name="categoria" defaultValue={categorias[0]?.id}>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.rotulo}
                </option>
              ))}
            </Selecao>
          </Campo>

          <Campo rotulo="Do que se trata" obrigatorio className="sm:col-span-2">
            <AreaTexto name="descricao" rows={2} required />
          </Campo>
        </div>
      </Bloco>

      <Bloco indice="02" titulo="Quando">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-surface-2 p-4 sm:col-span-2">
            <input
              type="checkbox"
              name="jaPago"
              checked={jaPago}
              onChange={(e) => setJaPago(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[#ff6b18]"
            />
            <span>
              <span className="block text-nota">
                {tipo === "entrada" ? "Já recebi este dinheiro" : "Já paguei"}
              </span>
              <span className="mt-1 block text-nota leading-relaxed text-texto-3">
                Desmarque se for fiado, carnê ou boleto que ainda vai vencer. Fica
                em aberto até você dar baixa.
              </span>
            </span>
          </label>

          {!jaPago && (
            <Campo
              rotulo="Vence em"
              nota="Opcional. Serve para avisar do atraso"
              className="sm:col-span-2"
            >
              <Entrada name="venceEm" type="date" />
            </Campo>
          )}
        </div>
      </Bloco>

      {estado.erro && (
        <p className="card border border-accent/40 px-5 py-4 text-nota text-accent">
          {estado.erro}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Salvar />
        <Link
          href="/admin/financeiro"
          className="flex h-13 items-center justify-center rounded-full bg-surface-2 px-8 font-mono text-nota tracking-[0.12em] text-texto-3 uppercase transition-colors hover:bg-surface-3"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
