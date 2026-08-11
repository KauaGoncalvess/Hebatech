"use client";

import { useEffect, useState, useTransition } from "react";
import { procurarClientes, type ClienteAchado } from "@/app/admin/actions";

/**
 * Um campo só para o cliente: você digita o nome e ele já procura.
 *
 * Antes eram dois — "nome do cliente" e "já é cliente?" — e a pessoa no balcão
 * tinha que decidir em qual escrever antes de saber a resposta. Digitar é a
 * mesma ação nos dois casos; o que muda é só o que aparece embaixo.
 *
 * Procura por nome, telefone ou CPF, porque o atendente tem na mão o que tiver:
 * às vezes o cliente diz o nome, às vezes manda o número.
 *
 * Se nada aparecer, o que foi digitado vira o nome do cliente novo — nenhuma
 * ação extra é exigida para cadastrar quem chega pela primeira vez.
 */
export function CampoCliente({
  nome,
  aoDigitar,
  aoEscolher,
  vinculado,
  aoDesvincular,
}: {
  nome: string;
  aoDigitar: (valor: string) => void;
  aoEscolher: (c: ClienteAchado) => void;
  vinculado: string | null;
  aoDesvincular: () => void;
}) {
  const [resposta, setResposta] = useState<{
    termo: string;
    itens: ClienteAchado[];
  } | null>(null);
  const [procurando, iniciar] = useTransition();

  useEffect(() => {
    const busca = nome.trim();
    if (busca.length < 2 || vinculado) return;
    // Espera a digitação parar: uma consulta por tecla seria desperdício.
    const id = setTimeout(() => {
      iniciar(async () => {
        setResposta({ termo: busca, itens: await procurarClientes(busca) });
      });
    }, 350);
    return () => clearTimeout(id);
  }, [nome, vinculado]);

  /**
   * A resposta carrega o termo que a originou, então enquanto a pessoa digita
   * o resultado anterior some em vez de piscar uma lista desatualizada.
   */
  const atual =
    !vinculado && resposta?.termo === nome.trim() ? resposta.itens : null;
  const achados = atual ?? [];

  return (
    <div className="sm:col-span-2">
      <label className="block">
        <span className="flex items-baseline justify-between gap-3">
          <span className="eyebrow text-texto-3">
            Cliente<span className="text-accent"> *</span>
          </span>
          <span className="font-mono text-rotulo text-texto-3">
            {vinculado ? "Ficha vinculada" : "Digite nome, telefone ou CPF"}
          </span>
        </span>
        <input
          name="clienteNome"
          value={nome}
          onChange={(e) => aoDigitar(e.target.value)}
          autoComplete="off"
          required
          className="mt-2.5 w-full rounded-2xl bg-surface-2 px-4 py-3 font-mono text-nota transition-colors focus-visible:bg-surface-3"
        />
      </label>

      {vinculado ? (
        <p className="mt-2.5 flex flex-wrap items-center gap-3">
          <span className="font-mono text-rotulo text-accent">{vinculado}</span>
          <button
            type="button"
            onClick={aoDesvincular}
            className="font-mono text-rotulo tracking-[0.1em] text-texto-3 uppercase transition-colors hover:text-white"
          >
            Desvincular
          </button>
        </p>
      ) : procurando ? (
        <p className="mt-2.5 font-mono text-rotulo text-texto-3">Procurando…</p>
      ) : achados.length > 0 ? (
        <ul className="mt-2.5 grid gap-2">
          {achados.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  aoEscolher(c);
                  setResposta(null);
                }}
                className="flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface-2 p-3.5 text-left transition-colors hover:bg-surface-3"
              >
                <span className="min-w-0">
                  <span className="block font-mono text-nota text-white">
                    {c.nome}
                  </span>
                  <span className="mt-0.5 block font-mono text-rotulo text-texto-3">
                    {[c.telefone, c.documento].filter(Boolean).join(" · ")}
                  </span>
                  {c.ultimoAparelho && (
                    <span className="mt-1 block text-rotulo text-texto-3">
                      Último: {c.ultimoAparelho}
                    </span>
                  )}
                </span>
                <span className="shrink-0 rounded-full bg-accent px-3.5 py-2 font-mono text-rotulo font-bold tracking-[0.1em] text-black uppercase">
                  {c.ordens === 0
                    ? "Usar ficha"
                    : `${c.ordens} ${c.ordens === 1 ? "ordem" : "ordens"}`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : atual !== null ? (
        <p className="mt-2.5 font-mono text-rotulo text-texto-3">
          Cliente novo. A ficha é criada junto com a ordem.
        </p>
      ) : null}
    </div>
  );
}
