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
  categoria          text not null default 'notebook'
                       check (categoria in ('notebook','desktop','monitor','periferico','peca','acessorio')),
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
