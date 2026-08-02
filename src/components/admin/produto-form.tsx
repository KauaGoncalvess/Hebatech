"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { salvarProduto, type Resultado } from "@/app/admin/actions";
import { gerarSlug } from "@/lib/slug";
import { CATEGORIAS, GRAUS, type Produto } from "@/types/produto";
import { AreaTexto, Bloco, Campo, Entrada, Selecao } from "./campo";
import { UploadFotos } from "./upload-fotos";

const VAZIO: Omit<Produto, "id"> = {
  codigo: "",
  slug: "",
  categoria: "notebook",
  marca: "",
  modelo: "",
  condicao: "seminovo",
  preco: 0,
  precoReferencia: null,
  destaque: false,
  disponivel: true,
  resumo: "",
  cpuFamilia: null,
  cpuNome: null,
  ramGb: null,
  armazenamentoGb: null,
  armazenamentoTipo: null,
  telaPolegadas: null,
  telaResolucao: null,
  bateriaSaude: null,
  pesoKg: null,
  ficha: [],
  estadoGrau: null,
  estadoObservacoes: [],
  garantiaDias: 90,
  fotos: [],
  ordem: 0,
};

function Salvar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-12 items-center justify-center bg-accent px-8 font-mono text-[11.5px] font-bold tracking-[0.16em] text-black uppercase transition-colors hover:bg-white disabled:opacity-50"
    >
      {pending ? "Salvando..." : "Salvar produto"}
    </button>
  );
}

export function ProdutoForm({ produto }: { produto?: Produto }) {
  const p = produto ?? VAZIO;
  const [estado, acao] = useActionState<Resultado, FormData>(salvarProduto, {});

  const [categoria, setCategoria] = useState(p.categoria);
  const [marca, setMarca] = useState(p.marca);
  const [modelo, setModelo] = useState(p.modelo);
  const [slug, setSlug] = useState(p.slug);
  const [codigo, setCodigo] = useState(p.codigo);
  const [condicao, setCondicao] = useState(p.condicao);

  const ehNotebook = categoria === "notebook" || categoria === "desktop";
  const slugSugerido = slug || gerarSlug(`${marca} ${modelo}`);

  return (
    <form action={acao}>
      {produto && <input type="hidden" name="id" value={produto.id} />}

      <Bloco indice="01" titulo="Identificação">
        <Campo rotulo="Categoria" obrigatorio>
          <Selecao
            name="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as Produto["categoria"])}
          >
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id} className="bg-ink">
                {c.rotulo}
              </option>
            ))}
          </Selecao>
        </Campo>

        <Campo rotulo="Condição" obrigatorio>
          <Selecao
            name="condicao"
            value={condicao}
            onChange={(e) => setCondicao(e.target.value as Produto["condicao"])}
          >
            <option value="seminovo" className="bg-ink">
              Seminovo
            </option>
            <option value="novo" className="bg-ink">
              Novo
            </option>
          </Selecao>
        </Campo>

        <Campo rotulo="Marca" obrigatorio>
          <Entrada
            name="marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder="Dell, Lenovo, HP, Acer..."
            required
          />
        </Campo>

        <Campo rotulo="Modelo" obrigatorio>
          <Entrada
            name="modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            placeholder="Latitude 5490"
            required
          />
        </Campo>

        <Campo rotulo="Código" nota="Único, aparece no WhatsApp" obrigatorio>
          <Entrada
            name="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="HT-L5490"
            required
          />
        </Campo>

        <Campo rotulo="Endereço da página" nota="Deixe vazio para gerar sozinho">
          <Entrada
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={slugSugerido}
          />
          <span className="mt-2 block font-mono text-[10px] text-white/30">
            /produtos/{slugSugerido || "..."}
          </span>
        </Campo>

        <Campo
          rotulo="Resumo"
          nota="Uma ou duas frases, tom técnico"
          className="sm:col-span-2"
        >
          <AreaTexto
            name="resumo"
            defaultValue={p.resumo}
            rows={2}
            placeholder="Chassi sem trincas, tela sem pixel morto, dobradiças firmes."
          />
        </Campo>
      </Bloco>

      <Bloco indice="02" titulo="Preço e exibição">
        <Campo rotulo="Preço de venda (R$)" obrigatorio>
          <Entrada
            name="preco"
            type="number"
            min={0}
            step={1}
            defaultValue={p.preco || ""}
            placeholder="1590"
            required
          />
        </Campo>

        <Campo rotulo="Preço de referência (R$)" nota="Aparece riscado. Opcional">
          <Entrada
            name="precoReferencia"
            type="number"
            min={0}
            step={1}
            defaultValue={p.precoReferencia ?? ""}
            placeholder="1890"
          />
        </Campo>

        <Campo rotulo="Garantia (dias)">
          <Entrada name="garantiaDias" type="number" min={0} defaultValue={p.garantiaDias} />
        </Campo>

        <Campo rotulo="Ordem na lista" nota="Menor aparece primeiro">
          <Entrada name="ordem" type="number" defaultValue={p.ordem} />
        </Campo>

        <div className="flex flex-col gap-3 sm:col-span-2">
          <Interruptor
            name="disponivel"
            padrao={p.disponivel}
            titulo="À venda"
            texto="Desligue quando vender. O produto some das listas na hora."
          />
          <Interruptor
            name="destaque"
            padrao={p.destaque}
            titulo="Destacar na home"
            texto="Entra no trilho da página inicial."
          />
        </div>
      </Bloco>

      <Bloco
        indice="03"
        titulo="Fotos"
        descricao="Sem foto, o site desenha automaticamente um render técnico do produto. Assim que você subir a primeira imagem, ela assume o lugar."
      >
        <UploadFotos codigo={codigo} iniciais={p.fotos} />
      </Bloco>

      {ehNotebook && (
        <Bloco
          indice="04"
          titulo="Campos técnicos"
          descricao="Alimentam os filtros do catálogo e o resumo do card. Deixe vazio o que não se aplica."
        >
          <Campo rotulo="Família do processador" nota="Filtro: i3, i5, i7, Ryzen 5">
            <Entrada name="cpuFamilia" defaultValue={p.cpuFamilia ?? ""} placeholder="i5" />
          </Campo>
          <Campo rotulo="Processador completo">
            <Entrada
              name="cpuNome"
              defaultValue={p.cpuNome ?? ""}
              placeholder="Intel Core i5-8350U"
            />
          </Campo>
          <Campo rotulo="Memória (GB)">
            <Entrada name="ramGb" type="number" min={0} defaultValue={p.ramGb ?? ""} placeholder="8" />
          </Campo>
          <Campo rotulo="Armazenamento (GB)">
            <Entrada
              name="armazenamentoGb"
              type="number"
              min={0}
              defaultValue={p.armazenamentoGb ?? ""}
              placeholder="256"
            />
          </Campo>
          <Campo rotulo="Tipo de disco">
            <Entrada
              name="armazenamentoTipo"
              defaultValue={p.armazenamentoTipo ?? ""}
              placeholder="NVMe"
            />
          </Campo>
          <Campo rotulo="Tela (polegadas)">
            <Entrada
              name="telaPolegadas"
              type="number"
              step="0.1"
              min={0}
              defaultValue={p.telaPolegadas ?? ""}
              placeholder="14"
            />
          </Campo>
          <Campo rotulo="Resolução">
            <Entrada
              name="telaResolucao"
              defaultValue={p.telaResolucao ?? ""}
              placeholder="1920 x 1080"
            />
          </Campo>
          <Campo rotulo="Saúde da bateria (%)">
            <Entrada
              name="bateriaSaude"
              type="number"
              min={0}
              max={100}
              defaultValue={p.bateriaSaude ?? ""}
              placeholder="84"
            />
          </Campo>
          <Campo rotulo="Peso (kg)">
            <Entrada
              name="pesoKg"
              type="number"
              step="0.01"
              min={0}
              defaultValue={p.pesoKg ?? ""}
              placeholder="1.63"
            />
          </Campo>
        </Bloco>
      )}

      {!ehNotebook && (
        <>
          <input type="hidden" name="cpuFamilia" value="" />
          <input type="hidden" name="cpuNome" value="" />
          <input type="hidden" name="ramGb" value="" />
          <input type="hidden" name="armazenamentoGb" value="" />
          <input type="hidden" name="armazenamentoTipo" value="" />
          <input type="hidden" name="bateriaSaude" value="" />
          <input type="hidden" name="pesoKg" value="" />
          <input type="hidden" name="telaPolegadas" value={p.telaPolegadas ?? ""} />
          <input type="hidden" name="telaResolucao" value={p.telaResolucao ?? ""} />
        </>
      )}

      <Bloco
        indice={ehNotebook ? "05" : "04"}
        titulo="Ficha técnica"
        descricao="Uma linha por item, no formato «Rótulo: valor». É o que monta a tabela de especificação da página."
      >
        <Campo rotulo="Especificação" className="sm:col-span-2">
          <AreaTexto
            name="ficha"
            rows={10}
            defaultValue={p.ficha.map((f) => `${f.rotulo}: ${f.valor}`).join("\n")}
            placeholder={
              "Processador: Intel Core i5-8350U · 4 núcleos / 8 threads\nMemória: 8 GB DDR4 2400 MHz\nArmazenamento: 256 GB SSD NVMe M.2\nTela: 14\" 1920 x 1080 IPS · antirreflexo"
            }
          />
        </Campo>
      </Bloco>

      <Bloco
        indice={ehNotebook ? "06" : "05"}
        titulo="Estado de conservação"
        descricao="Grau A: mínimo sinal de uso. B: desgaste estético visível. C: marcas acentuadas. Produto novo pode ficar sem grau."
      >
        <Campo rotulo="Grau">
          <Selecao name="estadoGrau" defaultValue={p.estadoGrau ?? ""}>
            <option value="" className="bg-ink">
              Sem grau (produto novo)
            </option>
            {GRAUS.map((g) => (
              <option key={g} value={g} className="bg-ink">
                Grau {g}
              </option>
            ))}
          </Selecao>
        </Campo>

        <Campo rotulo="Observações" nota="Uma por linha" className="sm:col-span-2">
          <AreaTexto
            name="estadoObservacoes"
            rows={5}
            defaultValue={p.estadoObservacoes.join("\n")}
            placeholder={
              "Marcas leves de uso na tampa, visíveis apenas contra a luz\nBateria original, 84% de saúde medida no diagnóstico"
            }
          />
        </Campo>
      </Bloco>

      <div className="flex flex-wrap items-center gap-4 p-4 md:p-6">
        <Salvar />
        <Link
          href="/admin/produtos"
          className="flex h-12 items-center border border-line px-6 font-mono text-[11.5px] tracking-[0.16em] uppercase transition-colors hover:border-accent hover:text-accent"
        >
          Cancelar
        </Link>
        {estado.erro && (
          <p className="font-mono text-[11.5px] text-accent">{estado.erro}</p>
        )}
      </div>
    </form>
  );
}

function Interruptor({
  name,
  padrao,
  titulo,
  texto,
}: {
  name: string;
  padrao: boolean;
  titulo: string;
  texto: string;
}) {
  const [ligado, setLigado] = useState(padrao);
  return (
    <label className="flex cursor-pointer items-start gap-4 border border-line p-4 transition-colors hover:border-line-strong">
      <input
        type="checkbox"
        name={name}
        checked={ligado}
        onChange={(e) => setLigado(e.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={`mt-0.5 h-4 w-4 shrink-0 border transition-colors ${
          ligado ? "border-accent bg-accent" : "border-line-strong"
        }`}
      />
      <span>
        <span className="block font-mono text-[12px] tracking-[0.08em] uppercase">
          {titulo}
        </span>
        <span className="mt-1 block text-[12px] text-white/45">{texto}</span>
      </span>
    </label>
  );
}
