-- P360 Dashboard — Supabase Schema
-- Run this in your Supabase SQL Editor

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('admin', 'client')),
  agency_id uuid,
  client_id uuid,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Clients
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text,
  logo_url text,
  color text default '#6366f1',
  status text default 'active' check (status in ('active', 'review', 'paused')),
  platforms text[] default '{}',
  agency_id uuid not null,
  created_at timestamptz default now()
);
alter table public.clients enable row level security;
create policy "Admins manage clients" on public.clients for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Clients view own" on public.clients for select using (
  exists (select 1 from public.profiles where id = auth.uid() and client_id = clients.id)
);

-- Data Sources
create table public.data_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  account_id text,
  account_label text,
  status text default 'disconnected' check (status in ('connected', 'disconnected')),
  agency_id uuid not null,
  created_at timestamptz default now()
);

-- Client <-> Data Source junction
create table public.client_datasources (
  client_id uuid references public.clients(id) on delete cascade,
  datasource_id uuid references public.data_sources(id) on delete cascade,
  connected_at timestamptz default now(),
  primary key (client_id, datasource_id)
);

-- Reports
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  title text not null,
  type text default 'monthly' check (type in ('monthly', 'weekly', 'custom')),
  schedule text,
  last_sent timestamptz,
  recipient_email text,
  created_at timestamptz default now()
);

-- Goals
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  metric text not null,
  target numeric,
  current_value numeric default 0,
  deadline date,
  created_at timestamptz default now()
);

-- Alerts
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  metric text not null,
  condition text check (condition in ('above', 'below')),
  threshold numeric,
  email text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'role', 'admin'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
