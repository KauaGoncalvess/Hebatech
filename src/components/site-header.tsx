"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { navegacao, site } from "@/data/site";
import { waGenerico } from "@/lib/whatsapp";

export function SiteHeader() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    setAberto(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const ativo = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between pr-4 pl-4 md:pr-0 md:pl-6">
        <Link href="/" aria-label={`${site.nomeCompleto} — início`}>
          <Logo />
        </Link>

        <nav className="hidden items-stretch self-stretch md:flex">
          {navegacao.map((item) => {
            const on = ativo(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={`group relative flex items-center gap-2 border-l border-line px-5 transition-colors ${
                  on ? "bg-surface-2" : "hover:bg-surface"
                }`}
              >
                <span
                  className={`font-mono text-[10px] leading-none ${
                    on ? "text-accent" : "text-white/30"
                  }`}
                >
                  {item.indice}
                </span>
                <span className="font-mono text-[11px] tracking-[0.14em] uppercase">
                  {item.rotulo}
                </span>
                <span
                  className={`absolute inset-x-0 bottom-0 h-px bg-accent transition-transform duration-200 ${
                    on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}

          <a
            href={waGenerico()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center border-l border-accent bg-accent px-6 font-mono text-[11px] font-bold tracking-[0.14em] text-black uppercase transition-colors hover:bg-white"
          >
            WhatsApp
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          className="-mr-1 flex h-11 w-11 flex-col items-center justify-center gap-[7px] border border-line md:hidden"
        >
          <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
          <span
            aria-hidden
            className={`h-px w-5 bg-white transition-transform duration-200 ${
              aberto ? "translate-y-1 rotate-45" : ""
            }`}
          />
          <span
            aria-hidden
            className={`h-px w-5 bg-accent transition-transform duration-200 ${
              aberto ? "-translate-y-1 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {aberto && (
        <div
          id="menu-mobile"
          className="fixed inset-x-0 top-[65px] bottom-0 z-50 flex flex-col border-t border-line bg-ink md:hidden"
        >
          {navegacao.map((item) => {
            const on = ativo(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-baseline gap-4 border-b border-line px-4 py-6"
              >
                <span
                  className={`font-mono text-[11px] ${on ? "text-accent" : "text-white/30"}`}
                >
                  {item.indice}
                </span>
                <span
                  className={`display text-sub ${on ? "text-accent" : "text-white"}`}
                >
                  {item.rotulo}
                </span>
              </Link>
            );
          })}

          <dl className="grid grid-cols-2">
            {[
              ["Endereço", `${site.endereco.logradouro}, ${site.endereco.bairro}`],
              ["Cidade", `${site.endereco.cidade}/${site.endereco.uf}`],
              ["Fixo", site.telefoneFixo],
              ["Seg a sex", site.horario[0].faixa],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`border-b border-line px-4 py-3 ${i % 2 === 0 ? "border-r" : ""}`}
              >
                <dt className="eyebrow text-white/30">{k}</dt>
                <dd className="mt-1.5 font-mono text-[11px] text-white/75">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto border-t border-line p-4">
            <a
              href={waGenerico()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center justify-center bg-accent font-mono text-xs font-bold tracking-[0.16em] text-black uppercase"
            >
              Falar no WhatsApp
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block font-mono text-[10px] tracking-[0.14em] text-white/40 uppercase"
            >
              {site.instagramHandle}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
