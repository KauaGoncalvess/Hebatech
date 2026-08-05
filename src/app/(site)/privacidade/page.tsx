import type { Metadata } from "next";
import Link from "next/link";
import { enderecoLinha, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacidade e uso dos seus dados",
  description:
    "O que a HebaTech faz com o nome, o telefone e as informações do aparelho que você envia pelo site: o que fica guardado, por quê e por quanto tempo.",
  alternates: { canonical: "/privacidade" },
};

const BLOCOS: [string, string[]][] = [
  [
    "O que o formulário de orçamento guarda",
    [
      "Quando você aperta o botão de enviar, duas coisas acontecem ao mesmo tempo: o WhatsApp abre com a mensagem pronta e o pedido fica registrado com a gente. Ficam guardados o nome, o telefone, o tipo de aparelho, a marca, o modelo, o defeito escolhido e os detalhes que você escreveu.",
      "O motivo é simples e vale a pena ser dito: muita gente preenche, o WhatsApp abre e a mensagem acaba não sendo enviada. Sem esse registro, a gente nunca fica sabendo que você precisava de ajuda e você fica sem resposta.",
      "Enquanto você está digitando, nada sai do seu navegador. Se fechar a página sem apertar enviar, nada é gravado.",
      "Usamos esse registro só para retornar o seu contato. Ele fica guardado por até 12 meses e depois é apagado. Se você preferir que a gente apague antes, é só pedir pelo WhatsApp — apagamos na hora e sem perguntar por quê.",
    ],
  ],
  [
    "Se você fizer o cadastro de cliente",
    [
      "O cadastro em /cadastro é opcional e não cria senha nem conta. Ele guarda o que você preencher: nome, telefone e, se você quiser informar, CPF ou CNPJ, e-mail, endereço e o recado que escrever.",
      "Serve para uma coisa só: quando você trouxer um aparelho, a ordem de serviço sair sem você precisar ditar tudo de novo no balcão, e a nota fiscal sair com os dados certos.",
      "Esses dados ficam guardados enquanto você for cliente da loja. A qualquer momento você pode pedir para ver, corrigir ou apagar — basta falar no WhatsApp, e apagamos sem perguntar por quê.",
      "O cadastro não te inscreve em lista de propaganda. A gente não manda mensagem em massa.",
    ],
  ],
  [
    "A ordem de serviço e o acompanhamento",
    [
      "Quando o aparelho entra na loja, a ordem de serviço registra nome, telefone, equipamento, defeito, o que foi feito e o valor. É o documento que dá direito à garantia, e por isso é guardado pelo prazo da garantia e das obrigações fiscais.",
      "A página de acompanhamento mostra só a etapa, o aparelho, a previsão e o recado da bancada — nunca o seu nome nem o seu telefone. Para abrir, é preciso o código da ordem e os quatro últimos dígitos do seu telefone, justamente para que ninguém veja o aparelho de outra pessoa.",
    ],
  ],
  [
    "O que fica com a gente depois que você manda a mensagem",
    [
      `A partir do momento em que você aperta enviar, a conversa passa a ser um atendimento normal de WhatsApp: ficam o seu número, o seu nome e o que você escreveu, dentro do próprio aplicativo. O WhatsApp é da Meta e tem as regras dele.`,
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
        Em uma frase: guardamos o pedido de orçamento só para conseguir te
        retornar, e nada do que chega aqui é usado para outra coisa.
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
