# Church Management System (MVP)

This is a production-ready MVP for a Church Management System built with Next.js App Router, Supabase, and Tailwind CSS. It focuses on secure login, admin-created users, role-based access, members, and donations.

## Tech Stack
- Next.js App Router (TypeScript, strict)
- Tailwind CSS
- Supabase (PostgreSQL, Auth, RLS)
- shadcn/ui-inspired component styles

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Fill in `.env.local` with your Supabase credentials.
4. Apply the SQL schema and RLS policies in Supabase:
   - `supabase/schema.sql`
   - `supabase/rls.sql`
5. Run the app:
   ```bash
   npm run dev
   ```

## Supabase Setup (Required)
1. Create a new Supabase project.
2. In the SQL Editor, run `supabase/schema.sql`.
3. Then run `supabase/rls.sql`.
4. In Project Settings → API:
   - Copy `Project URL` into `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` into `SUPABASE_SERVICE_ROLE_KEY`

## First Admin Bootstrap (Manual, One-Time)
Supabase does not allow public signup for this app. You must create the first admin manually:
1. In Supabase Auth → Users, create a user with:
   - Email: `admin@church.local`
   - Password: (choose a secure password)
2. In SQL Editor, run:
   ```sql
   update public.users
   set role = 'admin'
   where id = (select id from auth.users where email = 'admin@church.local');
   ```
3. Login at `/auth/login` with username `admin` and the password you set.
4. Use Admin → User Management to create the rest of your users.

## Auth Design Notes
- Users log in with **username + password**.
- Supabase requires email internally, so we map username → `username@church.local`.
- There is **no self-signup**. Admins create all users.
- Roles are stored in `public.users` and enforced by RLS.

## Commands
- `npm run dev` - local dev
- `npm run build` - production build
- `npm run lint` - lint

## Deployment Notes (Vercel or Netlify)
- Set the same environment variables from `.env.example`.
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is configured as a server-only secret.
- Confirm build passes with `npm run build`.

## Folder Structure
- `src/app/` - routes and layouts
- `src/components/` - UI components
- `src/lib/` - Supabase + auth helpers
- `supabase/` - SQL schema and RLS policies

## MVP Roadmap Extensions
Future additions should build on this foundation:
- Events
- Attendance tracking
- Sermons
- Public pages

