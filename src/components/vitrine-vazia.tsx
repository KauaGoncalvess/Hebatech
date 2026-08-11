import { waGenerico } from "@/lib/whatsapp";

/**
 * O que a vitrine diz quando não tem o que mostrar.
 *
 * Mora fora do filtro de propósito: o filtro é componente de cliente, e se a
 * mensagem só existisse lá dentro, o HTML sairia em branco para quem chega sem
 * JavaScript e para o buscador. Aqui ela é servida junto com a página.
 */
export function VitrineVazia({
  titulo = "Vitrine em renovação",
  texto = "Estamos atualizando os aparelhos anunciados. O estoque da loja continua o mesmo — diga o que você procura no WhatsApp que a gente confere na hora.",
  assunto = "procuro um equipamento que não achei no site",
  origem = "vitrine-vazia",
  children,
}: {
  titulo?: string;
  texto?: string;
  assunto?: string;
  origem?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="card px-6 py-20 text-center">
      <p className="display text-sub">{titulo}</p>
      <p className="mx-auto mt-4 max-w-[44ch] text-corpo text-texto-3">{texto}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <a
          href={waGenerico(assunto)}
          target="_blank"
          rel="noopener noreferrer"
          data-origem={origem}
          className="rounded-full bg-accent px-7 py-3.5 font-mono text-rotulo font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-accent-hover"
        >
          Perguntar no WhatsApp
        </a>
        {children}
      </div>
    </div>
  );
}
