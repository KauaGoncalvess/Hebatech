import type { Metadata } from "next";
import { CtaPanel } from "@/components/cta-panel";
import { enderecoLinha, site } from "@/data/site";
import { waGenerico } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato, endereço e horário",
  description: `${site.nomeCompleto} fica em ${enderecoLinha}. Telefone ${site.telefoneFixo}, atendimento de segunda a sexta das 8h30 às 18h.`,
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
    <>
      <section className="mx-auto max-w-[1600px] border-b border-line pt-28 md:pt-36">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="px-4 pt-10 pb-8 md:px-6 md:pt-16 lg:col-span-7 lg:border-r lg:border-line">
            <p className="eyebrow text-accent">
              {site.endereco.cidade} · {site.endereco.uf}
            </p>
            <h1 className="display mt-5 text-title">
              Loja física,
              <br />
              endereço fixo
              <br />
              e bancada própria
            </h1>
            <p className="mt-6 max-w-[52ch] text-[14px] leading-relaxed text-white/60">
              Você pode trazer o aparelho sem agendar. Para conferir um notebook do
              estoque, avise antes pelo WhatsApp — assim ele fica separado e testado na
              sua chegada.
            </p>
          </div>

          <address className="not-italic lg:col-span-5">
            <dl>
              {[
                ["Endereço", enderecoLinha],
                ["CEP", site.endereco.cep],
                ["Referência", `${site.endereco.bairro}, ${site.endereco.cidade}/${site.endereco.uf}`],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="border-t border-line px-4 py-4 md:px-6 lg:first:border-t-0"
                >
                  <dt className="eyebrow text-white/35">{k}</dt>
                  <dd className="mt-2 font-mono text-[13px] text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <a
              href={rotaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border-t border-line px-4 py-4 font-mono text-[11px] tracking-[0.16em] text-accent uppercase transition-colors hover:bg-accent hover:text-black md:px-6"
            >
              Traçar rota no Google Maps
              <span aria-hidden>→</span>
            </a>
          </address>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] border-b border-line">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:border-r lg:border-line">
            <p className="eyebrow border-b border-line px-4 py-3 text-white/35 md:px-6">
              Canais de atendimento
            </p>
            <ul>
              {CANAIS.map((c) => (
                <li key={c.rotulo}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`group flex items-center justify-between gap-4 border-b border-line px-4 py-4 transition-colors md:px-6 ${
                      c.destaque ? "hover:bg-accent hover:text-black" : "hover:bg-surface"
                    }`}
                  >
                    <span>
                      <span className="eyebrow text-white/35 group-hover:text-inherit">
                        {c.rotulo}
                      </span>
                      <span className="mt-1.5 block font-mono text-[14px]">{c.valor}</span>
                      <span className="mt-1 block text-[12px] text-white/45 group-hover:text-inherit">
                        {c.nota}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="font-mono text-base text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-inherit"
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="eyebrow border-b border-line px-4 py-3 text-white/35 md:px-6">
              Horário de funcionamento
            </p>
            <ul>
              {site.horario.map((h) => (
                <li
                  key={h.dia}
                  className="flex items-baseline justify-between border-b border-line px-4 py-3 md:px-6"
                >
                  <span className="text-[13px] text-white/70">{h.dia}</span>
                  <span
                    className={`font-mono text-[12.5px] ${
                      h.faixa === "Fechado" ? "text-white/30" : "text-accent"
                    }`}
                  >
                    {h.faixa}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative min-h-[380px] border-t border-line bg-surface lg:col-span-7 lg:border-t-0">
            <iframe
              src={mapaSrc}
              title={`Mapa com a localização da ${site.nomeCompleto}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full grayscale-[0.85] contrast-[1.05] invert-[0.92] hue-rotate-180"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="px-4 py-10 md:col-span-8 md:border-r md:border-line md:px-6 md:py-14">
            <p className="eyebrow text-white/35">Antes de vir</p>
            <p className="display mt-4 text-sub">
              Uma mensagem economiza a sua viagem
            </p>
            <ul className="mt-6 max-w-[56ch] space-y-2.5">
              {[
                "Peça de reposição de modelo raro pode precisar de encomenda — conferimos na hora.",
                "Notebook do estoque fica separado e ligado para você testar na chegada.",
                "Para empresa, emitimos proposta com prazo e condição de pagamento por e-mail.",
              ].map((t, i) => (
                <li key={t} className="flex gap-3 text-[13.5px] text-white/60">
                  <span className="font-mono text-[10px] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <CtaPanel
            etiqueta="WhatsApp"
            titulo="Confirme o estoque antes de sair de casa"
            acao="Abrir conversa"
            href={waGenerico()}
            className="border-t border-line md:col-span-4 md:border-t-0"
          />
        </div>
      </section>
    </>
  );
}
