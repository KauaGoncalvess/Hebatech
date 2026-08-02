"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { salvarPlano, type Resultado } from "@/app/admin/planos-actions";
import type { Plano } from "@/types/plano";
import { AreaTexto, Bloco, Campo, Entrada } from "./campo";

const VAZIO: Omit<Plano, "id"> = {
  codigo: "",
  nome: "",
  faixa: "",
  precoMensal: null,
  visitas: "",
  destaque: false,
  ativo: true,
  inclui: [],
  ordem: 0,
};

function Salvar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-12 items-center justify-center bg-accent px-8 font-mono text-[11.5px] font-bold tracking-[0.16em] text-black uppercase transition-colors hover:bg-white disabled:opacity-50"
    >
      {pending ? "Salvando..." : "Salvar plano"}
    </button>
  );
}

export function PlanoForm({ plano }: { plano?: Plano }) {
  const p = plano ?? VAZIO;
  const [estado, acao] = useActionState<Resultado, FormData>(salvarPlano, {});
  const [semPreco, setSemPreco] = useState(p.precoMensal === null);

  return (
    <form action={acao}>
      {plano && <input type="hidden" name="id" value={plano.id} />}

      <Bloco indice="01" titulo="Identificação do plano">
        <Campo rotulo="Código" nota="Aparece no card e no WhatsApp" obrigatorio>
          <Entrada
            name="codigo"
            defaultValue={p.codigo}
            placeholder="MP-01"
            required
            onChange={(e) => {
              e.currentTarget.value = e.currentTarget.value.toUpperCase();
            }}
          />
        </Campo>

        <Campo rotulo="Nome" obrigatorio>
          <Entrada name="nome" defaultValue={p.nome} placeholder="Essencial" required />
        </Campo>

        <Campo rotulo="Tamanho do parque" nota="Vai em laranja abaixo do nome">
          <Entrada name="faixa" defaultValue={p.faixa} placeholder="Até 5 máquinas" />
        </Campo>

        <Campo rotulo="Cadência do atendimento">
          <Entrada
            name="visitas"
            defaultValue={p.visitas}
            placeholder="1 visita por mês"
          />
        </Campo>
      </Bloco>

      <Bloco indice="02" titulo="Valor e exibição">
        <Campo
          rotulo="Valor mensal (R$)"
          nota={semPreco ? "Publicado como “Sob proposta”" : "Só o número"}
        >
          <Entrada
            name="precoMensal"
            type="number"
            min={0}
            step={1}
            disabled={semPreco}
            defaultValue={p.precoMensal ?? ""}
            placeholder="390"
            className={semPreco ? "opacity-30" : ""}
          />
        </Campo>

        <Campo rotulo="Ordem na lista" nota="Menor aparece primeiro">
          <Entrada name="ordem" type="number" defaultValue={p.ordem} />
        </Campo>

        <div className="flex flex-col gap-3 sm:col-span-2">
          <Interruptor
            checked={semPreco}
            onChange={setSemPreco}
            titulo="Sem valor fixo"
            texto="O card mostra “Sob proposta” em vez do preço. Use no plano sob medida."
          />
          <Interruptor
            name="ativo"
            padrao={p.ativo}
            titulo="Publicado"
            texto="Desligue para tirar o plano da página de assistência."
          />
          <Interruptor
            name="destaque"
            padrao={p.destaque}
            titulo="Marcar como mais contratado"
            texto="Ganha o filete laranja e o selo. Só um plano por vez fica assim."
          />
        </div>
      </Bloco>

      <Bloco
        indice="03"
        titulo="O que está incluso"
        descricao="Uma linha por item. É a lista que aparece dentro do card do plano."
      >
        <Campo rotulo="Itens do plano" className="sm:col-span-2">
          <AreaTexto
            name="inclui"
            rows={9}
            defaultValue={p.inclui.join("\n")}
            placeholder={
              "Visita técnica programada, 1x por mês\nSuporte remoto no horário comercial\nAtualização de Windows e antivírus"
            }
          />
        </Campo>
      </Bloco>

      <div className="flex flex-wrap items-center gap-4 p-4 md:p-6">
        <Salvar />
        <Link
          href="/admin/planos"
          className="flex h-12 items-center border border-line px-6 font-mono text-[11.5px] tracking-[0.16em] uppercase transition-colors hover:border-accent hover:text-accent"
        >
          Cancelar
        </Link>
        {estado.erro && <p className="font-mono text-[11.5px] text-accent">{estado.erro}</p>}
      </div>
    </form>
  );
}

/**
 * Com `name`, envia o valor no formulário. Sem `name`, é só um controle de tela
 * — usado pelo "sem valor fixo", que apenas desabilita o campo de preço.
 */
function Interruptor({
  name,
  padrao = false,
  checked,
  onChange,
  titulo,
  texto,
}: {
  name?: string;
  padrao?: boolean;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  titulo: string;
  texto: string;
}) {
  const [interno, setInterno] = useState(padrao);
  const ligado = checked ?? interno;

  return (
    <label className="flex cursor-pointer items-start gap-4 border border-line p-4 transition-colors hover:border-line-strong">
      <input
        type="checkbox"
        name={name}
        checked={ligado}
        onChange={(e) => {
          setInterno(e.target.checked);
          onChange?.(e.target.checked);
        }}
        className="sr-only"
      />
      <span
        aria-hidden
        className={`mt-0.5 h-4 w-4 shrink-0 border transition-colors ${
          ligado ? "border-accent bg-accent" : "border-line-strong"
        }`}
      />
      <span>
        <span className="block font-mono text-[12px] tracking-[0.08em] uppercase">
          {titulo}
        </span>
        <span className="mt-1 block text-[12px] text-white/45">{texto}</span>
      </span>
    </label>
  );
}
