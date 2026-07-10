-- MyHiredito initial Supabase schema
-- Run in Supabase Dashboard → SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('worker', 'employer')),
  email text,
  first_name text,
  last_name text,
  company_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.worker_onboarding (
  user_id uuid primary key references auth.users (id) on delete cascade,
  completed_steps text[] not null default '{}',
  dismissed boolean not null default false,
  personal jsonb,
  location_skills jsonb,
  payment jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.employer_onboarding (
  user_id uuid primary key references auth.users (id) on delete cascade,
  completed_steps text[] not null default '{}',
  dismissed boolean not null default false,
  identity jsonb,
  business_certificate jsonb,
  business_details jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.worker_onboarding enable row level security;
alter table public.employer_onboarding enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Workers manage own onboarding"
  on public.worker_onboarding for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Employers manage own onboarding"
  on public.employer_onboarding for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
begin
  user_role := coalesce(new.raw_user_meta_data->>'role', 'worker');

  insert into public.profiles (id, role, email, first_name, last_name, company_name)
  values (
    new.id,
    user_role,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'company_name'
  )
  on conflict (id) do nothing;

  if user_role = 'employer' then
    insert into public.employer_onboarding (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  else
    insert into public.worker_onboarding (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists worker_onboarding_updated_at on public.worker_onboarding;
create trigger worker_onboarding_updated_at
  before update on public.worker_onboarding
  for each row execute function public.set_updated_at();

drop trigger if exists employer_onboarding_updated_at on public.employer_onboarding;
create trigger employer_onboarding_updated_at
  before update on public.employer_onboarding
  for each row execute function public.set_updated_at();
