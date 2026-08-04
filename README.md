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
2. **SQL Editor** → cole `supabase/schema.sql` inteiro → Run. Isso cria as
   tabelas (`produtos`, `planos_manutencao`, `configuracoes`, `orcamentos`), as
   permissões e o bucket de fotos. Pode rodar de novo a qualquer momento: o
   arquivo é idempotente, então é assim que se aplicam as tabelas novas.
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
| `/admin/orcamentos` | Pedidos que vieram do formulário do site, com botão para chamar o cliente no WhatsApp |
| `/admin/etiqueta/<id>` | Folha para imprimir com QR do produto, para colar no aparelho na vitrine |
| `/admin/post/<id>` | Baixa a arte do produto pronta para o Instagram, em 1080×1350 |

- **Fotos** vão direto do seu computador para o Supabase Storage. A primeira é a
  capa; dá para reordenar e remover. **Sem foto, o site desenha automaticamente
  um render técnico do produto** — o card nunca fica vazio.
- **Ficha técnica** é escrita uma linha por item, no formato `Rótulo: valor`.
- **"À venda"** desligado tira o produto das listas na hora, sem apagar nada.
- **Planos de manutenção**: o valor mensal é um número; marcar "sem valor fixo"
  publica o plano como *Sob proposta*. Só um plano por vez pode ficar com o selo
  de mais contratado — o painel cuida disso sozinho. Sem nenhum plano publicado,
  a seção inteira some da página de assistência.
- **Pedidos de orçamento**: o formulário do site grava o pedido *e* abre o
  WhatsApp. Isso pega quem preenche tudo e não chega a mandar a mensagem — na
  prática, a maior fonte de contato perdido. A gravação é secundária de
  propósito: se o banco estiver fora do ar, o WhatsApp abre do mesmo jeito e o
  pedido só não fica registrado.
- Ao salvar, as páginas afetadas são revalidadas — a alteração aparece no site em
  segundos, sem publicar de novo.
- **Duplicar produto** copia o registro com código e endereço novos e já fora do
  ar, para cadastrar cinco máquinas parecidas sem digitar tudo cinco vezes.

## Antes de publicar — `src/data/site.ts`

| Campo | Situação |
| --- | --- |
| `url` | `https://hebatech.vercel.app`. Trocar no dia em que houver domínio próprio — alimenta `metadataBase`, o sitemap, os canonical e a prévia dos links |
| `whatsapp` / `whatsappVisivel` | `(31) 99961-2371` — confirmado |
| `endereco` | Av. José Sérvulo Soalheiro, 1625 — Jardim Europa. **Conferir o CEP**: a avenida atravessa mais de um bairro |
| `operacao.atendimentos` | `3000`, informado pela loja |
| `horario` | Conferir prazos e horário |

O atendimento é só por **WhatsApp e Instagram**: telefone fixo e e-mail saíram do ar a pedido da loja.

Os preços da tabela de serviço ficam em `src/app/(site)/assistencia/page.tsx`.
Os planos de manutenção mensal e as regras do contrato são editados no painel,
em `/admin/planos` — a carga inicial deles está em `src/data/seed-planos.ts`.

## Páginas

- `/` — hero com números, três portas, serviços, destaques, processo, comparativo e FAQ
- `/produtos` — vitrine única (notebook incluso) com filtro e busca na URL
- `/notebooks` — mesma vitrine, só notebooks
- `/produtos/<slug>` — página de produto; vendido continua no ar, marcado
- `/servicos/<slug>` — uma página por área de serviço, com preço, prazo e FAQ
- `/assistencia` — orçamento por WhatsApp, tabela de preço e regras da casa
- `/manutencao` — planos de contrato mensal para empresa
- `/contato` — endereço, canais, horário e mapa
- `/privacidade` — LGPD

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
    orcamentos.ts    grava e lê os pedidos vindos do site (sem queda para seed)
    supabase/        clientes de servidor e navegador
    whatsapp.ts      montagem das mensagens
  assets/fontes/     .woff lidos pelo gerador de post do Instagram
  middleware.ts      renova a sessão e protege /admin
  types/produto.ts   modelo único de produto
supabase/schema.sql  tabelas, permissões e bucket
```

## Decisões que valem manter

- **Zero dependência de UI.** Carrossel, filtro, gaveta, galeria e formulários
  são código próprio sobre rolagem nativa. As dependências são `next`, `react`,
  `tailwindcss` e o cliente do Supabase.
- **O site nunca cai com o banco.** Se o Supabase falhar, `catalogo.ts` devolve o
  catálogo do arquivo em vez de quebrar a página. O painel faz o contrário: lê
  estrito e mostra erro, porque editar um item de arquivo quebraria ao salvar.
- **Dado de cliente não tem queda para seed nem leitura pública.** A tabela
  `orcamentos` tem permissão de mão única: qualquer visitante consegue inserir,
  só quem fez login consegue ler. E `lib/orcamentos.ts` nunca inventa registro.
- **Laranja é a única cor de acento.** Desde o redesign de agosto ele também
  aparece como halo de fundo (componente `Aura`) e numa faixa de cor cheia no
  meio da home — decisão consciente da loja, contrariando a regra original de
  "nunca em bloco grande de fundo".
- **Prova social não se inventa.** `src/data/provas.ts` nasce vazio e a seção só
  entra no ar quando houver foto, avaliação ou logo de verdade.
- **Filtro de preço calculado do estoque**, não fixo no código — continua útil
  tanto para notebook de R$ 3.000 quanto para periférico de R$ 129.

## Deploy

Vercel. `npm run build` roda como está; só as duas variáveis `NEXT_PUBLIC_` são
necessárias em produção.
