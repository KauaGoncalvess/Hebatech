import Link from "next/link";
import { navegacao } from "@/data/site";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 pt-32 pb-20 md:pt-40 md:pb-28">
      <p className="eyebrow text-accent">Erro 404</p>
      <h1 className="display mt-5 max-w-[12ch] text-title">Esta página não existe</h1>
      <p className="mt-6 max-w-[48ch] text-[15px] leading-relaxed text-white/60">
        O endereço pode ter mudado ou o produto que você procurava já foi vendido. O
        estoque gira rápido.
      </p>

      <nav className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {navegacao.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="spot card group flex items-center justify-between p-5 transition-colors hover:bg-surface-2"
          >
            <span className="display text-[1.4rem] leading-none">{item.rotulo}</span>
            <span
              aria-hidden
              className="font-mono text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-accent"
            >
              →
            </span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
