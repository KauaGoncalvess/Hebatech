import type { AreaServico } from "@/data/servicos";

/**
 * Ilustração de cada área de serviço. Desenho vetorial próprio em vez de foto
 * de banco: peso zero, nítido em qualquer tela e coerente com a marca.
 */
export function ServicoArt({ area, className = "" }: { area: AreaServico; className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="presentation" aria-hidden>
      <defs>
        <linearGradient id={`fundo-${area}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1c1f" />
          <stop offset="100%" stopColor="#0b0c0e" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#fundo-${area})`} />
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {DESENHOS[area]}
      </g>
    </svg>
  );
}

const ACENTO = "var(--color-accent)";
const FRACO = "rgba(255,255,255,0.28)";

const DESENHOS: Record<AreaServico, React.ReactNode> = {
  // Notebook aberto com uma chave de fenda apoiada na tampa
  reparo: (
    <>
      <path d="M96 66h128v74H96z" stroke={FRACO} />
      <path d="M84 140h152l10 18H74l10-18Z" stroke={FRACO} />
      <path d="M110 80h100v46H110z" stroke={ACENTO} />
      <path d="M196 52l26-26 12 12-26 26-12-12Z" stroke={ACENTO} />
      <path d="M196 52l-14 14 12 12 14-14" stroke={ACENTO} />
      <circle cx="160" cy="149" r="3" fill={ACENTO} stroke="none" />
    </>
  ),

  // Ventoinha com fluxo de ar
  limpeza: (
    <>
      <circle cx="140" cy="100" r="52" stroke={FRACO} />
      <circle cx="140" cy="100" r="12" stroke={ACENTO} />
      {[0, 90, 180, 270].map((g) => (
        <path
          key={g}
          d="M140 88c14-10 30-4 32 10-14 6-27 4-32-10Z"
          stroke={ACENTO}
          transform={`rotate(${g} 140 100)`}
        />
      ))}
      <path d="M212 74h44M212 100h58M212 126h44" stroke={FRACO} />
    </>
  ),

  // Monitor com barra de progresso de instalação
  sistema: (
    <>
      <path d="M74 52h172v98H74z" stroke={FRACO} />
      <path d="M140 150h40v16h-40zM122 166h76" stroke={FRACO} />
      <path d="M96 118h128" stroke={FRACO} />
      <path d="M96 118h74" stroke={ACENTO} strokeWidth="4" />
      <path d="M148 68l14 14-14 14M172 96h-38" stroke={ACENTO} />
    </>
  ),

  // Pente de memória e SSD lado a lado
  pecas: (
    <>
      <path d="M52 78h122v40H52z" stroke={FRACO} />
      <g stroke={FRACO}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path key={i} d={`M${62 + i * 16} 118v10`} />
        ))}
      </g>
      <path d="M68 88h90v18H68z" stroke={ACENTO} />
      <path d="M190 62h78v96h-78z" stroke={FRACO} />
      <path d="M204 82h50v26h-50z" stroke={ACENTO} />
      <path d="M204 124h50" stroke={FRACO} />
    </>
  ),

  // Gabinete montado, com placa de vídeo e fans
  montagem: (
    <>
      <path d="M104 34h112v132H104z" stroke={FRACO} />
      <path d="M216 34l22 12v132l-22-12" stroke={FRACO} />
      <circle cx="132" cy="66" r="14" stroke={ACENTO} />
      <circle cx="132" cy="102" r="14" stroke={ACENTO} />
      <path d="M158 96h46v16h-46z" stroke={ACENTO} />
      <path d="M120 136h80v18h-80z" stroke={FRACO} />
      <path d="M158 52h6v28h-6z" stroke={FRACO} />
    </>
  ),

  // Roteador com ondas de sinal
  rede: (
    <>
      <path d="M92 120h136v34H92z" stroke={FRACO} />
      <path d="M116 137h8M136 137h8M156 137h8" stroke={ACENTO} />
      <path d="M160 120V96" stroke={FRACO} />
      <path d="M136 84a34 34 0 0 1 48 0" stroke={ACENTO} />
      <path d="M118 66a60 60 0 0 1 84 0" stroke={ACENTO} strokeOpacity="0.65" />
      <path d="M100 48a86 86 0 0 1 120 0" stroke={ACENTO} strokeOpacity="0.35" />
      <circle cx="204" cy="137" r="4" fill={ACENTO} stroke="none" />
    </>
  ),

  // Disco rígido aberto, com braço de leitura
  dados: (
    <>
      <path d="M76 44h168v112H76z" stroke={FRACO} />
      <circle cx="146" cy="100" r="44" stroke={FRACO} />
      <circle cx="146" cy="100" r="12" stroke={ACENTO} />
      <path d="M222 62l-52 44" stroke={ACENTO} />
      <circle cx="222" cy="62" r="7" stroke={ACENTO} />
      <path d="M96 64h18M96 78h10" stroke={FRACO} />
    </>
  ),

  // Calendário com visita marcada
  contrato: (
    <>
      <path d="M84 52h152v112H84z" stroke={FRACO} />
      <path d="M84 84h152" stroke={FRACO} />
      <path d="M116 38v26M204 38v26" stroke={FRACO} />
      <g stroke={FRACO}>
        {[0, 1, 2].map((linha) =>
          [0, 1, 2, 3].map((col) => (
            <path
              key={`${linha}-${col}`}
              d={`M${108 + col * 34} ${104 + linha * 22}h14`}
            />
          )),
        )}
      </g>
      <circle cx="183" cy="126" r="16" stroke={ACENTO} />
      <path d="M176 126l5 6 10-12" stroke={ACENTO} />
    </>
  ),
};
