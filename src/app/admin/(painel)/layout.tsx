import { PainelNav } from "@/components/admin/painel-nav";

/** Moldura das telas autenticadas do painel. A tela de login fica fora daqui. */
export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PainelNav />
      {/* Até 1600px em telas grandes: o painel é ferramenta de trabalho, e
          largura sobrando vira listas mais curtas em vez de espaço vazio. */}
      <main className="mx-auto max-w-[1600px] px-4 pb-20 md:px-6">{children}</main>
    </>
  );
}
