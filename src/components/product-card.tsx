import Image from "next/image";
import Link from "next/link";
import { armazenamento, parcela, preco } from "@/lib/format";
import { GRAU_DESCRICAO, rotuloCategoria, type Produto } from "@/types/produto";
import { ProductRender } from "./product-render";

/**
 * Linhas do bloco denso — só entra o que o produto realmente tem.
 * `rotuloLargo` avisa que os rótulos vieram da ficha e precisam de mais coluna.
 */
function linhasTecnicas(p: Produto): { linhas: [string, string][]; rotuloLargo: boolean } {
  const linhas: [string, string][] = [];

  if (p.cpuNome) {
    linhas.push(["CPU", p.cpuNome.replace("Intel Core ", "").replace("AMD ", "")]);
  }
  if (p.ramGb) linhas.push(["RAM", `${p.ramGb} GB`]);
  if (p.armazenamentoGb) {
    linhas.push([
      "SSD",
      `${armazenamento(p.armazenamentoGb)}${p.armazenamentoTipo ? ` ${p.armazenamentoTipo}` : ""}`,
    ]);
  }
  if (p.telaPolegadas) {
    linhas.push(["TELA", `${p.telaPolegadas}"${p.telaResolucao ? ` ${p.telaResolucao}` : ""}`]);
  }
  if (p.bateriaSaude) linhas.push(["BAT", `${p.bateriaSaude}% de saúde`]);

  // Produto sem campo técnico (periférico, peça) usa as primeiras linhas da ficha.
  if (linhas.length === 0) {
    for (const item of p.ficha.slice(0, 4)) {
      linhas.push([item.rotulo.toUpperCase(), item.valor]);
    }
    return { linhas, rotuloLargo: true };
  }

  return { linhas: linhas.slice(0, 5), rotuloLargo: false };
}

export function ProductCard({ p, indice }: { p: Produto; indice: number }) {
  const { linhas, rotuloLargo } = linhasTecnicas(p);

  return (
    <Link
      href={`/produtos/${p.slug}`}
      className="group relative flex h-full flex-col border border-line bg-surface transition-colors duration-200 hover:border-line-strong"
    >
      <span className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />

      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
        <span className="truncate font-mono text-[10px] tracking-[0.18em] text-white/40">
          {String(indice).padStart(2, "0")} / {p.codigo}
        </span>
        {p.estadoGrau ? (
          <span
            title={GRAU_DESCRICAO[p.estadoGrau]}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent font-mono text-[10px] leading-none font-bold text-accent"
          >
            {p.estadoGrau}
          </span>
        ) : (
          <span className="shrink-0 border border-accent px-1.5 py-0.5 font-mono text-[9px] leading-none tracking-[0.1em] text-accent uppercase">
            Novo
          </span>
        )}
      </div>

      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-ink">
        {p.fotos[0] ? (
          <Image
            src={p.fotos[0]}
            alt={`${p.marca} ${p.modelo}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <ProductRender
            codigo={p.codigo}
            marca={p.marca}
            categoria={p.categoria}
            polegadas={p.telaPolegadas}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>

      <div className="px-3 pt-3 pb-2">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
          {p.marca}
          <span className="text-white/25">/</span>
          <span className="text-white/35">{rotuloCategoria(p.categoria)}</span>
        </p>
        <h3 className="display mt-1 text-[1.35rem] leading-[0.95]">{p.modelo}</h3>
      </div>

      {/* Densidade alta: especificação sempre visível, sem hover */}
      <dl
        className={`mt-auto grid border-t border-line ${
          rotuloLargo ? "grid-cols-[104px_1fr]" : "grid-cols-[46px_1fr]"
        }`}
      >
        {linhas.map(([k, v], i) => (
          <div key={k} className="contents">
            <dt
              className={`truncate border-line px-3 py-1.5 font-mono text-[9px] tracking-[0.16em] text-white/35 ${
                i ? "border-t" : ""
              }`}
            >
              {k}
            </dt>
            <dd
              className={`truncate border-l border-line px-3 py-1.5 font-mono text-[10.5px] text-white/80 ${
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
            {preco(p.preco)}
          </p>
          <p className="mt-1.5 font-mono text-[9.5px] tracking-[0.1em] text-white/40">
            ou 10x {parcela(p.preco)} sem juros
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
