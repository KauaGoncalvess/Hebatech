"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./config";

/**
 * Cliente do navegador. Usado no login e no envio de fotos — o upload vai
 * direto do computador para o Storage, sem passar pelo servidor do site.
 */
export function criarClienteNavegador() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
