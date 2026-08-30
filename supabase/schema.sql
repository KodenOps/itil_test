-- ═══════════════════════════════════════════════════════════════════════
-- 1. Allow-list enforcement (replaces the NextAuth signIn-callback check)
-- ═══════════════════════════════════════════════════════════════════════
-- This function is wired up as a "Before User Created" Auth Hook in the
-- Supabase Dashboard (Authentication → Hooks). It runs server-side, inside
-- Postgres, before any account is created — so a rejected sign-in never
-- even produces a user row. This can't be bypassed by calling the API
-- directly, unlike a check that only lives in your Next.js code.

create table if not exists public.allowed_emails (
  email text primary key,
  added_at timestamptz not null default now()
);

-- Seed with your own users, e.g.:
-- insert into public.allowed_emails (email) values ('you@yourdomain.com');

alter table public.allowed_emails enable row level security;
-- No policies added on purpose: this table is only ever read by the
-- SECURITY DEFINER function below, never directly by client requests.

create or replace function public.check_email_allowed(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  user_email text;
begin
  user_email := lower(event->'user'->>'email');

  if not exists (
    select 1 from public.allowed_emails where email = user_email
  ) then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 403,
        'message', 'This email is not authorized to access this site.'
      )
    );
  end if;

  return jsonb_build_object();
end;
$$;

-- Then in Dashboard → Authentication → Hooks → "Before User Created":
-- select "Postgres function" and choose public.check_email_allowed.
--
-- Prefer a whole domain instead of listing individual emails? Swap the
-- `exists` check above for:
--   user_email like '%@yourdomain.com'


-- ═══════════════════════════════════════════════════════════════════════
-- 2. Practical assessment submissions
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.assessment_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  file_path text not null,       -- path in Supabase Storage, if you move
                                  -- the upload there instead of/alongside email
  status text not null default 'pending'
    check (status in ('pending', 'graded')),
  score numeric,                 -- null until manually graded
  graded_at timestamptz,
  graded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.assessment_submissions enable row level security;

-- Users can see only their own submissions.
create policy "Users can view own submissions"
  on public.assessment_submissions
  for select
  using (auth.uid() = user_id);

-- Users can create a submission for themselves only — can't submit on
-- someone else's behalf by tampering with a user_id field.
create policy "Users can insert own submissions"
  on public.assessment_submissions
  for insert
  with check (auth.uid() = user_id);

-- No update/delete policy for regular users at all: once submitted, a
-- learner cannot edit their own score or resubmit over an existing row.
-- Grading happens via the Supabase Dashboard, the SQL editor, or a
-- service-role key in a trusted server context (e.g. your future grading
-- API) — never via the anon/publishable key used by the browser.