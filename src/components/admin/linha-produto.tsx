"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { alternarDisponibilidade } from "@/app/admin/actions";
import { preco } from "@/lib/format";
import { rotuloCategoria, type Produto } from "@/types/produto";

export function LinhaProduto({ p }: { p: Produto }) {
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  const alternar = () =>
    iniciar(async () => {
      const { erro } = await alternarDisponibilidade(p.id, !p.disponivel);
      setErro(erro ?? null);
    });

  return (
    /**
     * No celular a linha vira duas: miniatura e dados em cima, botões embaixo
     * ocupando a largura toda. Espremer as três colunas em 390px cortava o
     * modelo no meio — "Dell…" não diz qual notebook é.
     */
    <li
      className={`card grid grid-cols-[56px_1fr] items-center gap-x-3 gap-y-3 p-3.5 transition-colors hover:bg-surface-2 sm:grid-cols-[64px_1fr_auto] sm:gap-4 sm:p-4 ${
        p.disponivel ? "" : "opacity-45"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-2">
        {p.fotos[0] ? (
          <Image
            src={p.fotos[0]}
            alt=""
            fill
            sizes="64px"
            unoptimized
            className="object-cover"
          />
        ) : (
          <span className="flex h-full items-center justify-center font-mono text-rotulo tracking-[0.1em] text-texto-3">
            SEM FOTO
          </span>
        )}
      </div>

      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 font-mono text-rotulo tracking-[0.16em] text-texto-3 uppercase">
          {p.codigo}
          <span aria-hidden className="h-3 w-px bg-line-strong" />
          {rotuloCategoria(p.categoria)}
          {p.destaque && <span className="text-accent">· destaque</span>}
        </p>
        <p className="font-mono text-nota leading-snug text-white">
          {p.marca} {p.modelo}
        </p>
        <p className="mt-0.5 font-mono text-nota text-accent">{preco(p.preco)}</p>
      </div>

      <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
        <button
          type="button"
          disabled={pendente}
          onClick={alternar}
          className="flex-1 rounded-full bg-surface-2 px-4 py-2.5 font-mono text-rotulo tracking-[0.1em] uppercase transition-colors hover:bg-surface-3 disabled:opacity-40 sm:flex-none"
        >
          {p.disponivel ? "Tirar do ar" : "Publicar"}
        </button>
        <Link
          href={`/admin/produtos/${p.id}`}
          className="flex-1 rounded-full bg-accent px-4 py-2.5 text-center font-mono text-rotulo font-bold tracking-[0.1em] text-black uppercase transition-colors hover:bg-accent-hover sm:flex-none"
        >
          Editar
        </Link>
      </div>

      {erro && (
        <p role="alert" className="col-span-2 font-mono text-rotulo text-accent sm:col-span-3">
          Não deu para mudar: {erro}
        </p>
      )}
    </li>
  );
}
