create table if not exists galleries (
  id uuid default gen_random_uuid() primary key,
  title text,
  site_name text,
  site_url text,
  image_url text,
  category text,
  industry text,
  color text,
  taste text,
  font text,
  memo text,
  featured boolean default false,
  created_at timestamp default now()
);

alter table galleries add column if not exists industry text;
alter table galleries add column if not exists color text;
alter table galleries add column if not exists taste text;
alter table galleries add column if not exists font text;

alter table galleries enable row level security;

drop policy if exists "Public galleries are readable" on galleries;
create policy "Public galleries are readable"
  on galleries
  for select
  using (true);

drop policy if exists "Public galleries can be inserted" on galleries;
create policy "Public galleries can be inserted"
  on galleries
  for insert
  with check (true);

drop policy if exists "Public galleries can be updated" on galleries;
create policy "Public galleries can be updated"
  on galleries
  for update
  using (true);

drop policy if exists "Public galleries can be deleted" on galleries;
create policy "Public galleries can be deleted"
  on galleries
  for delete
  using (true);

insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public gallery images are readable" on storage.objects;
create policy "Public gallery images are readable"
  on storage.objects
  for select
  using (bucket_id = 'gallery-images');

drop policy if exists "Public gallery images can be uploaded" on storage.objects;
create policy "Public gallery images can be uploaded"
  on storage.objects
  for insert
  with check (bucket_id = 'gallery-images');
