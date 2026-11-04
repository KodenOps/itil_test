-- ═════════════════════════════════════════════════════════════════════════════
-- 19. Blog studio, question reports and notifications
--
-- Run this file after supabase/schema.sql. Everything is idempotent.
--
--   * blog_posts           – posts written in the admin blog studio, or links
--                            to posts that live on Hashnode / Medium / Dev.to.
--   * question_reports     – a learner flags a question; an admin replies and
--                            edits the question straight from the report.
--   * notifications        – in-app feed behind the top-nav bell.
--   * question_bank_drafts – an unpublished question bank per course.
-- ═════════════════════════════════════════════════════════════════════════════

-- ---------------------------------------------------------------------------
-- Blog posts
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  category text,
  author text not null default 'CertifyHub studio',
  published boolean not null default false,
  -- 'studio' means the body is stored here; anything else is an external link.
  source text not null default 'studio'
    check (source in ('studio', 'hashnode', 'medium', 'dev', 'external')),
  external_url text,
  cover_image text,
  content jsonb not null default '[]'::jsonb
    check (jsonb_typeof(content) = 'array'),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (published, created_at desc);

alter table public.blog_posts enable row level security;

drop policy if exists "Anyone reads published blog posts" on public.blog_posts;
create policy "Anyone reads published blog posts"
  on public.blog_posts for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Admins manage blog posts" on public.blog_posts;
create policy "Admins manage blog posts"
  on public.blog_posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Question reports
-- ---------------------------------------------------------------------------
create table if not exists public.question_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  question_prompt text not null default '',
  course_slug text,
  issue_type text not null default 'other'
    check (issue_type in ('wrong-answer', 'ambiguous', 'missing-option', 'typo', 'other')),
  description text not null default '',
  status text not null default 'open'
    check (status in ('open', 'reviewing', 'resolved', 'declined')),
  admin_reply text not null default '',
  replied_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists question_reports_user_idx
  on public.question_reports (user_id, created_at desc);

create index if not exists question_reports_status_idx
  on public.question_reports (status, created_at desc);

alter table public.question_reports enable row level security;

drop policy if exists "Users read their own reports" on public.question_reports;
create policy "Users read their own reports"
  on public.question_reports for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users create their own reports" on public.question_reports;
create policy "Users create their own reports"
  on public.question_reports for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Admins manage reports" on public.question_reports;
create policy "Admins manage reports"
  on public.question_reports for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  type text not null default 'announcement'
    check (type in (
      'report_replied',
      'report_acknowledged',
      'question_updated',
      'blog_published',
      'announcement'
    )),
  title text not null,
  body text not null default '',
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, created_at desc);

create index if not exists notifications_unread_idx
  on public.notifications (user_id)
  where read_at is null;

alter table public.notifications enable row level security;

drop policy if exists "Users read their own notifications" on public.notifications;
create policy "Users read their own notifications"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users update their own notifications" on public.notifications;
create policy "Users update their own notifications"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins send notifications" on public.notifications;
create policy "Admins send notifications"
  on public.notifications for insert
  to authenticated
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Question-bank drafts (a bank that is not live yet)
-- ---------------------------------------------------------------------------
create table if not exists public.question_bank_drafts (
  course_slug text primary key
    references public.courses(slug) on update cascade on delete cascade,
  questions jsonb not null default '[]'::jsonb
    check (jsonb_typeof(questions) = 'array'),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.question_bank_drafts enable row level security;

drop policy if exists "Admins manage question drafts" on public.question_bank_drafts;
create policy "Admins manage question drafts"
  on public.question_bank_drafts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Notification helpers
-- ---------------------------------------------------------------------------
create or replace function public.notify_user(
  p_user_id uuid,
  p_actor_id uuid,
  p_type text,
  p_title text,
  p_body text,
  p_link text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into public.notifications (user_id, actor_id, type, title, body, link)
  values (p_user_id, p_actor_id, p_type, p_title, p_body, p_link)
  returning id into new_id;

  return new_id;
end;
$$;

grant execute on function public.notify_user(uuid, uuid, text, text, text, text)
  to authenticated;

create or replace function public.unread_notification_count()
returns integer
language sql
stable
security invoker
as $$
  select count(*)::integer
  from public.notifications
  where user_id = auth.uid() and read_at is null;
$$;

grant execute on function public.unread_notification_count() to authenticated;

create or replace function public.mark_notifications_read(p_id uuid default null)
returns void
language sql
security invoker
as $$
  update public.notifications
  set read_at = now()
  where user_id = auth.uid()
    and read_at is null
    and (p_id is null or id = p_id);
$$;

grant execute on function public.mark_notifications_read(uuid) to authenticated;
