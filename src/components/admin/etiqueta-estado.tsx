import type { ReactNode } from "react";
import { ETAPA, type StatusOrdem } from "@/types/ordem";

/**
 * Estado com forma própria.
 *
 * Antes todo estado era só texto laranja: "Esperando você aprovar", "Em
 * reparo", "vencido" e "em aberto" tinham exatamente a mesma aparência, e um
 * cartão com erro ficava idêntico a um saudável. Aqui o estado ganha fundo,
 * raio e um ponto colorido — some a cor e ainda sobra a forma.
 */
type Tom = "andamento" | "espera" | "ok" | "alerta" | "neutro";

const TONS: Record<Tom, { chip: string; ponto: string }> = {
  // Trabalho correndo na bancada: informa, não chama.
  andamento: { chip: "bg-surface-2 text-texto-2", ponto: "bg-texto-3" },
  // A bola está com o cliente. É o que a loja precisa perseguir.
  espera: { chip: "bg-accent/12 text-accent", ponto: "bg-accent" },
  ok: { chip: "bg-ok/12 text-ok", ponto: "bg-ok" },
  alerta: { chip: "bg-alerta/12 text-alerta", ponto: "bg-alerta" },
  neutro: { chip: "bg-surface-2 text-texto-3", ponto: "bg-texto-3" },
};

export function EtiquetaEstado({
  tom = "neutro",
  children,
  className = "",
}: {
  tom?: Tom;
  children: ReactNode;
  className?: string;
}) {
  const t = TONS[tom];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-rotulo tracking-[0.1em] uppercase ${t.chip} ${className}`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${t.ponto}`}
      />
      {children}
    </span>
  );
}

/**
 * Qual tom cada etapa da ordem recebe.
 *
 * A divisão que importa para o balcão não é "andou / não andou", é de quem é a
 * vez: `aguardando_aprovacao` e `pronto` são as duas etapas em que o aparelho
 * está parado esperando o cliente, e são as que rendem ligação.
 */
const TOM_DA_ETAPA: Record<StatusOrdem, Tom> = {
  recebido: "andamento",
  diagnosticado: "andamento",
  aguardando_aprovacao: "espera",
  em_reparo: "andamento",
  pronto: "espera",
  entregue: "ok",
  cancelado: "neutro",
};

export function EtiquetaEtapa({ status }: { status: StatusOrdem }) {
  return (
    <EtiquetaEstado tom={TOM_DA_ETAPA[status]}>
      {ETAPA[status].rotulo}
    </EtiquetaEstado>
  );
}
