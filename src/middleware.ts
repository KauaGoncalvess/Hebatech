import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseAnonKey, supabaseConfigurado, supabaseUrl } from "@/lib/supabase/config";

/**
 * Renova a sessão do painel a cada navegação e barra o acesso a /admin
 * de quem não está logado.
 */
export async function middleware(request: NextRequest) {
  const resposta = NextResponse.next({ request });
  const rota = request.nextUrl.pathname;

  if (!supabaseConfigurado) {
    // Sem banco não há painel: manda para a página que explica a configuração.
    if (rota.startsWith("/admin") && rota !== "/admin/indisponivel") {
      return NextResponse.redirect(new URL("/admin/indisponivel", request.url));
    }
    return resposta;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(lista) {
        for (const { name, value, options } of lista) {
          resposta.cookies.set(name, value, options);
        }
      },
    },
  });

  const ehLogin = rota === "/admin/login";

  // Supabase fora do ar não pode derrubar a rota inteira: sem conseguir
  // confirmar a sessão, tratamos como visitante e mandamos para o login.
  let user = null;
  try {
    ({
      data: { user },
    } = await supabase.auth.getUser());
  } catch (erro) {
    console.error("Falha ao confirmar a sessão do painel:", erro);
    if (ehLogin) return resposta;
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (!user && rota.startsWith("/admin") && !ehLogin) {
    const destino = new URL("/admin/login", request.url);
    destino.searchParams.set("de", rota);
    return NextResponse.redirect(destino);
  }

  if (user && ehLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return resposta;
}

export const config = {
  matcher: ["/admin/:path*"],
};
