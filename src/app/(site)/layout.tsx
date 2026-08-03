import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import { classesDeFonte } from "../fonts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsappBubble } from "@/components/whatsapp-bubble";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nomeCompleto} — Sete Lagoas/MG`,
    template: `%s · ${site.nome}`,
  },
  description: site.descricao,
  keywords: [
    "assistência técnica notebook Sete Lagoas",
    "conserto de computador Sete Lagoas",
    "manutenção mensal de computador para empresa",
    "notebook seminovo",
    "Dell Latitude usado",
    "ThinkPad seminovo",
    "HP EliteBook seminovo",
    "PC montado Sete Lagoas",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.nomeCompleto,
    title: `${site.nomeCompleto} — Sete Lagoas/MG`,
    description: site.descricao,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.nomeCompleto }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ComputerStore",
  "@id": `${site.url}#loja`,
  name: site.nomeCompleto,
  description: site.descricao,
  url: site.url,
  image: `${site.url}/og.png`,
  logo: `${site.url}/marca/hebatech-selo.png`,
  telephone: [site.telefoneFixoLink, `+${site.whatsapp}`],
  email: site.email,
  priceRange: "R$$",
  areaServed: {
    "@type": "City",
    name: `${site.endereco.cidade}, ${site.endereco.uf}`,
  },
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapaQuery)}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.endereco.logradouro,
    addressLocality: site.endereco.cidade,
    addressRegion: site.endereco.uf,
    postalCode: site.endereco.cep,
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:30",
      closes: "12:00",
    },
  ],
  sameAs: [site.instagram],
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={classesDeFonte}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-black"
        >
          Pular para o conteúdo
        </a>

        <SiteHeader />
        <main id="conteudo">{children}</main>
        <SiteFooter />
        <WhatsappBubble />

        <script
          type="application/ld+json"
          // Conteúdo estático definido acima — não há entrada de usuário aqui.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Medição sem cookie e sem dado pessoal, só no site público. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
