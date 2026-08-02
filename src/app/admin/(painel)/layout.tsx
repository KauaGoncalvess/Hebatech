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
      <header className="sticky top-0 z-40 border-b border-line bg-ink">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 md:px-6">
          <Link href="/admin" className="flex items-center gap-4">
            <Logo compacto />
            <span className="hidden border-l border-line pl-4 font-mono text-[10px] tracking-[0.2em] text-accent uppercase sm:block">
              Painel
            </span>
          </Link>

          <nav className="flex items-center gap-px">
            {SECOES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="border border-line px-4 py-2 font-mono text-[10.5px] tracking-[0.14em] uppercase transition-colors hover:border-accent hover:text-accent"
              >
                {s.rotulo}
              </Link>
            ))}
            <Link
              href="/"
              target="_blank"
              className="hidden border border-line px-4 py-2 font-mono text-[10.5px] tracking-[0.14em] uppercase transition-colors hover:border-accent hover:text-accent md:block"
            >
              Ver site
            </Link>
            <SairButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px]">{children}</main>
    </>
  );
}
