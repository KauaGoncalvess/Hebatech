import type { Metadata } from "next";
import Link from "next/link";
import { enderecoLinha, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacidade e uso dos seus dados",
  description:
    "O que a HebaTech faz com o nome, o telefone e as informações do aparelho que você envia pelo site. Nenhum formulário do site grava dado em servidor.",
  alternates: { canonical: "/privacidade" },
};

const BLOCOS: [string, string[]][] = [
  [
    "O formulário do site não grava nada",
    [
      "O formulário de orçamento monta uma mensagem no seu navegador e abre o WhatsApp com o texto pronto. Ele não envia nada para servidor nenhum, não guarda o que você digitou e não cria cadastro.",
      "Se você fechar a página sem enviar, nada fica registrado em lugar algum.",
    ],
  ],
  [
    "O que fica com a gente depois que você manda a mensagem",
    [
      `A partir do momento em que você aperta enviar, a conversa passa a ser um atendimento normal de WhatsApp: ficam o seu número, o seu nome e o que você escreveu, dentro do próprio aplicativo. O WhatsApp é da Meta e tem as regras dele.`,
      "Quando o aparelho entra na loja, registramos nome, telefone, modelo e defeito na ordem de serviço, que é o documento que dá direito à garantia. Guardamos isso pelo prazo da garantia e das obrigações fiscais.",
    ],
  ],
  [
    "Para que usamos",
    [
      "Só para atender, orçar, executar o serviço, emitir nota e acionar a garantia. Não vendemos, não trocamos e não repassamos os seus dados para terceiro nenhum.",
      "Não mandamos propaganda para quem não pediu.",
    ],
  ],
  [
    "Medição de acesso",
    [
      "Usamos a medição de audiência da Vercel, que conta visitas e mede a velocidade das páginas sem cookie e sem identificar quem você é.",
      "A página de contato incorpora o mapa do Google. Ao carregar esse mapa o Google recebe o seu endereço de IP, como acontece em qualquer site que usa o serviço.",
    ],
  ],
  [
    "Seus direitos (LGPD)",
    [
      "A Lei Geral de Proteção de Dados garante que você peça acesso, correção ou exclusão dos seus dados, e que saiba com quem eles foram compartilhados.",
      `Para exercer qualquer um desses direitos, fale com a gente pelo WhatsApp ${site.whatsappVisivel} ou presencialmente na loja. Respondemos no prazo da lei.`,
    ],
  ],
];

export default function PrivacidadePage() {
  return (
    <article className="mx-auto max-w-[1180px] px-5 pt-32 pb-20 md:pt-40 md:pb-28">
      <p className="eyebrow text-accent">Privacidade</p>
      <h1 className="display mt-5 max-w-[18ch] text-title">
        O que fazemos com os seus dados
      </h1>
      <p className="mt-6 max-w-[58ch] text-[15px] leading-relaxed text-white/60">
        Em uma frase: o site não guarda nada, e o que chega pela conversa é usado
        só para atender você.
      </p>

      <div className="mt-12 grid gap-4">
        {BLOCOS.map(([titulo, paragrafos]) => (
          <section key={titulo} className="card p-6 md:p-8">
            <h2 className="display max-w-[26ch] text-sub">{titulo}</h2>
            {paragrafos.map((texto) => (
              <p
                key={texto}
                className="mt-4 max-w-[74ch] text-[14px] leading-relaxed text-white/60"
              >
                {texto}
              </p>
            ))}
          </section>
        ))}
      </div>

      <section className="card mt-4 p-6 md:p-8">
        <h2 className="display text-sub">Quem responde</h2>
        <p className="mt-4 text-[14px] leading-relaxed text-white/60">
          {site.nomeCompleto}
          <br />
          {enderecoLinha}
          <br />
          WhatsApp {site.whatsappVisivel}
        </p>
      </section>

      <Link
        href="/contato"
        className="mt-10 inline-flex items-center gap-3 rounded-full bg-surface-2 px-7 py-4 font-mono text-[11.5px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
      >
        Falar com a loja
        <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
