/** Ficha de cliente. Sem senha e sem login — é cadastro de balcão. */
export type Cliente = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  documento: string;
  endereco: string;
  observacoes: string;
  origem: "painel" | "site";
  confirmado: boolean;
  criadoEm: string;
  atualizadoEm: string;
};

/** O que o pré-cadastro do site manda. Sem origem e sem confirmação. */
export type NovoCliente = Pick<
  Cliente,
  "nome" | "telefone" | "email" | "documento" | "endereco" | "observacoes"
>;

export type LinhaCliente = {
  id: string;
  nome: string | null;
  telefone: string | null;
  email: string | null;
  documento: string | null;
  endereco: string | null;
  observacoes: string | null;
  origem: string | null;
  confirmado: boolean | null;
  criado_em: string;
  atualizado_em: string;
};

export function paraCliente(linha: LinhaCliente): Cliente {
  return {
    id: linha.id,
    nome: linha.nome ?? "",
    telefone: linha.telefone ?? "",
    email: linha.email ?? "",
    documento: linha.documento ?? "",
    endereco: linha.endereco ?? "",
    observacoes: linha.observacoes ?? "",
    origem: linha.origem === "site" ? "site" : "painel",
    confirmado: linha.confirmado ?? true,
    criadoEm: linha.criado_em,
    atualizadoEm: linha.atualizado_em,
  };
}

/** Só os dígitos, do mesmo jeito que o banco calcula para achar duplicata. */
export function digitosDoTelefone(telefone: string): string {
  return telefone.replace(/\D/g, "");
}

/** Máscara de digitação: (31) 99961-2371. */
export function mascararTelefone(valor: string): string {
  const d = digitosDoTelefone(valor).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
