-- Keep employer signup role from Auth user_metadata on the profiles row.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
begin
  user_role := lower(coalesce(new.raw_user_meta_data->>'role', 'worker'));
  if user_role not in ('worker', 'employer') then
    user_role := 'worker';
  end if;

  insert into public.profiles (id, role, email, first_name, last_name, company_name)
  values (
    new.id,
    user_role,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'company_name'
  )
  on conflict (id) do update
    set role = excluded.role,
        email = coalesce(excluded.email, public.profiles.email),
        first_name = coalesce(excluded.first_name, public.profiles.first_name),
        last_name = coalesce(excluded.last_name, public.profiles.last_name),
        company_name = coalesce(excluded.company_name, public.profiles.company_name),
        updated_at = now();

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
