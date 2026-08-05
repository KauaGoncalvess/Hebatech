"use client";

import { useEffect, useState, useTransition } from "react";
import { procurarClientes, type ClienteAchado } from "@/app/admin/actions";

/**
 * Busca de cliente no topo da abertura de ordem.
 *
 * Existe por um motivo prático: a mesma pessoa volta à loja várias vezes ao
 * longo dos anos, e redigitar nome e telefone toda vez além de dar trabalho
 * cria ficha duplicada — aí o histórico dela se parte em dois.
 *
 * Procura por nome, telefone ou documento porque o atendente tem na mão o que
 * tiver: às vezes o cliente fala o nome, às vezes manda o número.
 */
export function BuscaCliente({
  aoEscolher,
}: {
  aoEscolher: (c: ClienteAchado) => void;
}) {
  const [termo, setTermo] = useState("");
  const [resposta, setResposta] = useState<{
    termo: string;
    itens: ClienteAchado[];
  } | null>(null);
  const [procurando, iniciar] = useTransition();

  useEffect(() => {
    const busca = termo.trim();
    if (busca.length < 2) return;
    // Espera a digitação parar: uma consulta por tecla seria desperdício.
    const id = setTimeout(() => {
      iniciar(async () => {
        setResposta({ termo: busca, itens: await procurarClientes(busca) });
      });
    }, 350);
    return () => clearTimeout(id);
  }, [termo]);

  /**
   * A resposta carrega o termo que a originou. Assim, enquanto a pessoa
   * continua digitando, o resultado da busca anterior some em vez de piscar
   * uma lista que não corresponde mais ao que está escrito.
   */
  const atual = resposta?.termo === termo.trim() ? resposta.itens : null;
  const achados = atual ?? [];
  const procurou = atual !== null;

  return (
    <div className="sm:col-span-2">
      <label className="block">
        <span className="flex items-baseline justify-between gap-3">
          <span className="eyebrow text-white/55">Já é cliente?</span>
          <span className="font-mono text-[10px] text-white/45">
            Nome, telefone ou CPF
          </span>
        </span>
        <input
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          autoComplete="off"
          className="mt-2.5 w-full rounded-2xl bg-surface-2 px-4 py-3 font-mono text-[13.5px] transition-colors placeholder:text-white/40 focus-visible:bg-surface-3"
        />
      </label>

      {procurando && (
        <p className="mt-3 font-mono text-[11px] text-white/40">Procurando…</p>
      )}

      {achados.length > 0 && (
        <ul className="mt-3 grid gap-2">
          {achados.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  aoEscolher(c);
                  setTermo("");
                  setResposta(null);
                }}
                className="flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface-2 p-4 text-left transition-colors hover:bg-surface-3"
              >
                <span className="min-w-0">
                  <span className="block font-mono text-[13px] text-white">{c.nome}</span>
                  <span className="mt-0.5 block font-mono text-[11.5px] text-white/50">
                    {[c.telefone, c.documento].filter(Boolean).join(" · ")}
                  </span>
                  {c.ultimoAparelho && (
                    <span className="mt-1 block text-[12px] text-white/40">
                      Último: {c.ultimoAparelho}
                    </span>
                  )}
                </span>
                <span className="shrink-0 rounded-full bg-accent px-3.5 py-2 font-mono text-[9.5px] font-bold tracking-[0.1em] text-black uppercase">
                  {c.ordens === 0
                    ? "Usar ficha"
                    : `${c.ordens} ${c.ordens === 1 ? "ordem" : "ordens"}`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {procurou && !procurando && achados.length === 0 && (
        <p className="mt-3 font-mono text-[11px] text-white/40">
          Nenhuma ficha com isso. Preencha abaixo que a ficha nasce junto com a ordem.
        </p>
      )}
    </div>
  );
}
