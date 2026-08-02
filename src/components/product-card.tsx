import Image from "next/image";
import Link from "next/link";
import type { Notebook } from "@/data/notebooks";
import { armazenamento, parcela, preco } from "@/lib/format";
import { ProductRender } from "./product-render";

const GRAU_TEXTO: Record<string, string> = {
  A: "Estado A — mínimo sinal de uso",
  B: "Estado B — desgaste estético visível",
  C: "Estado C — marcas acentuadas",
};

export function ProductCard({ n, indice }: { n: Notebook; indice: number }) {
  const linhas: [string, string][] = [
    ["CPU", n.cpu.nome.replace("Intel Core ", "").replace("AMD ", "")],
    ["RAM", `${n.ramGb} GB ${n.ramTipo.split(" ")[0]}`],
    ["SSD", `${armazenamento(n.armazenamentoGb)} ${n.armazenamentoTipo.split(" ")[1] ?? ""}`],
    ["TELA", `${n.tela.polegadas}" ${n.tela.resolucao} ${n.tela.painel}`],
    ["BAT", `${n.bateria.saudePct}% de saúde`],
  ];

  return (
    <Link
      href={`/notebooks/${n.slug}`}
      className="group relative flex h-full flex-col border border-line bg-surface transition-colors duration-200 hover:border-line-strong"
    >
      {/* Filete de acento que corre no topo ao passar o mouse */}
      <span className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />

      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="font-mono text-[10px] tracking-[0.18em] text-white/40">
          {String(indice).padStart(2, "0")} / {n.codigo}
        </span>
        <span
          title={GRAU_TEXTO[n.estado.grau]}
          className="flex h-5 w-5 items-center justify-center rounded-full border border-accent font-mono text-[10px] leading-none font-bold text-accent"
        >
          {n.estado.grau}
        </span>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-ink">
        {n.fotos[0] ? (
          <Image
            src={n.fotos[0]}
            alt={`${n.marca} ${n.modelo}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <ProductRender
            codigo={n.codigo}
            marca={n.marca}
            polegadas={n.tela.polegadas}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>

      <div className="px-3 pt-3 pb-2">
        <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
          {n.marca}
        </p>
        <h3 className="display mt-1 text-[1.35rem] leading-[0.95]">{n.modelo}</h3>
      </div>

      {/* Densidade alta: especificação sempre visível, sem hover */}
      <dl className="mt-auto grid grid-cols-[46px_1fr] border-t border-line">
        {linhas.map(([k, v], i) => (
          <div key={k} className="contents">
            <dt
              className={`border-line px-3 py-1.5 font-mono text-[9px] tracking-[0.16em] text-white/35 ${
                i ? "border-t" : ""
              }`}
            >
              {k}
            </dt>
            <dd
              className={`border-l border-line px-3 py-1.5 font-mono text-[10.5px] text-white/80 ${
                i ? "border-t" : ""
              }`}
            >
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex items-end justify-between border-t border-line px-3 py-3">
        <div>
          <p className="font-mono text-xl leading-none font-bold tracking-tight">
            {preco(n.preco)}
          </p>
          <p className="mt-1.5 font-mono text-[9.5px] tracking-[0.1em] text-white/40">
            ou 10x {parcela(n.preco)} sem juros
          </p>
        </div>
        <span
          aria-hidden
          className="font-mono text-base text-white/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent"
        >
          →
        </span>
      </div>
    </Link>
  );
}
