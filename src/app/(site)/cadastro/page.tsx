import type { Metadata } from "next";
import { Aura } from "@/components/aura";
import { CadastroForm } from "@/components/cadastro-form";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Cadastro de cliente",
  description: `Adiante o seu cadastro na HebaTech, em ${site.endereco.cidade}/${site.endereco.uf}. Preencha uma vez e da próxima é só deixar o aparelho — a ordem de serviço sai na hora.`,
  alternates: { canonical: "/cadastro" },
};

const VANTAGENS = [
  [
    "O balcão anda mais rápido",
    "Com a ficha pronta, deixar o aparelho vira uma assinatura. Sem ditar nome, CPF e endereço no meio da loja.",
  ],
  [
    "Seu histórico fica junto",
    "A gente vê o que já foi feito no seu equipamento em outras visitas — o que ajuda a acertar o diagnóstico mais rápido da próxima vez.",
  ],
  [
    "A nota sai certa",
    "CPF ou CNPJ já cadastrado significa nota fiscal emitida sem retrabalho na hora da retirada.",
  ],
];

export default function CadastroPage() {
  return (
    <section className="relative overflow-hidden">
      <Aura className="-top-40 -right-32 h-[520px] w-[520px]" />
      <div className="relative mx-auto max-w-[1180px] px-5 pt-32 pb-20 md:pt-40 md:pb-28">
        <p className="eyebrow text-accent">Cadastro</p>
        <h1 className="display mt-5 max-w-[18ch] text-title">
          Adiante o seu cadastro
        </h1>
        <p className="mt-6 max-w-[58ch] text-corpo-g leading-relaxed text-texto-3">
          Não é obrigatório e não cria senha nenhuma. É só para você não perder tempo no
          balcão quando trouxer o aparelho.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.25fr_1fr] lg:items-start">
          <CadastroForm />

          <aside className="mt-12 grid gap-3">
            {VANTAGENS.map(([titulo, texto]) => (
              <div key={titulo} className="card p-6">
                <p className="font-mono text-nota tracking-[0.06em] text-white">
                  {titulo}
                </p>
                <p className="mt-2.5 text-nota leading-relaxed text-texto-3">
                  {texto}
                </p>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
