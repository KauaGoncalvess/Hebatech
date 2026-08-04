"use client";

import { useEffect, useState } from "react";
import { waGenerico } from "@/lib/whatsapp";

/**
 * Balão flutuante do WhatsApp no canto inferior direito.
 * Aparece depois de uma rolagem curta para não cobrir o topo logo de cara.
 */
export function WhatsappBubble() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > 160);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <a
      href={waGenerico()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com um técnico no WhatsApp"
      // Invisível também sai da ordem de tabulação: sem isso o Tab no topo da
      // página cai num link que ninguém enxerga.
      tabIndex={visivel ? undefined : -1}
      aria-hidden={visivel ? undefined : true}
      className={`group fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-black ring-4 ring-ink/80 shadow-[0_10px_30px_-8px_rgba(255,107,24,0.6)] transition-all duration-300 hover:bg-white md:right-6 md:bottom-6 md:h-16 md:w-16 ${
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.73 2.65 4.2 3.71.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.22-.17-.47-.29Z" />
      </svg>

      {/* Rótulo que abre no hover, só onde há mouse */}
      <span className="pointer-events-none absolute right-full mr-3 hidden origin-right scale-95 rounded-full bg-surface-3 px-4 py-2 font-mono text-[11px] whitespace-nowrap text-white opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 lg:block">
        Falar com um técnico
      </span>
    </a>
  );
}
