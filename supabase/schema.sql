create extension if not exists "pgcrypto";

create type public.user_role as enum (
  'admin',
  'pastor',
  'secretary',
  'treasurer',
  'member'
);

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'member',
  created_at timestamptz not null default now()
);

create table if not exists public.ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  leader_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  full_name text not null,
  username text not null unique,
  gender text,
  phone text,
  email text,
  address text,
  baptism_status text,
  ministry_id uuid references public.ministries(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  amount numeric(12, 2) not null check (amount >= 0),
  type text not null,
  payment_method text,
  date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  start_date date not null,
  end_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  preacher text not null,
  date date not null,
  summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  date date not null,
  status text not null check (status in ('present', 'absent', 'excused')),
  notes text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, role)
  values (new.id, 'member')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role = 'admin' from public.users where id = auth.uid()), false);
$$;
