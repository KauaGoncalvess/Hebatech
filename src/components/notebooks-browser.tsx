"use client";

import { useEffect, useMemo, useState } from "react";
import type { Notebook } from "@/data/notebooks";
import { armazenamento } from "@/lib/format";
import { ProductCard } from "./product-card";

type FaixaPreco = { id: string; rotulo: string; testar: (p: number) => boolean };

const FAIXAS: FaixaPreco[] = [
  { id: "a", rotulo: "Até R$ 1.800", testar: (p) => p < 1800 },
  { id: "b", rotulo: "R$ 1.800 a R$ 2.500", testar: (p) => p >= 1800 && p < 2500 },
  { id: "c", rotulo: "R$ 2.500 a R$ 3.000", testar: (p) => p >= 2500 && p < 3000 },
  { id: "d", rotulo: "Acima de R$ 3.000", testar: (p) => p >= 3000 },
];

const ORDENS = [
  { id: "preco-asc", rotulo: "Menor preço" },
  { id: "preco-desc", rotulo: "Maior preço" },
  { id: "ram-desc", rotulo: "Mais memória" },
] as const;

type OrdemId = (typeof ORDENS)[number]["id"];

type Estado = {
  cpu: string[];
  ram: number[];
  ssd: number[];
  faixa: string[];
};

const VAZIO: Estado = { cpu: [], ram: [], ssd: [], faixa: [] };

function alternar<T>(lista: T[], valor: T): T[] {
  return lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
}

export function NotebooksBrowser({ itens }: { itens: Notebook[] }) {
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

  const opcoes = useMemo(() => {
    const contar = <T extends string | number>(vals: T[]) => {
      const mapa = new Map<T, number>();
      for (const v of vals) mapa.set(v, (mapa.get(v) ?? 0) + 1);
      return [...mapa.entries()].sort((a, b) =>
        typeof a[0] === "number" ? (a[0] as number) - (b[0] as number) : String(a[0]).localeCompare(String(b[0])),
      );
    };
    return {
      cpu: contar(itens.map((n) => n.cpu.familia)),
      ram: contar(itens.map((n) => n.ramGb)),
      ssd: contar(itens.map((n) => n.armazenamentoGb)),
      faixa: FAIXAS.map(
        (f) => [f.id, itens.filter((n) => f.testar(n.preco)).length] as [string, number],
      ),
    };
  }, [itens]);

  const resultado = useMemo(() => {
    const filtrado = itens.filter((n) => {
      if (filtros.cpu.length && !filtros.cpu.includes(n.cpu.familia)) return false;
      if (filtros.ram.length && !filtros.ram.includes(n.ramGb)) return false;
      if (filtros.ssd.length && !filtros.ssd.includes(n.armazenamentoGb)) return false;
      if (filtros.faixa.length) {
        const bate = FAIXAS.some((f) => filtros.faixa.includes(f.id) && f.testar(n.preco));
        if (!bate) return false;
      }
      return true;
    });

    return filtrado.sort((a, b) => {
      if (ordem === "preco-desc") return b.preco - a.preco;
      if (ordem === "ram-desc") return b.ramGb - a.ramGb || a.preco - b.preco;
      return a.preco - b.preco;
    });
  }, [itens, filtros, ordem]);

  const ativos =
    filtros.cpu.length + filtros.ram.length + filtros.ssd.length + filtros.faixa.length;

  const painel = (
    <div className="divide-y divide-line">
      <Grupo titulo="Processador">
        {opcoes.cpu.map(([valor, qtd]) => (
          <Opcao
            key={valor}
            rotulo={String(valor)}
            quantidade={qtd}
            ativo={filtros.cpu.includes(String(valor))}
            onClick={() =>
              setFiltros((f) => ({ ...f, cpu: alternar(f.cpu, String(valor)) }))
            }
          />
        ))}
      </Grupo>

      <Grupo titulo="Memória">
        {opcoes.ram.map(([valor, qtd]) => (
          <Opcao
            key={valor}
            rotulo={`${valor} GB`}
            quantidade={qtd}
            ativo={filtros.ram.includes(Number(valor))}
            onClick={() =>
              setFiltros((f) => ({ ...f, ram: alternar(f.ram, Number(valor)) }))
            }
          />
        ))}
      </Grupo>

      <Grupo titulo="Armazenamento">
        {opcoes.ssd.map(([valor, qtd]) => (
          <Opcao
            key={valor}
            rotulo={armazenamento(Number(valor))}
            quantidade={qtd}
            ativo={filtros.ssd.includes(Number(valor))}
            onClick={() =>
              setFiltros((f) => ({ ...f, ssd: alternar(f.ssd, Number(valor)) }))
            }
          />
        ))}
      </Grupo>

      <Grupo titulo="Faixa de preço">
        {FAIXAS.map((f) => {
          const qtd = opcoes.faixa.find(([id]) => id === f.id)?.[1] ?? 0;
          return (
            <Opcao
              key={f.id}
              rotulo={f.rotulo}
              quantidade={qtd}
              ativo={filtros.faixa.includes(f.id)}
              onClick={() =>
                setFiltros((prev) => ({ ...prev, faixa: alternar(prev.faixa, f.id) }))
              }
            />
          );
        })}
      </Grupo>
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
            {String(itens.length).padStart(2, "0")} aparelhos
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
            <p className="display text-sub">Nenhum aparelho com esse filtro</p>
            <p className="mx-auto mt-4 max-w-[42ch] text-[13px] text-white/55">
              O estoque gira rápido e nem tudo fica anunciado. Diga a configuração que
              você procura no WhatsApp — costumamos ter algo chegando na semana.
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
            {resultado.map((n, i) => (
              <li key={n.codigo}>
                <ProductCard n={n} indice={i + 1} />
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
                Ver {resultado.length} aparelhos
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
    <section>
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
      className={`flex w-full items-center justify-between border-b border-line px-4 py-2.5 text-left transition-colors md:px-6 ${
        ativo ? "bg-surface-2" : "hover:bg-surface"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          aria-hidden
          className={`h-2.5 w-2.5 border transition-colors ${
            ativo ? "border-accent bg-accent" : "border-line-strong"
          }`}
        />
        <span
          className={`font-mono text-[11.5px] ${ativo ? "text-accent" : "text-white/80"}`}
        >
          {rotulo}
        </span>
      </span>
      <span className="font-mono text-[10px] text-white/25">{quantidade}</span>
    </button>
  );
}
