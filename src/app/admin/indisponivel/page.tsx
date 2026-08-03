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
      "Preencha o .env.local",
      "NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY, copiados de Project Settings → API.",
    ],
    ["05", "Suba o catálogo inicial", "npm run seed — leva os produtos do arquivo para o banco."],
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
      <p className="mt-6 max-w-[54ch] text-[14px] text-white/60">
        O site está no ar normalmente com o catálogo do arquivo, mas o painel só
        funciona depois que o Supabase estiver configurado. São cinco passos.
      </p>

      <ol className="mt-10 grid gap-3">
        {passos.map(([n, titulo, texto]) => (
          <li key={n} className="card flex gap-5 p-5">
            <span className="font-mono text-[11px] text-accent">{n}</span>
            <span>
              <span className="block font-mono text-[13px] tracking-[0.04em]">{titulo}</span>
              <span className="mt-1.5 block max-w-[56ch] text-[12.5px] text-white/50">
                {texto}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-3 rounded-full bg-surface-2 px-7 py-4 font-mono text-[11.5px] tracking-[0.12em] uppercase transition-colors hover:bg-surface-3"
      >
        Voltar para o site
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
