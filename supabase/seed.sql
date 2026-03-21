insert into public.ministries (name)
values
  ('Worship'),
  ('Youth'),
  ('Children'),
  ('Outreach')
on conflict (name) do nothing;
