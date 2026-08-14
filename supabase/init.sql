-- ============================================================
-- BAYNA | بينّا — Supabase setup (idempotent — safe to re-run)
-- Run in the Supabase SQL Editor (Dashboard → SQL Editor)
--
-- NOTE: the dashboard uses the app's local login, so all writes
-- go through the anon key → write policies are public.
-- Every CREATE POLICY is guarded so re-running never errors.
-- ============================================================

-- ---------- 1. site_config (single row, id = 1) ----------
create table if not exists public.site_config (
  id integer primary key default 1,
  start_date timestamptz not null default '2025-05-16T16:48:00+02:00',
  names_ar text not null default 'معتز وهنا',
  names_en text not null default 'Moataz & Hana',
  story_count integer not null default 6,
  text_ar jsonb not null default '{}'::jsonb,
  text_en jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.site_config enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'site_config' and policyname = 'public read site_config') then
    create policy "public read site_config" on public.site_config for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'site_config' and policyname = 'public write site_config') then
    create policy "public write site_config" on public.site_config for all using (true) with check (true);
  end if;
end $$;

insert into public.site_config (id, start_date, names_ar, names_en, story_count)
values (1, '2025-05-16T16:48:00+02:00', 'معتز وهنا', 'Moataz & Hana', 6)
on conflict (id) do nothing;

-- ---------- 2. memories ----------
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  sort integer not null default 0,
  date text not null default '',
  title_ar text not null default '',
  title_en text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  location_ar text not null default '',
  location_en text not null default '',
  image text not null default '',
  categories text[] not null default '{}',
  aspect text not null default '4/5'
);
alter table public.memories add column if not exists section text not null default 'both';
comment on column public.memories.section is 'timeline | wall | both — where the memory appears on the site';
alter table public.memories enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'memories' and policyname = 'public read memories') then
    create policy "public read memories" on public.memories for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'memories' and policyname = 'public write memories') then
    create policy "public write memories" on public.memories for all using (true) with check (true);
  end if;
end $$;

-- ---------- 3. songs ----------
create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  sort integer not null default 0,
  title_ar text not null default '',
  title_en text not null default '',
  artist_ar text not null default '',
  artist_en text not null default '',
  audio_url text not null default '',
  spotify_url text not null default '',
  is_default boolean not null default false,
  accent text not null default '#D98C9A',
  chord jsonb not null default '[]'::jsonb
);
alter table public.songs add column if not exists audio_url text not null default '';
alter table public.songs add column if not exists spotify_url text not null default '';
alter table public.songs add column if not exists is_default boolean not null default false;
alter table public.songs enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'songs' and policyname = 'public read songs') then
    create policy "public read songs" on public.songs for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'songs' and policyname = 'public write songs') then
    create policy "public write songs" on public.songs for all using (true) with check (true);
  end if;
end $$;

-- ---------- 4. letters ----------
create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  sort integer not null default 0,
  trigger_ar text not null default '',
  trigger_en text not null default '',
  content_ar jsonb not null default '[]'::jsonb,
  content_en jsonb not null default '[]'::jsonb,
  accent text not null default '#D98C9A'
);
alter table public.letters enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'letters' and policyname = 'public read letters') then
    create policy "public read letters" on public.letters for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'letters' and policyname = 'public write letters') then
    create policy "public write letters" on public.letters for all using (true) with check (true);
  end if;
end $$;

-- ---------- 5. chapters ----------
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  sort integer not null default 0,
  number text not null default '01',
  title_ar text not null default '',
  title_en text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  image text not null default ''
);
alter table public.chapters enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'chapters' and policyname = 'public read chapters') then
    create policy "public read chapters" on public.chapters for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'chapters' and policyname = 'public write chapters') then
    create policy "public write chapters" on public.chapters for all using (true) with check (true);
  end if;
end $$;

-- ---------- 6. storage bucket for images & audio ----------
insert into storage.buckets (id, name, public)
values ('bayna', 'bayna', true)
on conflict (id) do update set public = true;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'public read bayna bucket') then
    create policy "public read bayna bucket" on storage.objects for select using (bucket_id = 'bayna');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'public write bayna bucket') then
    create policy "public write bayna bucket" on storage.objects for all using (bucket_id = 'bayna') with check (bucket_id = 'bayna');
  end if;
end $$;

-- ---------- 7. dashboard admins ----------
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  salt text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'admins' and policyname = 'public read admins') then
    create policy "public read admins" on public.admins for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'admins' and policyname = 'public write admins') then
    create policy "public write admins" on public.admins for all using (true) with check (true);
  end if;
end $$;
