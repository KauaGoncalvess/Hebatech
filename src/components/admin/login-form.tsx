"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { criarClienteNavegador } from "@/lib/supabase/browser";
import { Campo, Entrada } from "./campo";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const destino = params.get("de") ?? "/admin";

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

    router.replace(destino);
    router.refresh();
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
