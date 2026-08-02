# HebaTech — site institucional, catálogo e painel

Site da HebaTech Soluções em Informática (Sete Lagoas/MG). Next.js App Router,
TypeScript, Tailwind e Supabase. Sem carrinho e sem checkout: toda conversão
termina numa conversa de WhatsApp com a mensagem já montada.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
```

O site roda **sem nenhuma variável de ambiente**: nesse modo o catálogo vem do
arquivo `src/data/seed.ts` e o painel em `/admin` mostra a página de instruções.

## Ligar o painel (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com) — o plano gratuito
   atende uma loja deste porte.
2. **SQL Editor** → cole `supabase/schema.sql` inteiro → Run. Isso cria a tabela
   `produtos`, as permissões e o bucket de fotos.
3. **Authentication → Users → Add user**: crie o e-mail e a senha do painel, com
   "Auto Confirm User" marcado.
4. **Authentication → Providers → Email**: desligue *Enable sign ups*, para que
   ninguém consiga criar conta sozinho.
5. Copie `.env.example` para `.env.local` e preencha com os dados de
   **Project Settings → API**.
6. `npm run seed` sobe o catálogo inicial para o banco.

Na Vercel, cadastre apenas `NEXT_PUBLIC_SUPABASE_URL` e
`NEXT_PUBLIC_SUPABASE_ANON_KEY`. A `SUPABASE_SERVICE_ROLE_KEY` fica só na sua
máquina, para o `npm run seed`.

## Usar o painel — `/admin`

| Onde | O que dá para fazer |
| --- | --- |
| `/admin` | Resumo: quantos itens à venda, fora do ar, sem foto e o valor do estoque |
| `/admin/produtos` | Lista completa; tirar do ar ou publicar com um clique |
| `/admin/produtos/novo` | Cadastrar notebook, PC montado, monitor, peça, periférico ou acessório |
| `/admin/produtos/<id>` | Editar tudo, trocar fotos ou excluir |
| `/admin/planos` | Planos de manutenção mensal e as regras do contrato |
| `/admin/planos/<id>` | Mudar valor, itens inclusos, ordem e o selo de mais contratado |

- **Fotos** vão direto do seu computador para o Supabase Storage. A primeira é a
  capa; dá para reordenar e remover. **Sem foto, o site desenha automaticamente
  um render técnico do produto** — o card nunca fica vazio.
- **Ficha técnica** é escrita uma linha por item, no formato `Rótulo: valor`.
- **"À venda"** desligado tira o produto das listas na hora, sem apagar nada.
- **Planos de manutenção**: o valor mensal é um número; marcar "sem valor fixo"
  publica o plano como *Sob proposta*. Só um plano por vez pode ficar com o selo
  de mais contratado — o painel cuida disso sozinho. Sem nenhum plano publicado,
  a seção inteira some da página de assistência.
- Ao salvar, as páginas afetadas são revalidadas — a alteração aparece no site em
  segundos, sem publicar de novo.

## Antes de publicar — `src/data/site.ts`

| Campo | Situação |
| --- | --- |
| `whatsapp` / `whatsappVisivel` | **Placeholder.** Sem isso nenhum botão funciona |
| `endereco` / `mapaQuery` | **Placeholder.** O mapa e a rota dependem disso |
| `email`, `url` | **Placeholder** |
| `telefoneFixo` | `(31) 3771-7333`, tirado do Instagram — confirmar |
| `operacao`, `horario` | Conferir anos de loja, prazos e horário |

Os preços da tabela de serviço ficam em `src/app/(site)/assistencia/page.tsx`.
Os planos de manutenção mensal e as regras do contrato são editados no painel,
em `/admin/planos` — a carga inicial deles está em `src/data/seed-planos.ts`.

## Páginas

- `/` — prova de operação, três serviços, trilho de destaques, processo
- `/notebooks` — catálogo de notebooks com filtro técnico
- `/produtos` — desktops, monitores, peças, periféricos e acessórios
- `/produtos/<slug>` — página de produto (adapta as seções à categoria)
- `/assistencia` — orçamento por WhatsApp, tabela de preço, **manutenção mensal**
- `/contato` — endereço, canais, horário e mapa

## Estrutura

```
src/
  app/
    (site)/          páginas públicas (layout com cabeçalho e rodapé do site)
    admin/           painel — layout próprio, sem o cabeçalho do site
      actions.ts     server actions de salvar, publicar e excluir
    globals.css      tokens de cor, tipografia e utilitários
    fonts.ts         as três famílias, compartilhadas pelos dois layouts
    sitemap.ts       gerado a partir do catálogo
  components/
    admin/           formulário, upload de fotos, login
  data/
    site.ts          configuração da loja
    seed.ts          catálogo inicial e carga do banco
    seed-planos.ts   planos de manutenção e regras do contrato
  lib/
    catalogo.ts      leitura do catálogo, com queda para o seed
    planos.ts        leitura dos planos, com a mesma queda
    supabase/        clientes de servidor e navegador
    whatsapp.ts      montagem das mensagens
  middleware.ts      renova a sessão e protege /admin
  types/produto.ts   modelo único de produto
supabase/schema.sql  tabelas, permissões e bucket
```

## Decisões que valem manter

- **Zero dependência de UI.** Carrossel, filtro, gaveta, galeria e formulários
  são código próprio sobre rolagem nativa. As dependências são `next`, `react`,
  `tailwindcss` e o cliente do Supabase.
- **O site nunca cai com o banco.** Se o Supabase falhar, `catalogo.ts` devolve o
  catálogo do arquivo em vez de quebrar a página.
- **Radius zero** em card e botão; raio só no selo e no badge circular.
- **Laranja cirúrgico**: filete, número, estado ativo de filtro e botão primário.
  Nunca preenchendo bloco grande de fundo.
- **Filtro de preço calculado do estoque**, não fixo no código — continua útil
  tanto para notebook de R$ 3.000 quanto para periférico de R$ 129.

## Deploy

Vercel. `npm run build` roda como está; só as duas variáveis `NEXT_PUBLIC_` são
necessárias em produção.
