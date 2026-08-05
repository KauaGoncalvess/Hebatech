"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { armazenamento, preco } from "@/lib/format";
import { semAcento } from "@/lib/slug";
import { waGenerico } from "@/lib/whatsapp";
import {
  CATEGORIAS,
  resumoTecnico,
  rotuloCategoria,
  type CategoriaId,
  type Produto,
} from "@/types/produto";
import { ProductCard } from "./product-card";

type Faixa = { id: string; rotulo: string; min: number; max: number };

/**
 * Faixas de preço derivadas do próprio estoque, arredondadas para valor
 * redondo. Continua útil tanto para notebook de R$ 3.000 quanto para
 * periférico de R$ 129.
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

/** Nome de cada filtro na barra de endereço. */
const CHAVES = {
  categoria: "cat",
  cpu: "cpu",
  ram: "ram",
  ssd: "ssd",
  faixa: "preco",
} as const;

const CHAVE_ORDEM = "ordem";
const CHAVE_BUSCA = "q";

function comoLista(valor: string | null): string[] {
  return valor ? valor.split(",").filter(Boolean) : [];
}

/** Texto onde a busca procura: o que a pessoa digitaria para achar o aparelho. */
function textoDoProduto(p: Produto): string {
  return semAcento(
    [
      p.marca,
      p.modelo,
      p.codigo,
      p.resumo,
      rotuloCategoria(p.categoria),
      p.cpuNome ?? "",
      ...resumoTecnico(p),
      ...p.ficha.map((f) => `${f.rotulo} ${f.valor}`),
    ].join(" "),
  );
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
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const abrirDrawer = useRef<HTMLButtonElement>(null);
  const painelDrawer = useRef<HTMLDivElement>(null);

  /**
   * O filtro mora na barra de endereço, não em estado local. Assim o link
   * filtrado pode ser mandado no WhatsApp, o botão voltar desfaz um passo de
   * cada vez e a listagem sobrevive a um F5.
   */
  const filtros: Estado = useMemo(
    () => ({
      categoria: comoLista(params.get(CHAVES.categoria)).filter((v): v is CategoriaId =>
        CATEGORIAS.some((c) => c.id === v),
      ),
      cpu: comoLista(params.get(CHAVES.cpu)),
      ram: comoLista(params.get(CHAVES.ram)).map(Number).filter(Number.isFinite),
      ssd: comoLista(params.get(CHAVES.ssd)).map(Number).filter(Number.isFinite),
      faixa: comoLista(params.get(CHAVES.faixa)),
    }),
    [params],
  );

  const ordemBruta = params.get(CHAVE_ORDEM);
  const ordem: OrdemId = ORDENS.some((o) => o.id === ordemBruta)
    ? (ordemBruta as OrdemId)
    : "preco-asc";

  const buscaUrl = params.get(CHAVE_BUSCA) ?? "";
  const [busca, setBusca] = useState(buscaUrl);

  // Voltar e avançar do navegador têm que mexer no campo também. Ajuste durante
  // a renderização, que é o jeito recomendado — efeito aqui causa render extra.
  const [ultimaBuscaUrl, setUltimaBuscaUrl] = useState(buscaUrl);
  if (buscaUrl !== ultimaBuscaUrl) {
    setUltimaBuscaUrl(buscaUrl);
    if (busca.trim() !== buscaUrl) setBusca(buscaUrl);
  }

  /**
   * Clique em filtro entra no histórico, para o voltar desfazer um de cada vez.
   * Digitação na busca substitui, senão cada pausa viraria um passo a desfazer.
   */
  const escrever = useCallback(
    (mudar: (p: URLSearchParams) => void, substituir = false) => {
      const p = new URLSearchParams(params.toString());
      mudar(p);
      const qs = p.toString();
      const destino = qs ? `${pathname}?${qs}` : pathname;
      if (substituir) router.replace(destino, { scroll: false });
      else router.push(destino, { scroll: false });
    },
    [params, pathname, router],
  );

  const alternarNaUrl = (chave: string, valor: string) =>
    escrever((p) => {
      const atual = comoLista(p.get(chave));
      const novo = atual.includes(valor)
        ? atual.filter((v) => v !== valor)
        : [...atual, valor];
      if (novo.length) p.set(chave, novo.join(","));
      else p.delete(chave);
    });

  const limpar = () =>
    escrever((p) => {
      for (const chave of Object.values(CHAVES)) p.delete(chave);
      p.delete(CHAVE_BUSCA);
    });

  // A busca filtra na hora e só encosta na URL quando a digitação para.
  useEffect(() => {
    const termo = busca.trim();
    if (termo === buscaUrl) return;
    const id = setTimeout(() => {
      escrever((p) => {
        if (termo) p.set(CHAVE_BUSCA, termo);
        else p.delete(CHAVE_BUSCA);
      }, true);
    }, 400);
    return () => clearTimeout(id);
  }, [busca, buscaUrl, escrever]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    if (!drawer) return;

    // Foco entra na gaveta e volta para o botão que a abriu.
    const devolverPara = abrirDrawer.current ?? (document.activeElement as HTMLElement | null);
    painelDrawer.current?.focus();

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
      if (e.key !== "Tab") return;
      const foco = painelDrawer.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!foco || foco.length === 0) return;
      const primeiro = foco[0];
      const ultimo = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
      devolverPara?.focus();
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

  const termos = useMemo(
    () => semAcento(busca.trim()).split(/\s+/).filter(Boolean),
    [busca],
  );

  const resultado = useMemo(() => {
    const filtrado = itens.filter((p) => {
      if (termos.length) {
        const alvo = textoDoProduto(p);
        if (!termos.every((t) => alvo.includes(t))) return false;
      }
      if (filtros.categoria.length && !filtros.categoria.includes(p.categoria)) return false;
      if (filtros.cpu.length && !(p.cpuFamilia && filtros.cpu.includes(p.cpuFamilia)))
        return false;
      if (filtros.ram.length && !(p.ramGb && filtros.ram.includes(p.ramGb))) return false;
      if (filtros.ssd.length && !(p.armazenamentoGb && filtros.ssd.includes(p.armazenamentoGb)))
        return false;
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
  }, [itens, filtros, ordem, faixas, termos]);

  const ativos =
    filtros.categoria.length +
    filtros.cpu.length +
    filtros.ram.length +
    filtros.ssd.length +
    filtros.faixa.length +
    (termos.length ? 1 : 0);

  const painel = (
    <div className="space-y-7">
      {filtrarCategoria && opcoes.categoria.length > 1 && (
        <Grupo titulo="Categoria">
          {CATEGORIAS.filter((c) => opcoes.categoria.some(([id]) => id === c.id)).map((c) => (
            <Chip
              key={c.id}
              rotulo={c.rotulo}
              quantidade={opcoes.categoria.find(([id]) => id === c.id)?.[1] ?? 0}
              ativo={filtros.categoria.includes(c.id)}
              onClick={() => alternarNaUrl(CHAVES.categoria, c.id)}
            />
          ))}
        </Grupo>
      )}

      {opcoes.cpu.length > 0 && (
        <Grupo titulo="Processador">
          {opcoes.cpu.map(([valor, qtd]) => (
            <Chip
              key={valor}
              rotulo={valor}
              quantidade={qtd}
              ativo={filtros.cpu.includes(valor)}
              onClick={() => alternarNaUrl(CHAVES.cpu, valor)}
            />
          ))}
        </Grupo>
      )}

      {opcoes.ram.length > 0 && (
        <Grupo titulo="Memória">
          {opcoes.ram.map(([valor, qtd]) => (
            <Chip
              key={valor}
              rotulo={`${valor} GB`}
              quantidade={qtd}
              ativo={filtros.ram.includes(valor)}
              onClick={() => alternarNaUrl(CHAVES.ram, String(valor))}
            />
          ))}
        </Grupo>
      )}

      {opcoes.ssd.length > 0 && (
        <Grupo titulo="Armazenamento">
          {opcoes.ssd.map(([valor, qtd]) => (
            <Chip
              key={valor}
              rotulo={armazenamento(valor)}
              quantidade={qtd}
              ativo={filtros.ssd.includes(valor)}
              onClick={() => alternarNaUrl(CHAVES.ssd, String(valor))}
            />
          ))}
        </Grupo>
      )}

      {faixas.length > 0 && (
        <Grupo titulo="Faixa de preço">
          {faixas.map((f) => (
            <Chip
              key={f.id}
              rotulo={f.rotulo}
              quantidade={opcoes.faixa.find(([id]) => id === f.id)?.[1] ?? 0}
              ativo={filtros.faixa.includes(f.id)}
              onClick={() => alternarNaUrl(CHAVES.faixa, f.id)}
            />
          ))}
        </Grupo>
      )}
    </div>
  );

  return (
    <div>
      {/* Barra de controle */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <label className="relative flex min-w-[240px] flex-1 items-center sm:max-w-[320px]">
          <span className="sr-only">Buscar no catálogo</span>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por marca, modelo ou peça"
            className="w-full rounded-full bg-surface-2 py-3 pr-5 pl-11 font-mono text-[12px] transition-colors placeholder:text-white/55 hover:bg-surface-3 focus-visible:bg-surface-3"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 font-mono text-[13px] text-accent"
          >
            ⌕
          </span>
        </label>

        <p className="font-mono text-[12px] text-white/50">
          <span className="text-accent">{resultado.length}</span> de {itens.length} itens
        </p>

        <div className="flex items-center gap-2">
          <button
            ref={abrirDrawer}
            type="button"
            onClick={() => setDrawer(true)}
            aria-haspopup="dialog"
            aria-expanded={drawer}
            className="flex items-center gap-2 rounded-full bg-surface-2 px-5 py-3 font-mono text-[11.5px] tracking-[0.1em] uppercase transition-colors hover:bg-surface-3 lg:hidden"
          >
            Filtrar
            {ativos > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent font-mono text-[10px] font-bold text-black">
                {ativos}
              </span>
            )}
          </button>

          <label className="relative flex items-center">
            <span className="sr-only">Ordenar por</span>
            <select
              value={ordem}
              onChange={(e) =>
              escrever((p) => {
                if (e.target.value === "preco-asc") p.delete(CHAVE_ORDEM);
                else p.set(CHAVE_ORDEM, e.target.value);
              })
            }
              className="appearance-none rounded-full bg-surface-2 py-3 pr-10 pl-5 font-mono text-[11.5px] tracking-[0.1em] uppercase transition-colors hover:bg-surface-3"
            >
              {ORDENS.map((o) => (
                <option key={o.id} value={o.id} className="bg-surface">
                  {o.rotulo}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 font-mono text-[9px] text-accent"
            >
              ▼
            </span>
          </label>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="mb-6 flex items-center justify-between">
              <p className="eyebrow text-white/50">Filtro</p>
              {ativos > 0 && (
                <button
                  type="button"
                  onClick={limpar}
                  className="font-mono text-[11px] text-accent"
                >
                  Limpar
                </button>
              )}
            </div>
            {painel}
          </div>
        </aside>

        <div>
          {resultado.length === 0 ? (
            /**
             * Três vazios diferentes, e confundir os três fica ruim: "nada com
             * esse filtro" numa vitrine sem nenhum produto faz o visitante
             * procurar um filtro que não existe.
             */
            <div className="card px-6 py-20 text-center">
              <p className="display text-sub">
                {itens.length === 0
                  ? "Vitrine em renovação"
                  : termos.length
                    ? `Nada para "${busca.trim()}"`
                    : "Nada com esse filtro"}
              </p>
              <p className="mx-auto mt-4 max-w-[44ch] text-[14px] text-white/55">
                {itens.length === 0
                  ? "Estamos atualizando os aparelhos anunciados. O estoque da loja continua o mesmo — diga o que você procura no WhatsApp que a gente confere na hora."
                  : "O estoque gira rápido e nem tudo fica anunciado. Diga o que você procura no WhatsApp — costumamos ter algo chegando na semana."}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <a
                  href={waGenerico(
                    termos.length
                      ? `procuro ${busca.trim()} e não achei no site`
                      : "procuro um equipamento que não achei no site",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-origem="vitrine-vazia"
                  className="rounded-full bg-accent px-7 py-3.5 font-mono text-[11.5px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
                >
                  Perguntar no WhatsApp
                </a>
                {ativos > 0 && (
                  <button
                    type="button"
                    onClick={limpar}
                    className="rounded-full bg-surface-2 px-7 py-3.5 font-mono text-[11.5px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
                  >
                    Limpar filtro
                  </button>
                )}
              </div>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {resultado.map((p) => (
                <li key={p.id}>
                  <ProductCard p={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Gaveta de filtro no celular */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <button
            type="button"
            aria-label="Fechar filtro"
            onClick={() => setDrawer(false)}
            className="flex-1 bg-black/70 backdrop-blur-sm"
          />
          <div
            ref={painelDrawer}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-filtro"
            tabIndex={-1}
            className="flex max-h-[82vh] flex-col rounded-t-[28px] border border-line bg-surface outline-none"
          >
            <div className="flex shrink-0 items-center justify-between px-6 py-5">
              <p id="titulo-filtro" className="eyebrow text-white/55">
                Filtro · {resultado.length} itens
              </p>
              <div className="flex gap-5">
                {ativos > 0 && (
                  <button
                    type="button"
                    onClick={limpar}
                    className="font-mono text-[11px] text-accent"
                  >
                    Limpar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDrawer(false)}
                  className="font-mono text-[11px] text-white/60"
                >
                  Fechar
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-4">{painel}</div>
            <div className="shrink-0 p-4">
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="w-full rounded-full bg-accent py-4 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase"
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
    <section>
      <h3 className="eyebrow mb-3 text-white/50">{titulo}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function Chip({
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
      className={`flex items-center gap-2 rounded-full px-4 py-2.5 font-mono text-[11.5px] transition-colors ${
        ativo
          ? "bg-accent text-black"
          : "bg-surface-2 text-white/70 hover:bg-surface-3 hover:text-white"
      }`}
    >
      {rotulo}
      <span className={ativo ? "text-black/50" : "text-white/45"}>{quantidade}</span>
    </button>
  );
}
