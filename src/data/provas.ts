/**
 * Prova social da loja. Nasce vazio de propósito: depoimento, nota e logo de
 * cliente só entram no ar com material real, e a seção da home só renderiza
 * quando houver algo aqui — mesma regra dos planos de manutenção.
 *
 * Como preencher:
 * - `avaliacoes`: copiar do Google Meu Negócio, com o primeiro nome real.
 * - `empresas`: nome de quem autorizou aparecer; o logo é opcional e fica em
 *   public/clientes/<arquivo>.
 * - `fotos`: imagens da loja e da bancada em public/fotos.
 */

export type Avaliacao = {
  nome: string;
  texto: string;
  /** De 1 a 5. */
  nota: number;
  /** "Google", "Instagram"… de onde veio. */
  origem: string;
};

export type Empresa = {
  nome: string;
  /** Caminho em public/, opcional — sem logo mostramos só o nome. */
  logo?: string;
};

export type FotoDaLoja = {
  src: string;
  alt: string;
};

export const avaliacoes: Avaliacao[] = [];

export const empresas: Empresa[] = [];

export const fotosDaLoja: FotoDaLoja[] = [];

/** A seção de prova só aparece quando existe pelo menos um item real. */
export const temProva =
  avaliacoes.length > 0 || empresas.length > 0 || fotosDaLoja.length > 0;
