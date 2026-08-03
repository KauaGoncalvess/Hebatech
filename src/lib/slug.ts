/** Minúsculas e sem acento — base do slug e da busca do catálogo. */
export function semAcento(bruto: string): string {
  return bruto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Transforma texto livre no endereço da página: "ThinkPad T480" → "thinkpad-t480". */
export function gerarSlug(bruto: string): string {
  return semAcento(bruto)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}
