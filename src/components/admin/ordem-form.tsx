"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { salvarOrdem, type Resultado } from "@/app/admin/actions";
import { ETAPA, LINHA_DO_TEMPO, type Ordem } from "@/types/ordem";
import { AreaTexto, Bloco, Campo, Entrada, Selecao } from "./campo";

const EQUIPAMENTOS = ["Notebook", "Desktop", "All in one", "Impressora", "Outro"];

const VAZIO: Omit<Ordem, "id" | "criadoEm" | "atualizadoEm"> = {
  codigo: "",
  clienteNome: "",
  clienteTelefone: "",
  equipamento: "Notebook",
  marca: "",
  modelo: "",
  defeito: "",
  status: "recebido",
  valorOrcado: null,
  observacoes: "",
  previsao: null,
};

/** Sugere OS-<contador do dia> só na abertura, para o técnico não inventar padrão. */
function codigoSugerido(): string {
  const agora = new Date();
  const dia = `${agora.getDate()}`.padStart(2, "0");
  const mes = `${agora.getMonth() + 1}`.padStart(2, "0");
  return `OS-${dia}${mes}-${`${agora.getHours()}`.padStart(2, "0")}${`${agora.getMinutes()}`.padStart(2, "0")}`;
}

function Salvar({ novo }: { novo: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-13 items-center justify-center rounded-full bg-accent px-8 py-4 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white disabled:opacity-50"
    >
      {pending ? "Salvando..." : novo ? "Abrir ordem" : "Salvar ordem"}
    </button>
  );
}

export function OrdemForm({ ordem }: { ordem?: Ordem }) {
  const o = ordem ?? VAZIO;
  const [estado, acao] = useActionState<Resultado, FormData>(salvarOrdem, {});

  return (
    <form action={acao}>
      {ordem && <input type="hidden" name="id" value={ordem.id} />}

      <Bloco
        indice="01"
        titulo="Quem trouxe"
        descricao="O telefone é o que o cliente usa para consultar a ordem no site: ele digita o código e os quatro últimos dígitos deste número. Confira antes de salvar."
      >
        <Campo rotulo="Código da ordem" nota="Vai no comprovante do cliente" obrigatorio>
          <Entrada
            name="codigo"
            defaultValue={ordem ? o.codigo : codigoSugerido()}
            placeholder="OS-1042"
            required
            onChange={(e) => {
              e.currentTarget.value = e.currentTarget.value.toUpperCase();
            }}
          />
        </Campo>

        <Campo rotulo="Nome do cliente" obrigatorio>
          <Entrada name="clienteNome" defaultValue={o.clienteNome} required />
        </Campo>

        <Campo rotulo="Telefone" nota="Com DDD" obrigatorio>
          <Entrada
            name="clienteTelefone"
            defaultValue={o.clienteTelefone}
            placeholder="(31) 90000-0000"
            inputMode="tel"
            required
          />
        </Campo>

        <Campo rotulo="Previsão de entrega" nota="Opcional, aparece para o cliente">
          <Entrada name="previsao" type="date" defaultValue={o.previsao ?? ""} />
        </Campo>
      </Bloco>

      <Bloco indice="02" titulo="O aparelho">
        <Campo rotulo="Tipo">
          <Selecao name="equipamento" defaultValue={o.equipamento || "Notebook"}>
            {EQUIPAMENTOS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </Selecao>
        </Campo>

        <Campo rotulo="Marca">
          <Entrada name="marca" defaultValue={o.marca} placeholder="Dell" />
        </Campo>

        <Campo rotulo="Modelo">
          <Entrada name="modelo" defaultValue={o.modelo} placeholder="Latitude 5490" />
        </Campo>

        <Campo rotulo="Defeito relatado" nota="Aparece para o cliente">
          <Entrada
            name="defeito"
            defaultValue={o.defeito}
            placeholder="Não liga depois de uma queda"
          />
        </Campo>
      </Bloco>

      <Bloco
        indice="03"
        titulo="Andamento"
        descricao="A etapa e o recado são exatamente o que o cliente lê em /acompanhar. Escreva pensando nele."
      >
        <Campo rotulo="Etapa">
          <Selecao name="status" defaultValue={o.status}>
            {[...LINHA_DO_TEMPO, "cancelado" as const].map((s) => (
              <option key={s} value={s}>
                {ETAPA[s].rotulo}
              </option>
            ))}
          </Selecao>
        </Campo>

        <Campo rotulo="Valor orçado (R$)" nota="Só o número. Vazio = ainda sem orçamento">
          <Entrada
            name="valorOrcado"
            type="number"
            min={0}
            step={1}
            defaultValue={o.valorOrcado ?? ""}
            placeholder="280"
          />
        </Campo>

        <Campo rotulo="Recado da bancada" className="sm:col-span-2">
          <AreaTexto
            name="observacoes"
            rows={4}
            defaultValue={o.observacoes}
            placeholder="Trocado o conector de carga. Testado por 24h ligado, sem falha."
          />
        </Campo>
      </Bloco>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Salvar novo={!ordem} />
        <Link
          href="/admin/ordens"
          className="flex h-13 items-center rounded-full bg-surface-2 px-7 py-4 font-mono text-[12px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
        >
          Cancelar
        </Link>
        {estado.erro && <p className="font-mono text-[11.5px] text-accent">{estado.erro}</p>}
      </div>
    </form>
  );
}
