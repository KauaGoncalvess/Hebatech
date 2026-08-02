"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { BUCKET_FOTOS } from "@/lib/supabase/config";
import { criarClienteNavegador } from "@/lib/supabase/browser";

const MAX_MB = 8;
const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Envio de fotos direto do computador para o Supabase Storage.
 * O campo escondido `fotos` leva a lista de URLs junto com o formulário.
 */
export function UploadFotos({
  codigo,
  iniciais,
}: {
  codigo: string;
  iniciais: string[];
}) {
  const [fotos, setFotos] = useState<string[]>(iniciais);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function enviar(arquivos: FileList | null) {
    if (!arquivos || arquivos.length === 0) return;
    setErro("");
    setEnviando(true);

    const supabase = criarClienteNavegador();
    const novas: string[] = [];

    for (const arquivo of Array.from(arquivos)) {
      if (!TIPOS.includes(arquivo.type)) {
        setErro(`"${arquivo.name}" não é JPG, PNG, WebP nem AVIF.`);
        continue;
      }
      if (arquivo.size > MAX_MB * 1024 * 1024) {
        setErro(`"${arquivo.name}" passa de ${MAX_MB} MB.`);
        continue;
      }

      const extensao = arquivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const pasta = (codigo || "sem-codigo").toLowerCase().replace(/[^a-z0-9-]/g, "");
      const caminho = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensao}`;

      const { error } = await supabase.storage
        .from(BUCKET_FOTOS)
        .upload(caminho, arquivo, { cacheControl: "31536000", upsert: false });

      if (error) {
        setErro(error.message);
        continue;
      }

      const { data } = supabase.storage.from(BUCKET_FOTOS).getPublicUrl(caminho);
      novas.push(data.publicUrl);
    }

    setFotos((atual) => [...atual, ...novas]);
    setEnviando(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  const mover = (indice: number, direcao: -1 | 1) => {
    const destino = indice + direcao;
    if (destino < 0 || destino >= fotos.length) return;
    setFotos((atual) => {
      const copia = [...atual];
      [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
      return copia;
    });
  };

  const remover = (indice: number) =>
    setFotos((atual) => atual.filter((_, i) => i !== indice));

  return (
    <div className="sm:col-span-2">
      <input type="hidden" name="fotos" value={fotos.join("\n")} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="eyebrow text-white/45">Fotos do produto</span>
        <span className="font-mono text-[9.5px] text-white/30">
          A primeira é a capa · JPG, PNG ou WebP até {MAX_MB} MB
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-px">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={enviando}
          className="border border-accent px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-accent uppercase transition-colors hover:bg-accent hover:text-black disabled:opacity-40"
        >
          {enviando ? "Enviando..." : "Escolher fotos"}
        </button>
        <span className="px-4 font-mono text-[10.5px] text-white/35">
          {fotos.length === 0
            ? "Sem foto — o site mostra o desenho técnico"
            : `${fotos.length} ${fotos.length === 1 ? "foto" : "fotos"}`}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={TIPOS.join(",")}
        multiple
        onChange={(e) => enviar(e.target.files)}
        className="sr-only"
      />

      {erro && <p className="mt-3 font-mono text-[11px] text-accent">{erro}</p>}

      {fotos.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-4">
          {fotos.map((url, i) => (
            <li key={url} className="bg-ink">
              <div className="relative aspect-[4/3] border-b border-line">
                <Image
                  src={url}
                  alt={`Foto ${i + 1}`}
                  fill
                  sizes="200px"
                  unoptimized
                  className="object-cover"
                />
                {i === 0 && (
                  <span className="absolute top-2 left-2 bg-accent px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.12em] text-black uppercase">
                    Capa
                  </span>
                )}
              </div>
              <div className="flex items-stretch">
                <button
                  type="button"
                  onClick={() => mover(i, -1)}
                  disabled={i === 0}
                  aria-label="Mover para trás"
                  className="flex-1 border-r border-line py-2 font-mono text-[12px] text-white/60 hover:text-accent disabled:text-white/15"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => mover(i, 1)}
                  disabled={i === fotos.length - 1}
                  aria-label="Mover para frente"
                  className="flex-1 border-r border-line py-2 font-mono text-[12px] text-white/60 hover:text-accent disabled:text-white/15"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => remover(i)}
                  aria-label="Remover foto"
                  className="flex-1 py-2 font-mono text-[10px] tracking-[0.1em] text-white/50 uppercase hover:text-accent"
                >
                  Tirar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
