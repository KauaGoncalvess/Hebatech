import { site } from "@/data/site";

/**
 * Duas colunas comparando o que o cliente já viveu com o que a loja promete.
 * O laranja fica só nos marcadores da coluna da HebaTech — a outra coluna é
 * cinza de propósito, para não parecer ataque a concorrente nomeado.
 */
const COMUM = [
  "Abrem o aparelho antes de falar de preço",
  "Orçamento verbal, que muda no meio do caminho",
  "Formatam sem perguntar dos seus arquivos",
  "Peça sem nota, garantia no boca a boca",
  '"Passa aqui semana que vem" sem prazo',
];

const AQUI = [
  "Medição primeiro, valor fechado depois, por escrito no WhatsApp",
  "O preço combinado é o preço da entrega",
  `Backup dos seus arquivos antes de qualquer formatação`,
  `Peça com nota fiscal e ${site.operacao.garantiaServicoDias} dias de garantia`,
  `Diagnóstico em até ${site.operacao.prazoDiagnosticoHoras}h e prazo junto do orçamento`,
];

export function Comparativo() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="card p-6 md:p-8">
        <p className="eyebrow text-texto-3">O que costuma acontecer</p>
        <h3 className="display mt-4 text-sub">Assistência de esquina</h3>
        <ul className="mt-7 space-y-4">
          {COMUM.map((t) => (
            <li key={t} className="flex gap-3.5 text-corpo leading-relaxed text-texto-3">
              <span
                aria-hidden
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-3 font-mono text-rotulo text-texto-3"
              >
                ×
              </span>
              {t}
            </li>
          ))}
        </ul>
      </article>

      <article className="spot card bg-surface-2 p-6 md:p-8">
        <p className="eyebrow text-accent">Como trabalhamos</p>
        <h3 className="display mt-4 text-sub">{site.nome}</h3>
        <ul className="mt-7 space-y-4">
          {AQUI.map((t) => (
            <li key={t} className="flex gap-3.5 text-corpo leading-relaxed text-texto-2">
              <span
                aria-hidden
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-rotulo font-bold text-black"
              >
                ✓
              </span>
              {t}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
