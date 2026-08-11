import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Manual da loja",
  robots: { index: false, follow: false },
};

/**
 * Manual do sistema, em português de balcão.
 *
 * Sai do layout do painel de propósito, como a etiqueta: é uma folha para
 * imprimir e deixar na gaveta. Quem usa o sistema não é quem o construiu, e
 * daqui a um ano pode não ser nem quem foi treinado — a instrução precisa
 * existir em papel, sem depender de ninguém estar por perto.
 *
 * Nada aqui fala de terminal, de comando ou de código: essas coisas são para
 * quem for mexer no sistema, e essa pessoa não lê este manual.
 */

type Bloco = { titulo: string; passos: string[] };

const OPERACAO: Bloco[] = [
  {
    titulo: "Receber um aparelho na bancada",
    passos: [
      "No painel, toque em Ordens e depois em Nova ordem.",
      "No campo Cliente, comece a digitar o nome, o telefone ou o CPF. Se a pessoa já veio antes, o cadastro dela aparece num cartão — toque no cartão e os dados entram sozinhos. Se não aparecer nada, é cliente novo: escreva o nome completo e o telefone.",
      "O número da ordem já vem preenchido e não se mexe. Ele segue a sequência do ano.",
      "Preencha tipo, marca, modelo e o defeito que o cliente relatou. Escreva com as palavras dele — é isso que vale se houver discussão depois.",
      "Salve. Anote o número da ordem no comprovante que fica com o cliente: é com ele que a pessoa acompanha o conserto pelo site.",
    ],
  },
  {
    titulo: "Andar com o serviço",
    passos: [
      "Na lista de Ordens, cada aparelho tem a etapa em que está. Toque na ordem para abrir.",
      "Mude a etapa conforme o trabalho anda: Recebido, Diagnosticado, Esperando o cliente aprovar, Em reparo, Pronto para retirar, Entregue.",
      "Assim que você muda a etapa, o cliente já vê a mudança no site. Ele não precisa ligar para perguntar.",
      "Quando ficar pronto, use o botão do WhatsApp da própria ordem: a mensagem já sai escrita, é só enviar.",
      "Na entrega, mude para Entregue. A garantia conta a partir daí.",
    ],
  },
  {
    titulo: "Ver o histórico de um cliente",
    passos: [
      "Vá em Clientes e procure por nome, telefone ou CPF.",
      "Abra a ficha: aparecem todas as ordens que a pessoa já teve, com defeito, solução e número de cada uma.",
      "Serve para consulta de garantia e para lembrar o que já foi trocado naquela máquina.",
    ],
  },
];

const CATALOGO: Bloco[] = [
  {
    titulo: "Colocar um produto à venda",
    passos: [
      "Produtos, depois Novo produto.",
      "Preencha marca, modelo, ficha e preço. Tire a foto com o aparelho ligado, de dia, num fundo limpo — foto boa vende sozinha.",
      "Salve. O produto aparece no site na hora, sem precisar publicar nada.",
      "Para cadastrar vários parecidos, abra um que já existe e use Duplicar: copia tudo e você só troca o que muda.",
    ],
  },
  {
    titulo: "Etiqueta e post do Instagram",
    passos: [
      "Dentro do produto, Baixar etiqueta imprime uma tira com o código de barras quadrado. Cole no aparelho da prateleira: o cliente aponta a câmera e vê a ficha completa.",
      "Baixar post do Instagram gera a arte pronta, no tamanho certo do feed. É só publicar.",
    ],
  },
  {
    titulo: "Produto vendido",
    passos: [
      "Abra o produto e desmarque Disponível. Ele sai do site na hora, mas continua guardado aqui.",
      "Não apague: o histórico serve para lembrar por quanto você vendeu.",
    ],
  },
];

const DINHEIRO: Bloco[] = [
  {
    titulo: "Fechar o serviço com o valor certo",
    passos: [
      "Na ordem existem três campos de dinheiro: valor orçado (o que foi combinado), valor cobrado (o que o cliente pagou de fato) e custo da peça (o que você gastou).",
      "Preencha o cobrado e o custo antes de marcar como Entregue.",
      "Assim que a ordem sai como Entregue, ela entra sozinha no caixa: o serviço como entrada, a peça como saída. Não precisa lançar de novo.",
      "Se corrigir o valor depois e salvar de novo, o caixa se corrige junto — não duplica.",
    ],
  },
  {
    titulo: "Lançar o que não vem de ordem de serviço",
    passos: [
      "Caixa, depois Lançar. Escolha se entrou ou saiu dinheiro, o valor e do que se trata.",
      "Se for fiado, carnê ou boleto a vencer, desmarque \u201cjá recebi\u201d e ponha a data de vencimento. Fica em aberto até você dar baixa.",
      "Na lista, o botão Recebi ou Paguei dá a baixa. O que passou do vencimento aparece marcado como vencido.",
    ],
  },
  {
    titulo: "Saber quanto está parado na prateleira",
    passos: [
      "No cadastro do produto existe o campo Custo — quanto você pagou. Ele nunca aparece no site.",
      "Com o custo preenchido, a tela do Caixa mostra o lucro que ainda está na prateleira.",
      "É o número que ajuda a decidir baixar o preço do que está encalhado há meses.",
    ],
  },
];

const CUIDADOS: Bloco[] = [
  {
    titulo: "Cópia de segurança — todo mês, sem falta",
    passos: [
      "No painel, entre em Cópia de segurança e toque em Baixar a cópia agora.",
      "Mande o arquivo para o seu Google Drive ou para você mesmo no WhatsApp. Não deixe só no computador da loja.",
      "Guarde as três últimas. Marque no celular para o primeiro dia útil do mês.",
      "Esse arquivo é a única coisa que salva o histórico se o sistema se perder. Sem ele, não há como recuperar.",
    ],
  },
  {
    titulo: "Pedidos de orçamento que chegam do site",
    passos: [
      "Tudo que alguém preenche no formulário do site cai em Orçamentos — inclusive de quem desistiu antes de mandar a mensagem.",
      "Esses são os que mais valem uma ligação: a pessoa já disse o que tem e qual o aparelho.",
      "Depois de responder, marque como atendido para não retornar duas vezes.",
    ],
  },
];

const PROBLEMAS = [
  {
    q: "O site abriu, mas os produtos sumiram e o painel dá erro",
    a: "O banco de dados provavelmente foi pausado por falta de uso — isso acontece quando o sistema fica cerca de uma semana sem ninguém acessar, por exemplo depois de férias. Entre no painel do Supabase com a conta da loja e clique em restaurar o projeto. Volta em alguns minutos, sem perder nada.",
  },
  {
    q: "Esqueci a senha do painel",
    a: "Na tela de entrada existe a opção de recuperar por e-mail. O e-mail é o da conta que foi cadastrada na entrega do sistema.",
  },
  {
    q: "Mudei o preço e o site continua mostrando o antigo",
    a: "Espere alguns minutos e atualize a página segurando a tecla de recarregar. O site guarda uma cópia por pouco tempo para carregar rápido.",
  },
  {
    q: "Preciso mudar endereço, horário ou telefone da loja",
    a: "Isso não está no painel: fica dentro do sistema e precisa de quem mexe no código. Guarde os dados de acesso das contas e chame um profissional — é meia hora de serviço.",
  },
];

function Secao({ titulo, blocos }: { titulo: string; blocos: Bloco[] }) {
  return (
    <section className="break-inside-avoid">
      <h2 className="mt-10 border-b-2 border-black pb-2 text-corpo-g font-bold tracking-[0.1em] uppercase">
        {titulo}
      </h2>
      {blocos.map((b) => (
        <div key={b.titulo} className="mt-6 break-inside-avoid">
          <h3 className="text-corpo-g font-bold">{b.titulo}</h3>
          <ol className="mt-2 grid gap-1.5">
            {b.passos.map((p, i) => (
              <li key={p} className="flex gap-3 text-nota leading-relaxed">
                <span className="w-4 shrink-0 text-right font-bold tabular-nums">
                  {i + 1}.
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}

export default function ManualPage() {
  return (
    <div className="min-h-screen bg-white p-6 text-black print:p-0">
      <div className="mx-auto max-w-[760px]">
        <div className="flex flex-wrap gap-3 print:hidden">
          <Link
            href="/admin"
            className="rounded-full bg-black/5 px-5 py-3 font-mono text-rotulo tracking-[0.12em] uppercase"
          >
            ← Voltar ao painel
          </Link>
          <span className="rounded-full bg-black/5 px-5 py-3 font-mono text-rotulo tracking-[0.12em] uppercase">
            Para imprimir: Ctrl + P
          </span>
        </div>

        <header className="mt-8 border-b-4 border-black pb-5">
          <p className="font-mono text-rotulo tracking-[0.2em] uppercase">
            {site.nomeCompleto}
          </p>
          <h1 className="mt-2 text-[34px] leading-none font-bold tracking-tight">
            Manual do sistema
          </h1>
          <p className="mt-3 max-w-[62ch] text-nota leading-relaxed">
            Como usar o painel da loja no dia a dia. Guarde esta folha na gaveta
            do balcão. O painel fica em{" "}
            <strong>{site.url.replace("https://", "")}/admin</strong>.
          </p>
        </header>

        <Secao titulo="Bancada" blocos={OPERACAO} />
        <Secao titulo="Catálogo" blocos={CATALOGO} />
        <Secao titulo="Dinheiro" blocos={DINHEIRO} />
        <Secao titulo="Cuidados" blocos={CUIDADOS} />

        <section className="break-inside-avoid">
          <h2 className="mt-10 border-b-2 border-black pb-2 text-corpo-g font-bold tracking-[0.1em] uppercase">
            Se der problema
          </h2>
          <dl className="mt-6 grid gap-5">
            {PROBLEMAS.map((p) => (
              <div key={p.q} className="break-inside-avoid">
                <dt className="text-corpo font-bold">{p.q}</dt>
                <dd className="mt-1 text-nota leading-relaxed">{p.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10 break-inside-avoid border-2 border-black p-5">
          <h2 className="text-corpo-g font-bold tracking-[0.1em] uppercase">
            Onde ficam as chaves da casa
          </h2>
          <p className="mt-3 max-w-[62ch] text-nota leading-relaxed">
            O sistema depende de quatro contas, todas no nome da loja. Anote os
            acessos aqui e guarde esta folha em lugar seguro — sem elas ninguém
            consegue mexer no sistema, nem você.
          </p>
          <ul className="mt-5 grid gap-3">
            {[
              ["Painel da loja", "e-mail e senha de quem entra em /admin"],
              ["Vercel", "onde o site fica hospedado"],
              ["Supabase", "onde ficam os dados; é aqui que se religa o banco"],
              ["Registro.br", "o endereço do site na internet, renova todo ano"],
            ].map(([nome, oque]) => (
              <li key={nome} className="flex flex-wrap items-end gap-x-3 gap-y-1">
                <span className="text-nota font-bold">{nome}</span>
                <span className="text-nota">({oque})</span>
                <span className="min-w-[160px] flex-1 border-b border-dotted border-black/50" />
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8 pb-10 text-rotulo text-black/50">
          Dúvida que não está aqui? Guarde o contato de quem entregou o sistema.
        </p>
      </div>
    </div>
  );
}
