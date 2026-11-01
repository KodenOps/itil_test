# CertifyHub

Exam-prep platform built with Next.js 15 (App Router), Supabase auth/database and
Tailwind. Accounts are email + password only; every new account starts as a
**Learner**, and **Instructor** / **Admin** access is granted by invitation from
the admin dashboard.

## What is in here

| Area | Where |
| --- | --- |
| Schema, RLS, triggers, course catalogue | [`supabase/schema.sql`](supabase/schema.sql) |
| Global client store (session, role, enrollments) | [`src/store/app-store.tsx`](src/store/app-store.tsx) |
| Course catalogue + enrollment gates | [`src/lib/content/courses.ts`](src/lib/content/courses.ts) |
| Question banks from Postgres | [`src/lib/content/questions.ts`](src/lib/content/questions.ts) |
| Legacy `src/data` → database seed | [`src/lib/content/seed.ts`](src/lib/content/seed.ts) |
| Admin dashboard | [`src/app/admin/page.tsx`](src/app/admin/page.tsx) |
| Course requests (homepage form → email + admin) | [`src/app/actions/course-request.ts`](src/app/actions/course-request.ts) |
| Profile & learning activity | [`src/app/profile/page.tsx`](src/app/profile/page.tsx) |
| PWA manifest, service worker, offline page | [`src/app/manifest.ts`](src/app/manifest.ts), [`public/sw.js`](public/sw.js) |

## Roles

- `learner` — default for every registration.
- `instructor` — invited by an admin; staff read access to platform data.
- `admin` — full dashboard: invite, change roles, sync content.

Role enforcement is layered:

1. Postgres `profiles.role` + Row Level Security (the backstop).
2. `requireAdmin()` / `checkCourseAccess()` in server code.
3. Middleware redirects unauthenticated visitors away from `/admin`,
   `/profile`, `/page/*` and `/score`.

## Enrollment rules

- Maximum **2 active courses** per user.
- Enforced by a database trigger (`enforce_enrollment_limit`) *and* surfaced in
  the UI; the trigger is what makes the limit race-safe.
- Every assessment route checks enrollment server-side, so a pasted URL cannot
  skip it.
- `/` shows live enrollment counts per course and whether the viewer is enrolled.

## Setup

### 1. Environment

Create `.env.local` (never commit it):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR-PUBLISHABLE-KEY
```

Optional, for the Excel practical submission email:

```
RESEND_API_KEY=
ASSESSMENT_FROM=
ASSESSMENT_TO=
```

Optional, for the homepage **Request a course** form (requests are always
saved to the admin dashboard even when email is not configured):

```
RESEND_API_KEY=            # already required for the Excel submission email
COURSE_REQUEST_FROM=       # defaults to ASSESSMENT_FROM
COURSE_REQUEST_TO=         # defaults to femifadiya.segun@outlook.com
```

### 2. Database

Run the whole of [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL
editor. It is idempotent — re-run it after pulling changes.

In **Authentication → Providers**, keep **Email** enabled and disable every
social provider (Google, Facebook, …). If an old "Before User Created" hook is
still attached, leave it or remove it: the function in the schema is a no-op.

### 3. First admin

Register through `/login`, then promote yourself once in the SQL editor:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Everyone else gets a higher role through **Admin → Invitations** (the role is
applied automatically when that address registers).

### 4. Migrate content

Sign in as the admin and open **Admin → Courses & content → Sync content from
src/data**. That upserts every question bank (ITIL Foundation, ITIL Strategist,
KCNA, AWS, Excel), the practical tasks and the testimonials into Postgres.

Assessment routes, the Excel quiz, the practical tasks and the login-page
testimonials read from the database after that. `src/data` remains only as the
one-time seed source.

### 5. Run

```bash
npm ci
npm run dev
```

## Notes

- `supabase/schema.sql` no longer gates sign-up by allow-list, so registration
  is open. Learners can only see their own enrollments and activity.
- Scores, enrollment progress and the activity trail are recorded through
  `/api/attempts` and `activity_events`, which is what the profile page and the
  admin dashboard read.
- Course requests live in `public.course_requests`. Anyone may insert (guests
  included, with `user_id = null`); only staff can read them and only admins
  can change their status. Re-run the schema after pulling.
- The site is installable (PWA): `/manifest.webmanifest`, `/sw.js` and
  `/offline.html`. The service worker never caches signed-in HTML or API
  responses, so a shared device cannot replay another account's data.
