type Props = {
  codigo: string;
  marca: string;
  polegadas: number;
  /** `detalhe` desenha as cotas e a legenda; `card` fica limpo. */
  variante?: "card" | "detalhe";
  className?: string;
};

const TECLAS = [14, 11, 13, 12, 15, 11, 13, 12, 14, 11, 13];

/**
 * Render técnico vetorial usado quando o aparelho ainda não tem foto real.
 * Peso zero, nítido em qualquer tela e coerente com a linguagem de ficha técnica.
 */
export function ProductRender({
  codigo,
  marca,
  polegadas,
  variante = "card",
  className = "",
}: Props) {
  const detalhe = variante === "detalhe";

  return (
    <svg
      viewBox="0 0 480 300"
      className={className}
      role="img"
      aria-label={`Desenho técnico do ${marca} ${polegadas} polegadas, código ${codigo}`}
    >
      {/* Malha de fundo */}
      <defs>
        <pattern id={`m-${codigo}`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0v24" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="480" height="300" fill={`url(#m-${codigo})`} />

      {/* Marcas de corte nos cantos */}
      <g stroke="var(--color-accent)" strokeWidth="1" opacity="0.75">
        <path d="M12 12h16M12 12v16" />
        <path d="M468 12h-16M468 12v16" />
        <path d="M12 288h16M12 288v-16" />
        <path d="M468 288h-16M468 288v-16" />
      </g>

      {/* Tela */}
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
      <rect
        x="129"
        y="35"
        width="222"
        height="126"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.12"
      />

      {/* Varredura interna da tela */}
      <g stroke="#ffffff" strokeOpacity="0.07">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M129 ${45 + i * 13}h222`} />
        ))}
      </g>
      <text
        x="240"
        y="105"
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
        y="124"
        textAnchor="middle"
        fill="var(--color-accent)"
        fontFamily="var(--font-mono)"
        fontSize="9"
        letterSpacing="2.5"
      >
        {marca.toUpperCase()}
      </text>

      {/* Câmera */}
      <circle cx="240" cy="31.5" r="1.6" fill="#ffffff" fillOpacity="0.4" />

      {/* Base em perspectiva */}
      <path
        d="M120 176h240l38 52H82l38-52Z"
        fill="#0b0e12"
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      <path d="M82 228h316l-4 9H86l-4-9Z" fill="#05070a" stroke="#ffffff" strokeOpacity="0.2" />

      {/* Dobradiça */}
      <path d="M150 179h180" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="2" />

      {/* Teclado esquemático */}
      <g fill="#ffffff" fillOpacity="0.14">
        {[0, 1, 2, 3].map((linha) =>
          TECLAS.map((w, i) => {
            const x = 126 + linha * 3 + i * 20.4;
            const y = 187 + linha * 9;
            return <rect key={`${linha}-${i}`} x={x} y={y} width={w} height={5.5} />;
          }),
        )}
        <rect x="192" y="223" width="96" height="5.5" />
      </g>

      {/* Touchpad */}
      <rect
        x="215"
        y="232"
        width="50"
        height="4"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.22"
      />

      {detalhe && (
        <g
          fontFamily="var(--font-mono)"
          fontSize="8.5"
          letterSpacing="1.5"
          fill="#ffffff"
          fillOpacity="0.4"
        >
          {/* Cota de largura */}
          <g stroke="#ffffff" strokeOpacity="0.2">
            <path d="M82 258h316" />
            <path d="M82 254v8M398 254v8" />
          </g>
          <text x="240" y="273" textAnchor="middle">
            {polegadas}&quot; DIAGONAL
          </text>

          {/* Cota de altura */}
          <g stroke="#ffffff" strokeOpacity="0.2">
            <path d="M404 26v202" />
            <path d="M400 26h8M400 228h8" />
          </g>
          <text x="416" y="132" transform="rotate(90 416 132)" textAnchor="middle">
            ABERTO
          </text>

          <text x="24" y="284" fill="var(--color-accent)" fillOpacity="1">
            REF {codigo}
          </text>
        </g>
      )}
    </svg>
  );
}
