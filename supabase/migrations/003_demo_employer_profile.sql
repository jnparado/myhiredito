-- Employer demo accounts need company_name and employer_onboarding.
-- Safe to run on projects that already used 001_initial_schema.sql or schema.sql.

alter table public.profiles
  add column if not exists company_name text;

create table if not exists public.employer_onboarding (
  user_id uuid primary key references auth.users (id) on delete cascade,
  completed_steps text[] not null default '{}',
  dismissed boolean not null default false,
  identity jsonb,
  business_certificate jsonb,
  business_details jsonb,
  updated_at timestamptz not null default now()
);

alter table public.employer_onboarding enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'employer_onboarding'
      and policyname = 'Employers manage own onboarding'
  ) then
    create policy "Employers manage own onboarding"
      on public.employer_onboarding for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;
