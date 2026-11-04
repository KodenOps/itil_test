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
editor, then [`supabase/schema-20261104.sql`](supabase/schema-20261104.sql) for
the blog studio, question reports, notifications and question-bank drafts, and
finally [`supabase/schema-20261105-admin-alerts.sql`](supabase/schema-20261105-admin-alerts.sql)
so admins are alerted when work lands. All three files are idempotent — re-run
them after pulling changes.

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

### 6. Admin studio

The admin dashboard has a side navigation; every screen below lives there.

**Blog studio (`/admin?view=blog`).** Write a post and publish it to `/blog`,
or paste a Hashnode / Medium / Dev.to / any-blog link and press **Fetch
details** — the studio reads the page's Open Graph tags and fills the title,
summary, cover image and source label. External posts stay linked to the
original; the blog card and article page show where the post lives. Posts save
as drafts until published, and a first publish notifies every learner.
Posts are stored in `public.blog_posts`, with the body kept as a JSON array of
blocks (markdown-lite: `## heading`, paragraphs, `- lists`, `> quotes`,
``` fences ```, `![alt](url)` images and `---`).

**Course JSON (`/admin?view=import`).** Course creation is JSON-only. The editor
opens with a complete sample: the `course` object (every column the catalogue
reads), `sections[]` using the same block types as the course page renderer, and
`questions[]`. Upload a `.json` file, drop one on the editor, or paste the JSON;
tick **Publish to the catalogue now** or import it as a draft. Re-importing the
same slug updates in place, so flipping `isPublished` later is a re-run, not a
new course.

**Question bank (`/admin?view=questions`).** Pick a course from the dropdown,
then add questions one at a time, drag the handle to reorder, or drop a
question-bank JSON file. **Save draft** keeps the bank in
`public.question_bank_drafts` while learners keep seeing the live bank;
**Publish bank** replaces what learners get. Importing a course leads straight
here. Pasted JSON accepts an array or `{ "questions": [...] }`; `answer` can be
an option index, an option letter, the option text, or an array of those.

**Question reports (`/admin?view=reports`).** Learners flag a question from the
exam runner (**Report an issue**). Each report shows the reporter, the course
and the stored question, editable in place. Saving the question updates the live
row, and sending a reply notifies the reporter — they can read it in the bell in
the top nav or on `/notifications`, next to their own report history.

**Admin alerts.** A database trigger raises a notification for every admin when
a question is flagged, a practical is submitted, a course is requested or a new
account signs up. They arrive in the bell (red dot) and on the matching side-nav
link (red dot), and clearing happens by opening the section: the dashboard marks
that section's alerts read, so the dot goes away in the nav and the bell at once.
Nothing is lost — the rows stay in the admin's `/notifications` feed.

Sections open one at a time on `/courses/<slug>`: a section stays locked until
the learner marks the one before it complete, and those completions are what the
track's progress is calculated from. Every hand-built track page (ITIL
Foundation, ITIL Strategist, Excel, Power BI, AWS, KCNA and DevOps on
`/page/learning`) follows the same rule: one *Mark as completed* button per
section in the section header, never one per recap, and the next section stays
locked until it is pressed. The DevOps & Systems Engineering overview is not a
catalogue course: its original overview page lives at
`/blog/devops-sys-engineer` and is listed in the blog, it carries no completion
button because nothing is tracked for a blog post, and
`/page/devops-sys-engineer` redirects there. Its slug is listed in
`RETIRED_COURSE_SLUGS` ([`src/lib/content/courses.ts`](src/lib/content/courses.ts))
so `listCourses()` never returns it, which keeps it off `/` and out of the
admin dashboard counts; the row itself stays put so old enrolments resolve.
Section ids and their order live in
`RECAP_SECTIONS` in [`src/lib/content/progress.ts`](src/lib/content/progress.ts),
so the API rejects a section that is out of turn. A studio track with no
questions in its bank is scored on sections alone (100%); once the bank has
questions, the usual 40% sections / 60% assessment split applies.

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
