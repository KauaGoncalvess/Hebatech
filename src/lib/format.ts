const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function preco(valor: number): string {
  return brl.format(valor);
}

/** Parcela sem juros no cartão, arredondada para cima no centavo. */
export function parcela(valor: number, vezes = 10): string {
  return brl.format(Math.ceil(valor / vezes));
}

export function armazenamento(gb: number): string {
  return gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`;
}
