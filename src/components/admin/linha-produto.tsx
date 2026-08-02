"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { alternarDisponibilidade } from "@/app/admin/actions";
import { preco } from "@/lib/format";
import { rotuloCategoria, type Produto } from "@/types/produto";

export function LinhaProduto({ p }: { p: Produto }) {
  const [pendente, iniciar] = useTransition();

  return (
    <li
      className={`grid grid-cols-[64px_1fr_auto] items-center gap-4 border-b border-line px-4 py-3 transition-colors hover:bg-surface md:px-6 ${
        p.disponivel ? "" : "opacity-45"
      }`}
    >
      <div className="relative aspect-[4/3] border border-line bg-ink">
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
          <span className="flex h-full items-center justify-center font-mono text-[8px] tracking-[0.1em] text-white/25">
            SEM FOTO
          </span>
        )}
      </div>

      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 font-mono text-[9.5px] tracking-[0.16em] text-white/35 uppercase">
          {p.codigo}
          <span className="text-white/15">/</span>
          {rotuloCategoria(p.categoria)}
          {p.destaque && <span className="text-accent">· destaque</span>}
        </p>
        <p className="truncate font-mono text-[13px] text-white">
          {p.marca} {p.modelo}
        </p>
        <p className="mt-0.5 font-mono text-[12px] text-accent">{preco(p.preco)}</p>
      </div>

      <div className="flex items-center gap-px">
        <button
          type="button"
          disabled={pendente}
          onClick={() => iniciar(() => alternarDisponibilidade(p.id, !p.disponivel))}
          className="border border-line px-3 py-2 font-mono text-[9.5px] tracking-[0.12em] uppercase transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
        >
          {p.disponivel ? "Tirar do ar" : "Publicar"}
        </button>
        <Link
          href={`/admin/produtos/${p.id}`}
          className="border border-line px-3 py-2 font-mono text-[9.5px] tracking-[0.12em] uppercase transition-colors hover:border-accent hover:text-accent"
        >
          Editar
        </Link>
      </div>
    </li>
  );
}
