import type { Metadata, Viewport } from "next";
import "../globals.css";
import { classesDeFonte } from "../fonts";

export const metadata: Metadata = {
  title: "Painel · HebaTech",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

/** Raiz do painel: sem cabeçalho, rodapé ou barra de WhatsApp do site. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={classesDeFonte}>
      <body>{children}</body>
    </html>
  );
}
