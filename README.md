# CertifyHub

Exam preparation platform built with Next.js 15 (App Router), Supabase
auth/database and Tailwind. It is deliberately not a training product: every
track gives you a recap of the topic, short videos on the key concepts, then
sample professional exam questions answered under the same format and
conditions as the real paper. Accounts are email + password only; every new
account starts as a **Learner**, and **Instructor** / **Admin** access is
granted by invitation from the admin dashboard.

## What is in here

| Area | Where |
| --- | --- |
| Schema, RLS, triggers, course catalogue | [`supabase/schema.sql`](supabase/schema.sql) |
| Global client store (session, role, enrollments) | [`src/store/app-store.tsx`](src/store/app-store.tsx) |
| Course catalogue + enrollment gates | [`src/lib/content/courses.ts`](src/lib/content/courses.ts) |
| Question banks from Postgres | [`src/lib/content/questions.ts`](src/lib/content/questions.ts) |
| Legacy `src/data` → database seed | [`src/lib/content/seed.ts`](src/lib/content/seed.ts) |
| Admin dashboard | [`src/app/admin/page.tsx`](src/app/admin/page.tsx) |
| Course studio (drag-and-drop page builder) | [`src/app/admin/studio/CourseStudio.tsx`](src/app/admin/studio/CourseStudio.tsx) |
| Public page for studio courses | [`src/app/courses/[slug]/page.tsx`](src/app/courses/[slug]/page.tsx) |
| Password reset (6-digit OTP) | [`src/app/forgot-password/page.tsx`](src/app/forgot-password/page.tsx) |
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

Optional, PWA install prompt:

```
NEXT_PUBLIC_INSTALL_PROMPT_SNOOZE_DAYS=14   # days to stay quiet after
                                            # "Not now"; 0 = ask every visit
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
one-time seed source. Re-run the sync whenever a bank in `src/data` changes —
the studio does not edit assessment questions.

### 5. Password reset codes

`/forgot-password` asks the backend for a **six-digit one-time code**, then
uses that code to set a new password. The code itself is generated and mailed
by Supabase Auth's recovery flow, so turn on the code in the email template:

- Supabase Dashboard → **Authentication → Email Templates → Reset Password**.
- Include `{{ .Token }}` in the body, for example:
  `<p>Your six-digit reset code is <strong>{{ .Token }}</strong>.</p>`
- Keep `{{ .ConfirmationURL }}` if you also want the link flow. The page can
  finish a reset from either the code or the emailed link.

Without the template change users only receive the default link; the link flow
still works, but the code step will not have a code to accept.

### 6. Build course pages in the studio

Open **Admin → Course studio**. Create a course, then drag headings, body
text, images, video embeds/links, code blocks, callouts, quotes, lists, links
and file downloads into sections. Images upload to the public `course-assets`
bucket; everything else is stored in `public.course_pages` as one JSON document
per course, so a save is atomic.

New courses are added to the catalogue immediately and open at
`/courses/<slug>`. Existing tracks keep their hand-built pages until you change
their **Page URL** to the studio URL in the editor. Enrolment gates and the
admin preview use the same renderer, so what you see in Preview is what
learners get.

Sections open one at a time on `/courses/<slug>`: a section stays locked until
the learner marks the one before it complete, and those completions are what
the track's progress is calculated from. The DevOps track on
`/page/learning` works the same way: one *Mark as completed* button per
module, in order, and `/page/devops-sys-engineer` now redirects there. A
studio track with no questions in
its bank is scored on sections alone (100%); once the bank has questions, the
usual 40% sections / 60% assessment split applies.

The **Questions** tab in the same editor builds the bank for that course:
switch between the drag-and-drop builder and a JSON textarea for bulk upload,
pick one of the existing test formats (exam/practice, index/text answers),
mark a question as multi-answer, and attach an image. Pasted JSON accepts an
array or `{ "questions": [...] }`; `answer` can be an option index, an option
letter, the option text, or an array of any of those for multi-answer items.
`Save question bank` replaces the course's questions, or appends to them.

The **Delete course** button removes the course with its page, draft and
question bank; attempts and activity stay in the log.

For the seeded tracks you can still use **Courses & content → Sync content from
src/data**, which only ever writes the banks that live in `src/data`.

### 7. Run

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
- An install prompt appears a couple of seconds after load (native prompt on
  Chromium, Share → Add to Home Screen instructions on iOS). It is hidden once
  installed, snoozes after dismissal, and can be re-opened from the navbar
  **Install app** entry — see `src/lib/pwa.ts` and
  `src/app/components/InstallPrompt.tsx`.
