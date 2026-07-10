-- ============================================================
-- MyHiredito — Row Level Security (RLS) policies
-- Run AFTER creating tables (schema SQL).
-- Supabase Dashboard → SQL → New query → paste & run
-- ============================================================

-- ---------- HELPER FUNCTIONS ----------
create or replace function public.get_my_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin'::public.user_role from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_worker()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.get_my_role() = 'worker'::public.user_role;
$$;

create or replace function public.is_employer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.get_my_role() = 'employer'::public.user_role;
$$;

create or replace function public.owns_employer_org(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.employer_organizations
    where id = org_id
      and owner_id = auth.uid()
  );
$$;

create or replace function public.employer_owns_job(job_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.jobs j
    join public.employer_organizations e on e.id = j.employer_id
    where j.id = job_id
      and e.owner_id = auth.uid()
  );
$$;

create or replace function public.is_conversation_participant(conv_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.conversation_participants
    where conversation_id = conv_id
      and profile_id = auth.uid()
  );
$$;

create or replace function public.employer_can_view_worker(worker_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.job_applications ja
    join public.jobs j on j.id = ja.job_id
    join public.employer_organizations e on e.id = j.employer_id
    where ja.worker_id = worker_id
      and e.owner_id = auth.uid()
  );
$$;

-- ---------- ENABLE RLS ON ALL TABLES ----------
alter table public.profiles enable row level security;
alter table public.employer_organizations enable row level security;
alter table public.jobs enable row level security;
alter table public.job_shifts enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.assessment_answers enable row level security;
alter table public.job_applications enable row level security;
alter table public.onboarding_progress enable row level security;
alter table public.identity_documents enable row level security;
alter table public.worker_certificates enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.worker_connections enable row level security;
alter table public.notifications enable row level security;

-- ============================================================
-- 1. PROFILES
-- ============================================================
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_select_anon_active_jobs_context"
  on public.profiles for select
  to anon
  using (is_verified = true);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_admin_all"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 2. EMPLOYER_ORGANIZATIONS
-- ============================================================
create policy "employer_orgs_select_all"
  on public.employer_organizations for select
  to authenticated, anon
  using (true);

create policy "employer_orgs_insert_owner"
  on public.employer_organizations for insert
  to authenticated
  with check (
    public.is_employer()
    and owner_id = auth.uid()
  );

create policy "employer_orgs_update_owner"
  on public.employer_organizations for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "employer_orgs_delete_owner"
  on public.employer_organizations for delete
  to authenticated
  using (owner_id = auth.uid());

create policy "employer_orgs_admin_all"
  on public.employer_organizations for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 3. JOBS
-- ============================================================
create policy "jobs_select_active"
  on public.jobs for select
  to authenticated, anon
  using (is_active = true);

create policy "jobs_select_own_employer_inactive"
  on public.jobs for select
  to authenticated
  using (
    employer_id is not null
    and public.owns_employer_org(employer_id)
  );

create policy "jobs_insert_employer"
  on public.jobs for insert
  to authenticated
  with check (
    public.is_employer()
    and employer_id is not null
    and public.owns_employer_org(employer_id)
  );

create policy "jobs_update_employer"
  on public.jobs for update
  to authenticated
  using (
    employer_id is not null
    and public.owns_employer_org(employer_id)
  )
  with check (
    employer_id is not null
    and public.owns_employer_org(employer_id)
  );

create policy "jobs_delete_employer"
  on public.jobs for delete
  to authenticated
  using (
    employer_id is not null
    and public.owns_employer_org(employer_id)
  );

create policy "jobs_admin_all"
  on public.jobs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 4. JOB_SHIFTS
-- ============================================================
create policy "job_shifts_select_active_job"
  on public.job_shifts for select
  to authenticated, anon
  using (
    exists (
      select 1 from public.jobs j
      where j.id = job_id and j.is_active = true
    )
  );

create policy "job_shifts_select_own_employer"
  on public.job_shifts for select
  to authenticated
  using (public.employer_owns_job(job_id));

create policy "job_shifts_insert_employer"
  on public.job_shifts for insert
  to authenticated
  with check (public.employer_owns_job(job_id));

create policy "job_shifts_update_employer"
  on public.job_shifts for update
  to authenticated
  using (public.employer_owns_job(job_id))
  with check (public.employer_owns_job(job_id));

create policy "job_shifts_delete_employer"
  on public.job_shifts for delete
  to authenticated
  using (public.employer_owns_job(job_id));

create policy "job_shifts_admin_all"
  on public.job_shifts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 5. ASSESSMENT_QUESTIONS
-- ============================================================
create policy "assessment_questions_select_active"
  on public.assessment_questions for select
  to authenticated
  using (is_active = true);

create policy "assessment_questions_admin_write"
  on public.assessment_questions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 6. ASSESSMENT_ATTEMPTS
-- ============================================================
create policy "assessment_attempts_select_own"
  on public.assessment_attempts for select
  to authenticated
  using (worker_id = auth.uid());

create policy "assessment_attempts_select_employer_applicants"
  on public.assessment_attempts for select
  to authenticated
  using (
    public.is_employer()
    and exists (
      select 1
      from public.job_applications ja
      join public.jobs j on j.id = ja.job_id
      join public.employer_organizations e on e.id = j.employer_id
      where ja.worker_id = assessment_attempts.worker_id
        and ja.job_id = assessment_attempts.job_id
        and e.owner_id = auth.uid()
    )
  );

create policy "assessment_attempts_insert_worker"
  on public.assessment_attempts for insert
  to authenticated
  with check (
    public.is_worker()
    and worker_id = auth.uid()
  );

create policy "assessment_attempts_update_own"
  on public.assessment_attempts for update
  to authenticated
  using (worker_id = auth.uid())
  with check (worker_id = auth.uid());

create policy "assessment_attempts_delete_own"
  on public.assessment_attempts for delete
  to authenticated
  using (worker_id = auth.uid());

create policy "assessment_attempts_admin_all"
  on public.assessment_attempts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 7. ASSESSMENT_ANSWERS
-- ============================================================
create policy "assessment_answers_select_own"
  on public.assessment_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.assessment_attempts a
      where a.id = attempt_id and a.worker_id = auth.uid()
    )
  );

create policy "assessment_answers_select_employer_applicants"
  on public.assessment_answers for select
  to authenticated
  using (
    public.is_employer()
    and exists (
      select 1
      from public.assessment_attempts a
      join public.job_applications ja on ja.worker_id = a.worker_id and ja.job_id = a.job_id
      join public.jobs j on j.id = ja.job_id
      join public.employer_organizations e on e.id = j.employer_id
      where a.id = attempt_id
        and e.owner_id = auth.uid()
    )
  );

create policy "assessment_answers_insert_own"
  on public.assessment_answers for insert
  to authenticated
  with check (
    exists (
      select 1 from public.assessment_attempts a
      where a.id = attempt_id and a.worker_id = auth.uid()
    )
  );

create policy "assessment_answers_admin_all"
  on public.assessment_answers for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 8. JOB_APPLICATIONS
-- ============================================================
create policy "job_applications_select_own"
  on public.job_applications for select
  to authenticated
  using (worker_id = auth.uid());

create policy "job_applications_select_employer"
  on public.job_applications for select
  to authenticated
  using (public.employer_owns_job(job_id));

create policy "job_applications_insert_worker"
  on public.job_applications for insert
  to authenticated
  with check (
    public.is_worker()
    and worker_id = auth.uid()
  );

create policy "job_applications_update_worker"
  on public.job_applications for update
  to authenticated
  using (worker_id = auth.uid())
  with check (worker_id = auth.uid());

create policy "job_applications_update_employer_status"
  on public.job_applications for update
  to authenticated
  using (public.employer_owns_job(job_id))
  with check (public.employer_owns_job(job_id));

create policy "job_applications_delete_own"
  on public.job_applications for delete
  to authenticated
  using (worker_id = auth.uid());

create policy "job_applications_admin_all"
  on public.job_applications for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 9. ONBOARDING_PROGRESS
-- ============================================================
create policy "onboarding_select_own"
  on public.onboarding_progress for select
  to authenticated
  using (worker_id = auth.uid());

create policy "onboarding_insert_own"
  on public.onboarding_progress for insert
  to authenticated
  with check (
    public.is_worker()
    and worker_id = auth.uid()
  );

create policy "onboarding_update_own"
  on public.onboarding_progress for update
  to authenticated
  using (worker_id = auth.uid())
  with check (worker_id = auth.uid());

create policy "onboarding_admin_all"
  on public.onboarding_progress for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 10. IDENTITY_DOCUMENTS (sensitive — worker + admin only)
-- ============================================================
create policy "identity_docs_select_own"
  on public.identity_documents for select
  to authenticated
  using (worker_id = auth.uid());

create policy "identity_docs_insert_own"
  on public.identity_documents for insert
  to authenticated
  with check (
    public.is_worker()
    and worker_id = auth.uid()
  );

create policy "identity_docs_update_own"
  on public.identity_documents for update
  to authenticated
  using (worker_id = auth.uid())
  with check (worker_id = auth.uid());

create policy "identity_docs_delete_own"
  on public.identity_documents for delete
  to authenticated
  using (worker_id = auth.uid());

create policy "identity_docs_admin_all"
  on public.identity_documents for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 11. WORKER_CERTIFICATES
-- ============================================================
create policy "certificates_select_own"
  on public.worker_certificates for select
  to authenticated
  using (worker_id = auth.uid());

create policy "certificates_select_employer_applicants"
  on public.worker_certificates for select
  to authenticated
  using (public.employer_can_view_worker(worker_id));

create policy "certificates_insert_own"
  on public.worker_certificates for insert
  to authenticated
  with check (
    public.is_worker()
    and worker_id = auth.uid()
  );

create policy "certificates_update_own"
  on public.worker_certificates for update
  to authenticated
  using (worker_id = auth.uid())
  with check (worker_id = auth.uid());

create policy "certificates_delete_own"
  on public.worker_certificates for delete
  to authenticated
  using (worker_id = auth.uid());

create policy "certificates_admin_all"
  on public.worker_certificates for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 12. CONVERSATIONS
-- ============================================================
create policy "conversations_select_participant"
  on public.conversations for select
  to authenticated
  using (public.is_conversation_participant(id));

create policy "conversations_insert_authenticated"
  on public.conversations for insert
  to authenticated
  with check (true);

create policy "conversations_update_participant"
  on public.conversations for update
  to authenticated
  using (public.is_conversation_participant(id))
  with check (public.is_conversation_participant(id));

create policy "conversations_admin_all"
  on public.conversations for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 13. CONVERSATION_PARTICIPANTS
-- ============================================================
create policy "conv_participants_select_member"
  on public.conversation_participants for select
  to authenticated
  using (public.is_conversation_participant(conversation_id));

create policy "conv_participants_insert_self"
  on public.conversation_participants for insert
  to authenticated
  with check (profile_id = auth.uid());

create policy "conv_participants_insert_add_other"
  on public.conversation_participants for insert
  to authenticated
  with check (
    public.is_conversation_participant(conversation_id)
    or profile_id = auth.uid()
  );

create policy "conv_participants_update_own"
  on public.conversation_participants for update
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "conv_participants_admin_all"
  on public.conversation_participants for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 14. MESSAGES
-- ============================================================
create policy "messages_select_participant"
  on public.messages for select
  to authenticated
  using (public.is_conversation_participant(conversation_id));

create policy "messages_insert_participant"
  on public.messages for insert
  to authenticated
  with check (
    public.is_conversation_participant(conversation_id)
    and (sender_id is null or sender_id = auth.uid())
  );

create policy "messages_update_participant_read"
  on public.messages for update
  to authenticated
  using (public.is_conversation_participant(conversation_id))
  with check (public.is_conversation_participant(conversation_id));

create policy "messages_admin_all"
  on public.messages for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 15. WORKER_CONNECTIONS (Your Circle pins)
-- ============================================================
create policy "connections_select_own"
  on public.worker_connections for select
  to authenticated
  using (worker_id = auth.uid());

create policy "connections_insert_own"
  on public.worker_connections for insert
  to authenticated
  with check (
    public.is_worker()
    and worker_id = auth.uid()
    and worker_id <> target_worker_id
  );

create policy "connections_delete_own"
  on public.worker_connections for delete
  to authenticated
  using (worker_id = auth.uid());

create policy "connections_admin_all"
  on public.worker_connections for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 16. NOTIFICATIONS
-- ============================================================
create policy "notifications_select_own"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

create policy "notifications_insert_own"
  on public.notifications for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "notifications_update_own"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notifications_delete_own"
  on public.notifications for delete
  to authenticated
  using (user_id = auth.uid());

create policy "notifications_admin_all"
  on public.notifications for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- STORAGE BUCKET POLICIES (run after creating buckets)
-- Buckets: identity-documents, certificates, avatars
-- ============================================================

-- identity-documents: worker uploads to own folder {user_id}/...
create policy "storage_identity_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'identity-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_identity_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'identity-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_identity_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'identity-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_identity_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'identity-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- certificates: worker uploads to own folder
create policy "storage_certificates_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'certificates'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_certificates_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'certificates'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_certificates_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'certificates'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_certificates_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'certificates'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- avatars: public read, owner write
create policy "storage_avatars_select_public"
  on storage.objects for select
  to authenticated, anon
  using (bucket_id = 'avatars');

create policy "storage_avatars_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_avatars_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_avatars_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
