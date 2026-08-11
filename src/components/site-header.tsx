"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { navegacao, site } from "@/data/site";
import { waGenerico } from "@/lib/whatsapp";

/** Barra flutuante em pílula, no modelo da referência. */
export function SiteHeader() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  // Navegou, o menu fecha. Ajuste durante a renderização em vez de efeito, que
  // aqui provocaria um segundo render com o menu ainda aberto.
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

  const ativo = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 md:top-5 md:px-5">
      <div className="mx-auto flex max-w-[1180px] items-center gap-2 rounded-full border border-line bg-surface/85 p-1.5 pl-4 backdrop-blur-xl md:pl-5">
        <Link
          href="/"
          aria-label={`${site.nomeCompleto} — início`}
          className="mr-auto shrink-0 py-1"
        >
          <Logo compacto />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navegacao.map((item) => {
            const on = ativo(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={`rounded-full px-4 py-2.5 font-mono text-rotulo tracking-[0.1em] uppercase transition-colors ${
                  on
                    ? "bg-surface-3 text-white"
                    : "text-texto-3 hover:bg-surface-2 hover:text-white"
                }`}
              >
                {item.rotulo}
              </Link>
            );
          })}
        </nav>

        <span aria-hidden className="hidden h-6 w-px bg-line-strong lg:block" />

        <a
          href={waGenerico()}
          data-origem="topo"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-full bg-accent px-5 py-2.5 font-mono text-rotulo font-bold tracking-[0.1em] text-black uppercase transition-colors hover:bg-accent-hover lg:block"
        >
          Orçamento
        </a>

        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
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
          id="menu-mobile"
          className="mx-auto mt-2 max-w-[1180px] overflow-hidden rounded-[24px] border border-line bg-surface/95 p-2 backdrop-blur-xl lg:hidden"
        >
          {navegacao.map((item) => {
            const on = ativo(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-2xl px-4 py-4 transition-colors ${
                  on ? "bg-surface-3" : "hover:bg-surface-2"
                }`}
              >
                <span className={`display text-sub ${on ? "text-accent" : "text-white"}`}>
                  {item.rotulo}
                </span>
                <span aria-hidden className="font-mono text-texto-3">
                  →
                </span>
              </Link>
            );
          })}

          <a
            href={waGenerico()}
            data-origem="topo"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex h-14 items-center justify-center rounded-2xl bg-accent font-mono text-xs font-bold tracking-[0.14em] text-black uppercase"
          >
            Pedir orçamento
          </a>
        </div>
      )}
    </header>
  );
}
