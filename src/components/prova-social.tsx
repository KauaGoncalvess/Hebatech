import Image from "next/image";
import { avaliacoes, empresas, fotosDaLoja } from "@/data/provas";
import { SectionHead } from "./section-head";

/**
 * Prova de que a loja existe e atende: foto real, avaliação de cliente e
 * empresa atendida. Cada bloco só aparece se tiver conteúdo — nada aqui é
 * inventado, e enquanto a loja não mandar material a seção inteira some.
 */
export function ProvaSocial() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-20 md:py-28">
      <SectionHead
        etiqueta="Quem já passou por aqui"
        titulo="Loja de verdade, cliente de verdade"
      />

      {fotosDaLoja.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fotosDaLoja.map((f) => (
            <li key={f.src} className="card relative aspect-[4/3] overflow-hidden">
              <Image
                src={f.src}
                alt={f.alt}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1100px) 45vw, 31vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      )}

      {avaliacoes.length > 0 && (
        <ul
          className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
            fotosDaLoja.length > 0 ? "mt-4" : ""
          }`}
        >
          {avaliacoes.map((a) => (
            <li key={`${a.nome}-${a.texto.slice(0, 20)}`} className="spot card flex flex-col p-6">
              <p className="font-mono text-[13px] tracking-[0.14em] text-accent">
                {"★".repeat(Math.round(a.nota))}
                <span className="text-white/25">{"★".repeat(5 - Math.round(a.nota))}</span>
              </p>
              <p className="mt-5 flex-1 text-[14px] leading-relaxed text-white/70">
                “{a.texto}”
              </p>
              <p className="mt-6 font-mono text-[11.5px] tracking-[0.1em] text-white/55 uppercase">
                {a.nome} · {a.origem}
              </p>
            </li>
          ))}
        </ul>
      )}

      {empresas.length > 0 && (
        <div className="card mt-4 p-6 md:p-8">
          <p className="eyebrow text-white/50">Empresas que atendemos</p>
          <ul className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6">
            {empresas.map((e) =>
              e.logo ? (
                <li key={e.nome}>
                  <Image
                    src={e.logo}
                    alt={e.nome}
                    width={140}
                    height={44}
                    className="h-8 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  />
                </li>
              ) : (
                <li
                  key={e.nome}
                  className="font-mono text-[13px] tracking-[0.08em] text-white/60 uppercase"
                >
                  {e.nome}
                </li>
              ),
            )}
          </ul>
        </div>
      )}
    </section>
  );
}
