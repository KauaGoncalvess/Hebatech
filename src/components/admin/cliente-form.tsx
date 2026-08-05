"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { salvarCliente, type Resultado } from "@/app/admin/actions";
import { mascararTelefone, type Cliente } from "@/types/cliente";
import { AreaTexto, Bloco, Campo, Entrada } from "./campo";

const VAZIO: Omit<Cliente, "id" | "criadoEm" | "atualizadoEm" | "origem" | "confirmado"> =
  {
    nome: "",
    telefone: "",
    email: "",
    documento: "",
    endereco: "",
    observacoes: "",
  };

function Salvar({ novo }: { novo: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-13 items-center justify-center rounded-full bg-accent px-8 py-4 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white disabled:opacity-50"
    >
      {pending ? "Salvando..." : novo ? "Cadastrar cliente" : "Salvar ficha"}
    </button>
  );
}

export function ClienteForm({ cliente }: { cliente?: Cliente }) {
  const c = cliente ?? VAZIO;
  const [estado, acao] = useActionState<Resultado, FormData>(salvarCliente, {});

  return (
    <form action={acao}>
      {cliente && <input type="hidden" name="id" value={cliente.id} />}

      <Bloco
        indice="01"
        titulo="Contato"
        descricao="O telefone identifica a ficha: é por ele que a ordem de serviço encontra o cliente na hora de abrir, e é ele que evita cadastrar a mesma pessoa duas vezes."
      >
        <Campo rotulo="Nome" obrigatorio>
          <Entrada name="nome" defaultValue={c.nome} required />
        </Campo>

        <Campo rotulo="Telefone" nota="Com DDD" obrigatorio>
          <Entrada
            name="telefone"
            defaultValue={c.telefone}
            placeholder="(31) 90000-0000"
            inputMode="tel"
            required
            onChange={(e) => {
              e.currentTarget.value = mascararTelefone(e.currentTarget.value);
            }}
          />
        </Campo>

        <Campo rotulo="E-mail" nota="Opcional">
          <Entrada name="email" type="email" defaultValue={c.email} />
        </Campo>

        <Campo rotulo="CPF ou CNPJ" nota="Para a nota fiscal">
          <Entrada name="documento" defaultValue={c.documento} />
        </Campo>
      </Bloco>

      <Bloco indice="02" titulo="Outros dados">
        <Campo rotulo="Endereço" className="sm:col-span-2">
          <Entrada
            name="endereco"
            defaultValue={c.endereco}
            placeholder="Rua, número, bairro"
          />
        </Campo>

        <Campo
          rotulo="Observações"
          nota="Só a loja vê"
          className="sm:col-span-2"
        >
          <AreaTexto
            name="observacoes"
            rows={4}
            defaultValue={c.observacoes}
            placeholder="Empresa com 8 máquinas. Prefere retirar aos sábados."
          />
        </Campo>
      </Bloco>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Salvar novo={!cliente} />
        <Link
          href="/admin/clientes"
          className="flex h-13 items-center rounded-full bg-surface-2 px-7 py-4 font-mono text-[12px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
        >
          Cancelar
        </Link>
        {estado.erro && <p className="font-mono text-[11.5px] text-accent">{estado.erro}</p>}
      </div>
    </form>
  );
}
