"use client";

import Link from "next/link";
import { useActionState } from "react";
import { enviarCadastro, type EstadoCadastro } from "@/app/(site)/actions";
import { site } from "@/data/site";
import { waGenerico } from "@/lib/whatsapp";
import { mascararTelefone } from "@/types/cliente";

const CAMPO =
  "mt-2.5 w-full rounded-2xl bg-surface-2 px-4 py-3.5 font-mono text-[13.5px] transition-colors placeholder:text-white/45 focus-visible:bg-surface-3";

export function CadastroForm() {
  const [estado, acao, pendente] = useActionState<EstadoCadastro, FormData>(
    enviarCadastro,
    {},
  );

  if (estado.ok) {
    return (
      <div className="card mt-12 p-8 md:p-10">
        <p className="eyebrow text-accent">
          {estado.jaExiste ? "Você já é cadastrado" : "Cadastro feito"}
        </p>
        <h2 className="display mt-4 max-w-[22ch] text-sub">
          {estado.jaExiste
            ? "Já tínhamos a sua ficha aqui"
            : "Pronto. Da próxima vez é só chegar e deixar o aparelho"}
        </h2>
        <p className="mt-5 max-w-[52ch] text-[14.5px] leading-relaxed text-white/60">
          {estado.jaExiste
            ? "Esse telefone já tem ficha na loja, então não precisa fazer de novo. Se algum dado mudou, é só avisar no WhatsApp que a gente atualiza."
            : "Quando você trouxer o aparelho, a gente já tem seus dados e a ordem de serviço sai na hora. Nada de ditar nome e CPF no balcão."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={waGenerico("acabei de me cadastrar no site")}
            target="_blank"
            rel="noopener noreferrer"
            data-origem="cadastro-pronto"
            className="inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 font-mono text-[11.5px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
          >
            Falar com a loja
            <span aria-hidden>→</span>
          </a>
          <Link
            href="/assistencia"
            className="inline-flex items-center gap-3 rounded-full bg-surface-2 px-7 py-4 font-mono text-[11.5px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
          >
            Pedir um orçamento
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={acao} className="card mt-12 p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo rotulo="Nome completo" obrigatorio className="sm:col-span-2">
          <input name="nome" required autoComplete="name" className={CAMPO} />
        </Campo>

        <Campo rotulo="Telefone" nota="Com DDD" obrigatorio>
          <input
            name="telefone"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="(31) 90000-0000"
            className={CAMPO}
            onChange={(e) => {
              e.currentTarget.value = mascararTelefone(e.currentTarget.value);
            }}
          />
        </Campo>

        <Campo rotulo="CPF ou CNPJ" nota="Para a nota fiscal">
          <input name="documento" autoComplete="off" className={CAMPO} />
        </Campo>

        <Campo rotulo="E-mail" nota="Opcional">
          <input name="email" type="email" autoComplete="email" className={CAMPO} />
        </Campo>

        <Campo rotulo="Endereço" nota="Opcional">
          <input
            name="endereco"
            autoComplete="street-address"
            placeholder="Rua, número, bairro"
            className={CAMPO}
          />
        </Campo>

        <Campo
          rotulo="Algo que a gente deva saber"
          nota="Opcional"
          className="sm:col-span-2"
        >
          <textarea
            name="observacoes"
            rows={3}
            placeholder="Tenho 4 computadores na empresa. Prefiro ser atendido de manhã."
            className={`${CAMPO} resize-y leading-relaxed`}
          />
        </Campo>
      </div>

      {estado.erro && (
        <p role="alert" className="mt-5 font-mono text-[12px] text-accent">
          {estado.erro}
        </p>
      )}

      <button
        type="submit"
        disabled={pendente}
        className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-accent font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white disabled:opacity-50"
      >
        {pendente ? "Enviando…" : "Fazer meu cadastro"}
        {!pendente && <span aria-hidden>→</span>}
      </button>

      <p className="mt-4 text-center font-mono text-[11px] leading-relaxed text-white/55">
        Seus dados ficam só com a {site.nome}, para atender você.{" "}
        <Link href="/privacidade" className="text-accent underline underline-offset-4">
          Como tratamos seus dados
        </Link>
        .
      </p>
    </form>
  );
}

function Campo({
  rotulo,
  nota,
  obrigatorio,
  className = "",
  children,
}: {
  rotulo: string;
  nota?: string;
  obrigatorio?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="flex items-baseline justify-between gap-3">
        <span className="eyebrow text-white/55">
          {rotulo}
          {obrigatorio && <span className="text-accent"> *</span>}
        </span>
        {nota && <span className="font-mono text-[10px] text-white/45">{nota}</span>}
      </span>
      {children}
    </label>
  );
}
