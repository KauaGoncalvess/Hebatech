import Image from "next/image";
import Link from "next/link";
import { enderecoLinha, navegacao, site } from "@/data/site";
import { waGenerico } from "@/lib/whatsapp";

const CONTATO = [
  { rotulo: site.whatsappVisivel, href: waGenerico(), externo: true },
  { rotulo: "Instagram", href: site.instagram, externo: true },
];

export function SiteFooter() {
  return (
    <footer className="px-3 pb-3 md:px-5 md:pb-5">
      <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[24px] border border-line bg-surface">
        <div className="grid gap-10 p-6 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8 md:p-10">
          <div>
            <Image
              src="/marca/hebatech-selo.png"
              alt={site.nomeCompleto}
              width={64}
              height={64}
              className="rounded-full"
            />
            <p className="mt-5 max-w-[34ch] text-[14px] leading-relaxed text-white/60">
              Assistência técnica, manutenção e venda de equipamento de informática.
              Loja física em {site.endereco.cidade}.
            </p>
            <p className="mt-5 font-mono text-[12px] leading-relaxed text-white/50">
              {enderecoLinha}
            </p>
          </div>

          <nav>
            <p className="eyebrow text-white/45">Páginas</p>
            <ul className="mt-5 space-y-3.5">
              {[
                ...navegacao,
                { href: "/manutencao", rotulo: "Manutenção mensal" },
                { href: "/privacidade", rotulo: "Privacidade" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[14.5px] text-white/65 transition-colors hover:text-accent"
                  >
                    {item.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-white/45">Contato</p>
            <ul className="mt-5 space-y-3.5">
              {CONTATO.map((c) => (
                <li key={c.rotulo}>
                  <a
                    href={c.href}
                    target={c.externo ? "_blank" : undefined}
                    rel={c.externo ? "noopener noreferrer" : undefined}
                    className="text-[14.5px] text-white/65 transition-colors hover:text-accent"
                  >
                    {c.rotulo}
                  </a>
                </li>
              ))}
            </ul>

            <p className="eyebrow mt-8 text-white/45">Horário</p>
            <ul className="mt-4 space-y-2">
              {site.horario.map((h) => (
                <li key={h.dia} className="font-mono text-[12px] text-white/55">
                  {h.dia} · <span className="text-white/70">{h.faixa}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-surface-2 px-6 py-5 text-center md:px-10">
          <p className="font-mono text-[11px] tracking-[0.08em] text-white/50">
            © {new Date().getFullYear()} {site.nomeCompleto} · Preços e disponibilidade
            sujeitos a alteração
          </p>
        </div>
      </div>
    </footer>
  );
}
