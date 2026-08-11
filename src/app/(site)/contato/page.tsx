import type { Metadata } from "next";
import { enderecoLinha, site } from "@/data/site";
import { waGenerico } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato, endereço e horário",
  description: `${site.nomeCompleto} fica em ${enderecoLinha}. Atendimento pelo WhatsApp ${site.whatsappVisivel}, de segunda a sexta das 8h30 às 18h.`,
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
    rotulo: "Instagram",
    valor: site.instagramHandle,
    nota: "Estoque novo e serviço do dia",
    href: site.instagram,
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
      <p className="mt-6 max-w-[56ch] text-corpo-g leading-relaxed text-texto-3">
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
                  className={`card group flex items-center justify-between gap-4 p-5 transition-colors ${
                    c.destaque ? "hover:bg-accent hover:text-black" : "hover:bg-surface-2"
                  }`}
                >
                  <span>
                    <span className="eyebrow text-texto-3 group-hover:text-inherit">
                      {c.rotulo}
                    </span>
                    <span className="mt-2 block font-mono text-corpo-g">{c.valor}</span>
                    <span className="mt-1 block text-nota text-texto-3 group-hover:text-inherit">
                      {c.nota}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-lg text-texto-3 transition-transform group-hover:translate-x-1 group-hover:text-inherit"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="card p-6">
            <p className="eyebrow text-texto-3">Horário de funcionamento</p>
            <ul className="mt-4 space-y-3">
              {site.horario.map((h) => (
                <li key={h.dia} className="flex items-baseline justify-between gap-4">
                  <span className="text-corpo text-texto-2">{h.dia}</span>
                  <span
                    className={`font-mono text-nota ${
                      h.faixa === "Fechado" ? "text-texto-3" : "text-accent"
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
              <p className="eyebrow text-texto-3">Endereço</p>
              <p className="mt-2 font-mono text-nota text-texto-2">{enderecoLinha}</p>
              <p className="mt-1 font-mono text-nota text-texto-3">
                CEP {site.endereco.cep}
              </p>
              <a
                href={rotaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex h-12 items-center justify-center rounded-full bg-surface-2 font-mono text-rotulo tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
              >
                Traçar rota no Google Maps
              </a>
            </div>
          </div>

          <div className="card p-6">
            <p className="eyebrow text-texto-3">Antes de vir</p>
            <ul className="mt-4 space-y-3">
              {[
                "Peça de modelo raro pode precisar de encomenda — conferimos na hora.",
                "Produto do estoque fica separado e ligado para você testar na chegada.",
                "Para empresa, mandamos a proposta com prazo e condição pelo WhatsApp.",
              ].map((t, i) => (
                <li key={t} className="flex gap-3 text-nota text-texto-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-rotulo font-bold text-black">
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
          className="mt-8 inline-flex h-14 items-center rounded-full bg-accent px-8 font-mono text-nota font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-accent-hover"
        >
          Abrir conversa
        </a>
      </div>
    </div>
  );
}
