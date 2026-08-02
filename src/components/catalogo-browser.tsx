"use client";

import { useEffect, useMemo, useState } from "react";
import { armazenamento, preco } from "@/lib/format";
import { CATEGORIAS, type CategoriaId, type Produto } from "@/types/produto";
import { ProductCard } from "./product-card";

type Faixa = { id: string; rotulo: string; min: number; max: number };

/**
 * Faixas de preço derivadas do próprio estoque, arredondadas para valor
 * redondo. Assim o filtro continua útil tanto para notebook de R$ 3.000
 * quanto para periférico de R$ 129.
 */
function faixasDePreco(itens: Produto[]): Faixa[] {
  if (itens.length < 4) return [];

  const precos = itens.map((p) => p.preco).sort((a, b) => a - b);
  const corte = (fracao: number) => {
    const bruto = precos[Math.floor(precos.length * fracao)];
    const passo = bruto >= 2000 ? 500 : bruto >= 500 ? 100 : 50;
    return Math.round(bruto / passo) * passo;
  };

  const limites = [...new Set([corte(0.25), corte(0.5), corte(0.75)])].filter(
    (v) => v > precos[0] && v <= precos[precos.length - 1],
  );

  if (limites.length === 0) return [];

  const faixas: Faixa[] = [];
  let anterior = 0;

  for (const limite of limites) {
    faixas.push({
      id: `ate-${limite}`,
      rotulo: anterior === 0 ? `Até ${preco(limite)}` : `${preco(anterior)} a ${preco(limite)}`,
      min: anterior,
      max: limite,
    });
    anterior = limite;
  }

  faixas.push({
    id: `acima-${anterior}`,
    rotulo: `Acima de ${preco(anterior)}`,
    min: anterior,
    max: Number.POSITIVE_INFINITY,
  });

  return faixas;
}

const ORDENS = [
  { id: "preco-asc", rotulo: "Menor preço" },
  { id: "preco-desc", rotulo: "Maior preço" },
  { id: "ram-desc", rotulo: "Mais memória" },
] as const;

type OrdemId = (typeof ORDENS)[number]["id"];

type Estado = {
  categoria: CategoriaId[];
  cpu: string[];
  ram: number[];
  ssd: number[];
  faixa: string[];
};

const VAZIO: Estado = { categoria: [], cpu: [], ram: [], ssd: [], faixa: [] };

function alternar<T>(lista: T[], valor: T): T[] {
  return lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
}

function contar<T extends string | number>(vals: (T | null)[]): [T, number][] {
  const mapa = new Map<T, number>();
  for (const v of vals) {
    if (v === null || v === undefined) continue;
    mapa.set(v, (mapa.get(v) ?? 0) + 1);
  }
  return [...mapa.entries()].sort((a, b) =>
    typeof a[0] === "number"
      ? (a[0] as number) - (b[0] as number)
      : String(a[0]).localeCompare(String(b[0]), "pt-BR"),
  );
}

type Props = {
  itens: Produto[];
  /** Mostra o grupo de categoria. Desligado na página só de notebooks. */
  filtrarCategoria?: boolean;
};

export function CatalogoBrowser({ itens, filtrarCategoria = false }: Props) {
  const [filtros, setFiltros] = useState<Estado>(VAZIO);
  const [ordem, setOrdem] = useState<OrdemId>("preco-asc");
  const [drawer, setDrawer] = useState(false);

  // Trava a rolagem do fundo enquanto a gaveta está aberta.
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const faixas = useMemo(() => faixasDePreco(itens), [itens]);

  const opcoes = useMemo(
    () => ({
      categoria: contar(itens.map((p) => p.categoria)),
      cpu: contar(itens.map((p) => p.cpuFamilia)),
      ram: contar(itens.map((p) => p.ramGb)),
      ssd: contar(itens.map((p) => p.armazenamentoGb)),
      faixa: faixas.map(
        (f) =>
          [f.id, itens.filter((p) => p.preco >= f.min && p.preco < f.max).length] as [
            string,
            number,
          ],
      ),
    }),
    [itens, faixas],
  );

  const resultado = useMemo(() => {
    const filtrado = itens.filter((p) => {
      if (filtros.categoria.length && !filtros.categoria.includes(p.categoria)) return false;
      if (filtros.cpu.length && !(p.cpuFamilia && filtros.cpu.includes(p.cpuFamilia))) return false;
      if (filtros.ram.length && !(p.ramGb && filtros.ram.includes(p.ramGb))) return false;
      if (
        filtros.ssd.length &&
        !(p.armazenamentoGb && filtros.ssd.includes(p.armazenamentoGb))
      ) {
        return false;
      }
      if (filtros.faixa.length) {
        const bate = faixas.some(
          (f) => filtros.faixa.includes(f.id) && p.preco >= f.min && p.preco < f.max,
        );
        if (!bate) return false;
      }
      return true;
    });

    return filtrado.sort((a, b) => {
      if (ordem === "preco-desc") return b.preco - a.preco;
      if (ordem === "ram-desc") return (b.ramGb ?? 0) - (a.ramGb ?? 0) || a.preco - b.preco;
      return a.preco - b.preco;
    });
  }, [itens, filtros, ordem, faixas]);

  const ativos =
    filtros.categoria.length +
    filtros.cpu.length +
    filtros.ram.length +
    filtros.ssd.length +
    filtros.faixa.length;

  const painel = (
    <div>
      {filtrarCategoria && opcoes.categoria.length > 1 && (
        <Grupo titulo="Categoria">
          {CATEGORIAS.filter((c) => opcoes.categoria.some(([id]) => id === c.id)).map((c) => (
            <Opcao
              key={c.id}
              rotulo={c.plural}
              quantidade={opcoes.categoria.find(([id]) => id === c.id)?.[1] ?? 0}
              ativo={filtros.categoria.includes(c.id)}
              onClick={() =>
                setFiltros((f) => ({ ...f, categoria: alternar(f.categoria, c.id) }))
              }
            />
          ))}
        </Grupo>
      )}

      {opcoes.cpu.length > 0 && (
        <Grupo titulo="Processador">
          {opcoes.cpu.map(([valor, qtd]) => (
            <Opcao
              key={valor}
              rotulo={valor}
              quantidade={qtd}
              ativo={filtros.cpu.includes(valor)}
              onClick={() => setFiltros((f) => ({ ...f, cpu: alternar(f.cpu, valor) }))}
            />
          ))}
        </Grupo>
      )}

      {opcoes.ram.length > 0 && (
        <Grupo titulo="Memória">
          {opcoes.ram.map(([valor, qtd]) => (
            <Opcao
              key={valor}
              rotulo={`${valor} GB`}
              quantidade={qtd}
              ativo={filtros.ram.includes(valor)}
              onClick={() => setFiltros((f) => ({ ...f, ram: alternar(f.ram, valor) }))}
            />
          ))}
        </Grupo>
      )}

      {opcoes.ssd.length > 0 && (
        <Grupo titulo="Armazenamento">
          {opcoes.ssd.map(([valor, qtd]) => (
            <Opcao
              key={valor}
              rotulo={armazenamento(valor)}
              quantidade={qtd}
              ativo={filtros.ssd.includes(valor)}
              onClick={() => setFiltros((f) => ({ ...f, ssd: alternar(f.ssd, valor) }))}
            />
          ))}
        </Grupo>
      )}

      {faixas.length > 0 && (
        <Grupo titulo="Faixa de preço">
          {faixas.map((f) => (
            <Opcao
              key={f.id}
              rotulo={f.rotulo}
              quantidade={opcoes.faixa.find(([id]) => id === f.id)?.[1] ?? 0}
              ativo={filtros.faixa.includes(f.id)}
              onClick={() =>
                setFiltros((prev) => ({ ...prev, faixa: alternar(prev.faixa, f.id) }))
              }
            />
          ))}
        </Grupo>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12">
      {/* Coluna de filtro — vira gaveta no celular */}
      <aside className="hidden lg:col-span-3 lg:block lg:border-r lg:border-line">
        <div className="sticky top-[65px]">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <p className="eyebrow text-white/40">Filtro</p>
            {ativos > 0 && (
              <button
                type="button"
                onClick={() => setFiltros(VAZIO)}
                className="font-mono text-[10px] tracking-[0.14em] text-accent uppercase"
              >
                Limpar ({ativos})
              </button>
            )}
          </div>
          {painel}
        </div>
      </aside>

      <div className="lg:col-span-9">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-6">
          <p className="font-mono text-[11px] tracking-[0.12em] text-white/50">
            <span className="text-accent">{String(resultado.length).padStart(2, "0")}</span>
            {" de "}
            {String(itens.length).padStart(2, "0")} itens
          </p>

          <div className="flex items-center gap-px">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="flex h-9 items-center gap-2 border border-line px-4 font-mono text-[10.5px] tracking-[0.14em] uppercase lg:hidden"
            >
              Filtrar
              {ativos > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent font-mono text-[9px] font-bold text-black">
                  {ativos}
                </span>
              )}
            </button>

            <label className="relative flex h-9 items-center border border-line">
              <span className="sr-only">Ordenar por</span>
              <select
                value={ordem}
                onChange={(e) => setOrdem(e.target.value as OrdemId)}
                className="h-full appearance-none bg-transparent pr-9 pl-3 font-mono text-[10.5px] tracking-[0.12em] uppercase focus:outline-none"
              >
                {ORDENS.map((o) => (
                  <option key={o.id} value={o.id} className="bg-ink">
                    {o.rotulo}
                  </option>
                ))}
              </select>
              <span
                aria-hidden
                className="pointer-events-none absolute right-3 font-mono text-[9px] text-accent"
              >
                ▼
              </span>
            </label>
          </div>
        </div>

        {resultado.length === 0 ? (
          <div className="px-4 py-20 text-center md:px-6">
            <p className="display text-sub">Nada com esse filtro</p>
            <p className="mx-auto mt-4 max-w-[42ch] text-[13px] text-white/55">
              O estoque gira rápido e nem tudo fica anunciado. Diga o que você procura no
              WhatsApp — costumamos ter algo chegando na semana.
            </p>
            <button
              type="button"
              onClick={() => setFiltros(VAZIO)}
              className="mt-6 border border-accent px-6 py-3 font-mono text-[11px] tracking-[0.16em] text-accent uppercase transition-colors hover:bg-accent hover:text-black"
            >
              Limpar filtro
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 xl:grid-cols-3">
            {resultado.map((p, i) => (
              <li key={p.id}>
                <ProductCard p={p} indice={i + 1} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Gaveta de filtro no celular */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex flex-col lg:hidden">
          <button
            type="button"
            aria-label="Fechar filtro"
            onClick={() => setDrawer(false)}
            className="flex-1 bg-black/70"
          />
          <div className="flex max-h-[82vh] flex-col border-t border-accent bg-ink">
            <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-4">
              <p className="eyebrow text-white/40">Filtro · {resultado.length} resultados</p>
              <div className="flex gap-4">
                {ativos > 0 && (
                  <button
                    type="button"
                    onClick={() => setFiltros(VAZIO)}
                    className="font-mono text-[10px] tracking-[0.14em] text-accent uppercase"
                  >
                    Limpar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDrawer(false)}
                  className="font-mono text-[10px] tracking-[0.14em] uppercase"
                >
                  Fechar
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">{painel}</div>
            <div className="shrink-0 border-t border-line p-4">
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="w-full bg-accent py-4 font-mono text-[11px] font-bold tracking-[0.16em] text-black uppercase"
              >
                Ver {resultado.length} {resultado.length === 1 ? "item" : "itens"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line last:border-b-0">
      <h3 className="eyebrow px-4 py-3 text-white/35 md:px-6">{titulo}</h3>
      <div className="border-t border-line">{children}</div>
    </section>
  );
}

function Opcao({
  rotulo,
  quantidade,
  ativo,
  onClick,
}: {
  rotulo: string;
  quantidade: number;
  ativo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`flex w-full items-center justify-between gap-3 border-b border-line px-4 py-2.5 text-left transition-colors last:border-b-0 md:px-6 ${
        ativo ? "bg-surface-2" : "hover:bg-surface"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          aria-hidden
          className={`h-2.5 w-2.5 shrink-0 border transition-colors ${
            ativo ? "border-accent bg-accent" : "border-line-strong"
          }`}
        />
        <span className={`font-mono text-[11.5px] ${ativo ? "text-accent" : "text-white/80"}`}>
          {rotulo}
        </span>
      </span>
      <span className="font-mono text-[10px] text-white/25">{quantidade}</span>
    </button>
  );
}
