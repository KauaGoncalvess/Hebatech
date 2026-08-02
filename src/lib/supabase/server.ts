import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAnonKey, supabaseConfigurado, supabaseUrl } from "./config";

/**
 * Cliente para Server Components, Route Handlers e Server Actions.
 * Retorna null quando o Supabase não está configurado.
 */
export async function criarClienteServidor() {
  if (!supabaseConfigurado) return null;

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(lista) {
        try {
          for (const { name, value, options } of lista) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component não pode gravar cookie. O middleware já cuida
          // da renovação da sessão, então ignorar aqui é seguro.
        }
      },
    },
  });
}
