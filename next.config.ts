import type { NextConfig } from "next";

/**
 * As fotos de produto ficam no Storage do Supabase e são servidas por URL
 * pública. Sem liberar esse host aqui, o next/image recusa a imagem e a
 * página do catálogo quebra assim que a primeira foto real entra no ar.
 *
 * Libera o projeto configurado no ambiente e, como rede de segurança para
 * builds sem variável, qualquer subdomínio de supabase.co.
 */
function hostDoSupabase(): string | null {
  const bruto = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!bruto) return null;
  try {
    return new URL(bruto).hostname;
  } catch {
    return null;
  }
}

const host = hostDoSupabase();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "**.supabase.in", pathname: "/storage/v1/object/public/**" },
      ...(host && !host.endsWith(".supabase.co") && !host.endsWith(".supabase.in")
        ? [{ protocol: "https" as const, hostname: host, pathname: "/storage/v1/object/public/**" }]
        : []),
    ],
  },
};

export default nextConfig;
