import type { CategoriaId } from "@/types/produto";

type Props = {
  codigo: string;
  marca: string;
  categoria: CategoriaId;
  /** Exibido na cota do desenho quando o produto tem tela. */
  polegadas?: number | null;
  /** `detalhe` desenha as cotas e a legenda; `card` fica limpo. */
  variante?: "card" | "detalhe";
  className?: string;
};

const TECLAS = [14, 11, 13, 12, 15, 11, 13, 12, 14, 11, 13];

/**
 * Render técnico vetorial usado quando o produto ainda não tem foto.
 * Peso zero, nítido em qualquer tela e coerente com a linguagem de ficha
 * técnica. Cada categoria tem o seu desenho.
 */
export function ProductRender({
  codigo,
  marca,
  categoria,
  polegadas,
  variante = "card",
  className = "",
}: Props) {
  const detalhe = variante === "detalhe";
  const id = codigo.replace(/[^a-zA-Z0-9-]/g, "");

  return (
    <svg
      viewBox="0 0 480 300"
      className={className}
      role="img"
      aria-label={`Desenho técnico do ${marca} ${codigo}`}
    >
      <defs>
        <pattern id={`m-${id}`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0v24" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="480" height="300" fill={`url(#m-${id})`} />

      {/* Marcas de corte */}
      <g stroke="var(--color-accent)" strokeWidth="1" opacity="0.75">
        <path d="M12 12h16M12 12v16" />
        <path d="M468 12h-16M468 12v16" />
        <path d="M12 288h16M12 288v-16" />
        <path d="M468 288h-16M468 288v-16" />
      </g>

      {categoria === "notebook" && <DesenhoNotebook codigo={codigo} marca={marca} />}
      {categoria === "desktop" && <DesenhoDesktop codigo={codigo} marca={marca} />}
      {categoria === "monitor" && <DesenhoMonitor codigo={codigo} marca={marca} />}
      {(categoria === "periferico" || categoria === "peca" || categoria === "acessorio") && (
        <DesenhoModulo codigo={codigo} marca={marca} />
      )}

      {detalhe && (
        <g
          fontFamily="var(--font-mono)"
          fontSize="8.5"
          letterSpacing="1.5"
          fill="#ffffff"
          fillOpacity="0.4"
        >
          <g stroke="#ffffff" strokeOpacity="0.2">
            <path d="M82 258h316" />
            <path d="M82 254v8M398 254v8" />
          </g>
          <text x="240" y="273" textAnchor="middle">
            {polegadas ? `${polegadas}" DIAGONAL` : "MEDIDA REAL NA LOJA"}
          </text>
          <text x="24" y="284" fill="var(--color-accent)" fillOpacity="1">
            REF {codigo}
          </text>
        </g>
      )}
    </svg>
  );
}

type DesenhoProps = { codigo: string; marca: string };

function Legenda({ codigo, marca, y = 105 }: DesenhoProps & { y?: number }) {
  return (
    <>
      <text
        x="240"
        y={y}
        textAnchor="middle"
        fill="#ffffff"
        fillOpacity="0.5"
        fontFamily="var(--font-mono)"
        fontSize="13"
        letterSpacing="3"
      >
        {codigo}
      </text>
      <text
        x="240"
        y={y + 19}
        textAnchor="middle"
        fill="var(--color-accent)"
        fontFamily="var(--font-mono)"
        fontSize="9"
        letterSpacing="2.5"
      >
        {marca.toUpperCase()}
      </text>
    </>
  );
}

function DesenhoNotebook({ codigo, marca }: DesenhoProps) {
  return (
    <>
      <rect
        x="120"
        y="26"
        width="240"
        height="150"
        fill="#05070a"
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      <rect x="120" y="26" width="240" height="1.5" fill="var(--color-accent)" />
      <rect x="129" y="35" width="222" height="126" fill="none" stroke="#ffffff" strokeOpacity="0.12" />
      <g stroke="#ffffff" strokeOpacity="0.07">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M129 ${45 + i * 13}h222`} />
        ))}
      </g>
      <Legenda codigo={codigo} marca={marca} />
      <circle cx="240" cy="31.5" r="1.6" fill="#ffffff" fillOpacity="0.4" />

      <path
        d="M120 176h240l38 52H82l38-52Z"
        fill="#0b0e12"
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      <path d="M82 228h316l-4 9H86l-4-9Z" fill="#05070a" stroke="#ffffff" strokeOpacity="0.2" />
      <path d="M150 179h180" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="2" />

      <g fill="#ffffff" fillOpacity="0.14">
        {[0, 1, 2, 3].map((linha) =>
          TECLAS.map((w, i) => (
            <rect
              key={`${linha}-${i}`}
              x={126 + linha * 3 + i * 20.4}
              y={187 + linha * 9}
              width={w}
              height={5.5}
            />
          )),
        )}
        <rect x="192" y="223" width="96" height="5.5" />
      </g>
      <rect x="215" y="232" width="50" height="4" fill="none" stroke="#ffffff" strokeOpacity="0.22" />
    </>
  );
}

function DesenhoDesktop({ codigo, marca }: DesenhoProps) {
  return (
    <>
      {/* Gabinete em perspectiva leve */}
      <path
        d="M150 30h140v210H150z"
        fill="#05070a"
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      <path
        d="M290 30l38 16v210l-38-16z"
        fill="#0b0e12"
        stroke="#ffffff"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />
      <path d="M150 30h140l38 16" fill="none" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.5" />
      <rect x="150" y="30" width="140" height="1.5" fill="var(--color-accent)" />

      {/* Lateral de vidro com componentes */}
      <rect x="162" y="44" width="116" height="182" fill="none" stroke="#ffffff" strokeOpacity="0.12" />
      {/* Fans */}
      {[70, 116, 162].map((cy) => (
        <g key={cy}>
          <circle cx="184" cy={cy} r="16" fill="none" stroke="#ffffff" strokeOpacity="0.22" />
          <circle cx="184" cy={cy} r="4" fill="var(--color-accent)" fillOpacity="0.5" />
        </g>
      ))}
      {/* Placa de vídeo */}
      <rect x="210" y="128" width="60" height="18" fill="#ffffff" fillOpacity="0.1" />
      <rect x="210" y="128" width="60" height="1.5" fill="var(--color-accent)" fillOpacity="0.7" />
      {/* Memórias */}
      <g fill="#ffffff" fillOpacity="0.14">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={214 + i * 8} y="58" width="4" height="42" />
        ))}
      </g>
      {/* Fonte */}
      <rect x="168" y="192" width="104" height="26" fill="#ffffff" fillOpacity="0.07" stroke="#ffffff" strokeOpacity="0.15" />

      <Legenda codigo={codigo} marca={marca} y={258} />
      <path d="M150 240h140" stroke="#ffffff" strokeOpacity="0.15" />
    </>
  );
}

function DesenhoMonitor({ codigo, marca }: DesenhoProps) {
  return (
    <>
      <rect
        x="96"
        y="34"
        width="288"
        height="168"
        fill="#05070a"
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      <rect x="96" y="34" width="288" height="1.5" fill="var(--color-accent)" />
      <rect x="105" y="43" width="270" height="140" fill="none" stroke="#ffffff" strokeOpacity="0.12" />
      <g stroke="#ffffff" strokeOpacity="0.07">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M105 ${53 + i * 14}h270`} />
        ))}
      </g>
      <Legenda codigo={codigo} marca={marca} y={110} />

      {/* Pé e base */}
      <path d="M228 202h24v42h-24z" fill="#0b0e12" stroke="#ffffff" strokeOpacity="0.22" />
      <path d="M186 244h108l6 10H180l6-10Z" fill="#0b0e12" stroke="#ffffff" strokeOpacity="0.22" />
      <path d="M240 210v26" stroke="#ffffff" strokeOpacity="0.14" />
    </>
  );
}

function DesenhoModulo({ codigo, marca }: DesenhoProps) {
  return (
    <>
      <rect
        x="120"
        y="70"
        width="240"
        height="120"
        fill="#05070a"
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      <rect x="120" y="70" width="240" height="1.5" fill="var(--color-accent)" />

      {/* Contatos laterais, como num módulo de hardware */}
      <g fill="#ffffff" fillOpacity="0.16">
        {Array.from({ length: 18 }, (_, i) => (
          <rect key={i} x={134 + i * 12.4} y="182" width="7" height="8" />
        ))}
      </g>
      <g stroke="#ffffff" strokeOpacity="0.12">
        <path d="M120 100h240" />
        <path d="M120 160h240" />
      </g>
      <rect x="140" y="110" width="40" height="40" fill="#ffffff" fillOpacity="0.07" stroke="#ffffff" strokeOpacity="0.15" />
      <Legenda codigo={codigo} marca={marca} y={128} />
    </>
  );
}
