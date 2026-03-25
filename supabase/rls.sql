alter table public.users enable row level security;
alter table public.members enable row level security;
alter table public.donations enable row level security;
alter table public.ministries enable row level security;

-- Users table policies
create policy "Users can read own role"
  on public.users
  for select
  using (id = auth.uid());

create policy "Admins can read all users"
  on public.users
  for select
  using (public.current_role() = 'admin');

create policy "Admins can update roles"
  on public.users
  for update
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- Members table policies
create policy "Admins manage members"
  on public.members
  for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

create policy "Secretaries manage members"
  on public.members
  for insert
  with check (public.current_role() = 'secretary');

create policy "Secretaries read members"
  on public.members
  for select
  using (public.current_role() = 'secretary');

create policy "Secretaries update members"
  on public.members
  for update
  using (public.current_role() = 'secretary')
  with check (public.current_role() = 'secretary');

create policy "Secretaries delete members"
  on public.members
  for delete
  using (public.current_role() = 'secretary');

create policy "Pastors read members"
  on public.members
  for select
  using (public.current_role() = 'pastor');

create policy "Members read own profile"
  on public.members
  for select
  using (user_id = auth.uid());

-- Donations table policies
create policy "Admins manage donations"
  on public.donations
  for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

create policy "Treasurers manage donations"
  on public.donations
  for all
  using (public.current_role() = 'treasurer')
  with check (public.current_role() = 'treasurer');

create policy "Members read own donations"
  on public.donations
  for select
  using (
    member_id in (
      select id from public.members where user_id = auth.uid()
    )
  );

-- Ministries table policies (admin only for now)
create policy "Admins manage ministries"
  on public.ministries
  for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');
