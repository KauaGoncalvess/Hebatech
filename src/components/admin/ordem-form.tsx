"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { salvarOrdem, type Resultado } from "@/app/admin/actions";
import { mascararTelefone } from "@/types/cliente";
import { ETAPA, LINHA_DO_TEMPO, type Ordem } from "@/types/ordem";
import { CampoCliente } from "./campo-cliente";
import { AreaTexto, Bloco, Campo, Entrada, Selecao } from "./campo";

const EQUIPAMENTOS = ["Notebook", "Desktop", "All in one", "Impressora", "Outro"];

const VAZIO: Omit<Ordem, "id" | "criadoEm" | "atualizadoEm"> = {
  codigo: "",
  clienteId: null,
  clienteNome: "",
  clienteTelefone: "",
  equipamento: "Notebook",
  marca: "",
  modelo: "",
  defeito: "",
  status: "recebido",
  valorOrcado: null,
  valorCobrado: null,
  custoPeca: null,
  observacoes: "",
  previsao: null,
};

function Salvar({ novo }: { novo: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-13 items-center justify-center rounded-full bg-accent px-8 py-4 font-mono text-nota font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-accent-hover disabled:opacity-50"
    >
      {pending ? "Salvando..." : novo ? "Abrir ordem" : "Salvar ordem"}
    </button>
  );
}

export function OrdemForm({
  ordem,
  codigoPrevisto,
}: {
  ordem?: Ordem;
  /** Só na abertura: o número que a ordem vai receber ao salvar. */
  codigoPrevisto?: string | null;
}) {
  const o = ordem ?? VAZIO;
  const [estado, acao] = useActionState<Resultado, FormData>(salvarOrdem, {});

  /**
   * Nome e telefone deixam de ser campos soltos para poderem ser preenchidos
   * pela busca de ficha. `clienteId` viaja escondido: é o que liga a ordem ao
   * histórico da pessoa.
   */
  const [clienteId, setClienteId] = useState(o.clienteId);
  const [nome, setNome] = useState(o.clienteNome);
  const [telefone, setTelefone] = useState(o.clienteTelefone);
  const [fichaUsada, setFichaUsada] = useState<string | null>(null);

  return (
    <form action={acao}>
      {ordem && <input type="hidden" name="id" value={ordem.id} />}
      <input type="hidden" name="clienteId" value={clienteId ?? ""} />

      <Bloco
        indice="01"
        titulo="Quem trouxe"
        descricao="O telefone é o que o cliente usa para consultar a ordem no site: ele digita o código e os quatro últimos dígitos deste número. Confira antes de salvar — é também por ele que a ficha do cliente é encontrada ou aberta."
      >
        {/**
          * O número não é campo: é dado. Editar à mão abriria porta para dois
          * códigos iguais e para quebrar o acompanhamento de quem já recebeu o
          * comprovante — a ordem é encontrada por ele em /acompanhar.
          */}
        <div className="sm:col-span-2">
          <span className="eyebrow text-texto-3">Número da ordem</span>
          {o.codigo || codigoPrevisto ? (
            <p className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="display text-[1.7rem] leading-none text-accent">
                {o.codigo || codigoPrevisto}
              </span>
              <span className="font-mono text-rotulo text-texto-3">
                {ordem
                  ? "vai no comprovante do cliente"
                  : "reservado para esta ordem, gerado ao salvar"}
              </span>
            </p>
          ) : (
            <p className="mt-2.5 font-mono text-rotulo text-texto-3">
              O número sai ao salvar, seguindo a numeração do ano.
            </p>
          )}
        </div>

        <CampoCliente
          nome={nome}
          aoDigitar={setNome}
          vinculado={fichaUsada}
          aoDesvincular={() => {
            setClienteId(null);
            setFichaUsada(null);
          }}
          aoEscolher={(c) => {
            setClienteId(c.id);
            setNome(c.nome);
            setTelefone(c.telefone);
            setFichaUsada(
              `Ficha de ${c.nome}${c.ordens ? ` · ${c.ordens} ${c.ordens === 1 ? "ordem" : "ordens"}` : ""}`,
            );
          }}
        />

        <Campo
          rotulo="Telefone"
          nota={fichaUsada ? "Vindo da ficha" : "Com DDD"}
          obrigatorio
        >
          <Entrada
            name="clienteTelefone"
            value={telefone}
            onChange={(e) => setTelefone(mascararTelefone(e.target.value))}
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
          <Entrada name="marca" defaultValue={o.marca} />
        </Campo>

        <Campo rotulo="Modelo">
          <Entrada name="modelo" defaultValue={o.modelo} />
        </Campo>

        <Campo rotulo="Defeito relatado" nota="Aparece para o cliente">
          <Entrada
            name="defeito"
            defaultValue={o.defeito}
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
          />
        </Campo>

        {/*
          Orçado é o que foi combinado; cobrado é o que entrou. Separados porque
          desconto no fechamento é regra, não exceção — e é o cobrado, não o
          orçado, que vira dinheiro no caixa quando a ordem sai como entregue.
        */}
        <Campo rotulo="Valor cobrado (R$)" nota="O que o cliente pagou de fato">
          <Entrada
            name="valorCobrado"
            type="number"
            min={0}
            step={1}
            defaultValue={o.valorCobrado ?? ""}
          />
        </Campo>

        <Campo rotulo="Custo da peça (R$)" nota="O que você pagou. Não aparece pro cliente">
          <Entrada
            name="custoPeca"
            type="number"
            min={0}
            step={1}
            defaultValue={o.custoPeca ?? ""}
          />
        </Campo>

        <p className="sm:col-span-2 -mt-1 rounded-2xl bg-surface-2 px-4 py-3 text-nota leading-relaxed text-texto-3">
          Quando a ordem for marcada como <strong className="text-texto-2">entregue</strong>{" "}
          e tiver valor cobrado, ela entra no caixa sozinha — a peça como saída,
          o serviço como entrada. Não precisa lançar de novo no financeiro.
        </p>

        <Campo
          rotulo="O que foi feito"
          nota="O cliente lê isto, e fica no histórico dele"
          className="sm:col-span-2"
        >
          <AreaTexto
            name="observacoes"
            rows={4}
            defaultValue={o.observacoes}
          />
        </Campo>
      </Bloco>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Salvar novo={!ordem} />
        <Link
          href="/admin/ordens"
          className="flex h-13 items-center rounded-full bg-surface-2 px-7 py-4 font-mono text-nota tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
        >
          Cancelar
        </Link>
        {estado.erro && <p className="font-mono text-rotulo text-accent">{estado.erro}</p>}
      </div>
    </form>
  );
}
