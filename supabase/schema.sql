create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'pastor', 'treasurer', 'secretary', 'member')),
  created_at timestamptz not null default now()
);

create table if not exists public.ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  leader_id uuid null,
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique null references auth.users(id) on delete set null,
  full_name text not null,
  gender text,
  phone text,
  email text,
  address text,
  ministry_id uuid null references public.ministries(id) on delete set null,
  baptism_status text,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'ministries_leader_id_fkey'
  ) then
    alter table public.ministries
      add constraint ministries_leader_id_fkey
      foreign key (leader_id) references public.members(id) on delete set null;
  end if;
end
$$;

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  type text not null check (type in ('tithe', 'offering', 'pledge')),
  payment_method text not null default 'cash',
  date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  status text not null check (status in ('present', 'absent')),
  created_at timestamptz not null default now(),
  unique (member_id, event_id)
);

create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  preacher text not null,
  media_url text,
  date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  message text not null,
  status text not null default 'new' check (status in ('new', 'praying', 'closed')),
  created_at timestamptz not null default now()
);

create or replace function public.current_role()
returns text
language sql
stable
as $$
  select role from public.users where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(public.current_role() = 'admin', false)
$$;

create or replace function public.member_record_id()
returns uuid
language sql
stable
as $$
  select id from public.members where user_id = auth.uid()
$$;

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

  insert into public.members (user_id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
