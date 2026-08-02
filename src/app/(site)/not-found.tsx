import Link from "next/link";
import { navegacao } from "@/data/site";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[1600px]">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="px-4 py-16 md:px-6 md:py-24 lg:col-span-7 lg:border-r lg:border-line">
          <p className="eyebrow text-accent">Erro 404</p>
          <h1 className="display mt-5 text-title">
            Esta página
            <br />
            não existe
          </h1>
          <p className="mt-6 max-w-[46ch] text-[14px] text-white/60">
            O endereço pode ter mudado ou o aparelho que você procurava já foi vendido.
            O estoque gira rápido.
          </p>
        </div>

        <nav className="border-t border-line lg:col-span-5 lg:border-t-0">
          <p className="eyebrow border-b border-line px-4 py-3 text-white/35 md:px-6">
            Ir para
          </p>
          {navegacao.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between border-b border-line px-4 py-5 transition-colors hover:bg-surface hover:text-accent md:px-6"
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] text-white/30">{item.indice}</span>
                <span className="display text-[1.5rem] leading-none">{item.rotulo}</span>
              </span>
              <span aria-hidden className="font-mono">
                →
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
