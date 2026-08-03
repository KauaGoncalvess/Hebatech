import Link from "next/link";
import { Logo } from "@/components/logo";
import { SairButton } from "@/components/admin/sair-button";

const SECOES = [
  { href: "/admin/produtos", rotulo: "Produtos" },
  { href: "/admin/planos", rotulo: "Planos" },
];

/** Moldura das telas autenticadas do painel. A tela de login fica fora daqui. */
export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between gap-4 px-5">
          <Link href="/admin" className="flex items-center gap-4">
            <Logo compacto />
            <span className="hidden font-mono text-[10px] tracking-[0.2em] text-accent uppercase sm:block">
              Painel
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            {SECOES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[10.5px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
              >
                {s.rotulo}
              </Link>
            ))}
            <Link
              href="/"
              target="_blank"
              className="hidden rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[10.5px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3 md:block"
            >
              Ver site
            </Link>
            <SairButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 pb-20">{children}</main>
    </>
  );
}
