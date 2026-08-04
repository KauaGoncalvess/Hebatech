import type { Produto } from "@/types/produto";
import { ProductCard } from "./product-card";

/**
 * Grade simples, renderizada no servidor. É o que vai no HTML enquanto o
 * navegador não hidrata o filtro — sem ela a listagem sairia vazia para quem
 * lê a página sem executar JavaScript, buscador incluído.
 */
export function ProdutoGrade({ itens }: { itens: Produto[] }) {
  if (itens.length === 0) return null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {itens.map((p) => (
        <li key={p.id}>
          <ProductCard p={p} />
        </li>
      ))}
    </ul>
  );
}
