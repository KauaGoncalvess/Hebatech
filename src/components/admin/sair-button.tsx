import { sair } from "@/app/admin/actions";

export function SairButton() {
  return (
    <form action={sair}>
      <button
        type="submit"
        className="rounded-full bg-surface-2 px-4 py-2.5 font-mono text-[10.5px] tracking-[0.12em] text-white/60 uppercase transition-colors hover:bg-surface-3 hover:text-white"
      >
        Sair
      </button>
    </form>
  );
}
