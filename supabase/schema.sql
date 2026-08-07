-- ============================================================================
-- HebaTech — estrutura do banco
--
-- Como usar: Supabase → SQL Editor → cole este arquivo inteiro → Run.
-- Pode rodar mais de uma vez sem quebrar nada.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Tabela de produtos ──────────────────────────────────────────────────────
create table if not exists public.produtos (
  id                 uuid primary key default gen_random_uuid(),
  codigo             text not null unique,
  slug               text not null unique,
  categoria          text not null default 'notebook',
  marca              text not null,
  modelo             text not null,
  condicao           text not null default 'seminovo'
                       check (condicao in ('novo','seminovo')),

  preco              integer not null check (preco >= 0),
  preco_referencia   integer check (preco_referencia >= 0),

  destaque           boolean not null default false,
  disponivel         boolean not null default true,
  resumo             text not null default '',

  -- Campos técnicos: usados pelos filtros e pelo resumo do card.
  -- Ficam nulos em produto que não é notebook.
  cpu_familia        text,
  cpu_nome           text,
  ram_gb             integer,
  armazenamento_gb   integer,
  armazenamento_tipo text,
  tela_polegadas     numeric(4,1),
  tela_resolucao     text,
  bateria_saude      integer check (bateria_saude between 0 and 100),
  peso_kg            numeric(5,2),

  -- Ficha completa: [{ "rotulo": "...", "valor": "..." }]
  ficha              jsonb not null default '[]'::jsonb,

  estado_grau        text check (estado_grau in ('A','B','C')),
  estado_observacoes jsonb not null default '[]'::jsonb,
  garantia_dias      integer not null default 90 check (garantia_dias >= 0),

  -- URLs públicas das fotos, na ordem de exibição.
  fotos              jsonb not null default '[]'::jsonb,

  ordem              integer not null default 0,
  criado_em          timestamptz not null default now(),
  atualizado_em      timestamptz not null default now()
);

-- A lista de categorias fica fora do `create table` de propósito: assim ela é
-- reaplicada em banco que já existe. `create table if not exists` não alteraria
-- uma restrição antiga, e categoria nova passaria a ser recusada no salvar sem
-- ninguém entender por quê. Precisa bater com CATEGORIAS em src/types/produto.ts.
alter table public.produtos drop constraint if exists produtos_categoria_check;
alter table public.produtos add constraint produtos_categoria_check
  check (categoria in ('notebook','desktop','monitor','processador','placa-mae',
                       'placa-video','peca','periferico','acessorio','limpeza'));

create index if not exists produtos_disponivel_idx on public.produtos (disponivel);
create index if not exists produtos_categoria_idx  on public.produtos (categoria);
create index if not exists produtos_ordem_idx      on public.produtos (ordem, preco);

-- Mantém `atualizado_em` sempre correto.
create or replace function public.tocar_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists produtos_atualizado_em on public.produtos;
create trigger produtos_atualizado_em
  before update on public.produtos
  for each row execute function public.tocar_atualizado_em();

-- ── Permissões ──────────────────────────────────────────────────────────────
-- Qualquer visitante lê o catálogo. Só usuário logado escreve.
alter table public.produtos enable row level security;

drop policy if exists "catalogo visivel para todos" on public.produtos;
create policy "catalogo visivel para todos"
  on public.produtos for select
  using (true);

drop policy if exists "somente admin escreve" on public.produtos;
create policy "somente admin escreve"
  on public.produtos for all
  to authenticated
  using (true)
  with check (true);

-- ── Planos de manutenção mensal ─────────────────────────────────────────────
create table if not exists public.planos_manutencao (
  id            uuid primary key default gen_random_uuid(),
  codigo        text not null unique,
  nome          text not null,
  faixa         text not null default '',
  -- Valor mensal em reais. Nulo publica o plano como "Sob proposta".
  preco_mensal  integer check (preco_mensal >= 0),
  visitas       text not null default '',
  destaque      boolean not null default false,
  ativo         boolean not null default true,
  -- Itens inclusos: ["Visita técnica programada, 1x por mês", ...]
  inclui        jsonb not null default '[]'::jsonb,
  ordem         integer not null default 0,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists planos_ordem_idx on public.planos_manutencao (ordem);

drop trigger if exists planos_atualizado_em on public.planos_manutencao;
create trigger planos_atualizado_em
  before update on public.planos_manutencao
  for each row execute function public.tocar_atualizado_em();

alter table public.planos_manutencao enable row level security;

drop policy if exists "planos visiveis para todos" on public.planos_manutencao;
create policy "planos visiveis para todos"
  on public.planos_manutencao for select
  using (true);

drop policy if exists "somente admin edita planos" on public.planos_manutencao;
create policy "somente admin edita planos"
  on public.planos_manutencao for all
  to authenticated
  using (true)
  with check (true);

-- ── Textos avulsos editáveis pelo painel ────────────────────────────────────
-- Hoje guarda só `manutencao_regras`; serve para o que vier depois.
create table if not exists public.configuracoes (
  chave         text primary key,
  valor         jsonb not null default '[]'::jsonb,
  atualizado_em timestamptz not null default now()
);

drop trigger if exists configuracoes_atualizado_em on public.configuracoes;
create trigger configuracoes_atualizado_em
  before update on public.configuracoes
  for each row execute function public.tocar_atualizado_em();

alter table public.configuracoes enable row level security;

drop policy if exists "configuracoes visiveis para todos" on public.configuracoes;
create policy "configuracoes visiveis para todos"
  on public.configuracoes for select
  using (true);

drop policy if exists "somente admin edita configuracoes" on public.configuracoes;
create policy "somente admin edita configuracoes"
  on public.configuracoes for all
  to authenticated
  using (true)
  with check (true);

-- ── Pedidos de orçamento vindos do site ─────────────────────────────────────
-- Guarda o que a pessoa preencheu no formulário antes de ir para o WhatsApp.
-- Serve para não perder quem desiste no meio do caminho: o formulário abre a
-- conversa, mas ninguém garante que ela vai mandar a mensagem.
create table if not exists public.orcamentos (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  telefone   text not null,
  tipo       text not null default '',
  marca      text not null default '',
  modelo     text not null default '',
  defeito    text not null default '',
  descricao  text not null default '',
  atendido   boolean not null default false,
  criado_em  timestamptz not null default now()
);

create index if not exists orcamentos_criado_idx   on public.orcamentos (criado_em desc);
create index if not exists orcamentos_atendido_idx on public.orcamentos (atendido);

-- Permissão de mão única, diferente do resto do banco: qualquer visitante
-- consegue INSERIR um pedido, mas ninguém de fora consegue LER a lista. Sem
-- política de select para `anon`, a tabela fica invisível para quem não fez
-- login — é dado de cliente, não catálogo.
alter table public.orcamentos enable row level security;

drop policy if exists "visitante pede orcamento" on public.orcamentos;
create policy "visitante pede orcamento"
  on public.orcamentos for insert
  to anon, authenticated
  with check (true);

drop policy if exists "somente admin le orcamentos" on public.orcamentos;
create policy "somente admin le orcamentos"
  on public.orcamentos for select
  to authenticated
  using (true);

drop policy if exists "somente admin edita orcamentos" on public.orcamentos;
create policy "somente admin edita orcamentos"
  on public.orcamentos for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "somente admin apaga orcamentos" on public.orcamentos;
create policy "somente admin apaga orcamentos"
  on public.orcamentos for delete
  to authenticated
  using (true);

-- ── Clientes ────────────────────────────────────────────────────────────────
-- Ficha de cliente, sem senha e sem login. O balcão preenche quando o aparelho
-- entra; o site tem um pré-cadastro para quem quer adiantar isso de casa.
create table if not exists public.clientes (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  telefone      text not null,
  -- Só os dígitos, calculado pelo banco. É por ele que a ficha é encontrada e
  -- que se evita cadastrar a mesma pessoa duas vezes com máscaras diferentes:
  -- "(31) 99961-2371" e "31999612371" viram a mesma chave.
  telefone_digitos text generated always as (regexp_replace(telefone, '\D', '', 'g')) stored,
  email         text not null default '',
  documento     text not null default '',
  endereco      text not null default '',
  observacoes   text not null default '',
  -- 'site' veio do pré-cadastro público; 'painel' foi a loja quem digitou.
  origem        text not null default 'painel' check (origem in ('painel','site')),
  -- Pré-cadastro do site entra por conferir. Quem a loja cadastra já nasce ok.
  confirmado    boolean not null default true,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create unique index if not exists clientes_telefone_idx
  on public.clientes (telefone_digitos);
create index if not exists clientes_nome_idx on public.clientes (nome);

drop trigger if exists clientes_atualizado_em on public.clientes;
create trigger clientes_atualizado_em
  before update on public.clientes
  for each row execute function public.tocar_atualizado_em();

-- Mão única, como em `orcamentos`: o visitante consegue se cadastrar, mas
-- ninguém de fora lê a lista de clientes da loja.
alter table public.clientes enable row level security;

drop policy if exists "visitante se cadastra" on public.clientes;
create policy "visitante se cadastra"
  on public.clientes for insert
  to anon, authenticated
  with check (true);

drop policy if exists "somente admin le clientes" on public.clientes;
create policy "somente admin le clientes"
  on public.clientes for select
  to authenticated
  using (true);

drop policy if exists "somente admin edita clientes" on public.clientes;
create policy "somente admin edita clientes"
  on public.clientes for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "somente admin apaga clientes" on public.clientes;
create policy "somente admin apaga clientes"
  on public.clientes for delete
  to authenticated
  using (true);

-- ── Contadores sequenciais ──────────────────────────────────────────────────
-- Guarda o número da última ordem de cada ano. Uma linha por ano.
create table if not exists public.contadores (
  chave text primary key,
  valor integer not null default 0
);

alter table public.contadores enable row level security;
-- Sem política nenhuma: ninguém lê nem escreve direto. Só a função abaixo mexe.

/**
 * Devolve o próximo código de ordem: OS-2026-0001, reiniciando a cada ano.
 *
 * O insert com `on conflict do update ... returning` é uma operação só no
 * banco, então dois atendentes abrindo ordem ao mesmo tempo nunca recebem o
 * mesmo número nem pulam um.
 *
 * O ano sai no fuso de São Paulo de propósito: às 22h de 31 de dezembro aqui
 * já é 1º de janeiro em UTC, e a contagem viraria o ano cedo demais.
 */
create or replace function public.proximo_codigo_ordem()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  ano text := to_char(now() at time zone 'America/Sao_Paulo', 'YYYY');
  n   integer;
begin
  insert into public.contadores (chave, valor)
  values ('ordem_' || ano, 1)
  on conflict (chave) do update set valor = contadores.valor + 1
  returning valor into n;

  return 'OS-' || ano || '-' || lpad(n::text, 4, '0');
end;
$$;

revoke all on function public.proximo_codigo_ordem() from public;
-- Só o painel abre ordem, então visitante anônimo não precisa disto.
grant execute on function public.proximo_codigo_ordem() to authenticated;

/**
 * O mesmo número, só para mostrar na tela antes de salvar — sem consumir.
 *
 * A tela de abrir ordem precisa exibir qual será o número, e não pode gastá-lo:
 * formulário aberto e abandonado deixaria buraco na sequência. Então quem
 * mostra é esta função, que só lê, e quem decide é a `proximo_codigo_ordem`,
 * no salvar.
 *
 * Em teoria dois atendentes abrindo ao mesmo tempo veriam o mesmo número e um
 * deles salvaria com o seguinte. Vale a troca: o buraco na sequência seria
 * permanente, e a diferença de um número na tela se resolve ao salvar.
 */
create or replace function public.codigo_ordem_previsto()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  ano text := to_char(now() at time zone 'America/Sao_Paulo', 'YYYY');
  n   integer;
begin
  select coalesce(valor, 0) into n from public.contadores where chave = 'ordem_' || ano;
  return 'OS-' || ano || '-' || lpad((coalesce(n, 0) + 1)::text, 4, '0');
end;
$$;

revoke all on function public.codigo_ordem_previsto() from public;
grant execute on function public.codigo_ordem_previsto() to authenticated;

-- ── Ordens de serviço ───────────────────────────────────────────────────────
-- O aparelho que entrou para conserto. Alimenta a página /acompanhar, onde o
-- cliente vê em que etapa está sem precisar mandar mensagem perguntando.
create table if not exists public.ordens (
  id               uuid primary key default gen_random_uuid(),
  codigo           text not null unique,
  cliente_nome     text not null,
  cliente_telefone text not null,
  equipamento      text not null default 'Notebook',
  marca            text not null default '',
  modelo           text not null default '',
  defeito          text not null default '',
  status           text not null default 'recebido'
                     check (status in ('recebido','diagnosticado','aguardando_aprovacao',
                                       'em_reparo','pronto','entregue','cancelado')),
  -- Valor em reais. Nulo enquanto o diagnóstico não fecha um número.
  valor_orcado     integer check (valor_orcado >= 0),
  observacoes      text not null default '',
  previsao         date,
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now()
);

-- Liga a ordem à ficha do cliente. Fica nulo em ordem antiga e não impede nada:
-- nome e telefone continuam na própria ordem, para ela nunca depender da ficha.
-- `on delete set null` para apagar um cliente não levar junto o histórico.
alter table public.ordens
  add column if not exists cliente_id uuid references public.clientes(id) on delete set null;

create index if not exists ordens_cliente_idx on public.ordens (cliente_id);

create index if not exists ordens_codigo_idx on public.ordens (codigo);
create index if not exists ordens_status_idx on public.ordens (status, criado_em desc);

drop trigger if exists ordens_atualizado_em on public.ordens;
create trigger ordens_atualizado_em
  before update on public.ordens
  for each row execute function public.tocar_atualizado_em();

-- Sem política de select para `anon`: nome, telefone e defeito de cliente não
-- podem ser lidos de fora. A consulta pública de /acompanhar não fala com o
-- banco pelo navegador — ela passa por server action, que exige o código E os
-- quatro últimos dígitos do telefone e devolve só os campos liberados.
alter table public.ordens enable row level security;

drop policy if exists "somente admin le ordens" on public.ordens;
create policy "somente admin le ordens"
  on public.ordens for select
  to authenticated
  using (true);

drop policy if exists "somente admin edita ordens" on public.ordens;
create policy "somente admin edita ordens"
  on public.ordens for all
  to authenticated
  using (true)
  with check (true);

-- A consulta pública precisa passar por baixo da RLS, mas só depois de conferir
-- código + telefone. Esta função roda com os privilégios do dono da tabela e
-- devolve exclusivamente o que a página mostra — sem nome e sem telefone.
create or replace function public.consultar_ordem(p_codigo text, p_ultimos4 text)
returns table (
  codigo        text,
  equipamento   text,
  marca         text,
  modelo        text,
  defeito       text,
  status        text,
  valor_orcado  integer,
  observacoes   text,
  previsao      date,
  criado_em     timestamptz,
  atualizado_em timestamptz
)
language sql
security definer
set search_path = public
as $$
  select o.codigo, o.equipamento, o.marca, o.modelo, o.defeito, o.status,
         o.valor_orcado, o.observacoes, o.previsao, o.criado_em, o.atualizado_em
    from public.ordens o
   where upper(trim(o.codigo)) = upper(trim(p_codigo))
     and right(regexp_replace(o.cliente_telefone, '\D', '', 'g'), 4)
         = right(regexp_replace(p_ultimos4, '\D', '', 'g'), 4)
     and length(regexp_replace(p_ultimos4, '\D', '', 'g')) >= 4
   limit 1;
$$;

revoke all on function public.consultar_ordem(text, text) from public;
grant execute on function public.consultar_ordem(text, text) to anon, authenticated;

-- ── Financeiro ──────────────────────────────────────────────────────────────
-- Três campos de custo e uma tabela de lançamentos. Nada de plano de contas,
-- conciliação ou nota fiscal: livro-caixa de loja pequena, que é o que vai ser
-- usado de verdade. Todos os valores em reais inteiros, como o resto do sistema.

-- Quanto a loja pagou no aparelho. Fica fora do site: é o número que ninguém
-- de fora pode ver.
alter table public.produtos
  add column if not exists custo integer check (custo >= 0);

-- O orçado é o que foi combinado; o cobrado é o que entrou. Separados porque
-- desconto no fechamento é regra, não exceção.
alter table public.ordens
  add column if not exists valor_cobrado integer check (valor_cobrado >= 0);
alter table public.ordens
  add column if not exists custo_peca integer check (custo_peca >= 0);

-- Uma tabela só para caixa e para contas a receber/pagar. O que separa os dois
-- é `pago_em`: preenchido, já entrou ou saiu; nulo, ainda é promessa. Assim a
-- baixa de uma conta é um update de uma coluna, não uma migração entre tabelas.
create table if not exists public.lancamentos (
  id          uuid primary key default gen_random_uuid(),
  tipo        text not null check (tipo in ('entrada','saida')),
  valor       integer not null check (valor > 0),
  descricao   text not null default '',
  categoria   text not null default 'outros',
  -- Nulo em lançamento à vista. Preenchido, vira conta a receber ou a pagar.
  vence_em    date,
  -- Nulo enquanto não foi pago. É esta coluna que decide se entra no caixa.
  pago_em     date,
  cliente_id  uuid references public.clientes(id) on delete set null,
  ordem_id    uuid references public.ordens(id)  on delete set null,
  produto_id  uuid references public.produtos(id) on delete set null,
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists lancamentos_pago_idx on public.lancamentos (pago_em desc);
create index if not exists lancamentos_aberto_idx on public.lancamentos (vence_em) where pago_em is null;

-- Uma ordem gera no máximo dois lançamentos: a entrada do serviço e a saída da
-- peça. O fechamento da OS roda upsert por esta chave, então salvar a mesma
-- ordem de novo corrige os valores em vez de duplicar receita e custo.
drop index if exists public.lancamentos_ordem_idx;
create unique index if not exists lancamentos_ordem_tipo_idx
  on public.lancamentos (ordem_id, tipo) where ordem_id is not null;

drop trigger if exists lancamentos_atualizado_em on public.lancamentos;
create trigger lancamentos_atualizado_em
  before update on public.lancamentos
  for each row execute function public.tocar_atualizado_em();

alter table public.lancamentos enable row level security;

-- Sem política para `anon`: faturamento da loja não é dado público.
drop policy if exists "somente admin le lancamentos" on public.lancamentos;
create policy "somente admin le lancamentos"
  on public.lancamentos for select
  to authenticated
  using (true);

drop policy if exists "somente admin edita lancamentos" on public.lancamentos;
create policy "somente admin edita lancamentos"
  on public.lancamentos for all
  to authenticated
  using (true)
  with check (true);

-- ── Armazenamento das fotos ─────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do update set public = true;

drop policy if exists "fotos visiveis para todos" on storage.objects;
create policy "fotos visiveis para todos"
  on storage.objects for select
  using (bucket_id = 'produtos');

drop policy if exists "admin envia foto" on storage.objects;
create policy "admin envia foto"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'produtos');

drop policy if exists "admin apaga foto" on storage.objects;
create policy "admin apaga foto"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'produtos');

drop policy if exists "admin atualiza foto" on storage.objects;
create policy "admin atualiza foto"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'produtos');

-- ============================================================================
-- Depois de rodar isto:
--   1. Authentication → Users → Add user → crie o e-mail e a senha do painel.
--      (Deixe "Auto Confirm User" marcado.)
--   2. Authentication → Providers → Email → desligue "Enable sign ups",
--      para que ninguém consiga criar conta sozinho.
--   3. No projeto: `npm run seed` para subir o catálogo inicial.
-- ============================================================================
