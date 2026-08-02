/**
 * O site funciona com ou sem Supabase.
 *
 * Sem as variáveis abaixo, o catálogo vem do arquivo `src/data/seed.ts` e o
 * painel fica indisponível — assim o projeto roda e faz build em qualquer
 * máquina, inclusive antes de a conta do Supabase existir.
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabaseConfigurado = Boolean(supabaseUrl && supabaseAnonKey);

/** Nome do bucket de imagens no Supabase Storage. */
export const BUCKET_FOTOS = "produtos";
