"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

type Props = {
  fotos: string[];
  alt: string;
  /** Render técnico usado quando o aparelho ainda não tem foto. */
  children: ReactNode;
};

export function ProductGallery({ fotos, alt, children }: Props) {
  const [atual, setAtual] = useState(0);

  if (fotos.length === 0) {
    return <div className="bg-ink">{children}</div>;
  }

  return (
    <div>
      <div className="relative aspect-[4/3] border-b border-line bg-ink">
        <Image
          src={fotos[atual]}
          alt={`${alt} — foto ${atual + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain"
        />
        <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.16em] text-white/40">
          {String(atual + 1).padStart(2, "0")} / {String(fotos.length).padStart(2, "0")}
        </span>
      </div>

      {fotos.length > 1 && (
        <ul className="rail flex gap-px overflow-x-auto">
          {fotos.map((f, i) => (
            <li key={f} className="shrink-0">
              <button
                type="button"
                onClick={() => setAtual(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === atual}
                className={`relative block h-20 w-24 border transition-colors ${
                  i === atual ? "border-accent" : "border-line hover:border-line-strong"
                }`}
              >
                <Image src={f} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
