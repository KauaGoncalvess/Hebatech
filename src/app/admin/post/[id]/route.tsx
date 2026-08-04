import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { buscarPorId } from "@/lib/catalogo";
import { parcela, preco } from "@/lib/format";
import { resumoTecnico, rotuloCategoria } from "@/types/produto";

/**
 * Arte pronta do produto para postar no Instagram, em 1080×1350.
 *
 * Mora sob /admin, então o middleware já exige login.
 *
 * As fontes são lidas de src/assets/fontes (Barlow Condensed e JetBrains Mono,
 * licença OFL): o gerador de imagem não enxerga fonte do sistema nem o
 * next/font, precisa dos bytes. O next.config.ts inclui esses .woff no rastro
 * de arquivos desta rota, senão eles não sobem para a Vercel.
 */
export const dynamic = "force-dynamic";

const LARGURA = 1080;
const ALTURA = 1350;
const LARANJA = "#ff6b18";

type Params = { params: Promise<{ id: string }> };

export async function GET(_pedido: Request, { params }: Params) {
  const { id } = await params;

  let produto;
  try {
    produto = await buscarPorId(id);
  } catch (erro) {
    return new Response(
      `Não foi possível ler o produto: ${erro instanceof Error ? erro.message : "erro"}`,
      { status: 503 },
    );
  }
  if (!produto) return new Response("Produto não encontrado", { status: 404 });

  const pastaDeFontes = path.join(process.cwd(), "src/assets/fontes");
  const [condensada, mono] = await Promise.all([
    readFile(path.join(pastaDeFontes, "barlow-condensed-800.woff")),
    readFile(path.join(pastaDeFontes, "jetbrains-mono-500.woff")),
  ]);

  const foto = produto.fotos[0];
  const resumo = resumoTecnico(produto).slice(0, 4);
  const selo = produto.estadoGrau ? `GRAU ${produto.estadoGrau}` : "NOVO";

  return new ImageResponse(
    (
      <div
        style={{
          width: LARGURA,
          height: ALTURA,
          display: "flex",
          flexDirection: "column",
          background: "#050505",
          color: "#fff",
          fontFamily: "mono",
          position: "relative",
        }}
      >
        {/* Halo laranja, o mesmo do site */}
        <div
          style={{
            position: "absolute",
            top: -260,
            left: -200,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background: LARANJA,
            opacity: 0.28,
            filter: "blur(120px)",
          }}
        />

        {/* Topo: marca e selo de estado */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "56px 64px 0",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, letterSpacing: 6, fontWeight: 500 }}>
              HEBATECH
            </div>
            <div style={{ fontSize: 15, letterSpacing: 4, color: "#8b8b90", marginTop: 8 }}>
              {`${site.endereco.cidade.toUpperCase()} / ${site.endereco.uf}`}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              background: LARANJA,
              color: "#000",
              padding: "12px 24px",
              borderRadius: 999,
              fontSize: 18,
              letterSpacing: 3,
            }}
          >
            {selo}
          </div>
        </div>

        {/* O produto */}
        <div
          style={{
            display: "flex",
            margin: "44px 64px 0",
            height: 560,
            borderRadius: 28,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "#0e0f11",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={foto}
              alt=""
              width={LARGURA - 128}
              height={560}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#3a3a3e",
              }}
            >
              <div style={{ fontSize: 190, fontFamily: "condensada", color: "#1e2125" }}>
                {produto.marca.slice(0, 3).toUpperCase()}
              </div>
              <div style={{ fontSize: 22, letterSpacing: 5, marginTop: 12 }}>
                {produto.codigo}
              </div>
            </div>
          )}
        </div>

        {/* Nome, ficha e preço */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "40px 64px 0",
            flex: 1,
          }}
        >
          <div style={{ fontSize: 20, letterSpacing: 5, color: LARANJA }}>
            {`${produto.marca.toUpperCase()} · ${rotuloCategoria(produto.categoria).toUpperCase()}`}
          </div>

          <div
            style={{
              fontFamily: "condensada",
              fontSize: 92,
              lineHeight: 0.92,
              marginTop: 16,
              textTransform: "uppercase",
            }}
          >
            {produto.modelo}
          </div>

          {resumo.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 26,
              }}
            >
              {resumo.map((r) => (
                <div
                  key={r}
                  style={{
                    display: "flex",
                    background: "#16181b",
                    borderRadius: 999,
                    padding: "12px 22px",
                    fontSize: 21,
                    color: "#c9c9cf",
                  }}
                >
                  {r}
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginTop: "auto",
              paddingBottom: 56,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "condensada", fontSize: 96, lineHeight: 0.9 }}>
                {preco(produto.preco)}
              </div>
              <div style={{ fontSize: 22, color: "#8b8b90", marginTop: 10 }}>
                {`ou 10x de ${parcela(produto.preco)}`}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                fontSize: 19,
                color: "#8b8b90",
              }}
            >
              <div>{`${produto.garantiaDias} dias de garantia`}</div>
              <div style={{ marginTop: 8 }}>Nota fiscal</div>
              <div style={{ marginTop: 8, color: LARANJA }}>{produto.codigo}</div>
            </div>
          </div>
        </div>

        {/* Rodapé em faixa laranja, como no site */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: LARANJA,
            color: "#000",
            padding: "26px 64px",
            fontSize: 22,
            letterSpacing: 2,
          }}
        >
          <div>{site.whatsappVisivel}</div>
          <div>hebatech.vercel.app</div>
        </div>
      </div>
    ),
    {
      width: LARGURA,
      height: ALTURA,
      fonts: [
        { name: "condensada", data: condensada, style: "normal", weight: 800 },
        { name: "mono", data: mono, style: "normal", weight: 500 },
      ],
      headers: {
        "Content-Disposition": `attachment; filename="${produto.slug}.png"`,
      },
    },
  );
}
