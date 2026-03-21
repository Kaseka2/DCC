alter table public.users enable row level security;
alter table public.ministries enable row level security;
alter table public.members enable row level security;
alter table public.donations enable row level security;
alter table public.events enable row level security;
alter table public.attendance enable row level security;
alter table public.sermons enable row level security;
alter table public.prayer_requests enable row level security;

drop policy if exists "admins manage users" on public.users;
create policy "admins manage users" on public.users
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "users view own role" on public.users;
create policy "users view own role" on public.users
for select using (id = auth.uid() or public.is_admin());

drop policy if exists "admins manage ministries" on public.ministries;
create policy "admins manage ministries" on public.ministries
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "authenticated read ministries" on public.ministries;
create policy "authenticated read ministries" on public.ministries
for select using (auth.role() = 'authenticated');

drop policy if exists "admin pastor secretary read members" on public.members;
create policy "admin pastor secretary read members" on public.members
for select using (
  public.is_admin()
  or public.current_role() in ('pastor', 'secretary')
  or user_id = auth.uid()
);

drop policy if exists "admin secretary manage members" on public.members;
create policy "admin secretary manage members" on public.members
for all using (
  public.is_admin() or public.current_role() = 'secretary'
) with check (
  public.is_admin() or public.current_role() = 'secretary'
);

drop policy if exists "admin treasurer donations full" on public.donations;
create policy "admin treasurer donations full" on public.donations
for all using (
  public.is_admin() or public.current_role() = 'treasurer'
) with check (
  public.is_admin() or public.current_role() = 'treasurer'
);

drop policy if exists "members read own donations" on public.donations;
create policy "members read own donations" on public.donations
for select using (
  member_id = public.member_record_id()
);

drop policy if exists "authenticated read events" on public.events;
create policy "authenticated read events" on public.events
for select using (true);

drop policy if exists "admin pastor secretary manage events" on public.events;
create policy "admin secretary manage events" on public.events
for all using (
  public.is_admin() or public.current_role() = 'secretary'
) with check (
  public.is_admin() or public.current_role() = 'secretary'
);

drop policy if exists "attendance read allowed roles" on public.attendance;
create policy "attendance read allowed roles" on public.attendance
for select using (
  public.is_admin()
  or public.current_role() in ('pastor', 'secretary')
  or member_id = public.member_record_id()
);

drop policy if exists "attendance secretary manage" on public.attendance;
create policy "attendance secretary manage" on public.attendance
for all using (
  public.is_admin() or public.current_role() = 'secretary'
) with check (
  public.is_admin() or public.current_role() = 'secretary'
);

drop policy if exists "sermons public read" on public.sermons;
create policy "sermons public read" on public.sermons
for select using (true);

drop policy if exists "sermons admin pastor manage" on public.sermons;
create policy "sermons admin pastor manage" on public.sermons
for all using (
  public.is_admin() or public.current_role() = 'pastor'
) with check (
  public.is_admin() or public.current_role() = 'pastor'
);

drop policy if exists "prayer requests own read" on public.prayer_requests;
create policy "prayer requests own read" on public.prayer_requests
for select using (
  public.is_admin()
  or public.current_role() in ('pastor', 'secretary')
  or member_id = public.member_record_id()
);

drop policy if exists "members create prayer requests" on public.prayer_requests;
create policy "members create prayer requests" on public.prayer_requests
for insert with check (
  member_id = public.member_record_id()
);

drop policy if exists "pastor admin update prayer requests" on public.prayer_requests;
create policy "pastor admin update prayer requests" on public.prayer_requests
for update using (
  public.is_admin() or public.current_role() = 'pastor'
) with check (
  public.is_admin() or public.current_role() = 'pastor'
);
