alter table public.users enable row level security;
alter table public.members enable row level security;
alter table public.donations enable row level security;
alter table public.ministries enable row level security;
alter table public.events enable row level security;
alter table public.sermons enable row level security;
alter table public.attendance enable row level security;
alter table public.offering_types enable row level security;
alter table public.offerings enable row level security;

-- Users table policies
drop policy if exists "Users can read own role" on public.users;
create policy "Users can read own role"
  on public.users
  for select
  using (id = auth.uid());

drop policy if exists "Admins can read all users" on public.users;
create policy "Admins can read all users"
  on public.users
  for select
  using (public.current_role() = 'admin');

drop policy if exists "Admins can update roles" on public.users;
create policy "Admins can update roles"
  on public.users
  for update
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- Members table policies
drop policy if exists "Admins manage members" on public.members;
create policy "Admins manage members"
  on public.members
  for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

drop policy if exists "Secretaries manage members" on public.members;
create policy "Secretaries manage members"
  on public.members
  for insert
  with check (public.current_role() = 'secretary');

drop policy if exists "Secretaries read members" on public.members;
create policy "Secretaries read members"
  on public.members
  for select
  using (public.current_role() = 'secretary');

drop policy if exists "Secretaries update members" on public.members;
create policy "Secretaries update members"
  on public.members
  for update
  using (public.current_role() = 'secretary')
  with check (public.current_role() = 'secretary');

drop policy if exists "Secretaries delete members" on public.members;
create policy "Secretaries delete members"
  on public.members
  for delete
  using (public.current_role() = 'secretary');

drop policy if exists "Pastors read members" on public.members;
create policy "Pastors read members"
  on public.members
  for select
  using (public.current_role() = 'pastor');

drop policy if exists "Members read own profile" on public.members;
create policy "Members read own profile"
  on public.members
  for select
  using (user_id = auth.uid());

-- Donations table policies
drop policy if exists "Admins manage donations" on public.donations;
create policy "Admins manage donations"
  on public.donations
  for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

drop policy if exists "Treasurers manage donations" on public.donations;
create policy "Treasurers manage donations"
  on public.donations
  for all
  using (public.current_role() = 'treasurer')
  with check (public.current_role() = 'treasurer');

drop policy if exists "Members read own donations" on public.donations;
create policy "Members read own donations"
  on public.donations
  for select
  using (
    member_id in (
      select id from public.members where user_id = auth.uid()
    )
  );

-- Offering types policies
drop policy if exists "Admins manage offering types" on public.offering_types;
create policy "Admins manage offering types"
  on public.offering_types
  for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

drop policy if exists "Treasurers manage offering types" on public.offering_types;
create policy "Treasurers manage offering types"
  on public.offering_types
  for all
  using (public.current_role() = 'treasurer')
  with check (public.current_role() = 'treasurer');

drop policy if exists "Staff read offering types" on public.offering_types;
create policy "Staff read offering types"
  on public.offering_types
  for select
  using (public.current_role() in ('admin', 'treasurer', 'pastor', 'secretary'));

-- Offerings policies
drop policy if exists "Admins manage offerings" on public.offerings;
create policy "Admins manage offerings"
  on public.offerings
  for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

drop policy if exists "Treasurers manage offerings" on public.offerings;
create policy "Treasurers manage offerings"
  on public.offerings
  for all
  using (public.current_role() = 'treasurer')
  with check (public.current_role() = 'treasurer');

drop policy if exists "Members read own offerings" on public.offerings;
create policy "Members read own offerings"
  on public.offerings
  for select
  using (
    member_id in (
      select id from public.members where user_id = auth.uid()
    )
  );

-- Ministries table policies (admin only for now)
drop policy if exists "Admins manage ministries" on public.ministries;
create policy "Admins manage ministries"
  on public.ministries
  for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- Events table policies
drop policy if exists "Admins manage events" on public.events;
create policy "Admins manage events"
  on public.events
  for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

drop policy if exists "Secretaries manage events" on public.events;
create policy "Secretaries manage events"
  on public.events
  for all
  using (public.current_role() = 'secretary')
  with check (public.current_role() = 'secretary');

drop policy if exists "Pastors read events" on public.events;
create policy "Pastors read events"
  on public.events
  for select
  using (public.current_role() = 'pastor');

drop policy if exists "Members read events" on public.events;
create policy "Members read events"
  on public.events
  for select
  using (auth.uid() is not null);

-- Sermons table policies
drop policy if exists "Admins manage sermons" on public.sermons;
create policy "Admins manage sermons"
  on public.sermons
  for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

drop policy if exists "Pastors manage sermons" on public.sermons;
create policy "Pastors manage sermons"
  on public.sermons
  for all
  using (public.current_role() = 'pastor')
  with check (public.current_role() = 'pastor');

drop policy if exists "Everyone read sermons" on public.sermons;
create policy "Everyone read sermons"
  on public.sermons
  for select
  using (auth.uid() is not null);

-- Attendance table policies
drop policy if exists "Admins manage attendance" on public.attendance;
create policy "Admins manage attendance"
  on public.attendance
  for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

drop policy if exists "Secretaries manage attendance" on public.attendance;
create policy "Secretaries manage attendance"
  on public.attendance
  for all
  using (public.current_role() = 'secretary')
  with check (public.current_role() = 'secretary');

drop policy if exists "Pastors read attendance" on public.attendance;
create policy "Pastors read attendance"
  on public.attendance
  for select
  using (public.current_role() = 'pastor');

drop policy if exists "Members read own attendance" on public.attendance;
create policy "Members read own attendance"
  on public.attendance
  for select
  using (
    member_id in (
      select id from public.members where user_id = auth.uid()
    )
  );
