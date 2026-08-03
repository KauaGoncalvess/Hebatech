import type { Metadata } from "next";
import { enderecoLinha, site } from "@/data/site";
import { waGenerico } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato, endereço e horário",
  description: `${site.nomeCompleto} fica em ${enderecoLinha}. Telefone ${site.telefoneFixo}, atendimento de segunda a sexta das 8h30 às 18h.`,
  alternates: { canonical: "/contato" },
};

const mapaSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapaQuery)}&output=embed&hl=pt-BR`;
const rotaHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.mapaQuery)}`;

const CANAIS = [
  {
    rotulo: "WhatsApp",
    valor: site.whatsappVisivel,
    nota: "Resposta no horário comercial",
    href: waGenerico(),
    destaque: true,
  },
  {
    rotulo: "Telefone fixo",
    valor: site.telefoneFixo,
    nota: "Durante o expediente da loja",
    href: `tel:${site.telefoneFixoLink}`,
    destaque: false,
  },
  {
    rotulo: "Instagram",
    valor: site.instagramHandle,
    nota: "Estoque novo e serviço do dia",
    href: site.instagram,
    destaque: false,
  },
  {
    rotulo: "E-mail",
    valor: site.email,
    nota: "Para nota fiscal e proposta de empresa",
    href: `mailto:${site.email}`,
    destaque: false,
  },
];

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 pt-32 pb-20 md:pt-40 md:pb-28">
      <p className="eyebrow text-accent">
        {site.endereco.cidade} · {site.endereco.uf}
      </p>
      <h1 className="display mt-5 max-w-[15ch] text-title">
        Loja física, endereço fixo e bancada própria
      </h1>
      <p className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-white/60">
        Você pode trazer o aparelho sem agendar. Para conferir um produto do estoque,
        avise antes pelo WhatsApp — assim ele fica separado e testado na sua chegada.
      </p>

      <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {CANAIS.map((c) => (
              <li key={c.rotulo}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`spot card group flex items-center justify-between gap-4 p-5 transition-colors ${
                    c.destaque ? "hover:bg-accent hover:text-black" : "hover:bg-surface-2"
                  }`}
                >
                  <span>
                    <span className="eyebrow text-white/35 group-hover:text-inherit">
                      {c.rotulo}
                    </span>
                    <span className="mt-2 block font-mono text-[15px]">{c.valor}</span>
                    <span className="mt-1 block text-[12.5px] text-white/45 group-hover:text-inherit">
                      {c.nota}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-lg text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-inherit"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="card p-6">
            <p className="eyebrow text-white/35">Horário de funcionamento</p>
            <ul className="mt-4 space-y-3">
              {site.horario.map((h) => (
                <li key={h.dia} className="flex items-baseline justify-between gap-4">
                  <span className="text-[14px] text-white/70">{h.dia}</span>
                  <span
                    className={`font-mono text-[13px] ${
                      h.faixa === "Fechado" ? "text-white/30" : "text-accent"
                    }`}
                  >
                    {h.faixa}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card overflow-hidden">
            <div className="relative min-h-[380px] bg-surface-2 lg:min-h-[460px]">
              <iframe
                src={mapaSrc}
                title={`Mapa com a localização da ${site.nomeCompleto}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full grayscale-[0.85] contrast-[1.05] invert-[0.92] hue-rotate-180"
              />
            </div>
            <div className="p-5">
              <p className="eyebrow text-white/35">Endereço</p>
              <p className="mt-2 font-mono text-[13.5px] text-white/80">{enderecoLinha}</p>
              <p className="mt-1 font-mono text-[12.5px] text-white/45">
                CEP {site.endereco.cep}
              </p>
              <a
                href={rotaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex h-12 items-center justify-center rounded-full bg-surface-2 font-mono text-[11.5px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
              >
                Traçar rota no Google Maps
              </a>
            </div>
          </div>

          <div className="card p-6">
            <p className="eyebrow text-white/35">Antes de vir</p>
            <ul className="mt-4 space-y-3">
              {[
                "Peça de modelo raro pode precisar de encomenda — conferimos na hora.",
                "Produto do estoque fica separado e ligado para você testar na chegada.",
                "Para empresa, emitimos proposta com prazo e condição por e-mail.",
              ].map((t, i) => (
                <li key={t} className="flex gap-3 text-[13.5px] text-white/60">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[10px] font-bold text-black">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="spot card mt-4 p-6 text-center md:p-12">
        <p className="eyebrow text-accent">WhatsApp</p>
        <h2 className="display mx-auto mt-5 max-w-[20ch] text-title">
          Confirme o estoque antes de sair de casa
        </h2>
        <a
          href={waGenerico()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex h-14 items-center rounded-full bg-accent px-8 font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white"
        >
          Abrir conversa
        </a>
      </div>
    </div>
  );
}
