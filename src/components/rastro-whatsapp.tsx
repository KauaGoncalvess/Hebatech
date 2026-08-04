"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

/**
 * Um ouvinte só para todos os botões de WhatsApp do site.
 *
 * A alternativa seria transformar cada link em componente de cliente; assim
 * basta marcar o link com `data-origem` e o clique é capturado na subida do
 * evento. Sem `data-origem`, o link ainda é contado como "sem origem".
 */
export function RastroWhatsapp() {
  useEffect(() => {
    function aoClicar(evento: MouseEvent) {
      const alvo = evento.target as HTMLElement | null;
      const link = alvo?.closest?.("a[href*='wa.me']") as HTMLAnchorElement | null;
      if (!link) return;

      track("whatsapp", {
        origem: link.dataset.origem ?? "sem origem",
        pagina: window.location.pathname,
      });
    }

    document.addEventListener("click", aoClicar);
    return () => document.removeEventListener("click", aoClicar);
  }, []);

  return null;
}
