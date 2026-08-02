import Image from "next/image";
import Link from "next/link";
import { enderecoLinha, navegacao, site } from "@/data/site";
import { waGenerico } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="border-b border-line p-4 md:col-span-4 md:border-r md:border-b-0 md:p-6">
            {/* Badge circular: o único lugar do site com raio. */}
            <Image
              src="/marca/hebatech-selo.png"
              alt={site.nomeCompleto}
              width={92}
              height={92}
              className="rounded-full border border-line"
            />
            <p className="mt-5 max-w-[38ch] text-[13px] text-white/55">
              Loja física em {site.endereco.cidade}. Assistência técnica, consultoria e
              venda de notebooks corporativos revisados, com garantia por escrito.
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block font-mono text-[11px] tracking-[0.14em] text-white/60 underline decoration-line underline-offset-4 transition-colors hover:text-accent"
            >
              {site.instagramHandle}
            </a>
          </div>

          <nav className="border-b border-line md:col-span-3 md:border-r md:border-b-0">
            <p className="eyebrow border-b border-line px-4 py-3 text-white/35 md:px-6">
              Páginas
            </p>
            {navegacao.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-baseline gap-3 border-b border-line px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-2 hover:text-accent md:px-6"
              >
                <span className="font-mono text-[10px] text-white/30">{item.indice}</span>
                <span className="font-mono text-[11px] tracking-[0.14em] uppercase">
                  {item.rotulo}
                </span>
              </Link>
            ))}
          </nav>

          <div className="border-b border-line md:col-span-5 md:border-b-0">
            <p className="eyebrow border-b border-line px-4 py-3 text-white/35 md:px-6">
              Contato e horário
            </p>
            <dl className="px-4 py-4 md:px-6">
              {[
                ["Endereço", enderecoLinha],
                ["CEP", site.endereco.cep],
                ["Fixo", site.telefoneFixo],
                ["WhatsApp", site.whatsappVisivel],
                ["E-mail", site.email],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 border-b border-line py-2 last:border-b-0">
                  <dt className="w-20 shrink-0 font-mono text-[9.5px] tracking-[0.16em] text-white/35 uppercase">
                    {k}
                  </dt>
                  <dd className="font-mono text-[11.5px] text-white/75">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="grid grid-cols-2 border-t border-line">
              {site.horario.map((h) => (
                <div key={h.dia} className="border-r border-line px-4 py-3 last:border-r-0 md:px-6">
                  <p className="font-mono text-[9.5px] tracking-[0.14em] text-white/35 uppercase">
                    {h.dia}
                  </p>
                  <p className="mt-1 font-mono text-[12px] text-white">{h.faixa}</p>
                </div>
              ))}
              <a
                href={waGenerico()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border-t border-line px-4 py-3 font-mono text-[11px] tracking-[0.14em] text-accent uppercase transition-colors hover:bg-accent hover:text-black md:px-6"
              >
                Abrir conversa →
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line px-4 py-4 font-mono text-[10px] tracking-[0.12em] text-white/30 uppercase md:flex-row md:items-center md:justify-between md:px-6">
          <p>
            © {new Date().getFullYear()} {site.nomeCompleto}
          </p>
          <p>
            Preços e disponibilidade sujeitos a alteração sem aviso · Consulte o
            estoque antes da visita
          </p>
        </div>
      </div>
    </footer>
  );
}
