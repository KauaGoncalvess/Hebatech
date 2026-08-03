const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const decimal = new Intl.NumberFormat("pt-BR");

export function preco(valor: number): string {
  return brl.format(valor);
}

/** Número inteiro com separador de milhar: 3000 → "3.000". */
export function numero(valor: number): string {
  return decimal.format(valor);
}

/** Parcela sem juros no cartão, arredondada para cima no centavo. */
export function parcela(valor: number, vezes = 10): string {
  return brl.format(Math.ceil(valor / vezes));
}

export function armazenamento(gb: number): string {
  return gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`;
}
