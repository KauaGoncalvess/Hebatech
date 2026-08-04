import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import { supabaseAnonKey, supabaseConfigurado, supabaseUrl } from "./config";

/**
 * Cliente de leitura pública — sem sessão, sem cookie.
 *
 * Existe por um motivo concreto: o cliente de `server.ts` chama `cookies()`,
 * e `cookies()` não pode ser chamado onde não existe requisição. Catálogo,
 * planos e `generateStaticParams` rodam exatamente aí, na geração estática, e
 * o build quebra se eles pedirem cookie.
 *
 * Nada se perde: o catálogo é liberado para todo mundo pela RLS, então essas
 * leituras não precisam de sessão nenhuma. Quem precisa de login — painel,
 * ordens, orçamentos — continua no cliente de `server.ts`.
 */
export const criarClientePublico = cache(() => {
  if (!supabaseConfigurado) return null;

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
});
