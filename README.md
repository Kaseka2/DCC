# ChurchFlow CMS

ChurchFlow is a production-ready Church Management System built with Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-style UI components, and Supabase.

## Included

- Public website with home, about, events, sermons, and contact pages
- Admin dashboard with overview, members, donations, events, attendance, and sermons
- Member portal with profile, giving history, and prayer requests
- Supabase Auth integration with role-aware dashboard access
- SQL schema and Row Level Security policies
- Reusable hooks for members, donations, and events

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, and Storage-ready architecture
- shadcn-style component primitives

## Setup

1. Install Node.js 20+.
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and add your Supabase project values.
4. In Supabase SQL Editor, run:

```sql
-- first
\i supabase/schema.sql

-- then
\i supabase/rls.sql
```

If your SQL editor does not support `\i`, paste the contents of each file manually in that order.

5. Start the app:

```bash
npm run dev
```

6. Open `http://localhost:3000`.

## Roles

- `admin`: full platform access
- `pastor`: read members, manage sermons and events, view attendance-friendly reporting
- `treasurer`: donation management
- `secretary`: members, attendance, and events
- `member`: own profile, own giving, own prayer requests

## Auth Flow

- Public self-signup is disabled in the working flow.
- Everyone signs in from `/auth/login`.
- New accounts are provisioned by an admin from `/dashboard/users`.
- After login, users are redirected by role:
  - `admin`, `pastor`, `treasurer`, `secretary` -> `/dashboard`
  - `member` -> `/portal`

## First Admin Bootstrap

Before the admin can create other users, create the first admin manually in Supabase:

1. Go to `Authentication > Users`.
2. Create a user with a username-shaped email such as `admin@churchflow.local` and a password.
3. Run this SQL in Supabase:

```sql
update public.users
set role = 'admin'
where id = (
  select id
  from auth.users
  where email = 'admin@churchflow.local'
);
```

4. Sign in through `/auth/login` using `admin` as the username and the password you created.
5. Open `/dashboard/users` and create the rest of the accounts from the admin UI.

## Supabase Notes

- New signups create a linked `users` row and a starter `members` row through the trigger in `supabase/schema.sql`.
- Role-based protection is enforced in both dashboard route guards and `supabase/rls.sql`.
- Sermon media uses a `media_url` field now, and can be extended later to Supabase Storage uploads.
- Admin-driven account creation uses `SUPABASE_SERVICE_ROLE_KEY` on the server route at `app/api/admin/users/route.ts`.

## MVP Priority Covered

- Authentication
- Members module
- Donations module
- Basic dashboard analytics
- Public events and sermons
- Member portal

## Recommended Next Steps

- Add server actions or API routes for stricter form validation
- Add toast notifications and optimistic UI
- Add Supabase Storage upload flow for sermon audio/video and profile assets
- Add test coverage and CI
