import Image from "next/image";
import Link from "next/link";
import { parcela, preco } from "@/lib/format";
import { resumoTecnico, rotuloCategoria, type Produto } from "@/types/produto";
import { ProductRender } from "./product-render";

export function ProductCard({ p }: { p: Produto }) {
  const resumo = resumoTecnico(p);
  const detalhes = resumo.length ? resumo : p.ficha.slice(0, 2).map((f) => f.valor);

  return (
    <Link
      href={`/produtos/${p.slug}`}
      className="card flutua group flex h-full flex-col overflow-hidden hover:bg-surface-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink">
        {p.fotos[0] ? (
          <Image
            src={p.fotos[0]}
            alt={`${p.marca} ${p.modelo}`}
            fill
            sizes="(max-width: 640px) 86vw, (max-width: 1100px) 45vw, 30vw"
            className="flutua-fundo object-cover"
          />
        ) : (
          <ProductRender
            codigo={p.codigo}
            marca={p.marca}
            categoria={p.categoria}
            polegadas={p.telaPolegadas}
            className="flutua-fundo h-full w-full"
          />
        )}

        <span className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1.5 font-mono text-rotulo tracking-[0.12em] text-texto-2 uppercase backdrop-blur">
          {rotuloCategoria(p.categoria)}
        </span>

        {p.estadoGrau ? (
          <span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-accent font-mono text-rotulo font-bold text-black">
            {p.estadoGrau}
          </span>
        ) : (
          <span className="absolute top-3 right-3 rounded-full bg-accent px-3 py-1.5 font-mono text-rotulo font-bold tracking-[0.1em] text-black uppercase">
            Novo
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-rotulo tracking-[0.14em] text-accent uppercase">
          {p.marca}
        </p>
        <h3 className="display mt-2 text-[1.5rem] leading-[0.95]">{p.modelo}</h3>

        {detalhes.length > 0 && (
          <p className="mt-3 line-clamp-2 text-nota leading-relaxed text-texto-3">
            {detalhes.join(" · ")}
          </p>
        )}

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-5">
          <div>
            <p className="font-mono text-[1.35rem] leading-none font-bold">
              {preco(p.preco)}
            </p>
            <p className="mt-2 text-nota text-texto-3">
              ou 10x {parcela(p.preco)}
            </p>
          </div>
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-sm transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-black"
          >
            ↗
          </span>
        </div>
      </div>
    </Link>
  );
}
