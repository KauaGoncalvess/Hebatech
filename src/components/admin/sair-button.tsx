import { sair } from "@/app/admin/actions";

/**
 * `largo` é para a gaveta do celular, onde o botão divide a linha com "ver
 * site" e precisa ter a mesma altura de toque dos vizinhos.
 */
export function SairButton({ largo = false }: { largo?: boolean }) {
  return (
    <form action={sair} className={largo ? "flex-1" : ""}>
      <button
        type="submit"
        className={
          largo
            ? "flex h-12 w-full items-center justify-center rounded-2xl bg-surface-2 font-mono text-[11px] tracking-[0.12em] text-white/70 uppercase transition-colors hover:bg-surface-3 hover:text-white"
            : "rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[10.5px] tracking-[0.12em] text-white/60 uppercase transition-colors hover:bg-surface-3 hover:text-white"
        }
      >
        Sair
      </button>
    </form>
  );
}
