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
            <p className="mt-5 max-w-[34ch] text-corpo leading-relaxed text-texto-3">
              Assistência técnica, manutenção e venda de equipamento de informática.
              Loja física em {site.endereco.cidade}.
            </p>
            <p className="mt-5 font-mono text-nota leading-relaxed text-texto-3">
              {enderecoLinha}
            </p>
          </div>

          <nav>
            <p className="eyebrow text-texto-3">Páginas</p>
            <ul className="mt-5 space-y-3.5">
              {[
                ...navegacao,
                { href: "/manutencao", rotulo: "Manutenção mensal" },
                { href: "/acompanhar", rotulo: "Acompanhar conserto" },
                { href: "/cadastro", rotulo: "Cadastro de cliente" },
                { href: "/privacidade", rotulo: "Privacidade" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-corpo text-texto-2 transition-colors hover:text-accent"
                  >
                    {item.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-texto-3">Contato</p>
            <ul className="mt-5 space-y-3.5">
              {CONTATO.map((c) => (
                <li key={c.rotulo}>
                  <a
                    href={c.href}
                    target={c.externo ? "_blank" : undefined}
                    rel={c.externo ? "noopener noreferrer" : undefined}
                    className="text-corpo text-texto-2 transition-colors hover:text-accent"
                  >
                    {c.rotulo}
                  </a>
                </li>
              ))}
            </ul>

            <p className="eyebrow mt-8 text-texto-3">Horário</p>
            <ul className="mt-4 space-y-2">
              {site.horario.map((h) => (
                <li key={h.dia} className="font-mono text-nota text-texto-3">
                  {h.dia} · <span className="text-texto-2">{h.faixa}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-surface-2 px-6 py-5 text-center md:px-10">
          <p className="font-mono text-rotulo tracking-[0.08em] text-texto-3">
            © {new Date().getFullYear()} {site.nomeCompleto} · Preços e disponibilidade
            sujeitos a alteração
          </p>
        </div>
      </div>
    </footer>
  );
}
