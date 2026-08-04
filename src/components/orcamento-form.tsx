"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { registrarOrcamento } from "@/app/(site)/actions";
import { enderecoLinha } from "@/data/site";
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

const CAMPO =
  "mt-2.5 w-full rounded-2xl bg-surface-2 px-4 py-3.5 font-mono text-[13.5px] transition-colors placeholder:text-white/55 focus-visible:bg-surface-3";

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

    const pedido = {
      nome: f.nome.trim(),
      telefone: f.telefone,
      tipo: f.tipo,
      marca: f.marca.trim(),
      modelo: f.modelo.trim() || "não sei informar",
      defeito: f.defeito,
      descricao: f.descricao,
    };
    const url = waOrcamento(pedido);

    // A janela abre agora, ainda dentro do clique. Se eu esperasse a gravação
    // terminar, o navegador trataria o window.open como popup e bloquearia.
    const janela = window.open(url, "_blank", "noopener,noreferrer");

    // O registro é secundário: serve para a loja não perder quem preenche e
    // não manda a mensagem. Banco fora do ar não pode travar a conversa.
    const gravando = registrarOrcamento(pedido).catch(() => false);

    if (!janela) {
      // Popup bloqueado: vamos sair desta aba, o que cortaria a gravação no
      // meio. Espera um instante — e no máximo isso — antes de navegar.
      const limite = new Promise((resolve) => setTimeout(resolve, 1200));
      void Promise.race([gravando, limite]).then(() => {
        window.location.href = url;
      });
    }
  }

  const mostrarErro = (campo: keyof typeof INICIAL) => tentou && erros[campo];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
      <form onSubmit={enviar} noValidate className="card p-6 md:p-8">
        <Bloco numero="1" titulo="Equipamento">
          <div className="flex flex-wrap gap-2">
            {TIPOS.map((t) => (
              <Pastilha
                key={t}
                rotulo={t}
                ativo={f.tipo === t}
                onClick={() => set("tipo", t)}
              />
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Campo rotulo="Marca" obrigatorio erro={mostrarErro("marca")}>
              <input
                value={f.marca}
                onChange={(e) => set("marca", e.target.value)}
                placeholder="Dell, Lenovo, HP, Acer..."
                autoComplete="off"
                className={CAMPO}
              />
            </Campo>
            <Campo rotulo="Modelo" nota="Não sabe? Deixe vazio">
              <input
                value={f.modelo}
                onChange={(e) => set("modelo", e.target.value)}
                placeholder="Latitude 5490"
                autoComplete="off"
                className={CAMPO}
              />
            </Campo>
          </div>
        </Bloco>

        <Bloco numero="2" titulo="Defeito">
          <div className="flex flex-wrap gap-2">
            {DEFEITOS.map((d) => (
              <Pastilha
                key={d}
                rotulo={d}
                ativo={f.defeito === d}
                onClick={() => set("defeito", d)}
              />
            ))}
          </div>
          {mostrarErro("defeito") && (
            <p className="mt-3 font-mono text-[11.5px] text-accent">{erros.defeito}</p>
          )}

          <div className="mt-5">
            <Campo rotulo="Detalhes" nota="Quando começou, se caiu, se já mexeram">
              <textarea
                value={f.descricao}
                onChange={(e) => set("descricao", e.target.value)}
                rows={3}
                placeholder="Começou depois de uma queda. Liga, mas a imagem fica com listra roxa."
                className={`${CAMPO} resize-y leading-relaxed`}
              />
            </Campo>
          </div>
        </Bloco>

        <Bloco numero="3" titulo="Seu contato" ultimo>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo="Nome" obrigatorio erro={mostrarErro("nome")}>
              <input
                value={f.nome}
                onChange={(e) => set("nome", e.target.value)}
                autoComplete="name"
                className={CAMPO}
              />
            </Campo>
            <Campo rotulo="Telefone" obrigatorio erro={mostrarErro("telefone")}>
              <input
                value={f.telefone}
                onChange={(e) => set("telefone", mascararTelefone(e.target.value))}
                inputMode="tel"
                autoComplete="tel"
                placeholder="(31) 90000-0000"
                className={CAMPO}
              />
            </Campo>
          </div>
        </Bloco>

        <button
          type="submit"
          className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-accent font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
        >
          Enviar pelo WhatsApp
          <span aria-hidden>→</span>
        </button>
        <p className="mt-4 text-center font-mono text-[11px] text-white/55">
          O botão abre o WhatsApp com o texto montado. Guardamos o pedido para conseguir
          te retornar caso a conversa não vá para a frente.{" "}
          <Link href="/privacidade" className="text-accent underline underline-offset-4">
            Como tratamos seus dados
          </Link>
          .
        </p>
      </form>

      {/* Prévia da mensagem */}
      <aside className="space-y-4">
        <div className="card p-6">
          <p className="eyebrow text-white/45">Prévia da mensagem</p>
          <pre className="mt-4 overflow-x-auto font-mono text-[12px] leading-[1.9] whitespace-pre-wrap text-white/70">
            {previa}
          </pre>
        </div>

        <div className="card p-6">
          <p className="eyebrow text-white/45">O que acontece depois</p>
          <ol className="mt-4 space-y-3">
            {[
              "Respondemos no horário comercial com uma estimativa e o prazo.",
              "Valor fechado só depois do diagnóstico de bancada, em até 48h.",
              "Nenhum reparo começa sem a sua autorização por escrito.",
            ].map((t, i) => (
              <li key={t} className="flex gap-3 text-[13.5px] text-white/60">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[10px] font-bold text-black">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ol>
        </div>

        <div className="card p-6">
          <p className="eyebrow text-white/45">Prefere resolver direto</p>
          <p className="mt-4 text-[13.5px] leading-relaxed text-white/55">
            Traga o aparelho na loja sem agendar, de segunda a sexta das 8h30 às 18h e
            sábado até meio-dia.
          </p>
          <p className="mt-4 font-mono text-[12.5px] text-white/70">{enderecoLinha}</p>
        </div>
      </aside>
    </div>
  );
}

function Bloco({
  numero,
  titulo,
  ultimo,
  children,
}: {
  numero: string;
  titulo: string;
  ultimo?: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset className={ultimo ? "" : "mb-8 border-b border-line pb-8"}>
      <legend className="sr-only">{titulo}</legend>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-3 font-mono text-[11px] text-accent">
          {numero}
        </span>
        <span className="font-mono text-[12px] tracking-[0.12em] uppercase">{titulo}</span>
      </div>
      {children}
    </fieldset>
  );
}

function Pastilha({
  rotulo,
  ativo,
  onClick,
}: {
  rotulo: string;
  ativo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`rounded-full px-4 py-2.5 text-[13px] transition-colors ${
        ativo
          ? "bg-accent font-medium text-black"
          : "bg-surface-2 text-white/70 hover:bg-surface-3 hover:text-white"
      }`}
    >
      {rotulo}
    </button>
  );
}

function Campo({
  rotulo,
  nota,
  obrigatorio,
  erro,
  children,
}: {
  rotulo: string;
  nota?: string;
  obrigatorio?: boolean;
  erro?: string | false;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="eyebrow text-white/55">
          {rotulo}
          {obrigatorio && <span className="text-accent"> *</span>}
        </span>
        {erro ? (
          <span className="font-mono text-[10px] text-accent">{erro}</span>
        ) : (
          nota && <span className="font-mono text-[10px] text-white/45">{nota}</span>
        )}
      </span>
      {children}
    </label>
  );
}
