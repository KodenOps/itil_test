-- ═════════════════════════════════════════════════════════════════════════════
-- 20. Admin alerts
--
-- Run this file after supabase/schema-20261104.sql. Everything is idempotent.
--
-- Admins get an in-app notification whenever something needs them:
--
--   * a learner flags a question        → /admin?view=reports
--   * a practical is submitted          → /admin?view=grading
--   * somebody requests a course        → /admin?view=requests
--   * a new account is created          → /admin?view=users
--
-- The side-nav dot and the bell badge both read the same unread notification
-- rows, so opening a section clears them there and in the bell at once.
-- ═════════════════════════════════════════════════════════════════════════════

-- ---------------------------------------------------------------------------
-- New notification types
-- ---------------------------------------------------------------------------
do $$
declare
  existing record;
begin
  for existing in
    select conname
    from pg_constraint
    where conrelid = 'public.notifications'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) like '%report_replied%'
  loop
    execute format(
      'alter table public.notifications drop constraint %I',
      existing.conname
    );
  end loop;
end $$;

alter table public.notifications
  add constraint notifications_type_check check (type in (
    'report_replied',
    'report_acknowledged',
    'question_updated',
    'blog_published',
    'announcement',
    'report_created',
    'submission_created',
    'request_created',
    'signup_created'
  ));

-- ---------------------------------------------------------------------------
-- Fan a notification out to every admin (the actor is skipped)
-- ---------------------------------------------------------------------------
create or replace function public.notify_admins(
  p_type text,
  p_title text,
  p_body text,
  p_link text default null,
  p_actor_id uuid default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted integer;
begin
  insert into public.notifications (user_id, actor_id, type, title, body, link)
  select id, p_actor_id, p_type, p_title, p_body, p_link
  from public.profiles
  where role = 'admin'
    and (p_actor_id is null or id <> p_actor_id);

  get diagnostics inserted = row_count;

  return inserted;
end;
$$;

-- Triggers call this as its owner; no client role needs the grant, and
-- withholding it stops users from fanning out fake alerts to every admin.
revoke all on function public.notify_admins(text, text, text, text, uuid)
  from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Triggers: raise the alerts as the rows land
-- ---------------------------------------------------------------------------
create or replace function public.alert_admins_new_report()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_admins(
    'report_created',
    'A question was flagged',
    left(
      coalesce(nullif(new.question_prompt, ''), 'A quiz question')
        || ' · ' || replace(new.issue_type, '-', ' '),
      300
    ),
    '/admin?view=reports',
    new.user_id
  );

  return new;
end;
$$;

create or replace function public.alert_admins_new_submission()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_admins(
    'submission_created',
    'A practical is waiting to be graded',
    left(
      coalesce(nullif(new.full_name, ''), new.email)
        || coalesce(' · ' || nullif(new.task_name, ''), ''),
      300
    ),
    '/admin?view=grading',
    new.user_id
  );

  return new;
end;
$$;

create or replace function public.alert_admins_new_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_admins(
    'request_created',
    'A new course was requested',
    left(
      new.full_name || ' · ' || new.course_title || ' · ' || new.level,
      300
    ),
    '/admin?view=requests',
    new.user_id
  );

  return new;
end;
$$;

create or replace function public.alert_admins_new_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_admins(
    'signup_created',
    'A new account signed up',
    left(coalesce(nullif(new.full_name, ''), new.email) || ' · ' || new.email, 300),
    '/admin?view=users',
    new.id
  );

  return new;
end;
$$;

drop trigger if exists question_reports_alert_admins
  on public.question_reports;
create trigger question_reports_alert_admins
  after insert on public.question_reports
  for each row execute function public.alert_admins_new_report();

drop trigger if exists assessment_submissions_alert_admins
  on public.assessment_submissions;
create trigger assessment_submissions_alert_admins
  after insert on public.assessment_submissions
  for each row execute function public.alert_admins_new_submission();

drop trigger if exists course_requests_alert_admins
  on public.course_requests;
create trigger course_requests_alert_admins
  after insert on public.course_requests
  for each row execute function public.alert_admins_new_request();

drop trigger if exists profiles_alert_admins
  on public.profiles;
create trigger profiles_alert_admins
  after insert on public.profiles
  for each row execute function public.alert_admins_new_signup();

-- Triggers do not fire while seeding previous rows, so start from a clean slate
-- for alerts that predate this file: the red dots reflect new work only.
