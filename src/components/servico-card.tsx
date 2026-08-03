import Link from "next/link";
import type { Servico } from "@/data/servicos";
import { ServicoArt } from "./servico-art";

export function ServicoCard({ s }: { s: Servico }) {
  const conteudo = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden text-white">
        <ServicoArt area={s.area} className="h-full w-full" />
        <span className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-accent uppercase backdrop-blur">
          {s.etiqueta}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="display text-[1.6rem] leading-[0.95]">{s.titulo}</h3>
        <p className="mt-3 text-[14px] leading-relaxed text-white/55">{s.resumo}</p>

        <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
          {s.itens.map((item) => (
            <li key={item} className="flex gap-3 text-[13.5px] text-white/70">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>

        {s.href && (
          <span className="mt-6 inline-flex items-center gap-3 font-mono text-[11.5px] tracking-[0.12em] text-accent uppercase">
            Ver planos e valores
            <span aria-hidden>→</span>
          </span>
        )}
      </div>
    </>
  );

  const classe = "spot card flex h-full flex-col overflow-hidden";

  // Só o serviço que tem página própria vira link; o resto continua cartão.
  return s.href ? (
    <Link href={s.href} className={`${classe} transition-colors hover:bg-surface-2`}>
      {conteudo}
    </Link>
  ) : (
    <article className={classe}>{conteudo}</article>
  );
}
