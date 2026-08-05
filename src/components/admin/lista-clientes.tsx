"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { confirmarCliente } from "@/app/admin/actions";
import { semAcento } from "@/lib/slug";
import { digitosDoTelefone, type Cliente } from "@/types/cliente";

const quando = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

/**
 * Lista com busca por nome, telefone ou documento.
 *
 * Filtra no navegador, sobre a lista que já veio: a loja tem centenas de
 * clientes, não milhões, e o resultado a cada tecla vale mais que economizar
 * uma consulta. Se um dia passar disso, a busca vai para o servidor.
 */
export function ListaClientes({ clientes }: { clientes: Cliente[] }) {
  const [busca, setBusca] = useState("");

  const resultado = useMemo(() => {
    const termo = semAcento(busca.trim());
    if (!termo) return clientes;
    const digitos = digitosDoTelefone(busca);

    return clientes.filter((c) => {
      if (semAcento(c.nome).includes(termo)) return true;
      if (semAcento(c.documento).includes(termo)) return true;
      if (digitos.length >= 3 && digitosDoTelefone(c.telefone).includes(digitos)) {
        return true;
      }
      return false;
    });
  }, [clientes, busca]);

  const porConferir = resultado.filter((c) => !c.confirmado);
  const conferidos = resultado.filter((c) => c.confirmado);

  return (
    <>
      <input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        autoComplete="off"
        placeholder="Buscar por nome, telefone ou CPF"
        aria-label="Buscar cliente"
        className="mb-6 w-full rounded-2xl bg-surface-2 px-5 py-4 font-mono text-[13.5px] transition-colors placeholder:text-white/40 focus-visible:bg-surface-3"
      />

      {resultado.length === 0 ? (
        <p className="card px-6 py-16 text-center text-[13.5px] text-white/50">
          {busca.trim()
            ? `Nenhuma ficha para "${busca.trim()}".`
            : "Nenhum cliente cadastrado ainda."}
        </p>
      ) : (
        <>
          {porConferir.length > 0 && (
            <>
              <p className="eyebrow mb-4 text-accent">
                Vieram do site, por conferir · {porConferir.length}
              </p>
              <ul className="mb-10 grid gap-3">
                {porConferir.map((c) => (
                  <Linha key={c.id} c={c} />
                ))}
              </ul>
            </>
          )}

          <p className="eyebrow mb-4 text-white/35">Clientes · {conferidos.length}</p>
          <ul className="grid gap-3">
            {conferidos.map((c) => (
              <Linha key={c.id} c={c} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function Linha({ c }: { c: Cliente }) {
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  const confirmar = () =>
    iniciar(async () => {
      const { erro } = await confirmarCliente(c.id);
      setErro(erro ?? null);
    });

  return (
    <li className="card flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-surface-2">
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 font-mono text-[9.5px] tracking-[0.16em] text-white/35 uppercase">
          desde {quando.format(new Date(c.criadoEm))}
          {c.origem === "site" && <span className="text-accent">· pelo site</span>}
        </p>
        <p className="mt-1 font-mono text-[13px] text-white">{c.nome}</p>
        <p className="mt-0.5 font-mono text-[12px] text-white/55">
          {[c.telefone, c.documento, c.email].filter(Boolean).join(" · ")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!c.confirmado && (
          <button
            type="button"
            disabled={pendente}
            onClick={confirmar}
            className="rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[9.5px] tracking-[0.1em] uppercase transition-colors hover:bg-surface-3 disabled:opacity-40"
          >
            Conferido
          </button>
        )}
        <Link
          href={`/admin/clientes/${c.id}`}
          className="rounded-full bg-accent px-4 py-2.5 font-mono text-[9.5px] font-bold tracking-[0.1em] text-black uppercase transition-colors hover:bg-white"
        >
          Abrir ficha
        </Link>
      </div>

      {erro && (
        <p role="alert" className="w-full font-mono text-[11px] text-accent">
          Não deu para salvar: {erro}
        </p>
      )}
    </li>
  );
}
