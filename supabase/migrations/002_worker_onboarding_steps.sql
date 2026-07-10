-- Rename worker onboarding step enum values for skills + payment flow.
-- Safe to run on fresh installs that already use schema.sql with new values.

do $$
begin
  if exists (
    select 1
    from pg_enum e
    join pg_type t on e.enumtypid = t.oid
    where t.typname = 'onboarding_step'
      and e.enumlabel = 'government-id'
  ) then
    alter type public.onboarding_step rename value 'government-id' to 'skills-certificates';
  end if;

  if exists (
    select 1
    from pg_enum e
    join pg_type t on e.enumtypid = t.oid
    where t.typname = 'onboarding_step'
      and e.enumlabel = 'certificates'
  ) then
    alter type public.onboarding_step rename value 'certificates' to 'payment-method';
  end if;
end $$;
