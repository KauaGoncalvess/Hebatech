const ITENS = [
  "Diagnóstico em até 48h",
  "Orçamento antes de qualquer reparo",
  "90 dias de garantia no serviço",
  "Peça trocada com nota fiscal",
  "Backup do disco antes de formatar",
  "Notebook corporativo revisado item a item",
  "Loja física em Sete Lagoas/MG",
];

/** Faixa de rolagem contínua. CSS puro, uma transformação, sem JavaScript. */
export function Ticker() {
  return (
    <div className="overflow-hidden border-y border-line bg-surface-2 py-2.5">
      <div className="tick flex w-max">
        {[0, 1].map((copia) => (
          <ul key={copia} className="flex shrink-0" aria-hidden={copia === 1}>
            {ITENS.map((t) => (
              <li
                key={t}
                className="flex items-center gap-6 pr-6 font-mono text-[10.5px] tracking-[0.2em] whitespace-nowrap text-white/50 uppercase"
              >
                <span className="text-accent">/</span>
                {t}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
