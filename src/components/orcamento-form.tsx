"use client";

import { useMemo, useState, type FormEvent } from "react";
import { enderecoLinha, site } from "@/data/site";
import { waOrcamento } from "@/lib/whatsapp";

const TIPOS = ["Notebook", "Desktop", "All in one", "Impressora"];

const DEFEITOS = [
  "Não liga",
  "Liga e desliga sozinho",
  "Tela quebrada ou com mancha",
  "Não carrega / conector de carga",
  "Superaquecendo ou ventoinha barulhenta",
  "Lento, travando ou com vírus",
  "Teclado ou touchpad com falha",
  "Não conecta no Wi-Fi",
  "Barulho no disco / perda de arquivo",
  "Molhou ou caiu",
  "Quero fazer upgrade de SSD ou memória",
  "Outro (descrevo abaixo)",
];

const INICIAL = {
  tipo: "Notebook",
  marca: "",
  modelo: "",
  defeito: "",
  descricao: "",
  nome: "",
  telefone: "",
};

function mascararTelefone(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function OrcamentoForm() {
  const [f, setF] = useState(INICIAL);
  const [tentou, setTentou] = useState(false);

  const set = (campo: keyof typeof INICIAL, valor: string) =>
    setF((prev) => ({ ...prev, [campo]: valor }));

  const erros = useMemo(() => {
    const e: Partial<Record<keyof typeof INICIAL, string>> = {};
    if (!f.nome.trim()) e.nome = "Informe seu nome";
    if (f.telefone.replace(/\D/g, "").length < 10) e.telefone = "Telefone incompleto";
    if (!f.marca.trim()) e.marca = "Informe a marca";
    if (!f.defeito) e.defeito = "Escolha o defeito";
    return e;
  }, [f]);

  const valido = Object.keys(erros).length === 0;

  const previa = useMemo(
    () =>
      [
        "Olá, vim pelo site da HebaTech e quero um orçamento de assistência técnica.",
        "",
        `Nome: ${f.nome || "—"}`,
        `Telefone: ${f.telefone || "—"}`,
        `Equipamento: ${f.tipo}`,
        `Marca: ${f.marca || "—"}`,
        `Modelo: ${f.modelo || "não sei informar"}`,
        `Defeito: ${f.defeito || "—"}`,
        ...(f.descricao.trim() ? [`Detalhes: ${f.descricao.trim()}`] : []),
      ].join("\n"),
    [f],
  );

  function enviar(e: FormEvent) {
    e.preventDefault();
    setTentou(true);
    if (!valido) return;

    const url = waOrcamento({
      nome: f.nome.trim(),
      telefone: f.telefone,
      tipo: f.tipo,
      marca: f.marca.trim(),
      modelo: f.modelo.trim() || "não sei informar",
      defeito: f.defeito,
      descricao: f.descricao,
    });

    const janela = window.open(url, "_blank", "noopener,noreferrer");
    if (!janela) window.location.href = url;
  }

  const mostrarErro = (campo: keyof typeof INICIAL) => tentou && erros[campo];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12">
      <form onSubmit={enviar} noValidate className="lg:col-span-7 lg:border-r lg:border-line">
        <fieldset className="border-b border-line">
          <legend className="sr-only">Equipamento</legend>
          <p className="eyebrow border-b border-line px-4 py-3 text-white/35 md:px-6">
            01 — Equipamento
          </p>

          <div className="flex flex-wrap gap-px border-b border-line p-4 md:px-6">
            {TIPOS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("tipo", t)}
                aria-pressed={f.tipo === t}
                className={`border px-4 py-2.5 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors ${
                  f.tipo === t
                    ? "border-accent bg-accent text-black"
                    : "border-line text-white/70 hover:border-line-strong"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            <Campo
              rotulo="Marca"
              obrigatorio
              erro={mostrarErro("marca")}
              className="border-b border-line sm:border-r sm:border-b-0"
            >
              <input
                value={f.marca}
                onChange={(e) => set("marca", e.target.value)}
                placeholder="Dell, Lenovo, HP, Acer, Samsung..."
                autoComplete="off"
                className="w-full bg-transparent font-mono text-[13px] placeholder:text-white/25 focus:outline-none"
              />
            </Campo>

            <Campo rotulo="Modelo" nota="Se não souber, deixe em branco">
              <input
                value={f.modelo}
                onChange={(e) => set("modelo", e.target.value)}
                placeholder="Latitude 5490, Ideapad 3..."
                autoComplete="off"
                className="w-full bg-transparent font-mono text-[13px] placeholder:text-white/25 focus:outline-none"
              />
            </Campo>
          </div>
        </fieldset>

        <fieldset className="border-b border-line">
          <legend className="sr-only">Defeito</legend>
          <p className="eyebrow border-b border-line px-4 py-3 text-white/35 md:px-6">
            02 — Defeito
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2">
            {DEFEITOS.map((d, i) => (
              <li key={d} className={i % 2 === 0 ? "sm:border-r sm:border-line" : ""}>
                <button
                  type="button"
                  onClick={() => set("defeito", d)}
                  aria-pressed={f.defeito === d}
                  className={`flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition-colors md:px-6 ${
                    f.defeito === d ? "bg-surface-2" : "hover:bg-surface"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-2.5 w-2.5 shrink-0 border transition-colors ${
                      f.defeito === d ? "border-accent bg-accent" : "border-line-strong"
                    }`}
                  />
                  <span
                    className={`text-[12.5px] ${
                      f.defeito === d ? "text-accent" : "text-white/75"
                    }`}
                  >
                    {d}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {mostrarErro("defeito") && (
            <p className="px-4 py-2 font-mono text-[10.5px] text-accent md:px-6">
              {erros.defeito}
            </p>
          )}

          <Campo rotulo="Detalhes" nota="Quando começou, se caiu, se já mexeram antes">
            <textarea
              value={f.descricao}
              onChange={(e) => set("descricao", e.target.value)}
              rows={3}
              placeholder="Começou depois de uma queda. Liga, mas a imagem fica com listra roxa."
              className="w-full resize-y bg-transparent font-mono text-[13px] leading-relaxed placeholder:text-white/25 focus:outline-none"
            />
          </Campo>
        </fieldset>

        <fieldset>
          <legend className="sr-only">Contato</legend>
          <p className="eyebrow border-b border-line px-4 py-3 text-white/35 md:px-6">
            03 — Seu contato
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            <Campo
              rotulo="Nome"
              obrigatorio
              erro={mostrarErro("nome")}
              className="border-b border-line sm:border-r sm:border-b-0"
            >
              <input
                value={f.nome}
                onChange={(e) => set("nome", e.target.value)}
                autoComplete="name"
                className="w-full bg-transparent font-mono text-[13px] focus:outline-none"
              />
            </Campo>

            <Campo rotulo="Telefone" obrigatorio erro={mostrarErro("telefone")}>
              <input
                value={f.telefone}
                onChange={(e) => set("telefone", mascararTelefone(e.target.value))}
                inputMode="tel"
                autoComplete="tel"
                placeholder="(31) 90000-0000"
                className="w-full bg-transparent font-mono text-[13px] placeholder:text-white/25 focus:outline-none"
              />
            </Campo>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-between gap-4 border-t border-line bg-accent px-4 py-5 text-black transition-colors hover:bg-white md:px-6"
          >
            <span className="text-left">
              <span className="block font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
                Enviar pelo WhatsApp
              </span>
              <span className="display mt-1 block text-[1.7rem] leading-none">
                Pedir orçamento
              </span>
            </span>
            <span aria-hidden className="font-mono text-xl">
              →
            </span>
          </button>

          <p className="border-t border-line px-4 py-3 font-mono text-[10px] tracking-[0.1em] text-white/40 md:px-6">
            Nada é enviado a servidor nenhum. O botão abre o WhatsApp com o texto já
            montado, e você confere antes de mandar.
          </p>
        </fieldset>
      </form>

      {/* Prévia da mensagem: o cliente vê exatamente o que vai sair */}
      <aside className="border-t border-line lg:col-span-5 lg:border-t-0">
        <div className="lg:sticky lg:top-[65px]">
          <p className="eyebrow border-b border-line px-4 py-3 text-white/35 md:px-6">
            Prévia da mensagem
          </p>
          <pre className="overflow-x-auto px-4 py-5 font-mono text-[11.5px] leading-[1.9] whitespace-pre-wrap text-white/70 md:px-6">
            {previa}
          </pre>
          <div className="border-t border-line px-4 py-4 md:px-6">
            <p className="eyebrow text-white/35">O que acontece depois</p>
            <ol className="mt-3 space-y-2">
              {[
                "Respondemos no horário comercial com uma estimativa e o prazo.",
                "Valor fechado só depois do diagnóstico de bancada, em até 48h.",
                "Nenhum reparo começa sem a sua autorização por escrito no WhatsApp.",
              ].map((t, i) => (
                <li key={t} className="flex gap-3 text-[12.5px] text-white/55">
                  <span className="font-mono text-[10px] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-line px-4 py-4 md:px-6">
            <p className="eyebrow text-white/35">Prefere resolver direto</p>
            <p className="mt-3 text-[12.5px] text-white/55">
              Traga o aparelho na loja sem agendar, de segunda a sexta das 8h30 às 18h e
              sábado até meio-dia. O diagnóstico começa no mesmo dia.
            </p>
            <p className="mt-3 font-mono text-[12px] text-white/75">{enderecoLinha}</p>
            <a
              href={`tel:${site.telefoneFixoLink}`}
              className="mt-1 inline-block font-mono text-[12px] text-accent"
            >
              {site.telefoneFixo}
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Campo({
  rotulo,
  nota,
  obrigatorio,
  erro,
  className = "",
  children,
}: {
  rotulo: string;
  nota?: string;
  obrigatorio?: boolean;
  erro?: string | false;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block px-4 py-4 md:px-6 ${className}`}>
      <span className="flex items-baseline justify-between gap-3">
        <span className="eyebrow text-white/40">
          {rotulo}
          {obrigatorio && <span className="text-accent"> *</span>}
        </span>
        {erro ? (
          <span className="font-mono text-[9.5px] text-accent">{erro}</span>
        ) : (
          nota && <span className="font-mono text-[9.5px] text-white/25">{nota}</span>
        )}
      </span>
      <span
        className={`mt-2.5 block border-b pb-2 transition-colors focus-within:border-accent ${
          erro ? "border-accent" : "border-line-strong"
        }`}
      >
        {children}
      </span>
    </label>
  );
}
