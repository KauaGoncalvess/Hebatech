"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { salvarRegras, type Resultado } from "@/app/admin/planos-actions";
import type { RegraManutencao } from "@/types/plano";
import { AreaTexto, Campo } from "./campo";

function Salvar({ salvo }: { salvo: boolean }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 items-center rounded-full border border-accent px-7 font-mono text-[11.5px] tracking-[0.12em] text-accent uppercase transition-colors hover:bg-accent hover:text-black disabled:opacity-50"
      >
        {pending ? "Salvando..." : "Salvar regras"}
      </button>
      {salvo && !pending && (
        <p className="font-mono text-[11px] text-accent">Regras atualizadas.</p>
      )}
    </div>
  );
}

export function RegrasForm({ regras }: { regras: RegraManutencao[] }) {
  const [estado, acao] = useActionState<Resultado, FormData>(salvarRegras, {});
  const salvo = estado.ok === true;

  return (
    <form action={acao} className="card p-6 md:p-8">
      <Campo
        rotulo="Regras do contrato"
        nota="Uma por linha, no formato «Título: texto»"
      >
        <AreaTexto
          name="regras"
          rows={6}
          defaultValue={regras.map((r) => `${r.titulo}: ${r.texto}`).join("\n")}
          placeholder={
            "Sem fidelidade: Contrato mensal. Você cancela avisando com 30 dias.\nNota fiscal: Emitida todo mês, com o serviço discriminado."
          }
        />
      </Campo>

      <div className="mt-5">
        <Salvar salvo={salvo} />
        {estado.erro && (
          <p className="mt-3 font-mono text-[11.5px] text-accent">{estado.erro}</p>
        )}
      </div>
    </form>
  );
}
