import { copiaComoHtml, montarCopia, nomeDoArquivo } from "@/lib/backup";

/**
 * Baixa a cópia de segurança.
 *
 * Fica sob /admin, então o matcher do middleware já exige sessão — ninguém de
 * fora baixa a ficha dos clientes da loja por esta rota.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const copia = await montarCopia();
    const arquivo = copiaComoHtml(copia);

    return new Response(arquivo, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${nomeDoArquivo(copia.geradoEm)}"`,
        // Cópia de ontem servida hoje seria pior que erro: o dono guardaria um
        // arquivo achando que é o de agora.
        "Cache-Control": "no-store",
      },
    });
  } catch (erro) {
    const motivo = erro instanceof Error ? erro.message : "Erro desconhecido.";
    return new Response(
      `Não foi possível gerar a cópia de segurança.\n\n${motivo}\n\nTente de novo em alguns minutos.`,
      { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }
}
