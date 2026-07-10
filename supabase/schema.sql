-- MyHiredito core schema (run before rls-policies.sql)

create type user_role as enum ('worker', 'employer', 'admin');
create type availability_type as enum ('full-time', 'part-time', 'weekends', 'flexible');
create type onboarding_step as enum ('profile', 'skills-certificates', 'payment-method');
create type id_document_type as enum (
  'drivers-license',
  'passport',
  'national-id',
  'state-id'
);
create type verification_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'worker',
  email text not null,
  first_name text,
  last_name text,
  display_name text,
  phone text,
  headline text,
  bio text,
  location text,
  skills text[] default '{}',
  seeking text[] default '{}',
  availability availability_type,
  avatar_url text,
  is_verified boolean not null default false,
  last_active_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.onboarding_progress (
  worker_id uuid primary key references public.profiles(id) on delete cascade,
  completed_steps onboarding_step[] not null default '{}',
  dismissed boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.identity_documents (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.profiles(id) on delete cascade,
  id_type id_document_type not null,
  id_number text not null,
  expiry_date date,
  front_file_url text,
  back_file_url text,
  verification_status verification_status not null default 'pending',
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (worker_id)
);

create table public.worker_certificates (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.profiles(id) on delete cascade,
  certificate_name text not null,
  issuing_body text not null,
  issue_date date,
  expiry_date date,
  license_number text,
  file_url text,
  verification_status verification_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role_value user_role;
begin
  user_role_value := coalesce(
    (new.raw_user_meta_data->>'role')::user_role,
    'worker'::user_role
  );

  insert into public.profiles (id, email, role, display_name)
  values (
    new.id,
    new.email,
    user_role_value,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;

  if user_role_value = 'worker' then
    insert into public.onboarding_progress (worker_id)
    values (new.id)
    on conflict (worker_id) do nothing;
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

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger identity_documents_updated_at before update on public.identity_documents
  for each row execute function public.set_updated_at();
create trigger worker_certificates_updated_at before update on public.worker_certificates
  for each row execute function public.set_updated_at();
