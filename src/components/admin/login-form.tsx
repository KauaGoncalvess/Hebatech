"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { criarClienteNavegador } from "@/lib/supabase/browser";
import { Campo, Entrada } from "./campo";

/**
 * O destino vem da URL (`?de=`), então é texto de fora. Como o login termina
 * numa navegação de página inteira, um valor como `//outro-site.com` levaria a
 * pessoa para longe daqui achando que ainda está na loja. Só passa caminho
 * interno do painel; qualquer outra coisa vira a capa do painel.
 */
function destinoSeguro(bruto: string | null): string {
  if (!bruto || !bruto.startsWith("/admin") || bruto.startsWith("//")) return "/admin";
  return bruto;
}

export function LoginForm() {
  const params = useSearchParams();
  const destino = destinoSeguro(params.get("de"));

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setEntrando(true);

    const supabase = criarClienteNavegador();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) {
      setErro(
        error.message.toLowerCase().includes("invalid")
          ? "E-mail ou senha incorretos."
          : error.message,
      );
      setEntrando(false);
      return;
    }

    /**
     * Navegação de página inteira, e não `router.replace`.
     *
     * Quem chega aqui quase sempre bateu no /admin antes e foi mandado embora
     * pelo middleware. O Next guarda esse desvio por alguns minutos, então a
     * navegação interna reaproveitava a resposta de quando ainda não havia
     * sessão — o login funcionava e a tela continuava a mesma. Recarregar a
     * página joga a pergunta de volta para o servidor, agora com o cookie.
     */
    window.location.replace(destino);
  }

  return (
    <form onSubmit={entrar} className="card overflow-hidden">
      <p className="eyebrow px-6 pt-6 text-white/45">Entrar</p>

      <div className="flex flex-col gap-5 p-6">
        <Campo rotulo="E-mail" obrigatorio>
          <Entrada
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </Campo>

        <Campo rotulo="Senha" obrigatorio>
          <Entrada
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            required
          />
        </Campo>

        {erro && <p className="font-mono text-[11.5px] text-accent">{erro}</p>}
      </div>

      <button
        type="submit"
        disabled={entrando}
        className="m-6 mt-0 flex h-14 items-center justify-center rounded-full bg-accent font-mono text-[12px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-white disabled:opacity-50"
      >
        {entrando ? "Entrando..." : "Entrar no painel"}
      </button>
    </form>
  );
}
