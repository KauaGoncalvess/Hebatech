import Link from "next/link";
import { Logo } from "@/components/logo";

/** Mostrada quando o site roda sem Supabase: o site funciona, o painel não. */
export default function PainelIndisponivel() {
  const passos = [
    ["01", "Crie um projeto no Supabase", "supabase.com — o plano gratuito atende a loja."],
    [
      "02",
      "Rode o supabase/schema.sql",
      "No SQL Editor, cole o arquivo inteiro e execute. Ele cria a tabela e o bucket de fotos.",
    ],
    [
      "03",
      "Crie o usuário do painel",
      "Authentication → Users → Add user. Depois desligue “Enable sign ups” em Providers → Email.",
    ],
    [
      "04",
      "Cadastre as duas chaves",
      "NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY, copiadas do Supabase, no serviço onde o site está hospedado. Depois é preciso publicar de novo para elas valerem.",
    ],
    [
      "05",
      "Suba o catálogo inicial",
      "No SQL Editor, cole o supabase/carga-inicial.sql. Só se a loja quiser começar com produtos de exemplo — dá para cadastrar os de verdade direto pelo painel.",
    ],
  ];

  return (
    <div className="mx-auto max-w-[900px] px-4 py-10 md:px-6 md:py-16">
      <Logo />

      <p className="eyebrow mt-12 text-accent">Painel indisponível</p>
      <h1 className="display mt-4 text-title">
        Falta conectar
        <br />
        o banco de dados
      </h1>
      <p className="mt-6 max-w-[54ch] text-corpo leading-relaxed text-texto-3">
        O site continua no ar e atendendo — só o painel é que não abre até a conexão
        com o banco ser configurada.
      </p>

      {/* Esta página tem dois leitores, e a lista serve a só um deles. Sem dizer
          isso, quem atende no balcão fica tentando entender instruções que não
          são para ele. */}
      <p className="card mt-8 max-w-[60ch] p-5 text-nota leading-relaxed text-texto-2">
        <span className="font-mono text-accent">Se você é da loja:</span> não há nada
        para fazer aqui. Avise quem cuida do sistema e mostre esta tela — a lista
        abaixo é o passo a passo dele.
      </p>

      <ol className="mt-6 grid gap-3">
        {passos.map(([n, titulo, texto]) => (
          <li key={n} className="card flex gap-5 p-5">
            <span className="font-mono text-rotulo text-accent">{n}</span>
            <span>
              <span className="block font-mono text-nota tracking-[0.04em]">{titulo}</span>
              <span className="mt-1.5 block max-w-[56ch] text-nota text-texto-3">
                {texto}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-3 rounded-full bg-surface-2 px-7 py-4 font-mono text-rotulo tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
      >
        Voltar para o site
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
