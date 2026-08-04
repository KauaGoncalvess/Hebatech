/**
 * Halo laranja de fundo. Vai dentro de um bloco `relative overflow-hidden` e
 * pinta atrás do conteúdo — é o brilho das referências trazido para a cor da
 * marca. `className` posiciona e dimensiona (top/left/size).
 */
export function Aura({
  className = "",
  forte = false,
}: {
  className?: string;
  forte?: boolean;
}) {
  return <div aria-hidden className={`aura ${forte ? "aura-forte" : ""} ${className}`} />;
}
