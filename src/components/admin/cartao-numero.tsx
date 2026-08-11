import type { ReactNode } from "react";

/**
 * Cartão de número do painel.
 *
 * Existiam três desenhos diferentes para a mesma coisa: na capa o número e o
 * rótulo dividiam a mesma linha de base (e quebravam de um jeito num cartão e
 * de outro no vizinho, na mesma fileira); no financeiro o número vinha em
 * bloco com o rótulo embaixo; e os chips de categoria punham o rótulo em cima.
 *
 * Aqui é um só: rótulo em cima, número embaixo, nota opcional. O rótulo vem
 * primeiro porque sem ele o número não quer dizer nada — e é ele que a pessoa
 * procura ao varrer a fileira.
 */
export function CartaoNumero({
  rotulo,
  valor,
  nota,
  tom = "acento",
  notaTom = "padrao",
  compacto = false,
}: {
  rotulo: string;
  valor: ReactNode;
  nota?: ReactNode;
  /** `neutro` para o que sai ou não pede atenção; `alerta` para atraso. */
  tom?: "acento" | "neutro" | "alerta";
  /**
   * Quando só uma parte do número é problema. "A receber R$ 2.540, dos quais
   * R$ 2.190 venceram" não pode pintar o total inteiro de vermelho: o alerta é
   * da nota, não do valor.
   */
  notaTom?: "padrao" | "alerta";
  /** Sem nota e com menos respiro, para fileiras de contagem. */
  compacto?: boolean;
}) {
  const cor =
    tom === "alerta"
      ? "text-alerta"
      : tom === "neutro"
        ? "text-texto-2"
        : "text-accent";

  return (
    <div
      className={
        // `h-full`: numa fileira, nota de uma linha e de duas linhas deixavam
        // os cartões vizinhos com alturas diferentes.
        compacto
          ? "h-full rounded-2xl bg-surface-2 p-3 md:p-4"
          : "card h-full p-4 md:p-5"
      }
    >
      <p className="font-mono text-rotulo tracking-[0.14em] text-texto-3 uppercase">
        {rotulo}
      </p>
      <p
        className={`display mt-2 text-[clamp(1.5rem,6vw,2.1rem)] leading-none tabular-nums ${cor}`}
      >
        {valor}
      </p>
      {nota && (
        <p
          className={`mt-2 text-nota leading-snug ${
            notaTom === "alerta" ? "text-alerta" : "text-texto-3"
          }`}
        >
          {nota}
        </p>
      )}
    </div>
  );
}
