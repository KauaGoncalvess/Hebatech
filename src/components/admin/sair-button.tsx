import { sair } from "@/app/admin/actions";

export function SairButton() {
  return (
    <form action={sair}>
      <button
        type="submit"
        className="border border-line px-4 py-2 font-mono text-[10.5px] tracking-[0.14em] text-white/60 uppercase transition-colors hover:border-accent hover:text-accent"
      >
        Sair
      </button>
    </form>
  );
}
