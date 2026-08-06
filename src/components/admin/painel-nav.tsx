"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { SairButton } from "./sair-button";

const SECOES = [
  { href: "/admin/ordens", rotulo: "Ordens" },
  { href: "/admin/clientes", rotulo: "Clientes" },
  { href: "/admin/produtos", rotulo: "Produtos" },
  { href: "/admin/planos", rotulo: "Planos" },
  { href: "/admin/orcamentos", rotulo: "Orçamentos" },
];

/**
 * Barra do painel.
 *
 * Cinco seções mais "ver site" e "sair" não cabem numa linha de celular, e
 * deixar quebrar em três fileiras comia um terço da tela antes de qualquer
 * conteúdo. Abaixo de `lg` vira gaveta, no mesmo padrão do site público.
 */
export function PainelNav() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  // Navegou, a gaveta fecha. Ajuste na renderização em vez de efeito, que aqui
  // provocaria um segundo render com o menu ainda aberto.
  const [ultimaRota, setUltimaRota] = useState(pathname);
  if (pathname !== ultimaRota) {
    setUltimaRota(pathname);
    if (aberto) setAberto(false);
  }

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const ativo = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <Link href="/admin" className="flex shrink-0 items-center gap-3.5">
          <Logo compacto />
          <span className="hidden font-mono text-[10px] tracking-[0.2em] text-accent uppercase sm:block">
            Painel
          </span>
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex">
          {SECOES.map((s) => {
            const on = ativo(s.href);
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={on ? "page" : undefined}
                className={`rounded-full px-4 py-2.5 font-mono text-[10.5px] tracking-[0.12em] uppercase transition-colors ${
                  on
                    ? "bg-surface-3 text-white"
                    : "text-white/55 hover:bg-surface-2 hover:text-white"
                }`}
              >
                {s.rotulo}
              </Link>
            );
          })}
          <span aria-hidden className="mx-1 h-6 w-px bg-line-strong" />
          <Link
            href="/"
            target="_blank"
            className="rounded-full px-4 py-2.5 font-mono text-[10.5px] tracking-[0.12em] text-white/55 uppercase transition-colors hover:bg-surface-2 hover:text-white"
          >
            Ver site
          </Link>
          <SairButton />
        </nav>

        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="menu-painel"
          className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[6px] rounded-full bg-surface-2 transition-colors hover:bg-surface-3 lg:hidden"
        >
          <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
          <span
            aria-hidden
            className={`h-px w-4 bg-white transition-transform duration-200 ${
              aberto ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            aria-hidden
            className={`h-px w-4 bg-accent transition-transform duration-200 ${
              aberto ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {aberto && (
        <div
          id="menu-painel"
          className="border-t border-line px-3 pt-2 pb-3 lg:hidden"
        >
          {SECOES.map((s) => {
            const on = ativo(s.href);
            return (
              <Link
                key={s.href}
                href={s.href}
                className={`flex items-center justify-between rounded-2xl px-4 py-3.5 transition-colors ${
                  on ? "bg-surface-3" : "hover:bg-surface-2"
                }`}
              >
                <span
                  className={`font-mono text-[14px] tracking-[0.06em] ${
                    on ? "text-accent" : "text-white"
                  }`}
                >
                  {s.rotulo}
                </span>
                <span aria-hidden className="font-mono text-white/40">
                  →
                </span>
              </Link>
            );
          })}

          <div className="mt-2 flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-surface-2 font-mono text-[11px] tracking-[0.12em] uppercase"
            >
              Ver site
            </Link>
            <SairButton largo />
          </div>
        </div>
      )}
    </header>
  );
}
