-- ═══════════════════════════════════════════════════════════════════════
--  CertifyHub — Supabase schema
-- ═══════════════════════════════════════════════════════════════════════
--  This file is idempotent: it is safe to run the whole thing again in the
--  Supabase SQL editor after an update. It covers:
--
--    1. Roles              learner | instructor | admin   (default: learner)
--    2. Profiles           one row per auth user, auto-created on sign-up
--    3. Role invitations   admin-issued upgrades (instructor / admin)
--    4. Courses            catalogue shown on "/"
--    5. Enrollments        max 2 active courses per user (DB enforced)
--    6. Questions          all question banks from src/data
--    7. Learning tasks     practical tasks from src/data
--    8. Reviews            testimonials from src/data
--    9. Quiz attempts      learning activity used by profile + admin
--   10. Activity feed      per-user timeline
--   11. Assessment submissions (practical Excel uploads)
--   12. RLS policies + helper functions + admin metrics RPCs
--
--  First admin: register normally (you get "learner"), then run
--      update public.profiles set role = 'admin' where email = 'you@example.com';
--  Everyone else is upgraded from the admin dashboard by invitation.
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ── 1. Roles ─────────────────────────────────────────────────────────────

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('learner', 'instructor', 'admin');
  end if;
end $$;

-- ── 2. Profiles ──────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role public.app_role not null default 'learner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_active_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

-- Role helpers. SECURITY DEFINER so policies can call them without
-- recursing into the profiles RLS policy.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'instructor')
  );
$$;

-- A user may edit their own display name / avatar, but never their own role.
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.uid() is null for the SQL editor / service role, which is how the
  -- very first admin is promoted. Never let a signed-in learner escalate.
  if
    new.role is distinct from old.role
    and auth.uid() is not null
    and not public.is_admin()
  then
    raise exception 'Only administrators can change roles.' using errcode = '42501';
  end if;

  if
    new.email is distinct from old.email
    and auth.uid() is not null
    and not public.is_admin()
  then
    new.email := old.email;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_guard_update on public.profiles;
create trigger profiles_guard_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ── 3. Role invitations ──────────────────────────────────────────────────

create table if not exists public.role_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role public.app_role not null,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'revoked')),
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id) on delete set null
);

create unique index if not exists role_invites_pending_email_idx
  on public.role_invites (lower(email))
  where status = 'pending';

-- Most recent pending invite for this address, if any.
create or replace function public.pending_invite_for(user_email text)
returns public.role_invites
language sql
stable
security definer
set search_path = public
as $$
  select i.*
  from public.role_invites i
  where lower(i.email) = lower(user_email) and i.status = 'pending'
  order by i.created_at desc
  limit 1;
$$;

-- ── 4. Courses ───────────────────────────────────────────────────────────

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  track text not null default 'Learning track',
  level text not null default 'All levels',
  accent_from text not null default '#2660A4',
  accent_to text not null default '#4F8FCA',
  href text not null,
  icon text not null default 'work',
  estimated_hours integer not null default 12,
  position integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.courses
  (slug, title, summary, track, level, accent_from, accent_to, href, icon, estimated_hours, position)
values
  ('itil-foundation', 'ITIL V4/V5 Foundation',
   'Process thinking, service value, and exam practice built around the ITIL path.',
   'Learning track', 'Foundation', '#2660A4', '#4F8FCA',
   '/page/itil-v5', 'work', 18, 1),
  ('itil-strategist', 'ITIL Strategist: DPI',
   'Direct, Plan and Improve — the strategist module, from syllabus to exam room.',
   'Learning track', 'Advanced', '#9EBC9E', '#553E4E',
   '/page/itil-v5-Strategist', 'work', 22, 2),
  ('excel-fundamentals', 'Excel 101',
   'Learn the basics of Excel, including formulas, functions, and data visualization.',
   'Learning track', 'Beginner', '#247BA0', '#3C1642',
   '/page/excel-for-beginners', 'work', 10, 3),
  ('power-bi', 'Power BI 101',
   'Learn the basics of Business Intelligence with Microsoft Power BI.',
   'Learning track', 'Beginner', '#DD44AF', '#0C1642',
   '/page/bi-for-beginners', 'chart', 10, 4),
  ('kcna', 'KCNA',
   'Kubernetes fundamentals, practice flow, and study structure for cloud-native learners.',
   'Learning track', 'Associate', '#26a465', '#39c682',
   '/page/kcna-home', 'kubernetes', 20, 5),
  ('aws-cloud-practitioner', 'AWS Cloud Practitioner',
   'Core AWS services, the shared responsibility model, and a full practice bank.',
   'Learning track', 'Foundation', '#F97316', '#7C2D12',
   '/page/aws-practise', 'cloud', 16, 6),
  ('devops-sys-engineer', 'DevOps & Sys Eng',
   'Architecture, reliability, production sense, and the skills that make systems durable.',
   'Learning track', 'Intermediate', '#6D2E46', '#A24E67',
   '/page/devops-sys-engineer', 'engineering', 24, 7)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  track = excluded.track,
  level = excluded.level,
  accent_from = excluded.accent_from,
  accent_to = excluded.accent_to,
  href = excluded.href,
  icon = excluded.icon,
  estimated_hours = excluded.estimated_hours,
  position = excluded.position;

-- ── 5. Enrollments (max 2 active per user) ───────────────────────────────

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'active'
    check (status in ('active', 'completed', 'withdrawn')),
  progress integer not null default 0 check (progress between 0 and 100),
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, course_id)
);

create index if not exists course_enrollments_user_idx
  on public.course_enrollments (user_id);
create index if not exists course_enrollments_course_idx
  on public.course_enrollments (course_id);

create or replace function public.enforce_enrollment_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  active_count integer;
  max_active constant integer := 2;
begin
  if new.status <> 'active' then
    return new;
  end if;

  select count(*) into active_count
  from public.course_enrollments e
  where e.user_id = new.user_id
    and e.status = 'active'
    and e.id is distinct from new.id;

  if active_count >= max_active then
    raise exception 'ENROLLMENT_LIMIT_REACHED'
      using errcode = 'P0001',
            message = 'You can be enrolled in at most 2 courses at a time. Complete or leave a course first.';
  end if;

  return new;
end;
$$;

drop trigger if exists course_enrollments_limit_insert on public.course_enrollments;
create trigger course_enrollments_limit_insert
  before insert on public.course_enrollments
  for each row execute function public.enforce_enrollment_limit();

drop trigger if exists course_enrollments_limit_update on public.course_enrollments;
create trigger course_enrollments_limit_update
  before update on public.course_enrollments
  for each row execute function public.enforce_enrollment_limit();

-- ── 6. Questions (migrated from src/data) ────────────────────────────────

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null references public.courses(slug) on update cascade on delete cascade,
  external_id text,
  category text,
  prompt text not null,
  options jsonb not null default '[]'::jsonb,
  answer_index integer,
  answer_text text,
  explanation text not null default '',
  image_url text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (course_slug, external_id)
);

create index if not exists questions_course_idx on public.questions (course_slug);

-- ── 7. Learning tasks (practical exercises from src/data) ────────────────

create table if not exists public.learning_tasks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  course_slug text references public.courses(slug) on update cascade on delete cascade,
  title text not null,
  description text not null default '',
  link text,
  download text,
  status text not null default 'open' check (status in ('open', 'locked')),
  accent text not null default '#f2f4f3',
  concepts jsonb not null default '[]'::jsonb,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── 8. Reviews (testimonials from src/data) ──────────────────────────────

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  name text not null,
  role text,
  body text not null,
  avatar_url text,
  rating integer not null default 5 check (rating between 1 and 5),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── 9. Quiz attempts (learning activity) ─────────────────────────────────

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_slug text references public.courses(slug) on update cascade on delete set null,
  mode text not null default 'practice',
  question_count integer not null default 0,
  correct_count integer not null default 0,
  score numeric(5, 2) not null default 0,
  duration_seconds integer,
  created_at timestamptz not null default now()
);

create index if not exists quiz_attempts_user_idx on public.quiz_attempts (user_id, created_at desc);
create index if not exists quiz_attempts_created_idx on public.quiz_attempts (created_at desc);

-- ── 10. Activity feed ────────────────────────────────────────────────────

create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null,
  course_slug text,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_events_user_idx on public.activity_events (user_id, created_at desc);
create index if not exists activity_events_created_idx on public.activity_events (created_at desc);

-- ── 11. Profile bootstrap + invitation redemption ────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  invite public.role_invites;
  assigned public.app_role := 'learner';
begin
  invite := public.pending_invite_for(new.email);

  if invite.id is not null then
    assigned := invite.role;
    update public.role_invites
       set status = 'accepted', accepted_at = now(), accepted_by = new.id
     where id = invite.id;
  end if;

  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    assigned
  )
  on conflict (id) do nothing;

  insert into public.activity_events (user_id, event_type, summary, metadata)
  values (
    new.id,
    'signup',
    case when invite.id is null then 'Created an account' else 'Accepted a role invitation' end,
    jsonb_build_object('role', assigned)
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── 12. Assessment submissions (kept from the original schema) ───────────

create table if not exists public.assessment_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  file_path text not null,
  status text not null default 'pending'
    check (status in ('pending', 'graded')),
  score numeric,
  graded_at timestamptz,
  graded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- The old allow-list gate blocked self-registration. Registration is open
-- now and everyone starts as a learner, so the hook is a no-op even if it
-- is still attached in Dashboard → Authentication → Hooks.
create table if not exists public.allowed_emails (
  email text primary key,
  added_at timestamptz not null default now()
);

create or replace function public.check_email_allowed(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  return jsonb_build_object();
end;
$$;

-- ── 13. Metrics RPCs (aggregates only, safe for every signed-in user) ────

create or replace function public.course_stats()
returns table (
  course_id uuid,
  enrolled bigint,
  active bigint,
  completed bigint,
  questions bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select c.id,
         count(distinct e.id) as enrolled,
         count(distinct e.id) filter (where e.status = 'active') as active,
         count(distinct e.id) filter (where e.status = 'completed') as completed,
         (select count(*) from public.questions q where q.course_slug = c.slug) as questions
  from public.courses c
  left join public.course_enrollments e on e.course_id = c.id
  group by c.id;
$$;

create or replace function public.platform_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_staff() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'total_users', (select count(*) from public.profiles),
    'learners', (select count(*) from public.profiles where role = 'learner'),
    'instructors', (select count(*) from public.profiles where role = 'instructor'),
    'admins', (select count(*) from public.profiles where role = 'admin'),
    'new_users_7d', (select count(*) from public.profiles where created_at > now() - interval '7 days'),
    'active_learners_7d', (select count(distinct user_id) from public.quiz_attempts where created_at > now() - interval '7 days'),
    'total_enrollments', (select count(*) from public.course_enrollments),
    'active_enrollments', (select count(*) from public.course_enrollments where status = 'active'),
    'total_courses', (select count(*) from public.courses where is_published),
    'total_questions', (select count(*) from public.questions),
    'total_attempts', (select count(*) from public.quiz_attempts),
    'attempts_7d', (select count(*) from public.quiz_attempts where created_at > now() - interval '7 days'),
    'avg_score', coalesce((select round(avg(score), 1) from public.quiz_attempts), 0),
    'pending_invites', (select count(*) from public.role_invites where status = 'pending'),
    'pending_submissions', (select count(*) from public.assessment_submissions where status = 'pending')
  ) into result;

  return result;
end;
$$;

create or replace function public.activity_daily(days integer default 14)
returns table (day date, signups bigint, enrollments bigint, attempts bigint)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  return query
  with span as (
    select generate_series(
      (now()::date - (days - 1)),
      now()::date,
      interval '1 day'
    )::date as d
  )
  select span.d,
         (select count(*) from public.profiles p where p.created_at::date = span.d),
         (select count(*) from public.course_enrollments e where e.enrolled_at::date = span.d),
         (select count(*) from public.quiz_attempts a where a.created_at::date = span.d)
  from span
  order by span.d;
end;
$$;

grant execute on function public.course_stats() to anon, authenticated;
grant execute on function public.platform_stats() to authenticated;
grant execute on function public.activity_daily(integer) to authenticated;

-- ── 14. Row Level Security ───────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.role_invites enable row level security;
alter table public.courses enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.questions enable row level security;
alter table public.learning_tasks enable row level security;
alter table public.reviews enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.activity_events enable row level security;
alter table public.assessment_submissions enable row level security;
alter table public.allowed_emails enable row level security;

-- profiles
drop policy if exists "Profiles are readable by staff or self" on public.profiles;
create policy "Profiles are readable by staff or self"
  on public.profiles for select
  using (auth.uid() = id or public.is_staff());

drop policy if exists "Users create their own profile" on public.profiles;
create policy "Users create their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users update their own profile" on public.profiles;
create policy "Users update their own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- role invitations: admins only
drop policy if exists "Admins manage invitations" on public.role_invites;
create policy "Admins manage invitations"
  on public.role_invites for all
  using (public.is_admin())
  with check (public.is_admin());

-- courses: readable by anyone (the catalogue is public), writable by admins
drop policy if exists "Courses are public" on public.courses;
create policy "Courses are public"
  on public.courses for select
  using (true);

drop policy if exists "Admins manage courses" on public.courses;
create policy "Admins manage courses"
  on public.courses for all
  using (public.is_admin())
  with check (public.is_admin());

-- enrollments
drop policy if exists "Users read their own enrollments" on public.course_enrollments;
create policy "Users read their own enrollments"
  on public.course_enrollments for select
  using (auth.uid() = user_id or public.is_staff());

drop policy if exists "Users enroll themselves" on public.course_enrollments;
create policy "Users enroll themselves"
  on public.course_enrollments for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update their own enrollments" on public.course_enrollments;
create policy "Users update their own enrollments"
  on public.course_enrollments for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users leave their own enrollments" on public.course_enrollments;
create policy "Users leave their own enrollments"
  on public.course_enrollments for delete
  using (auth.uid() = user_id or public.is_admin());

-- questions: signed-in read, admin write
drop policy if exists "Signed-in users read questions" on public.questions;
create policy "Signed-in users read questions"
  on public.questions for select
  to authenticated
  using (true);

drop policy if exists "Admins manage questions" on public.questions;
create policy "Admins manage questions"
  on public.questions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- learning tasks / reviews: public read, admin write
drop policy if exists "Learning tasks are public" on public.learning_tasks;
create policy "Learning tasks are public"
  on public.learning_tasks for select
  using (true);

drop policy if exists "Admins manage learning tasks" on public.learning_tasks;
create policy "Admins manage learning tasks"
  on public.learning_tasks for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Reviews are public" on public.reviews;
create policy "Reviews are public"
  on public.reviews for select
  using (true);

drop policy if exists "Admins manage reviews" on public.reviews;
create policy "Admins manage reviews"
  on public.reviews for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- quiz attempts
drop policy if exists "Users read their own attempts" on public.quiz_attempts;
create policy "Users read their own attempts"
  on public.quiz_attempts for select
  using (auth.uid() = user_id or public.is_staff());

drop policy if exists "Users record their own attempts" on public.quiz_attempts;
create policy "Users record their own attempts"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

-- activity feed
drop policy if exists "Users read their own activity" on public.activity_events;
create policy "Users read their own activity"
  on public.activity_events for select
  using (auth.uid() = user_id or public.is_staff());

drop policy if exists "Users write their own activity" on public.activity_events;
create policy "Users write their own activity"
  on public.activity_events for insert
  with check (auth.uid() = user_id);

-- assessment submissions (original rules)
drop policy if exists "Users can view own submissions" on public.assessment_submissions;
create policy "Users can view own submissions"
  on public.assessment_submissions for select
  using (auth.uid() = user_id or public.is_staff());

drop policy if exists "Users can insert own submissions" on public.assessment_submissions;
create policy "Users can insert own submissions"
  on public.assessment_submissions for insert
  with check (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════
--  After running this file:
--
--  1. Authentication → Providers → Email: enable Email + Password.
--     Turn OFF every social provider (Google, Facebook, …) — the sign-in
--     page no longer offers them.
--  2. Disable any "Before User Created" hook left over from the old
--     allow-list setup; the function above is a no-op if it is still on.
--  3. Register your own account on /login, then promote it:
--       update public.profiles set role = 'admin'
--        where email = 'you@example.com';
--  4. Sign in as that admin → Admin → Content → "Sync content" to move
--     every question bank, task and review from src/data into the tables.
-- ═══════════════════════════════════════════════════════════════════════
