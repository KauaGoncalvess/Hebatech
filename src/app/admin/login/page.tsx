import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-between p-6 lg:p-10">
        <Logo />
        <div className="py-16">
          <p className="eyebrow text-accent">Área restrita</p>
          <h1 className="display mt-5 text-title">
            Painel do
            <br />
            catálogo
          </h1>
          <p className="mt-6 max-w-[42ch] text-nota text-texto-3">
            Aqui você cadastra produto, sobe foto, muda preço e tira do ar o que já
            vendeu. A alteração aparece no site em segundos.
          </p>
        </div>
        <p className="font-mono text-rotulo tracking-[0.14em] text-texto-3 uppercase">
          Acesso só para a equipe da loja
        </p>
      </div>

      <div className="flex items-center p-6 lg:p-10">
        <div className="w-full max-w-[380px]">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
