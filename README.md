# HebaTech — site institucional e catálogo

Site da HebaTech Soluções em Informática (Sete Lagoas/MG). Next.js App Router,
TypeScript e Tailwind. Sem banco, sem carrinho e sem painel: todo o conteúdo
sai de dois arquivos TypeScript, e toda conversão termina no WhatsApp.

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run typecheck
```

## Antes de publicar — conferir `src/data/site.ts`

Esses campos estão preenchidos com valor de exemplo e precisam do dado real:

| Campo                       | O que é                                              |
| --------------------------- | ---------------------------------------------------- |
| `whatsapp`                  | Número internacional só com dígitos (`5531…`)         |
| `whatsappVisivel`           | Mesmo número formatado, exibido na tela               |
| `telefoneFixo` / `Link`     | Fixo da loja                                          |
| `endereco`                  | Rua, número, bairro e CEP                             |
| `mapaQuery`                 | Termo usado no mapa e no botão "traçar rota"          |
| `email`                     | E-mail de contato                                     |
| `url`                       | Domínio final (usado em SEO, sitemap e compartilhar)  |
| `operacao`                  | Anos de loja, atendimentos, prazos e garantia         |
| `horario`                   | Dias e faixas de funcionamento                        |

## Editar o catálogo — `src/data/notebooks.ts`

Cada aparelho é um objeto do array `notebooks`. Para publicar um novo:

1. Copie um bloco inteiro e cole no fim do array.
2. Troque `codigo` (precisa ser único) e `slug` (vira a URL: `/notebooks/<slug>`).
3. Preencha a especificação. Os campos de filtro são `cpu.familia`, `ramGb`,
   `armazenamentoGb` e `preco` — as opções do filtro se montam sozinhas a partir
   do que existe no arquivo.
4. `destaque: true` coloca o aparelho no trilho da home (mostra os 4 primeiros).
5. Vendeu? Troque para `disponivel: false`. Ele some da lista e do sitemap, mas a
   página continua no ar para quem já tem o link.

### Fotos dos produtos

Sem foto, o card e a página usam um **render técnico vetorial** gerado na hora
(peso zero, sempre nítido). Para usar foto real:

1. Salve os arquivos em `public/produtos/` — ex.: `ht-t480-1.jpg`.
2. Liste no aparelho: `fotos: ["/produtos/ht-t480-1.jpg", "/produtos/ht-t480-2.jpg"]`.

A galeria com miniaturas aparece automaticamente a partir da segunda foto.
Recomendado: 1600 px no lado maior, JPG, fundo escuro ou neutro.

## Estrutura

```
src/
  app/               páginas (home, notebooks, produto, assistência, contato)
    icon.png         favicon · apple-icon.png para iOS
    sitemap.ts       gerado a partir do catálogo
  components/        UI própria — nenhuma biblioteca de componente
  data/              site.ts (configuração) e notebooks.ts (catálogo)
  lib/               formatação de preço e montagem dos links do WhatsApp
public/
  marca/             selo circular usado no rodapé e nos ícones
  fotos/             foto de bancada usada no topo da home
  og.png             imagem de compartilhamento (WhatsApp, Instagram, Google)
```

## Decisões que valem manter

- **Zero dependência de UI.** Só `next`, `react` e `tailwindcss`. Carrossel,
  filtro, gaveta e galeria são código próprio usando rolagem nativa.
- **Radius zero** em card e botão; raio só em selo e badge circular.
- **Laranja cirúrgico**: filete, número, estado ativo de filtro e botão primário.
  Nunca preenchendo bloco grande de fundo.
- **Formulário sem backend**: monta o texto e abre o WhatsApp. Nada trafega para
  servidor nenhum, e o cliente vê a prévia da mensagem antes de enviar.
- Todas as páginas são estáticas, inclusive as 12 de produto.

## Deploy

Vercel, sem variável de ambiente. `npm run build` roda como está.
