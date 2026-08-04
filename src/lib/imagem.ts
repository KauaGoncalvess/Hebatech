const LADO_MAXIMO = 1600;
const QUALIDADE = 0.82;
/** Abaixo disso não compensa recomprimir: o ganho não paga o tempo de processar. */
const JA_ESTA_BOM = 320 * 1024;

/**
 * Reduz a foto no próprio navegador, antes de subir.
 *
 * Celular tira foto de 4000 pixels e 6 MB. Numa internet comum de loja, subir
 * isso leva dez, quinze segundos por imagem — e o site nunca vai mostrar mais
 * que uns 800 pixels de largura. Reduzir aqui costuma cortar o arquivo em vinte
 * vezes, e o envio passa a ser instantâneo.
 *
 * Nunca falha para o usuário: qualquer problema devolve o arquivo original.
 */
export async function reduzirImagem(arquivo: File): Promise<File> {
  if (typeof createImageBitmap !== "function") return arquivo;

  try {
    const bitmap = await createImageBitmap(arquivo);
    const maior = Math.max(bitmap.width, bitmap.height);

    if (maior <= LADO_MAXIMO && arquivo.size <= JA_ESTA_BOM) {
      bitmap.close();
      return arquivo;
    }

    const escala = Math.min(1, LADO_MAXIMO / maior);
    const largura = Math.round(bitmap.width * escala);
    const altura = Math.round(bitmap.height * escala);

    const tela = document.createElement("canvas");
    tela.width = largura;
    tela.height = altura;

    const pincel = tela.getContext("2d");
    if (!pincel) {
      bitmap.close();
      return arquivo;
    }

    pincel.imageSmoothingQuality = "high";
    pincel.drawImage(bitmap, 0, 0, largura, altura);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      tela.toBlob(resolve, "image/webp", QUALIDADE),
    );

    // Sem WebP ou compressão que engordou o arquivo: fica o original.
    if (!blob || blob.type !== "image/webp" || blob.size >= arquivo.size) return arquivo;

    const nome = arquivo.name.replace(/\.[^.]+$/, "") || "foto";
    return new File([blob], `${nome}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch {
    return arquivo;
  }
}
