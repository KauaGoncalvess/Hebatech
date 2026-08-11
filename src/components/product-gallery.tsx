"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

type Props = {
  fotos: string[];
  alt: string;
  /** Render técnico usado quando o produto ainda não tem foto. */
  children: ReactNode;
};

export function ProductGallery({ fotos, alt, children }: Props) {
  const [atual, setAtual] = useState(0);

  if (fotos.length === 0) return <div className="bg-ink">{children}</div>;

  return (
    <div>
      <div className="relative aspect-[4/3] bg-ink">
        <Image
          src={fotos[atual]}
          alt={`${alt} — foto ${atual + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-contain"
        />
        {fotos.length > 1 && (
          <span className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1.5 font-mono text-rotulo text-texto-2 backdrop-blur">
            {atual + 1} / {fotos.length}
          </span>
        )}
      </div>

      {fotos.length > 1 && (
        <ul className="rail flex gap-2 overflow-x-auto p-3">
          {fotos.map((f, i) => (
            <li key={f} className="shrink-0">
              <button
                type="button"
                onClick={() => setAtual(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === atual}
                className={`relative block h-16 w-20 overflow-hidden rounded-xl border-2 transition-colors ${
                  i === atual ? "border-accent" : "border-transparent hover:border-line-strong"
                }`}
              >
                <Image src={f} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
